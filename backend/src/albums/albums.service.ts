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
    const finalUserId = "685fe192e9ad4407f2b52ce4";
    
    // Validate user ID before creating the album
    if (finalUserId) {
      await this.userValidationService.validateUserExists(finalUserId, 'Album creator');
    }

    const albumData = {
      ...createAlbumDto,
      userId: finalUserId,
    };
    
    const createdAlbum = new this.albumModel(albumData);
    return createdAlbum.save();
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel
      .find()
      .populate('userId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumModel
      .findById(id)
      .populate('userId', 'firstName lastName email profileImage')
      .exec();
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    // Validate user ID if being updated
    // if (updateAlbumDto.userId) {
    //   await this.userValidationService.validateUserExists(updateAlbumDto.userId, 'Album creator');
    // }

    const updatedAlbum = await this.albumModel
      .findByIdAndUpdate(id, updateAlbumDto, { new: true })
      .populate('userId', 'firstName lastName email profileImage')
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

  async findByTags(tags: string[]): Promise<Album[]> {
    return this.albumModel
      .find({ tags: { $in: tags } })
      .populate('userId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findWithFiltersAndPagination(
    tags: string[] = [],
    page: number = 1,
    limit: number = 10
  ): Promise<{
    albums: Album[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const skip = (page - 1) * limit;
    
    // Build filter query
    const filterQuery = tags.length > 0 ? { tags: { $in: tags } } : {};
    
    // Get total count for pagination
    const totalCount = await this.albumModel.countDocuments(filterQuery);
    
    // Get albums with pagination
    const albums = await this.albumModel
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      albums,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async searchAlbums(query: string): Promise<Album[]> {
    return this.albumModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { 'youtubeVideo.title': { $regex: query, $options: 'i' } },
          { 'youtubeVideo.description': { $regex: query, $options: 'i' } },
        ],
      })
      .populate('userId', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllTags(): Promise<string[]> {
    const albums = await this.albumModel.find({}, 'tags').exec();
    const allTags = albums.flatMap(album => album.tags || []);
    return [...new Set(allTags)] as string[]; // Remove duplicates and cast to string[]
  }

  async addImage(id: string, image: { url: string; alt?: string }): Promise<Album> {
    const album = await this.albumModel.findById(id).exec();
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    
    album.images = album.images || [];
    album.images.push(image);
    return album.save();
  }

  async removeImage(id: string, imageUrl: string): Promise<Album> {
    const album = await this.albumModel.findById(id).exec();
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    
    album.images = album.images?.filter(img => img.url !== imageUrl) || [];
    return album.save();
  }
} 