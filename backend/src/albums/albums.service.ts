import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UserValidationService } from '../common/validators/user-validation.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private userValidationService: UserValidationService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, userId?: string): Promise<Album> {
    const finalUserId = createAlbumDto.createdBy || userId;
    
    // Validate user ID before creating the album
    if (finalUserId) {
      await this.userValidationService.validateUserExists(finalUserId, 'Album creator');
    }

    const albumData = {
      ...createAlbumDto,
      createdBy: finalUserId,
    };
    
    const createdAlbum = new this.albumModel(albumData);
    return createdAlbum.save();
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel
      .find()
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPublished(): Promise<Album[]> {
    return this.albumModel
      .find({ isPublished: true })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findFeatured(): Promise<Album[]> {
    return this.albumModel
      .find({ isPublished: true, isFeatured: true })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByCategory(category: string): Promise<Album[]> {
    return this.albumModel
      .find({ isPublished: true, category })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByProjectType(projectType: string): Promise<Album[]> {
    return this.albumModel
      .find({ isPublished: true, projectType })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  // Portfolio-based methods
  async findPublishedByPortfolio(portfolioId: string): Promise<Album[]> {
    return this.albumModel
      .find({ 
        isPublished: true, 
        createdBy: portfolioId 
      })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findFeaturedByPortfolio(portfolioId: string): Promise<Album[]> {
    return this.albumModel
      .find({ 
        isPublished: true, 
        isFeatured: true, 
        createdBy: portfolioId 
      })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByCategoryAndPortfolio(category: string, portfolioId: string): Promise<Album[]> {
    return this.albumModel
      .find({ 
        isPublished: true, 
        category, 
        createdBy: portfolioId 
      })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByProjectTypeAndPortfolio(projectType: string, portfolioId: string): Promise<Album[]> {
    return this.albumModel
      .find({ 
        isPublished: true, 
        projectType, 
        createdBy: portfolioId 
      })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findOneByPortfolio(id: string, portfolioId: string): Promise<Album> {
    const album = await this.albumModel
      .findOne({ 
        _id: id, 
        createdBy: portfolioId 
      })
      .populate('createdBy', 'firstName lastName email profileImage')
      .exec();
    
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found for this portfolio`);
    }
    
    // Increment view count
    await this.albumModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    
    return album;
  }

  async searchAlbumsByPortfolio(query: string, portfolioId: string): Promise<Album[]> {
    return this.albumModel
      .find({
        isPublished: true,
        createdBy: portfolioId,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { projectGoal: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { category: { $regex: query, $options: 'i' } },
          { projectType: { $regex: query, $options: 'i' } },
          { 'youtubeVideo.title': { $regex: query, $options: 'i' } },
          { 'youtubeVideo.description': { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async getCategoriesByPortfolio(portfolioId: string): Promise<string[]> {
    const categories = await this.albumModel
      .distinct('category', { createdBy: portfolioId })
      .exec();
    return categories;
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumModel
      .findById(id)
      .populate('createdBy', 'firstName lastName email profileImage')
      .exec();
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    // Validate user ID if being updated
    if (updateAlbumDto.createdBy) {
      await this.userValidationService.validateUserExists(updateAlbumDto.createdBy, 'Album creator');
    }

    const updatedAlbum = await this.albumModel
      .findByIdAndUpdate(id, updateAlbumDto, { new: true })
      .populate('createdBy', 'firstName lastName email profileImage')
      .exec();
    
    if (!updatedAlbum) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return updatedAlbum;
  }

  async remove(id: string): Promise<void> {
    const result = await this.albumModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
  }

  async togglePublished(id: string): Promise<Album> {
    const album = await this.findOne(id);
    return this.update(id, { isPublished: !album.isPublished });
  }

  async toggleFeatured(id: string): Promise<Album> {
    const album = await this.findOne(id);
    return this.update(id, { isFeatured: !album.isFeatured });
  }

  async addImage(id: string, image: any): Promise<Album> {
    const album = await this.albumModel.findById(id).exec();
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    
    album.images = album.images || [];
    album.images.push(image);
    return album.save();
  }

  async removeImage(id: string, imageId: string): Promise<Album> {
    const album = await this.albumModel.findById(id).exec();
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    
    album.images = album.images?.filter(img => img.publicId !== imageId) || [];
    return album.save();
  }

  async updateSortOrder(id: string, sortOrder: number): Promise<Album> {
    return this.update(id, { sortOrder });
  }

  async searchAlbums(query: string): Promise<Album[]> {
    return this.albumModel
      .find({
        isPublished: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { projectGoal: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { category: { $regex: query, $options: 'i' } },
          { projectType: { $regex: query, $options: 'i' } },
          { 'youtubeVideo.title': { $regex: query, $options: 'i' } },
          { 'youtubeVideo.description': { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.albumModel.distinct('category').exec();
    return categories;
  }

  async getProjectTypes(): Promise<string[]> {
    const projectTypes = await this.albumModel.distinct('projectType').exec();
    return projectTypes;
  }

  // Tag filtering methods
  async findByTags(tags: string[]): Promise<Album[]> {
    return this.albumModel
      .find({ 
        isPublished: true, 
        tags: { $in: tags } 
      })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findByTagsAndPortfolio(tags: string[], portfolioId: string): Promise<Album[]> {
    return this.albumModel
      .find({ 
        isPublished: true, 
        tags: { $in: tags },
        createdBy: portfolioId 
      })
      .populate('createdBy', 'firstName lastName email profileImage')
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async getAllTags(): Promise<string[]> {
    const tags = await this.albumModel
      .distinct('tags', { isPublished: true })
      .exec();
    
    return tags.sort();
  }

  async getTagsByPortfolio(portfolioId: string): Promise<string[]> {
    const tags = await this.albumModel
      .distinct('tags', { isPublished: true, createdBy: portfolioId })
      .exec();
    
    return tags.sort();
  }

  async getAlbumStats(): Promise<any> {
    const stats = await this.albumModel.aggregate([
      {
        $group: {
          _id: null,
          totalAlbums: { $sum: 1 },
          publishedAlbums: { $sum: { $cond: ['$isPublished', 1, 0] } },
          featuredAlbums: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          totalViews: { $sum: '$viewCount' },
          averageViews: { $avg: '$viewCount' }
        }
      }
    ]);

    const categoryStats = await this.albumModel.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return {
      ...stats[0],
      categoryBreakdown: categoryStats
    };
  }
} 