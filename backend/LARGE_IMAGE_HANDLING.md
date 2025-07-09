# Large Image Handling Guide

This document explains how to handle large images in the portfolio application, including upload limits, optimization, and best practices.

## Overview

The application now supports uploading large images (up to 100MB) with automatic optimization and compression. This is particularly useful for high-resolution photography and professional portfolio images.

## File Size Limits

### Standard Upload Endpoints
- **Regular uploads**: 50MB per file (increased from 10MB)
- **Multiple uploads**: 50MB per file, max 10 files
- **Mixed media**: 50MB per file, max 10 files

### Large Image Endpoint
- **Large image uploads**: 100MB per file
- **Specialized optimization**: Enhanced compression and multiple format generation

## Upload Endpoints

### 1. Regular Image Upload
```bash
POST /media/upload
Content-Type: multipart/form-data

# Form data:
# file: [image file up to 50MB]
# folder: portfolio/images (optional)
```

### 2. Large Image Upload (NEW)
```bash
POST /media/upload/large-image
Content-Type: multipart/form-data

# Form data:
# file: [image file up to 100MB]
# folder: portfolio/high-res (optional)
# quality: auto|best|good|eco|low (optional, default: auto)
# maxWidth: 4000 (optional, default: 4000px)
# maxHeight: 4000 (optional, default: 4000px)
```

### 3. Multiple Image Upload
```bash
POST /media/upload/multiple
Content-Type: multipart/form-data

# Form data:
# files: [array of image files, up to 50MB each]
# folder: portfolio/gallery (optional)
```

### 4. Album Creation with Images (NEW)
```bash
POST /albums/with-images
Content-Type: multipart/form-data
Authorization: Bearer <token>

# Form data:
# title: "My Photo Album" (required)
# description: "Album description" (required)
# tags: "nature,photography,travel" (optional, comma-separated)
# images: [array of image files, up to 50MB each, max 20 files]
# folder: portfolio/albums (optional)
```

## Image Optimization Features

### Automatic Optimization
- **Progressive JPEG**: Faster loading experience
- **Format conversion**: Automatic format selection (WebP, AVIF, etc.)
- **Quality optimization**: Automatic quality adjustment based on content
- **Metadata stripping**: Removes unnecessary metadata to reduce file size

### Large Image Specific Features
- **Multi-resolution generation**: Creates multiple sizes automatically
  - 1920x1080 (Full HD)
  - 1200x800 (Standard)
  - 800x600 (Thumbnail)
- **Eager transformation**: Pre-generates optimized versions
- **Enhanced compression**: Better compression algorithms for large files

## Usage Examples

### 1. Upload a Large High-Resolution Image

```javascript
const formData = new FormData();
formData.append('file', largeImageFile); // Up to 100MB
formData.append('folder', 'portfolio/high-res');
formData.append('quality', 'best');
formData.append('maxWidth', '6000');
formData.append('maxHeight', '4000');

const response = await fetch('/media/upload/large-image', {
  method: 'POST',
  body: formData
});

const result = await response.json();
// Returns: { url, publicId, originalSize, optimizedSize }
```

### 2. Create Album with Multiple Large Images

```javascript
const formData = new FormData();
formData.append('title', 'Nature Photography');
formData.append('description', 'Collection of nature photos');
formData.append('tags', 'nature,landscape,photography');
formData.append('folder', 'portfolio/nature');

// Add multiple images
largeImageFiles.forEach(file => {
  formData.append('images', file);
});

const response = await fetch('/albums/with-images', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### 3. Upload Multiple Large Images

```javascript
const formData = new FormData();
formData.append('folder', 'portfolio/gallery');

largeImageFiles.forEach(file => {
  formData.append('files', file);
});

const response = await fetch('/media/upload/multiple', {
  method: 'POST',
  body: formData
});
```

## Error Handling

### Common Errors
- **File too large**: Check file size limits for each endpoint
- **Invalid format**: Only image files are accepted
- **Upload timeout**: For very large files, consider chunked uploads
- **Memory issues**: Server may need more memory for processing large images

### Error Responses
```json
{
  "statusCode": 400,
  "message": "File too large. Maximum size is 100MB for large images.",
  "error": "Bad Request"
}
```

## Best Practices

### 1. Choose the Right Endpoint
- Use `/media/upload/large-image` for single high-resolution images
- Use `/media/upload/multiple` for batch uploads of standard images
- Use `/albums/with-images` for creating albums with images in one step

### 2. Optimize Before Upload
- Consider pre-resizing extremely large images (>50MB)
- Use appropriate quality settings based on image type
- Remove unnecessary metadata before upload

### 3. Handle Errors Gracefully
```javascript
try {
  const result = await uploadLargeImage(file);
  console.log('Upload successful:', result);
} catch (error) {
  if (error.message.includes('File too large')) {
    // Handle file size error
    console.error('File is too large, please reduce size');
  } else {
    // Handle other errors
    console.error('Upload failed:', error.message);
  }
}
```

### 4. Monitor Upload Progress
```javascript
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percentComplete = (e.loaded / e.total) * 100;
    console.log(`Upload progress: ${percentComplete}%`);
  }
});
```

## Performance Considerations

### Server Configuration
- Increase server memory for processing large images
- Configure appropriate timeout values
- Consider using CDN for image delivery

### Client-Side Optimizations
- Implement upload progress indicators
- Use chunked uploads for very large files
- Compress images client-side when possible

## Security Considerations

### File Validation
- Files are validated for image format
- Size limits are enforced server-side
- Malicious files are rejected

### Access Control
- Album creation requires authentication
- User permissions are checked
- Rate limiting may be applied

## Monitoring and Logging

### Upload Metrics
- Track file sizes and upload times
- Monitor success/failure rates
- Log optimization results

### Error Tracking
- Upload failures are logged
- Performance issues are monitored
- User feedback is collected

## Troubleshooting

### Common Issues
1. **Uploads timing out**: Increase server timeout settings
2. **Memory errors**: Increase server memory allocation
3. **Quality issues**: Adjust quality settings
4. **Slow uploads**: Check network connectivity and server resources

### Debug Information
Check the response for additional debugging information:
```json
{
  "url": "https://...",
  "publicId": "...",
  "originalSize": 15728640,
  "optimizedSize": 2097152,
  "uploadTime": "2.3s",
  "compressionRatio": "86.7%"
}
```

## Support

For issues with large image uploads:
1. Check file size and format
2. Review error messages
3. Monitor server logs
4. Contact support with specific error details 