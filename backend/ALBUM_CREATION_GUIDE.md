# Album Creation API Guide

## Overview

The album creation endpoint has been enhanced to support image uploads (cover image and album images) with comprehensive validation. The endpoint now uses multipart/form-data to handle file uploads and includes proper validation for all album attributes.

## Endpoint Details

- **URL**: `POST /albums`
- **Authentication**: Required (Admin role)
- **Content-Type**: `multipart/form-data`
- **Hardcoded User ID**: `685fe192e9ad4407f2b52ce4`

## Request Format

### Required Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `title` | string | Album title | Required, 1-200 characters |
| `description` | string | Album description | Required, 1-2000 characters |

### Optional Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `coverImage` | file | Cover image for the album | Image file, uploaded to Cloudinary |
| `images` | files[] | Album images (max 20) | Image files, uploaded to Cloudinary |
| `tags` | string | Comma-separated tags | Converted to array, max 20 tags, 50 chars each |
| `features` | string | JSON string of features | Max 10 features, validated structure |
| `specifications` | string | JSON string of specifications | Max 10 specifications, validated structure |
| `actionButton` | string | JSON string of action button | Validated structure |
| `youtubeVideo` | string | JSON string of YouTube video | Validated structure |

### Image Alt Text

For each uploaded image, you can provide alt text using the format:
- `imageAlt_0` for the first image
- `imageAlt_1` for the second image
- etc.

## Data Structures

### Features Array
```json
[
  {
    "icon": "📸",
    "title": "Camera Used",
    "value": "Canon EOS R5",
    "order": 1
  }
]
```

### Specifications Array
```json
[
  {
    "icon": "📂",
    "name": "Category",
    "value": "Travel",
    "order": 1
  }
]
```

### Action Button
```json
{
  "text": "Buy Prints",
  "url": "https://prints.example.com/album",
  "enabled": true,
  "style": "primary"
}
```

### YouTube Video
```json
{
  "videoId": "YqeW9_5kURI",
  "title": "Behind the Scenes",
  "description": "Video description",
  "thumbnail": "https://img.youtube.com/vi/YqeW9_5kURI/maxresdefault.jpg",
  "embedUrl": "https://www.youtube.com/embed/YqeW9_5kURI",
  "duration": "4:32"
}
```

## Validation Rules

### Title
- Required
- String
- 1-200 characters
- Not empty

### Description
- Required
- String
- 1-2000 characters
- Not empty

### Cover Image
- Optional
- Valid image file
- Uploaded to Cloudinary in `albums/covers` folder

### Images Array
- Optional
- Maximum 20 images
- Each image uploaded to Cloudinary in `albums/images` folder
- Each image can have alt text (max 200 characters)

### Tags
- Optional
- Comma-separated string converted to array
- Maximum 20 tags
- Each tag maximum 50 characters

### Features
- Optional
- Maximum 10 features
- Each feature has:
  - icon: string (max 10 chars)
  - title: string (1-100 chars)
  - value: string (1-200 chars)
  - order: number (optional)

### Specifications
- Optional
- Maximum 10 specifications
- Each specification has:
  - icon: string (max 10 chars)
  - name: string (1-100 chars)
  - value: string (1-200 chars)
  - order: number (optional)

### Action Button
- Optional
- Object with:
  - text: string (1-50 chars)
  - url: valid URL
  - enabled: boolean
  - style: string (max 20 chars, optional)

### YouTube Video
- Optional
- Object with:
  - videoId: string (1-20 chars)
  - title: string (1-200 chars)
  - description: string (1-1000 chars)
  - thumbnail: valid URL
  - embedUrl: valid URL
  - duration: string (max 10 chars, optional)

## Example Usage

### Using cURL

```bash
curl -X POST http://localhost:3000/albums \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My Photography Album" \
  -F "description=A beautiful collection of travel photos" \
  -F "coverImage=@cover.jpg" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "imageAlt_0=Beautiful sunset" \
  -F "imageAlt_1=Mountain landscape" \
  -F "tags=Travel,Photography,Landscape" \
  -F "features=[{\"icon\":\"📸\",\"title\":\"Camera\",\"value\":\"Canon EOS R5\",\"order\":1}]" \
  -F "specifications=[{\"icon\":\"📂\",\"name\":\"Category\",\"value\":\"Travel\",\"order\":1}]" \
  -F "actionButton={\"text\":\"View Gallery\",\"url\":\"https://example.com\",\"enabled\":true,\"style\":\"primary\"}" \
  -F "youtubeVideo={\"videoId\":\"dQw4w9WgXcQ\",\"title\":\"Behind the Scenes\",\"description\":\"Video description\",\"thumbnail\":\"https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg\",\"embedUrl\":\"https://www.youtube.com/embed/dQw4w9WgXcQ\",\"duration\":\"3:45\"}"
```

### Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append('title', 'My Album');
formData.append('description', 'Album description');
formData.append('coverImage', coverImageFile);
formData.append('images', imageFile1);
formData.append('images', imageFile2);
formData.append('imageAlt_0', 'First image alt text');
formData.append('imageAlt_1', 'Second image alt text');
formData.append('tags', 'Travel,Photography');
formData.append('features', JSON.stringify([
  {
    icon: '📸',
    title: 'Camera Used',
    value: 'Canon EOS R5',
    order: 1
  }
]));

const response = await fetch('/albums', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## Response Format

### Success Response (200)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My Photography Album",
  "description": "A beautiful collection of travel photos",
  "coverImage": "https://res.cloudinary.com/example/image/upload/v1/albums/covers/cover.jpg",
  "images": [
    {
      "url": "https://res.cloudinary.com/example/image/upload/v1/albums/images/image1.jpg",
      "alt": "Beautiful sunset"
    }
  ],
  "tags": ["Travel", "Photography", "Landscape"],
  "features": [
    {
      "icon": "📸",
      "title": "Camera Used",
      "value": "Canon EOS R5",
      "order": 1
    }
  ],
  "specifications": [
    {
      "icon": "📂",
      "name": "Category",
      "value": "Travel",
      "order": 1
    }
  ],
  "actionButton": {
    "text": "View Gallery",
    "url": "https://example.com",
    "enabled": true,
    "style": "primary"
  },
  "youtubeVideo": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Behind the Scenes",
    "description": "Video description",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "duration": "3:45"
  },
  "createdBy": "685fe192e9ad4407f2b52ce4",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": "Title and description are required",
  "error": "Bad Request"
}
```

#### File Upload Error (400)
```json
{
  "statusCode": 400,
  "message": "Failed to upload cover image",
  "error": "Bad Request"
}
```

#### Authentication Error (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### Authorization Error (403)
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Testing

Use the provided test file `test-album-creation.js` to test the endpoint:

```bash
node test-album-creation.js
```

Make sure to:
1. Replace `YOUR_JWT_TOKEN_HERE` with an actual admin JWT token
2. Uncomment image upload lines if you have test image files
3. Ensure the server is running on `http://localhost:3000`

## Notes

- The user ID is hardcoded to `685fe192e9ad4407f2b52ce4` as requested
- Images are uploaded to Cloudinary in organized folders (`albums/covers` and `albums/images`)
- All JSON fields must be sent as strings and will be parsed on the server
- Maximum file upload limits are enforced (20 images total)
- Comprehensive validation ensures data integrity
- Error handling provides clear feedback for validation failures 