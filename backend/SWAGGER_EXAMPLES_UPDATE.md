# Swagger API Examples Update - Saeed Sekka Portfolio

This document outlines all the updated Swagger API examples that have been synchronized with the Saeed Sekka portfolio seed data.

## 📋 Overview

All API DTOs have been updated with realistic examples from the Saeed Sekka portfolio data, ensuring consistency between the API documentation and the actual data structure used in the application.

## 🔐 Authentication APIs

### Login
```json
{
  "email": "SaeedSekka@email.com",
  "password": "admin123"
}
```

### Register
```json
{
  "email": "customer@example.com",
  "password": "customer123",
  "firstName": "Ahmed",
  "lastName": "Al-Rashid",
  "phone": "+966 50 123 4567",
  "role": "customer"
}
```

### Forgot Password
```json
{
  "email": "SaeedSekka@email.com"
}
```

## 👤 User Management APIs

### Create User (CMS)
```json
{
  "email": "SaeedSekka@email.com",
  "password": "SecurePass123!",
  "firstName": "Saeed",
  "lastName": "Sekka",
  "role": "admin",
  "isActive": true,
  "phone": "+966-53-868-3923",
  "dateOfBirth": "1990-01-01",
  "bio": "Professional photographer dedicated to capturing life's most precious moments",
  "website": "https://saeedseka.framer.website/",
  "location": "Riyadh, Saudi Arabia"
}
```

### User Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "SaeedSekka@email.com",
  "firstName": "Saeed",
  "lastName": "Sekka",
  "role": "admin",
  "isActive": true,
  "phone": "+966-53-868-3923",
  "bio": "Professional photographer dedicated to capturing life's most precious moments",
  "website": "https://saeedseka.framer.website/",
  "location": "Riyadh, Saudi Arabia",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Profile APIs

