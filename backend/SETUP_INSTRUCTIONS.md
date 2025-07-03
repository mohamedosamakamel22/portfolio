# Photography Portfolio CMS - Setup Instructions

## Quick Start

### 1. Environment Setup
First, you need to create a `.env` file with your credentials:

```bash
# Copy the example file
cp env.example .env
```

Then edit the `.env` file with your actual credentials:
```
MONGODB_URI=mongodb+srv://osamakamelmohamed6:x2NRTuaw630wnw0x@cluster0.jkbgwct.mongodb.net/portfolio
CLOUDINARY_URL=cloudinary://464657318314657:xAc3DCSTR5_Hiak7jDDpWmIgeoA@egyptismycountry
PORT=3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed the Database
```bash
npm run seed
```

### 4. Start the Development Server
```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000/api`

## What You Get

### 🏗️ Complete API Structure
- **Profile Management**: Photographer profile with stats, experience, FAQ
- **Reviews System**: Client testimonials with ratings and visibility controls  
- **Albums Management**: Photo galleries with categories and image uploads
- **File Upload**: Cloudinary integration for image storage

### 📋 Pre-populated Data
The seed script creates sample data based on the Saeed Sekka photography website:
- Professional photographer profile
- 4 client reviews with ratings
- 5 sample photo albums with different categories

### 🔗 API Endpoints
- `GET /api/profile/active` - Get active photographer profile
- `GET /api/reviews?visible=true` - Get visible client reviews  
- `GET /api/albums?published=true` - Get published photo albums
- `POST /api/albums/{id}/upload-images` - Upload multiple images
- And many more... (see README.md for complete list)

## Testing the API

### Using curl
```bash
# Get active profile
curl -X GET http://localhost:3000/api/profile/active

# Get visible reviews
curl -X GET "http://localhost:3000/api/reviews?visible=true"

# Get published albums
curl -X GET "http://localhost:3000/api/albums?published=true"
```

### Using Postman
1. Import the examples from `API_EXAMPLES.md`
2. Set base URL: `http://localhost:3000/api`
3. Test all endpoints

## File Upload Testing

### Upload Profile Image
```bash
curl -X POST http://localhost:3000/api/profile/{PROFILE_ID}/upload-profile-image \
  -F "image=@/path/to/your/image.jpg"
```

### Upload Album Images
```bash
curl -X POST http://localhost:3000/api/albums/{ALBUM_ID}/upload-images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## Next Steps

### For Frontend Integration
The API is designed to work with any frontend framework:
- React/Next.js
- Vue/Nuxt.js  
- Angular
- Plain JavaScript

### Example Frontend API Calls
```javascript
// Get photographer profile
const profile = await fetch('http://localhost:3000/api/profile/active')
  .then(res => res.json());

// Get client reviews  
const reviews = await fetch('http://localhost:3000/api/reviews?visible=true')
  .then(res => res.json());

// Get photo albums
const albums = await fetch('http://localhost:3000/api/albums?published=true')
  .then(res => res.json());
```

### Production Deployment
1. Build the project: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)
4. Update CORS settings in `main.ts` for your frontend domain

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network access is configured properly

### Cloudinary Upload Issues  
- Verify your Cloudinary URL format is correct
- Check if your Cloudinary account has sufficient storage
- Ensure API credentials are valid

### Port Already in Use
- Change the PORT in your `.env` file
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your `.env` file configuration
3. Ensure all dependencies are installed
4. Check the MongoDB and Cloudinary connections 