# Digital Ocean Spaces Migration

This document outlines the migration from Cloudinary to Digital Ocean Spaces for file uploads in the portfolio backend.

## Overview

The backend has been successfully migrated from Cloudinary to Digital Ocean Spaces while preserving all original endpoints and functionality. All upload endpoints remain the same, ensuring backward compatibility.

## Changes Made

### 1. New Digital Ocean Spaces Service
- **File**: `src/digitalocean-spaces/digitalocean-spaces.service.ts`
- **Module**: `src/digitalocean-spaces/digitalocean-spaces.module.ts`
- **Features**:
  - File upload to Digital Ocean Spaces
  - Support for images, videos, and mixed media
  - Large file handling (up to 100MB)
  - Metadata tracking
  - File deletion
  - Presigned URL generation

### 2. Updated Controllers
All controllers have been updated to use the new Digital Ocean Spaces service:
- `src/media/media.controller.ts` - Main upload endpoints
- `src/profile/profile.controller.ts` - Profile image uploads
- `src/reviews/reviews.controller.ts` - Review image uploads
- `src/albums/albums.controller.ts` - Album image uploads

### 3. Updated Modules
- `src/app.module.ts` - Imports DigitalOceanSpacesModule
- `src/media/media.module.ts` - Uses DigitalOceanSpacesModule
- `src/profile/profile.module.ts` - Uses DigitalOceanSpacesService
- `src/reviews/reviews.module.ts` - Uses DigitalOceanSpacesService
- `src/albums/albums.module.ts` - Uses DigitalOceanSpacesService
- `src/report/report.module.ts` - Uses DigitalOceanSpacesModule

### 4. Environment Variables
Updated `env.example` with Digital Ocean Spaces configuration:
```env
# Digital Ocean Spaces Configuration
DO_SPACES_KEY=your_digital_ocean_spaces_key
DO_SPACES_SECRET=your_digital_ocean_spaces_secret
DO_SPACES_BUCKET=portfolio
DO_SPACES_ENDPOINT=https://seka.sfo3.digitaloceanspaces.com
DO_SPACES_REGION=sfo3
```

## Preserved Endpoints

All original upload endpoints remain unchanged:

### Media Upload Endpoints
- `POST /media/upload` - Single file upload
- `POST /media/upload/large-file` - Large file upload with optimization
- `POST /media/upload/multiple` - Multiple files upload
- `POST /media/upload/mixed` - Mixed media upload

### Profile Endpoints
- `POST /profile/:id/upload-profile-image` - Profile image upload

### Response Format
The response format has been updated to match Digital Ocean Spaces:
```json
{
          "url": "https://sfo3.digitaloceanspaces.com/portfolio/folder/file.jpg",
  "publicId": "folder/file",
  "bytes": 12345
}
```

## Key Differences

### 1. URL Format
- **Before (Cloudinary)**: `https://res.cloudinary.com/cloud-name/image/upload/v1234/folder/file.jpg`
- **After (Digital Ocean Spaces)**: `https://sfo3.digitaloceanspaces.com/portfolio/folder/file.jpg`

### 2. File Naming
- **Before**: Cloudinary managed file names with versioning
- **After**: Timestamp-based unique file names with random strings

### 3. Image Optimization
- **Before**: Cloudinary provided automatic image optimization and transformations
- **After**: Files are stored as-is; optimization needs to be handled client-side or with a separate service

## Setup Instructions

### 1. Install Dependencies
```bash
npm install aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Configure Environment Variables
Copy the new environment variables to your `.env` file:
```env
DO_SPACES_KEY=your_actual_key
DO_SPACES_SECRET=your_actual_secret
DO_SPACES_BUCKET=your_bucket_name
DO_SPACES_ENDPOINT=https://seka.sfo3.digitaloceanspaces.com
DO_SPACES_REGION=sfo3
```

### 3. Digital Ocean Spaces Setup
1. Create a Digital Ocean Spaces bucket
2. Generate API keys with appropriate permissions
3. Configure CORS if needed for direct browser uploads
4. Set bucket to public read access for uploaded files

### 4. Test the Migration
```bash
# Test single file upload
curl -X POST http://localhost:3000/media/upload \
  -F "file=@test-image.jpg" \
  -F "folder=test"

# Test large file upload
curl -X POST http://localhost:3000/media/upload/large-file \
  -F "file=@large-image.jpg" \
  -F "folder=large-files" \
  -F "quality=auto" \
  -F "maxWidth=4000" \
  -F "maxHeight=4000"
```

## Benefits of Migration

1. **Cost Efficiency**: Digital Ocean Spaces is generally more cost-effective for high-volume uploads
2. **Performance**: Direct S3-compatible API with global CDN
3. **Control**: Full control over file storage and access patterns
4. **Scalability**: Better suited for large file uploads and high traffic

## Limitations

1. **No Built-in Image Optimization**: Unlike Cloudinary, Digital Ocean Spaces doesn't provide automatic image transformations
2. **Manual CDN Setup**: Requires separate CDN configuration if needed
3. **No Automatic Format Conversion**: Files are stored in their original format

## Future Enhancements

1. **Image Processing Service**: Implement a separate image processing service for optimization
2. **CDN Integration**: Configure CloudFlare or similar CDN for better performance
3. **File Versioning**: Implement file versioning for rollback capabilities
4. **Backup Strategy**: Implement automated backup to secondary storage

## Rollback Plan

If needed, the original Cloudinary service files are still available:
- `src/cloudinary/cloudinary.service.ts`
- `src/cloudinary/cloudinary.module.ts`

To rollback, simply:
1. Revert the import changes in modules
2. Update environment variables back to Cloudinary
3. Remove Digital Ocean Spaces dependencies

## Support

For issues or questions regarding the Digital Ocean Spaces integration, refer to:
- [Digital Ocean Spaces Documentation](https://docs.digitalocean.com/products/spaces/)
- [AWS S3 SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-examples.html) 