### Create Profile
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "name": "Saeed Sekka",
  "title": "Photography • Photo Editing • Designer",
  "bio": "I am Saeed, a passionate photographer dedicated to capturing life's most precious moments. With a keen eye for detail and a love for storytelling, I strive to create images that are not just beautiful, but that also evoke emotion and tell a compelling story.",
  "introText": "I am Saeed, a passionate photographer dedicated to crafting moments and capturing stories through the lens",
  "detailedBio": "Hi there! I'm Saeed Sekka, a passionate photographer based in the vibrant city of Riyadh...",
  "photographyJourney": "My journey into photography began as a curious child with a disposable camera...",
  "callToAction": "Let's create something extraordinary together...",
  "email": "SaeedSekka@email.com",
  "phone": "+966-53-868-3923",
  "address": "Riyadh, Saudi Arabia",
  "profileImage": "https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg",
  "stats": [
    { "key": "yearsExperience", "value": 14 },
    { "key": "projectsCompleted", "value": 500 },
    { "key": "happyClients", "value": 200 },
    { "key": "awards", "value": 25 },
    { "key": "hoursExperience", "value": 15000 }
  ],
  "services": [
    "Event Photography",
    "Aerial Photography",
    "Corporate Photography",
    "Editorial Photography",
    "Photography",
    "Photo Editing",
    "Designer"
  ],
  "socialMedia": {
    "instagram": "https://instagram.com/saeedsekka",
    "facebook": "https://facebook.com/saeedsekka",
    "twitter": "https://twitter.com/saeed_sekka",
    "linkedin": "https://linkedin.com/in/saeed-sekka"
  },
  "experience": [
    {
      "company": "Clavmen Studio",
      "position": "Senior UX Designer",
      "startDate": "2022-01-01T00:00:00.000Z",
      "isPresent": true,
      "location": "Riyadh, Saudi Arabia",
      "employmentType": "Full-time",
      "description": "Clavmen inspires creativity and makes learning piano fun...",
      "achievements": [
        "Led UX design for innovative piano learning platform",
        "Improved user engagement by 40%"
      ]
    }
  ],
  "brandsWorkedWith": [
    { "name": "Canon", "icon": "📷", "url": "https://canon.com", "order": 1 },
    { "name": "Adobe", "icon": "🎨", "url": "https://adobe.com", "order": 2 }
  ],
  "bookSessionButton": {
    "text": "Book a session",
    "url": "/contact",
    "enabled": true,
    "style": "primary",
    "icon": "📸"
  },
  "moreAboutMe": {
    "text": "More About Me",
    "url": "/about",
    "enabled": true
  }
}
```

## 📸 Album APIs

### Create Album
```json
{
  "title": "Colorful India",
  "description": "Travel photography collaboration showcasing the vibrant colors and culture of India",
  "projectGoal": "To capture the vibrant life, culture, and diversity of India's streets through a collaborative travel photography project...",
  "category": "Travel",
  "projectType": "Collaboration",
  "tags": ["Travel", "Collaboration"],
  "coverImage": "https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/colorful-india-cover.jpg",
  "images": [
    {
      "url": "https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/india-1.jpg",
      "publicId": "portfolio/travel/india-1",
      "caption": "Colorful streets of India",
      "alt": "Vibrant Indian street scene"
    }
  ],
  "specifications": [
    { "icon": "📂", "name": "Category", "value": "Travel", "order": 1 },
    { "icon": "🤝", "name": "Project Type", "value": "Collaboration", "order": 2 },
    { "icon": "📸", "name": "Camera", "value": "Fujifilm X-T4", "order": 3 },
    { "icon": "🔍", "name": "Lenses", "value": "Fujinon XF 23mm f/1.4 R, Fujinon XF 35mm f/2 R WR", "order": 4 },
    { "icon": "🚁", "name": "Other Devices", "value": "Mavic Air", "order": 5 },
    { "icon": "📍", "name": "Location", "value": "India", "order": 6 },
    { "icon": "📅", "name": "Time", "value": "April 2024", "order": 7 },
    { "icon": "🏢", "name": "Client", "value": "India Tourism", "order": 8 }
  ],
  "actionButton": {
    "text": "Buy Prints",
    "url": "https://prints.saeedseka.com/colorful-india",
    "enabled": true,
    "style": "primary"
  },
  "youtubeVideo": {
    "videoId": "YqeW9_5kURI",
    "title": "Colorful India - Behind the Scenes",
    "description": "Take a journey behind the scenes of our collaborative travel photography project in India...",
    "thumbnail": "https://img.youtube.com/vi/YqeW9_5kURI/maxresdefault.jpg",
    "embedUrl": "https://www.youtube.com/embed/YqeW9_5kURI",
    "duration": "4:32"
  },
  "client": "India Tourism",
  "location": "India",
  "shootDate": "2024-04-15T10:00:00.000Z",
  "eventDate": "2024-04-15T18:00:00.000Z",
  "isPublished": true,
  "isFeatured": true,
  "viewCount": 324,
  "likes": 156,
  "createdBy": "507f1f77bcf86cd799439011"
}
```

## ⭐ Review APIs

### Create Review
```json
{
  "reviewedBy": "507f1f77bcf86cd799439011",
  "clientUserId": "507f1f77bcf86cd799439012",
  "clientName": "Michael T.",
  "clientTitle": "Marketing Manager",
  "company": "Stellar Designs",
  "review": "We are thrilled with the product photography provided by Saeed. They captured our products beautifully, highlighting their unique features and enhancing their appeal.",
  "avatar": "https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/clients/michael-avatar.jpg",
  "rating": 5,
  "reviewDate": "2024-01-25T10:30:00.000Z",
  "isVisible": true,
  "isFeatured": true,
  "projectType": "Product Photography",
  "serviceUsed": "Product Photography"
}
```

### CMS Create Review
```json
{
  "reviewedBy": "507f1f77bcf86cd799439011",
  "clientUserId": "507f1f77bcf86cd799439012",
  "clientName": "Michael T.",
  "clientTitle": "Marketing Manager",
  "company": "Stellar Designs",
  "review": "We are thrilled with the product photography provided by Saeed. They captured our products beautifully, highlighting their unique features and enhancing their appeal.",
  "avatar": "https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/clients/michael-avatar.jpg",
  "rating": 5,
  "reviewDate": "2024-01-25T10:30:00.000Z",
  "isVisible": true,
  "isFeatured": true,
  "projectType": "Product Photography",
  "serviceUsed": "Product Photography"
}
```

## 📞 Contact APIs

### Create Contact
```json
{
  "contactingUser": "507f1f77bcf86cd799439011",
  "clientUserId": "507f1f77bcf86cd799439012",
  "name": "Fahad Al-Mansour",
  "email": "fahad.almansour@email.com",
  "phone": "+966 50 444 5566",
  "subject": "Corporate Photography Services",
  "message": "Hi Saeed! We need professional corporate photography for our new office in Riyadh. Could you provide information about your corporate packages?",
  "type": "general",
  "preferredContactMethod": "email",
  "eventDate": "2024-05-15",
  "eventLocation": "Riyadh, Saudi Arabia",
  "budget": "5000-8000 SAR",
  "serviceType": "Corporate Photography"
}
```

## 🎯 Key Features Updated

### 1. **Realistic Data Examples**
- All examples now use actual data from the Saeed Sekka portfolio
- Consistent naming conventions and contact information
- Realistic URLs and image paths

### 2. **Comprehensive Profile Structure**
- Complete profile with all sections (bio, experience, services, etc.)
- Realistic social media links
- Proper gear and equipment information
- FAQ structure with rich content

### 3. **Album Specifications**
- Detailed album examples with specifications
- YouTube video integration
- Action buttons with real URLs
- Comprehensive metadata

### 4. **Review System**
- Realistic client testimonials
- Proper rating system
- Project type categorization

### 5. **Contact Management**
- Saudi Arabia-specific contact examples
- Realistic budget ranges in SAR
- Proper event types and locations

## 🔗 Consistent Data References

- **User ID**: `507f1f77bcf86cd799439011` (Saeed Sekka - Admin)
- **Client ID**: `507f1f77bcf86cd799439012` (Customer)
- **Email**: `SaeedSekka@email.com`
- **Phone**: `+966-53-868-3923`
- **Location**: `Riyadh, Saudi Arabia`
- **Website**: `https://saeedseka.framer.website/`

