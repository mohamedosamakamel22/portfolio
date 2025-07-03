# Page-Specific API Documentation

This document outlines all the APIs created for each page of the Saeed Sekka Photography website.

## 🏠 Home Page APIs

### GET `/api/website/home`
**Description**: Get complete home page data with aggregated information
**Query Parameters**:
- `albumLimit` (optional): Number of albums to return (default: 6)
- `reviewLimit` (optional): Number of reviews to return (default: 4)

**Response Structure**:
```json
{
  "profile": {
    "name": "Saeed Sekka",
    "title": "Photography • Photo Editing • Designer",
    "bio": "...",
    "introText": "...",
    "profileImage": "...",
    "stats": {...},
    "socialMedia": {...},
    "brandsWorkedWith": [...],
    "moreAboutMe": {...}
  },
  "services": [...],
  "experience": [...], // Latest 4 positions
  "albums": [...], // Featured albums (limited)
  "reviews": [...], // Featured reviews (limited)
  "stats": {
    "albums": {...},
    "reviews": {...},
    "totalProjects": 5,
    "averageRating": 4.8
  },
  "meta": {
    "albumsShown": 6,
    "totalAlbums": 5,
    "reviewsShown": 4,
    "totalReviews": 4
  }
}
```

### GET `/api/website/home/stats`
**Description**: Get statistics for home page counters
**Response**:
```json
{
  "hoursExperience": 15000,
  "yearsExperience": 14,
  "awards": 25,
  "happyClients": 200,
  "projectsCompleted": 500,
  "totalAlbums": 5,
  "totalReviews": 4,
  "averageRating": 4.8
}
```

## 📖 About Page APIs

### GET `/api/website/about`
**Description**: Get comprehensive about page data including gear, experience, and detailed bio
**Response Structure**:
```json
{
  "name": "Saeed Sekka",
  "title": "Photography • Photo Editing • Designer",
  "bio": "...",
  "detailedBio": "...",
  "photographyJourney": "...",
  "callToAction": "Let's create something extraordinary together. Whether you're looking to capture a special moment, need stunning visuals for your brand, or simply want to explore the world through my lens, I'd love to hear from you! Feel free to reach out, and let's make magic happen.",
  "bookSessionButton": {
    "text": "Book a session",
    "url": "/contact",
    "enabled": true,
    "style": "primary",
    "icon": "📸"
  },
  "experience": [...], // All positions
  "services": [...],
  "clientBenefits": [...],
  "workApproach": [...],
  "gear": {
    "cameras": [...],
    "lenses": [...],
    "accessories": [...],
    "editingTools": [...]
  },
  "stats": {...},
  "socialMedia": {...},
  "brandsWorkedWith": [...],
  "faq": [...],
  "youtubeVideo": {...}
}
```

### GET `/api/website/about/gear`
**Description**: Get gear information only
**Response**:
```json
{
  "cameras": [...],
  "lenses": [...],
  "accessories": [...],
  "editingTools": [...]
}
```

### GET `/api/website/about/experience`
**Description**: Get professional experience only
**Response**:
```json
{
  "experience": [...],
  "totalYears": 14,
  "currentPosition": {...}
}
```

### GET `/api/website/about/benefits`
**Description**: Get client benefits and work approach
**Response**:
```json
{
  "clientBenefits": [...],
  "workApproach": [...],
  "services": [...]
}
```

## 📸 Albums Page APIs

### GET `/api/website/albums`
**Description**: Get albums with filtering and pagination
**Query Parameters**:
- `limit` (optional): Number of albums to return
- `category` (optional): Filter by category
- `projectType` (optional): Filter by project type

**Response**: Array of albums with full details

### GET `/api/website/albums/:id`
**Description**: Get specific album by ID
**Query Parameters**:
- `includeRelated` (optional): Include related albums (true/false)
- `relatedLimit` (optional): Number of related albums (default: 4)

**Response Structure**:
```json
{
  "album": {
    "title": "Colorful India",
    "description": "...",
    "category": "Travel",
    "projectType": "Collaboration",
    "images": [...],
    "specifications": [...],
    "actionButton": {...},
    "youtubeVideo": {...}
  },
  "relatedAlbums": [...], // If includeRelated=true
  "relatedCount": 3
}
```

