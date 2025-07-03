import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserValidationService } from '../common/validators/user-validation.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private userValidationService: UserValidationService,
  ) {}

  async create(createReviewDto: CreateReviewDto, clientUserId?: string): Promise<Review> {
    // Validate user IDs before creating the review
    const usersToValidate: Array<{id: string, fieldName: string}> = [];
    
    if (createReviewDto.reviewedBy) {
      usersToValidate.push({ id: createReviewDto.reviewedBy, fieldName: 'Reviewed user' });
    }
    
    if (createReviewDto.clientUserId) {
      usersToValidate.push({ id: createReviewDto.clientUserId, fieldName: 'Client user' });
    }
    
    if (clientUserId) {
      usersToValidate.push({ id: clientUserId, fieldName: 'Client user' });
    }

    if (usersToValidate.length > 0) {
      await this.userValidationService.validateMultipleUsers(usersToValidate);
    }

    const reviewData = {
      ...createReviewDto,
      clientUserId: clientUserId || createReviewDto.clientUserId,
    };
    
    const createdReview = new this.reviewModel(reviewData);
    return createdReview.save();
  }

  async createAdminReview(createReviewDto: any, clientUserId: string): Promise<Review> {
    // Validate user IDs before creating the review
    const usersToValidate: Array<{id: string, fieldName: string}> = [];
    
    if (createReviewDto.reviewedBy) {
      usersToValidate.push({ id: createReviewDto.reviewedBy, fieldName: 'Reviewed user' });
    }
    
    if (clientUserId) {
      usersToValidate.push({ id: clientUserId, fieldName: 'Client user' });
    }

    if (usersToValidate.length > 0) {
      await this.userValidationService.validateMultipleUsers(usersToValidate);
    }

    const reviewData = {
      ...createReviewDto,
      clientUserId: clientUserId,
    };
    
    const createdReview = new this.reviewModel(reviewData);
    return createdReview.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findVisible(): Promise<Review[]> {
    return this.reviewModel
      .find({ isVisible: true })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findFeatured(): Promise<Review[]> {
    return this.reviewModel
      .find({ isVisible: true, isFeatured: true })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ 
        $or: [
          { reviewedBy: userId },
          { clientUserId: userId }
        ]
      })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findVisibleByUser(userId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ 
        isVisible: true,
        $or: [
          { reviewedBy: userId },
          { clientUserId: userId }
        ]
      })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findVisibleByPortfolio(portfolioId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ 
        isVisible: true, 
        reviewedBy: portfolioId 
      })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findFeaturedByPortfolio(portfolioId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ 
        isVisible: true, 
        isFeatured: true, 
        reviewedBy: portfolioId 
      })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByRating(rating: number): Promise<Review[]> {
    return this.reviewModel
      .find({ isVisible: true, rating })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getReviewStats(): Promise<any> {
    const stats = await this.reviewModel.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          visibleReviews: { $sum: { $cond: ['$isVisible', 1, 0] } },
          featuredReviews: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: '$rating' }
        }
      }
    ]);

    const ratingDistribution = await this.reviewModel.aggregate([
      { $match: { isVisible: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return {
      ...stats[0],
      ratingDistribution
    };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    // Validate user IDs before updating the review
    const usersToValidate: Array<{id: string, fieldName: string}> = [];
    
    if (updateReviewDto.reviewedBy) {
      usersToValidate.push({ id: updateReviewDto.reviewedBy, fieldName: 'Reviewed user' });
    }
    
    if (updateReviewDto.clientUserId) {
      usersToValidate.push({ id: updateReviewDto.clientUserId, fieldName: 'Client user' });
    }

    if (usersToValidate.length > 0) {
      await this.userValidationService.validateMultipleUsers(usersToValidate);
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .exec();
    
    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return updatedReview;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }

  async toggleVisibility(id: string): Promise<Review> {
    const review = await this.findOne(id);
    return this.update(id, { isVisible: !review.isVisible });
  }

  async toggleFeatured(id: string): Promise<Review> {
    const review = await this.findOne(id);
    return this.update(id, { isFeatured: !review.isFeatured });
  }

  async findByService(service: string): Promise<Review[]> {
    return this.reviewModel
      .find({ isVisible: true, serviceUsed: service })
      .populate('reviewedBy', 'firstName lastName email profileImage')
      .populate('clientUserId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAverageRating(): Promise<number> {
    const result = await this.reviewModel.aggregate([
      { $match: { isVisible: true } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    
    return result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
  }

  async getRatingStats(): Promise<any> {
    const result = await this.reviewModel.aggregate([
      { $match: { isVisible: true } },
      { $group: { 
        _id: '$rating', 
        count: { $sum: 1 } 
      }},
      { $sort: { _id: -1 } }
    ]);
    
    return result;
  }

  async getRatingStatsByPortfolio(portfolioId: string): Promise<any> {
    const result = await this.reviewModel.aggregate([
      { $match: { 
        isVisible: true, 
        reviewedBy: portfolioId 
      }},
      { $group: { 
        _id: '$rating', 
        count: { $sum: 1 } 
      }},
      { $sort: { _id: -1 } }
    ]);
    
    return result;
  }

  async getAverageRatingByPortfolio(portfolioId: string): Promise<number> {
    const result = await this.reviewModel.aggregate([
      { $match: { 
        isVisible: true, 
        reviewedBy: portfolioId 
      }},
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    return result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
  }
} 