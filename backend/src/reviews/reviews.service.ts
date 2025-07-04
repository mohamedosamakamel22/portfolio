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
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const reviewData = {
      ...createReviewDto,
      userId: createReviewDto.userId,
    };

    const createdReview = new this.reviewModel(reviewData);
    return createdReview.save();
  }

  async findAll(limit: number = 10, page: number = 1): Promise<Review[]> {
    return this.reviewModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
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

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
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
} 