### GET `/api/website/albums/:id/related`
**Description**: Get related albums by album ID
**Query Parameters**:
- `limit` (optional): Number of related albums (default: 4)

**Response**: Array of related albums

### GET `/api/website/albums/featured`
**Description**: Get featured albums only

### GET `/api/website/albums/categories`
**Description**: Get all album categories

### GET `/api/website/albums/search`
**Description**: Search albums
**Query Parameters**:
- `q`: Search query

## ⭐ Reviews Page APIs

### GET `/api/website/reviews`
**Description**: Get reviews page data with filtering
**Query Parameters**:
- `limit` (optional): Number of reviews to return
- `featured` (optional): Only featured reviews (true/false)
- `rating` (optional): Filter by minimum rating (1-5)

**Response Structure**:
```json
{
  "reviews": [...],
  "stats": {
    "totalReviews": 4,
    "averageRating": 4.8,
    "ratingDistribution": {...}
  },
  "meta": {
    "totalShown": 4,
    "filters": {
      "featured": false,
      "minimumRating": null,
      "limit": null
    }
  }
}
```

### GET `/api/website/reviews/featured`
**Description**: Get featured reviews only

### GET `/api/website/reviews/stats`
**Description**: Get rating statistics

## 📞 Contact Page APIs

### GET `/api/website/contact`
**Description**: Get contact page data including info, FAQ, and pricing
**Response Structure**:
```json
{
  "contactInfo": {
    "name": "Saeed Sekka",
    "email": "SaeedSekka@email.com",
    "phone": "+966-53-868-3923",
    "whatsapp": "+966-53-868-3923",
    "address": "Riyadh, Saudi Arabia",
    "website": "https://saeedseka.framer.website/"
  },
  "socialMedia": {...},
  "services": [...],
  "availability": {
    "status": "available",
    "message": "Currently accepting new projects",
    "responseTime": "24 hours"
  },
  "businessHours": {...},
  "faq": [...],
  "pricing": {
    "portraitSessions": "Starting at $200",
    "eventPhotography": "Starting at $500",
    "commercialPhotography": "Custom pricing based on project scope"
  },
  "ctaMessage": "Let's create something extraordinary together!",
  "responsePromise": "I'll get back to you within 24 hours to discuss your project."
}
```

### GET `/api/website/contact/info`
**Description**: Get contact information only

### POST `/api/website/contact`
**Description**: Submit contact inquiry
**Request Body**:
```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+966501234567",
  "subject": "Photography Inquiry",
  "message": "...",
  "type": "booking",
  "eventDate": "2024-06-15",
  "budget": "5000-8000 SAR"
}
```

## 🔗 Database Relations

All schemas now have proper relationships to the User model:

### Profile Schema
- `userId`: References the User who owns this profile

### Album Schema
- `createdBy`: References the User who created this album

### Review Schema
- `reviewedBy`: References the User being reviewed (photographer)
- `clientUserId`: Optional reference to User if client is registered

### Contact Schema
- `contactingUser`: References the User being contacted (photographer)
- `clientUserId`: Optional reference to User if client is registered

## 🎯 Usage Examples

### Frontend Implementation

```javascript
// Home Page
const homeData = await fetch('/api/website/home?albumLimit=6&reviewLimit=4');

// About Page
const aboutData = await fetch('/api/website/about');

// Albums Page
const albumsData = await fetch('/api/website/albums?limit=10&category=Travel');

// Specific Album with Related
const albumData = await fetch('/api/website/albums/123?includeRelated=true&relatedLimit=4');

// Reviews Page
const reviewsData = await fetch('/api/website/reviews?featured=true&limit=8');

// Contact Page
const contactData = await fetch('/api/website/contact');
```

### Key Features

1. **Pagination**: All endpoints support limit parameters
2. **Filtering**: Albums and reviews support category/type filtering
3. **Relations**: Proper user relationships established
4. **Optimization**: Page-specific data aggregation
5. **Flexibility**: Optional parameters for different use cases
6. **Comprehensive**: All website pages fully covered

## 🚀 Next Steps

1. Test all endpoints with the frontend
2. Add caching for frequently accessed data
3. Implement user authentication for personalized content
4. Add search functionality across all content types
5. Consider implementing GraphQL for more flexible queries 