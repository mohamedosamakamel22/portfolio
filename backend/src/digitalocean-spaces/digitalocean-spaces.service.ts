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
    this.region = 'sfo3';
    this.endpoint = `https://sfo3.digitaloceanspaces.com`;
    
    this.s3Client = new S3Client({
      endpoint: "https://sfo3.digitaloceanspaces.com",
      region: "sfo3",
      credentials: {
        accessKeyId: this.configService.get<string>('DO_SPACES_KEY') || "",
        secretAccessKey: this.configService.get<string>('DO_SPACES_SECRET') || "",
      },
      forcePathStyle: false,
    });
    console.log("CONFIG DO_SPACES_ACCESS_KEY",this.configService.get<string>('DO_SPACES_KEY'));
  }

  private generateFileName(originalName: string, folder?: string, preserveOriginalName: boolean = true): string {
    if (preserveOriginalName) {
      // Use original name with folder path - no additional encoding here
      const sanitizedName = this.sanitizeFileName(originalName);
      return folder ? `${folder}/${sanitizedName}` : sanitizedName;
    } else {
      // Use the old method with timestamp and random string
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      const extension = path.extname(originalName);
      const fileName = `${timestamp}-${randomString}${extension}`;
      
      return folder ? `${folder}/${fileName}` : fileName;
    }
  }

  private sanitizeFileName(fileName: string): string {
    console.log('Original filename:', fileName);
    console.log('Original filename bytes:', Buffer.from(fileName, 'utf8'));
    
    // Try to decode if it's URL encoded
    let decoded: string;
    try {
      // Check if it's already URL encoded
      if (fileName !== decodeURIComponent(fileName)) {
        decoded = decodeURIComponent(fileName);
        console.log('Decoded filename:', decoded);
      } else {
        decoded = fileName;
      }
    } catch (error) {
      console.log('Decoding failed, using original:', error.message);
      decoded = fileName;
    }
    
    // Convert from any potential encoding issues
    try {
      // Handle potential double encoding or encoding issues
      const buffer = Buffer.from(decoded, 'latin1');
      const utf8String = buffer.toString('utf8');
      if (utf8String !== decoded && /[\u0080-\uFFFF]/.test(utf8String)) {
        decoded = utf8String;
        console.log('Fixed encoding to:', decoded);
      }
    } catch (error) {
      console.log('Encoding fix failed:', error.message);
    }
    
    // Only replace characters that are actually problematic for file systems
    const sanitized = decoded
      .replace(/[<>:"/\\|?*]/g, '-') // Replace forbidden filesystem characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .replace(/_+/g, '_') // Replace multiple underscores with single underscore
      .trim(); // Remove leading/trailing whitespace
    
    console.log('Final sanitized filename:', sanitized);
    return sanitized;
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
    // Don't encode the key - let the browser handle encoding naturally
    return `https://${this.bucketName}.sfo3.digitaloceanspaces.com/${key}`;
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
        filename: path.basename(key), // Extract filename from the key
        originalFilename: file.originalname, // Store the original filename
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
        filename: path.basename(key), // Extract filename from the key
        originalFilename: file.originalname, // Store the original filename
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
        filename: path.basename(key), // Extract filename from the key
        originalFilename: file.originalname, // Store the original filename
      };
    } catch (error) {
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }

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
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      Metadata: {
        'original-name': file.originalname,
        'upload-date': new Date().toISOString(),
        'file-type': 'document',
      },
    });

    try {
      await this.s3Client.send(command);
      return {
        url: this.getFileUrl(key),
        publicId: key,
        bytes: file.size,
        filename: path.basename(key), // Extract filename from the key
        originalFilename: file.originalname, // Store the original filename
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
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