## 📊 Statistics Examples

```json
{
  "stats": [
    { "key": "yearsExperience", "value": 14 },
    { "key": "projectsCompleted", "value": 500 },
    { "key": "happyClients", "value": 200 },
    { "key": "awards", "value": 25 },
    { "key": "hoursExperience", "value": 15000 }
  ]
}
```

## 🎨 Services Examples

```json
{
  "services": [
    "Event Photography",
    "Aerial Photography",
    "Corporate Photography",
    "Editorial Photography",
    "Photography",
    "Photo Editing",
    "Designer"
  ]
}
```

## 📱 Social Media Examples

```json
{
  "socialMedia": {
    "instagram": "https://instagram.com/saeedsekka",
    "facebook": "https://facebook.com/saeedsekka",
    "twitter": "https://twitter.com/saeed_sekka",
    "linkedin": "https://linkedin.com/in/saeed-sekka"
  }
}
```

## ✅ Benefits

1. **Consistency**: All API examples match the actual data structure
2. **Realism**: Examples reflect real-world usage scenarios
3. **Completeness**: Comprehensive examples for all data types
4. **Localization**: Saudi Arabia-specific examples and currency
5. **Professional**: High-quality, production-ready examples

## 🚀 Usage

These updated examples are now available in the Swagger UI at `/api` endpoint and provide developers with:

- Clear understanding of expected data formats
- Realistic test data for API development
- Consistent examples across all endpoints
- Professional documentation for client presentations

All examples are synchronized with the seed data and reflect the actual Saeed Sekka portfolio structure.
