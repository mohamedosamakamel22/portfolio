import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Body, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DigitalOceanSpacesService } from '../digitalocean-spaces/digitalocean-spaces.service';
import { ApiTags, ApiConsumes, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { diskStorage } from 'multer';

@ApiTags('Media Upload')
@Controller('media')
export class MediaController {
  constructor(private readonly digitalOceanSpacesService: DigitalOceanSpacesService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a single file',
    description: 'Upload a single file of any type to Digital Ocean Spaces and get back the URL',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload with optional folder and naming parameters',
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
          description: 'Optional Digital Ocean Spaces folder path (e.g., "portfolio/files")',
          example: 'portfolio/files',
        },
        preserveOriginalName: {
          type: 'boolean',
          description: 'Whether to preserve original filename (default: true)',
          example: true,
        },
        preventOverwrite: {
          type: 'boolean',
          description: 'Whether to prevent overwriting existing files (default: true)',
          example: true,
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
          description: 'The Digital Ocean Spaces URL of the uploaded file',
          example: 'https://portfolio.sfo3.digitaloceanspaces.com/portfolio/files/صورة.png',
        },
        publicId: {
          type: 'string',
          description: 'The Digital Ocean Spaces key/path of the uploaded file',
          example: 'portfolio/files/عربيpdf.pdf',
        },
        filename: {
          type: 'string',
          description: 'The original filename before any modifications',
          example: 'عربيpdf.pdf',
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
      // Handle Unicode filenames properly
      preservePath: true,
      fileFilter: (req, file, cb) => {
        // Fix filename encoding if needed
        if (file.originalname) {
          try {
            // Try to fix potential encoding issues
            const buffer = Buffer.from(file.originalname, 'latin1');
            const utf8String = buffer.toString('utf8');
            if (utf8String !== file.originalname && /[\u0080-\uFFFF]/.test(utf8String)) {
              file.originalname = utf8String;
            }
          } catch (error) {
            console.log('Could not fix filename encoding:', error.message);
          }
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
    @Body('preserveOriginalName') preserveOriginalName?: string,
    @Body('preventOverwrite') preventOverwrite?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Convert string to boolean (form data comes as string)
    const shouldPreserveOriginalName = preserveOriginalName === 'false' ? false : true;
    const shouldPreventOverwrite = preventOverwrite === 'false' ? false : true;

    // Log the received filename for debugging
    console.log('Received file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    try {
      const result = await this.digitalOceanSpacesService.uploadImage(file, folder, shouldPreserveOriginalName, shouldPreventOverwrite);
      return {
        url: result.url,
        publicId: result.publicId,
        filename: result.originalFilename, // Return the original filename
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload file: ' + error.message);
    }
  }

  @Post('upload/large-file')
  @ApiOperation({
    summary: 'Upload a large file with enhanced optimization',
    description: 'Upload a large file (up to 100MB) to Digital Ocean Spaces with metadata tracking',
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
          description: 'Optional Digital Ocean Spaces folder path (e.g., "portfolio/large-files")',
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
        preserveOriginalName: {
          type: 'boolean',
          description: 'Whether to preserve original filename (default: true)',
          example: true,
        },
        preventOverwrite: {
          type: 'boolean',
          description: 'Whether to prevent overwriting existing files (default: true)',
          example: true,
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
          description: 'The Digital Ocean Spaces URL of the uploaded file',
          example: 'https://portfolio.sfo3.digitaloceanspaces.com/portfolio/files/صورة.png',
        },
        publicId: {
          type: 'string',
          description: 'The Digital Ocean Spaces key/path of the uploaded file',
          example: 'portfolio/files/عربيpdf.pdf',
        },
        filename: {
          type: 'string',
          description: 'The original filename before any modifications',
          example: 'عربيpdf.pdf',
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
    @Body('preserveOriginalName') preserveOriginalName?: string,
    @Body('preventOverwrite') preventOverwrite?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Convert string to boolean (form data comes as string)
    const shouldPreserveOriginalName = preserveOriginalName === 'false' ? false : true;
    const shouldPreventOverwrite = preventOverwrite === 'false' ? false : true;

    try {
      const result = await this.digitalOceanSpacesService.uploadLargeImage(file, {
        folder: folder || 'portfolio/large-files',
        quality: quality || 'auto',
        maxWidth: maxWidth || 4000,
        maxHeight: maxHeight || 4000,
        preserveOriginalName: shouldPreserveOriginalName,
        preventOverwrite: shouldPreventOverwrite,
      });
      
      return {
        url: result.url,
        publicId: result.publicId,
        filename: result.originalFilename, // Return the original filename
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
    description: 'Upload multiple files of any type to Digital Ocean Spaces and get back their URLs',
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
          description: 'Optional Digital Ocean Spaces folder path (e.g., "portfolio/files")',
          example: 'portfolio/files',
        },
        preserveOriginalName: {
          type: 'boolean',
          description: 'Whether to preserve original filename (default: true)',
          example: true,
        },
        preventOverwrite: {
          type: 'boolean',
          description: 'Whether to prevent overwriting existing files (default: true)',
          example: true,
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
            description: 'The Digital Ocean Spaces URL of the uploaded file',
            example: 'https://portfolio.sfo3.digitaloceanspaces.com/portfolio/files/عربيpdf.pdf',
          },
          publicId: {
            type: 'string',
            description: 'The Digital Ocean Spaces key/path of the uploaded file',
            example: 'portfolio/files/عربيpdf.pdf',
          },
          filename: {
            type: 'string',
            description: 'The original filename before any modifications',
            example: 'عربيpdf.pdf',
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
    @Body('preserveOriginalName') preserveOriginalName?: string,
    @Body('preventOverwrite') preventOverwrite?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Convert string to boolean (form data comes as string)
    const shouldPreserveOriginalName = preserveOriginalName === 'false' ? false : true;
    const shouldPreventOverwrite = preventOverwrite === 'false' ? false : true;

    try {
      const results = await this.digitalOceanSpacesService.uploadMultipleImages(files, folder, shouldPreserveOriginalName, shouldPreventOverwrite);
      return results.map(result => ({
        url: result.url,
        publicId: result.publicId,
        filename: result.originalFilename, // Return the original filename
      }));
    } catch (error) {
      throw new BadRequestException('Failed to upload files: ' + error.message);
    }
  }

  @Post('upload/mixed')
  @ApiOperation({
    summary: 'Upload mixed files',
    description: 'Upload multiple files of any type to Digital Ocean Spaces and get back their URLs',
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
          description: 'Array of files to upload (any file type, max 100MB per file)',
        },
        folder: {
          type: 'string',
          description: 'Optional Digital Ocean Spaces folder path (e.g., "portfolio/files")',
          example: 'portfolio/files',
        },
        preserveOriginalName: {
          type: 'boolean',
          description: 'Whether to preserve original filename (default: true)',
          example: true,
        },
        preventOverwrite: {
          type: 'boolean',
          description: 'Whether to prevent overwriting existing files (default: true)',
          example: true,
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
            description: 'The Digital Ocean Spaces URL of the uploaded file',
            example: 'https://portfolio.sfo3.digitaloceanspaces.com/portfolio/files/عربيpdf.pdf',
          },
          publicId: {
            type: 'string',
            description: 'The Digital Ocean Spaces key/path of the uploaded file',
            example: 'portfolio/files/عربيpdf.pdf',
          },
          filename: {
            type: 'string',
            description: 'The original filename before any modifications',
            example: 'عربيpdf.pdf',
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
    @Body('preserveOriginalName') preserveOriginalName?: string,
    @Body('preventOverwrite') preventOverwrite?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Convert string to boolean (form data comes as string)
    const shouldPreserveOriginalName = preserveOriginalName === 'false' ? false : true;
    const shouldPreventOverwrite = preventOverwrite === 'false' ? false : true;

    try {
      const results = await this.digitalOceanSpacesService.uploadMixedMedia(files, folder, shouldPreserveOriginalName, shouldPreventOverwrite);
      return results.map(result => ({
        url: result.url,
        publicId: result.publicId,
        filename: result.originalFilename, // Return the original filename
      }));
    } catch (error) {
      throw new BadRequestException('Failed to upload files: ' + error.message);
    }
  }
}