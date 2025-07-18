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
    description: 'Upload a single file of any type to Cloudinary and get back the URL',
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
          description: 'The file to upload (any file type)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/files")',
          example: 'portfolio/files',
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
        fileSize: 100 * 1024 * 1024, // 100MB
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

  @Post('upload/large-file')
  @ApiOperation({
    summary: 'Upload a large file with enhanced optimization',
    description: 'Upload a large file (up to 100MB) with automatic compression and optimization',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Large file upload with optional folder parameter',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The large file to upload (up to 100MB)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/large-files")',
          example: 'portfolio/large-files',
        },
        quality: {
          type: 'string',
          description: 'File quality (auto, best, good, eco, low) - for images only',
          example: 'auto',
        },
        maxWidth: {
          type: 'number',
          description: 'Maximum width in pixels (default: 4000) - for images only',
          example: 4000,
        },
        maxHeight: {
          type: 'number',
          description: 'Maximum height in pixels (default: 4000) - for images only',
          example: 4000,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Large file uploaded successfully',
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
        fileSize: 100 * 1024 * 1024, // 100MB for large files
      },
    }),
  )
  async uploadLargeFile(
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
        folder: folder || 'portfolio/large-files',
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
      throw new BadRequestException('Failed to upload large file: ' + error.message);
    }
  }

  @Post('upload/multiple')
  @ApiOperation({
    summary: 'Upload multiple files',
    description: 'Upload multiple files of any type to Cloudinary and get back their URLs',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple files upload with optional folder parameter',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of files to upload (any file type, max 10 files)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/files")',
          example: 'portfolio/files',
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
        fileSize: 100 * 1024 * 1024, // 100MB per file
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
    summary: 'Upload mixed files',
    description: 'Upload multiple files of any type to Cloudinary and get back their URLs',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Mixed files upload with optional folder parameter',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of files to upload (any file type, max 10 files)',
        },
        folder: {
          type: 'string',
          description: 'Optional Cloudinary folder path (e.g., "portfolio/files")',
          example: 'portfolio/files',
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
        fileSize: 100 * 1024 * 1024, // 100MB per file
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