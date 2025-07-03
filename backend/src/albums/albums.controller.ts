import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  create(@Body() createAlbumDto: CreateAlbumDto, @CurrentUser() user: any) {
    return this.albumsService.create(createAlbumDto, user.userId);
  }

  @Get()
  findAll(@Query('published') published?: string) {
    if (published === 'true') {
      return this.albumsService.findPublished();
    }
    return this.albumsService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.albumsService.findFeatured();
  }

  @Get('categories')
  getCategories() {
    return this.albumsService.getCategories();
  }

  @Get('project-types')
  getProjectTypes() {
    return this.albumsService.getProjectTypes();
  }

  @Get('tags')
  getAllTags() {
    return this.albumsService.getAllTags();
  }

  @Get('filter-by-tags')
  findByTags(@Query('tags') tags: string) {
    if (!tags) {
      throw new BadRequestException('Tags query parameter is required');
    }
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.albumsService.findByTags(tagArray);
  }

  @Get('stats')
  getAlbumStats() {
    return this.albumsService.getAlbumStats();
  }

  @Get('search')
  searchAlbums(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Search query is required');
    }
    return this.albumsService.searchAlbums(query);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.albumsService.findByCategory(category);
  }

  @Get('project-type/:projectType')
  findByProjectType(@Param('projectType') projectType: string) {
    return this.albumsService.findByProjectType(projectType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.albumsService.remove(id);
  }

  @Patch(':id/toggle-published')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  togglePublished(@Param('id') id: string) {
    return this.albumsService.togglePublished(id);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  toggleFeatured(@Param('id') id: string) {
    return this.albumsService.toggleFeatured(id);
  }

  @Patch(':id/sort-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  updateSortOrder(@Param('id') id: string, @Body('sortOrder') sortOrder: number) {
    return this.albumsService.updateSortOrder(id, sortOrder);
  }

  @Post(':id/upload-cover')
  @UseInterceptors(FileInterceptor('cover'))
  async uploadCoverImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file, 'albums/covers');
      
      // Update album with new cover image URL
      const updatedAlbum = await this.albumsService.update(id, {
        coverImage: result.secure_url,
      });

      return {
        message: 'Cover image uploaded successfully',
        imageUrl: result.secure_url,
        album: updatedAlbum,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload cover image');
    }
  }

  @Post(':id/upload-images')
  @UseInterceptors(FilesInterceptor('images', 20))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      const uploadResults = await this.cloudinaryService.uploadMultipleImages(
        files,
        'albums/images',
      );

      const images = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        caption: '',
        alt: '',
      }));

      // Add images to album
      let updatedAlbum;
      for (const image of images) {
        updatedAlbum = await this.albumsService.addImage(id, image);
      }

      return {
        message: `${images.length} images uploaded successfully`,
        images,
        album: updatedAlbum,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload images');
    }
  }

  @Delete(':id/images/:imageId')
  async removeImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    try {
      // Delete from Cloudinary
      await this.cloudinaryService.deleteImage(imageId);
      
      // Remove from album
      const updatedAlbum = await this.albumsService.removeImage(id, imageId);

      return {
        message: 'Image removed successfully',
        album: updatedAlbum,
      };
    } catch (error) {
      throw new BadRequestException('Failed to remove image');
    }
  }
} 