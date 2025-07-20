import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

export interface UploadResponse {
  url: string;
  publicId: string;
  bytes?: number;
  filename: string; // The actual filename stored in Digital Ocean Spaces
  originalFilename: string; // The original filename before any modifications
}

export interface UploadOptions {
  folder?: string;
  quality?: string;
  maxWidth?: number;
  maxHeight?: number;
  preserveOriginalName?: boolean; // New option to control filename behavior
  preventOverwrite?: boolean; // New option to prevent file overwrites
}

@Injectable()
export class DigitalOceanSpacesService {
  private s3Client: S3Client;
  private bucketName: string;
  private endpoint: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('DO_SPACES_BUCKET') || 'portfolio';
    this.region = this.configService.get<string>('DO_SPACES_REGION') || 'sfo3';
    this.endpoint = this.configService.get<string>('DO_SPACES_ENDPOINT') || `https://${this.region}.digitaloceanspaces.com`;
    
    console.log('Digital Ocean Spaces Configuration:', {
      bucket: this.bucketName,
      region: this.region,
      endpoint: this.endpoint,
      hasKey: !!this.configService.get<string>('DO_SPACES_KEY'),
      hasSecret: !!this.configService.get<string>('DO_SPACES_SECRET')
    });
    
    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('DO_SPACES_KEY') || "",
        secretAccessKey: this.configService.get<string>('DO_SPACES_SECRET') || "",
      },
      forcePathStyle: true, // Use path-style URLs for Digital Ocean Spaces
      // Add proper configuration for Digital Ocean Spaces
      maxAttempts: 3,
      retryMode: 'adaptive',
    });
  }

  private decodeFilename(filename: string): string {
    try {
      // First, try to detect if it's double-encoded UTF-8
      if (filename.includes('Ø') || filename.includes('Ù') || filename.includes('Ú')) {
        // This looks like UTF-8 bytes interpreted as Latin-1, convert back
        const buffer = Buffer.from(filename, 'latin1');
        const decoded = buffer.toString('utf8');
        console.log('Decoded Arabic filename:', filename, '->', decoded);
        return decoded;
      }
      
      // Try URL decoding
      const urlDecoded = decodeURIComponent(filename);
      if (urlDecoded !== filename) {
        console.log('URL decoded filename:', filename, '->', urlDecoded);
        return urlDecoded;
      }
      
      // Return as-is if no decoding needed
      return filename;
    } catch (error) {
      console.log('Filename decoding failed:', error.message);
      return filename;
    }
  }
  

// Updated sanitizeFileName method for the DigitalOceanSpacesService class
private sanitizeFileName(fileName: string): string {
  console.log('Original filename:', fileName);
  console.log('Original filename bytes:', Buffer.from(fileName, 'utf8'));
  
  let decoded: string;
  
  try {
    // First, try to handle double-encoded UTF-8 (common with form uploads)
    if (fileName.includes('\\x')) {
      // Handle escaped Unicode sequences
      try {
        decoded = JSON.parse(`"${fileName}"`);
        console.log('Fixed escaped Unicode:', decoded);
      } catch {
        decoded = fileName;
      }
    } else {
      // Try to decode from Latin-1 to UTF-8 (common encoding issue)
      const buffer = Buffer.from(fileName, 'latin1');
      const utf8String = buffer.toString('utf8');
      
      if (utf8String !== fileName && /[\u0080-\uFFFF]/.test(utf8String)) {
        decoded = utf8String;
        console.log('Fixed encoding from Latin-1 to UTF-8:', decoded);
      } else {
        // Try URL decoding
        try {
          const urlDecoded = decodeURIComponent(fileName);
          decoded = urlDecoded !== fileName ? urlDecoded : fileName;
          console.log('URL decoded filename:', decoded);
        } catch {
          decoded = fileName;
        }
      }
    }
  } catch (error) {
    console.log('Encoding fix failed, using original:', error.message);
    decoded = fileName;
  }
  
  // Check if filename contains non-ASCII characters
  const hasNonAscii = /[^\x00-\x7F]/.test(decoded);
  
  if (hasNonAscii) {
    console.log('Non-ASCII filename detected, generating S3-safe filename');
    
    // For non-ASCII filenames (Arabic, Chinese, etc.), generate a safe filename
    // but preserve the original in metadata
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(6).toString('hex');
    const extension = path.extname(decoded);
    
    // Create a meaningful prefix based on the original filename length
    const prefix = decoded.length > 10 ? 'document' : 'file';
    const sanitized = `${prefix}_${timestamp}_${randomString}${extension}`;
    
    console.log('Generated S3-safe filename:', sanitized);
    return sanitized;
  } else {
    // For ASCII filenames, use standard sanitization
    const sanitized = decoded
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-') // Replace forbidden characters
      .replace(/\s+/g, '_') // Replace spaces with underscores  
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .replace(/_+/g, '_') // Replace multiple underscores with single underscore
      .replace(/^[-_.]+|[-_.]+$/g, '') // Remove leading/trailing special chars
      .toLowerCase() // Convert to lowercase for consistency
      .substring(0, 100); // Limit length to prevent issues
    
    console.log('ASCII filename sanitized:', sanitized);
    return sanitized || `file_${Date.now()}${path.extname(decoded)}`;
  }
}

