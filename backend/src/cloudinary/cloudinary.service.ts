import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.extractCloudName(),
      api_key: this.extractApiKey(),
      api_secret: this.extractApiSecret(),
    });
  }

  private extractCloudName(): string {
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (!cloudinaryUrl) throw new Error('CLOUDINARY_URL is not defined');
    return cloudinaryUrl.split('@')[1];
  }

  private extractApiKey(): string {
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (!cloudinaryUrl) throw new Error('CLOUDINARY_URL is not defined');
    return cloudinaryUrl.split('://')[1].split(':')[0];
  }

  private extractApiSecret(): string {
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (!cloudinaryUrl) throw new Error('CLOUDINARY_URL is not defined');
    return cloudinaryUrl.split('://')[1].split(':')[1].split('@')[0];
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder || 'portfolio',
          resource_type: 'auto',
          quality: 'auto',
          flags: 'progressive',
          transformation: [
            { width: 4000, height: 4000, crop: 'limit' },
            { quality: 'auto' }
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      ).end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder || 'portfolio/videos',
          resource_type: 'video',
          quality: 'auto',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' }
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Video upload failed'));
          resolve(result);
        },
      ).end(file.buffer);
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async uploadMultipleVideos(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map(file => this.uploadVideo(file, folder));
    return Promise.all(uploadPromises);
  }

  async uploadMixedMedia(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map(file => {
      // Check if file is video
      if (file.mimetype.startsWith('video/')) {
        return this.uploadVideo(file, folder);
      } else {
        return this.uploadImage(file, folder);
      }
    });
    return Promise.all(uploadPromises);
  }
} 