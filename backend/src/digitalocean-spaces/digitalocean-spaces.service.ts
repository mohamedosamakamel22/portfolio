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
}

export interface UploadOptions {
  folder?: string;
  quality?: string;
  maxWidth?: number;
  maxHeight?: number;
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
    // Fixed: Remove bucket name from endpoint
    this.endpoint = `https://sfo3.digitaloceanspaces.com`;
    
    this.s3Client = new S3Client({
      // Fixed: Use region endpoint without bucket name
      endpoint: "https://sfo3.digitaloceanspaces.com",
      region: "sfo3",
      credentials: {
        accessKeyId: this.configService.get<string>('DO_SPACES_KEY') || "",
        secretAccessKey: this.configService.get<string>('DO_SPACES_SECRET') || "",
      },
      // Fixed: Set to true for DigitalOcean Spaces
      forcePathStyle: false,
    });
    console.log("CONFIG DO_SPACES_ACCESS_KEY",this.configService.get<string>('DO_SPACES_KEY'));
  }

  private generateFileName(originalName: string, folder?: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const fileName = `${timestamp}-${randomString}${extension}`;
    
    if (folder) {
      return `${folder}/${fileName}`;
    }
    return fileName;
  }

  private getFileUrl(key: string): string {
    // Fixed: Use bucket name in the URL construction
    return `https://${this.bucketName}.sfo3.digitaloceanspaces.com/${key}`;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadResponse> {
    const key = this.generateFileName(file.originalname, folder || 'portfolio');
    
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
      };
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadLargeImage(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<UploadResponse> {
    const { folder, quality, maxWidth, maxHeight } = options;
    const key = this.generateFileName(file.originalname, folder || 'portfolio/high-res');
    
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
  ): Promise<UploadResponse> {
    const key = this.generateFileName(file.originalname, folder || 'portfolio/videos');
    
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
      };
    } catch (error) {
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadResponse> {
    const key = this.generateFileName(file.originalname, folder || 'files');
    
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
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async uploadMultipleVideos(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadVideo(file, folder));
    return Promise.all(uploadPromises);
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async uploadMixedMedia(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => {
      // Check if file is video
      if (file.mimetype.startsWith('video/')) {
        return this.uploadVideo(file, folder);
      } else if (file.mimetype.startsWith('image/')) {
        return this.uploadImage(file, folder);
      } else {
        return this.uploadFile(file, folder);
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