// Updated uploadFile method with better error handling and metadata
async uploadFile(
  file: Express.Multer.File,
  folder?: string,
  preserveOriginalName: boolean = true,
  preventOverwrite: boolean = true,
): Promise<UploadResponse> {
  let key = this.generateFileName(file.originalname, folder || 'files', preserveOriginalName);
  
  // Handle filename conflicts to prevent overwrites if enabled
  if (preventOverwrite) {
    key = await this.handleFileNameConflict(key);
  }
  
  console.log('Upload file - Final key:', key);
  console.log('Upload file - Original filename:', file.originalname);
  
  // Ensure the key is properly encoded for S3
  const encodedKey = key;
  
  const command = new PutObjectCommand({
    Bucket: this.bucketName,
    Key: encodedKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
    Metadata: {
      'original-name': Buffer.from(file.originalname, 'utf8').toString('base64'), // Store as base64 to avoid encoding issues
      'original-name-utf8': encodeURIComponent(file.originalname), // Also store URL-encoded version
      'upload-date': new Date().toISOString(),
      'file-type': 'document',
      'file-size': file.size.toString(),
    },
    // Add cache control for better performance
    CacheControl: 'public, max-age=31536000',
  });

  try {
    console.log('Sending S3 command with encoded key:', encodedKey);
    
    const result = await this.s3Client.send(command);
    
    console.log('S3 upload successful');
    
    return {
      url: this.getFileUrl(encodedKey),
      publicId: encodedKey,
      bytes: file.size,
      filename: preserveOriginalName ? this.decodeFilename(file.originalname) : path.basename(encodedKey),
      originalFilename: this.decodeFilename(file.originalname),
    };
  } catch (error) {
    console.error('Upload error details:', {
      error: error.message,
      errorCode: error.name,
      key: encodedKey,
      originalName: file.originalname,
      hasNonAscii: /[^\x00-\x7F]/.test(file.originalname),
    });
    
    // If signature error and filename has non-ASCII, try with a completely safe filename
    if (error.message.includes('signature') && /[^\x00-\x7F]/.test(file.originalname)) {
      console.log('Retrying with fallback safe filename...');
      
      const fallbackKey = this.generateSafeFilename(file.originalname, folder || 'files');
      const fallbackCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fallbackKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        Metadata: {
          'original-name': Buffer.from(file.originalname, 'utf8').toString('base64'),
          'original-name-utf8': encodeURIComponent(file.originalname),
          'upload-date': new Date().toISOString(),
          'file-type': 'document',
          'fallback-upload': 'true',
        },
        CacheControl: 'public, max-age=31536000',
      });
      
      try {
        await this.s3Client.send(fallbackCommand);
        return {
          url: this.getFileUrl(fallbackKey),
          publicId: fallbackKey,
          bytes: file.size,
          filename: preserveOriginalName ? this.decodeFilename(file.originalname) : path.basename(fallbackKey),
          originalFilename: this.decodeFilename(file.originalname),
        };
      } catch (fallbackError) {
        console.error('Fallback upload also failed:', fallbackError.message);
        throw new Error(`Failed to upload file even with safe filename: ${fallbackError.message}`);
      }
    }
    
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

// Add this new helper method to generate completely safe filenames
private generateSafeFilename(originalName: string, folder?: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName).toLowerCase();
  
  // Create a completely ASCII-safe filename
  const safeFilename = `upload_${timestamp}_${randomString}${extension}`;
  
  return folder ? `${folder}/${safeFilename}` : safeFilename;
}

