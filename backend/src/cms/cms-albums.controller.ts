import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AlbumsService } from '../albums/albums.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateAlbumDto } from '../albums/dto/create-album.dto';
import { UpdateAlbumDto } from '../albums/dto/update-album.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('CMS - Albums Management')
@Controller('cms/albums')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CmsAlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.albumsService.getAlbumStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(id);
  }

  @Patch(':id/toggle-published')
  togglePublished(@Param('id') id: string) {
    return this.albumsService.togglePublished(id);
  }

  @Patch(':id/toggle-featured')  
  toggleFeatured(@Param('id') id: string) {
    return this.albumsService.toggleFeatured(id);
  }

  @Post(':id/upload-images')
  @UseInterceptors(FilesInterceptor('images', 20))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload multiple images and videos',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      const uploadResults = await this.cloudinaryService.uploadMixedMedia(files, 'albums');
      
      const imageData = uploadResults.map((result: any) => ({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
      }));

      // Add images one by one
      let updatedAlbum;
      for (const image of imageData) {
        updatedAlbum = await this.albumsService.addImage(id, image);
      }

      return {
        message: `${files.length} files uploaded successfully`,
        album: updatedAlbum,
        uploadedFiles: imageData,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload files');
    }
  }

  @Delete(':id/images/:imageId')
  async removeImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    try {
      await this.cloudinaryService.deleteImage(imageId);
      return this.albumsService.removeImage(id, imageId);
    } catch (error) {
      throw new BadRequestException('Failed to remove image');
    }
  }
} 