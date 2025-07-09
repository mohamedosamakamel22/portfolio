import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Body, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ApiTags, ApiConsumes, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { diskStorage } from 'multer';

@ApiTags('Media Upload')
@Controller('media')
export class MediaController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a single file',
    description: 'Upload a single image or video file to Cloudinary and get back the URL',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload with optional folder parameter',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload (image or video)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/images")',
          example: 'portfolio/images',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The Cloudinary URL of the uploaded file',
          example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234/folder/file.jpg',
        },
        publicId: {
          type: 'string',
          description: 'The Cloudinary public ID of the uploaded file',
          example: 'folder/file',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file or upload failed' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 50MB - increased from 10MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^(image|video)/)) {
          return callback(new BadRequestException('Only image and video files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file, folder);
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload file: ' + error.message);
    }
  }

  @Post('upload/large-image')
  @ApiOperation({
    summary: 'Upload a large image with enhanced optimization',
    description: 'Upload a large image file (up to 100MB) with automatic compression and optimization',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Large image file upload with optional folder parameter',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The large image file to upload (up to 100MB)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/high-res")',
          example: 'portfolio/high-res',
        },
        quality: {
          type: 'string',
          description: 'Image quality (auto, best, good, eco, low)',
          example: 'auto',
        },
        maxWidth: {
          type: 'number',
          description: 'Maximum width in pixels (default: 4000)',
          example: 4000,
        },
        maxHeight: {
          type: 'number',
          description: 'Maximum height in pixels (default: 4000)',
          example: 4000,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Large image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The Cloudinary URL of the uploaded file',
          example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234/folder/file.jpg',
        },
        publicId: {
          type: 'string',
          description: 'The Cloudinary public ID of the uploaded file',
          example: 'folder/file',
        },
        originalSize: {
          type: 'number',
          description: 'Original file size in bytes',
        },
        optimizedSize: {
          type: 'number',
          description: 'Optimized file size in bytes',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file or upload failed' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB for large images
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image/)) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadLargeImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
    @Body('quality') quality?: string,
    @Body('maxWidth') maxWidth?: number,
    @Body('maxHeight') maxHeight?: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.cloudinaryService.uploadLargeImage(file, {
        folder: folder || 'portfolio/high-res',
        quality: quality || 'auto',
        maxWidth: maxWidth || 4000,
        maxHeight: maxHeight || 4000,
      });
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        originalSize: file.size,
        optimizedSize: result.bytes,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload large image: ' + error.message);
    }
  }

  @Post('upload/multiple')
  @ApiOperation({
    summary: 'Upload multiple image files',
    description: 'Upload multiple image files to Cloudinary and get back their URLs',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple image files upload with optional folder parameter',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of image files to upload (max 10 files)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/gallery")',
          example: 'portfolio/gallery',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The Cloudinary URL of the uploaded file',
            example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234/folder/file.jpg',
          },
          publicId: {
            type: 'string',
            description: 'The Cloudinary public ID of the uploaded file',
            example: 'folder/file',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid files or upload failed' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 100 * 1024 * 1024, // 50MB per file - increased from 10MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image/)) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      const results = await this.cloudinaryService.uploadMultipleImages(files, folder);
      return results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    } catch (error) {
      throw new BadRequestException('Failed to upload files: ' + error.message);
    }
  }

  @Post('upload/mixed')
  @ApiOperation({
    summary: 'Upload mixed media files',
    description: 'Upload multiple files (images and videos) to Cloudinary and get back their URLs',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Mixed media files upload with optional folder parameter',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of files to upload (images and videos, max 10 files)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/media")',
          example: 'portfolio/media',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The Cloudinary URL of the uploaded file',
            example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234/folder/file.jpg',
          },
          publicId: {
            type: 'string',
            description: 'The Cloudinary public ID of the uploaded file',
            example: 'folder/file',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid files or upload failed' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 100 * 1024 * 1024, // 50MB per file - increased from 10MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^(image|video)/)) {
          return callback(new BadRequestException('Only image and video files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadMixedFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      const results = await this.cloudinaryService.uploadMixedMedia(files, folder);
      return results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    } catch (error) {
      throw new BadRequestException('Failed to upload files: ' + error.message);
    }
  }
} 