// Updated generateFileName method
private generateFileName(originalName: string, folder?: string, preserveOriginalName: boolean = true): string {
  if (preserveOriginalName) {
    const sanitizedName = this.sanitizeFileName(originalName);
    return folder ? `${folder}/${sanitizedName}` : sanitizedName;
  } else {
    return this.generateSafeFilename(originalName, folder);
  }
}


  private async handleFileNameConflict(key: string): Promise<string> {
    // Check if file already exists
    const exists = await this.fileExists(key);
    if (!exists) {
      return key;
    }

    // If file exists, append a timestamp to make it unique
    const parsedPath = path.parse(key);
    const timestamp = Date.now();
    const nameWithoutExt = parsedPath.name;
    const extension = parsedPath.ext;
    const dir = parsedPath.dir;
    
    // Use timestamp instead of counter to avoid race conditions
    const newFileName = `${nameWithoutExt}_${timestamp}${extension}`;
    const newKey = dir ? `${dir}/${newFileName}` : newFileName;
    
    console.log(`File ${key} already exists, using new name: ${newKey}`);
    return newKey;
  }

  private getFileUrl(key: string): string {
    // Use path-style URLs since forcePathStyle is true
    return `${this.endpoint}/${this.bucketName}/${key}`;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
    preserveOriginalName: boolean = true,
    preventOverwrite: boolean = true,
  ): Promise<UploadResponse> {
    let key = this.generateFileName(file.originalname, folder || 'portfolio', preserveOriginalName);
    
    console.log('Upload parameters:', {
      originalName: file.originalname,
      preserveOriginalName,
      preventOverwrite,
      initialKey: key
    });
    
    // Handle filename conflicts to prevent overwrites if enabled
    if (preventOverwrite) {
      key = await this.handleFileNameConflict(key);
    }
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      Metadata: {
        'original-name': file.originalname,
        'upload-date': new Date().toISOString(),
      },
    });

    try {
      await this.s3Client.send(command);
      return {
        url: this.getFileUrl(key),
        publicId: key,
        bytes: file.size,
        filename: preserveOriginalName ? this.decodeFilename(file.originalname) : path.basename(key),
        originalFilename: this.decodeFilename(file.originalname),
      };
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadLargeImage(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<UploadResponse> {
    const { folder, quality, maxWidth, maxHeight, preserveOriginalName = true, preventOverwrite = true } = options;
    let key = this.generateFileName(file.originalname, folder || 'portfolio/high-res', preserveOriginalName);
    
    // Handle filename conflicts to prevent overwrites if enabled
    if (preventOverwrite) {
      key = await this.handleFileNameConflict(key);
    }
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      Metadata: {
        'original-name': file.originalname,
        'upload-date': new Date().toISOString(),
        'quality': quality || 'auto',
        'max-width': maxWidth?.toString() || '4000',
        'max-height': maxHeight?.toString() || '4000',
        'file-size': file.size.toString(),
      },
    });

    try {
      await this.s3Client.send(command);
      return {
        url: this.getFileUrl(key),
        publicId: key,
        bytes: file.size,
        filename: preserveOriginalName ? this.decodeFilename(file.originalname) : path.basename(key),
        originalFilename: this.decodeFilename(file.originalname),
      };
    } catch (error) {
      throw new Error(`Failed to upload large image: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<any> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: publicId,
    });

    try {
      return await this.s3Client.send(command);
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder?: string,
    preserveOriginalName: boolean = true,
    preventOverwrite: boolean = true,
  ): Promise<UploadResponse> {
    let key = this.generateFileName(file.originalname, folder || 'portfolio/videos', preserveOriginalName);
    
    // Handle filename conflicts to prevent overwrites if enabled
    if (preventOverwrite) {
      key = await this.handleFileNameConflict(key);
    }
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      Metadata: {
        'original-name': file.originalname,
        'upload-date': new Date().toISOString(),
        'file-type': 'video',
      },
    });

    try {
      await this.s3Client.send(command);
      return {
        url: this.getFileUrl(key),
        publicId: key,
        bytes: file.size,
        filename: preserveOriginalName ? this.decodeFilename(file.originalname) : path.basename(key),
        originalFilename: this.decodeFilename(file.originalname),
      };
    } catch (error) {
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }


  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder?: string,
    preserveOriginalName: boolean = true,
    preventOverwrite: boolean = true,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder, preserveOriginalName, preventOverwrite));
    return Promise.all(uploadPromises);
  }

  async uploadMultipleVideos(
    files: Express.Multer.File[],
    folder?: string,
    preserveOriginalName: boolean = true,
    preventOverwrite: boolean = true,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadVideo(file, folder, preserveOriginalName, preventOverwrite));
    return Promise.all(uploadPromises);
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
    preserveOriginalName: boolean = true,
    preventOverwrite: boolean = true,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder, preserveOriginalName, preventOverwrite));
    return Promise.all(uploadPromises);
  }

  async uploadMixedMedia(
    files: Express.Multer.File[],
    folder?: string,
    preserveOriginalName: boolean = true,
    preventOverwrite: boolean = true,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => {
      // Check if file is video
      if (file.mimetype.startsWith('video/')) {
        return this.uploadVideo(file, folder, preserveOriginalName, preventOverwrite);
      } else if (file.mimetype.startsWith('image/')) {
        return this.uploadImage(file, folder, preserveOriginalName, preventOverwrite);
      } else {
        return this.uploadFile(file, folder, preserveOriginalName, preventOverwrite);
      }
    });
    return Promise.all(uploadPromises);
  }

  async fileExists(key: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  async generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }
}