# 📸 Photography Portfolio CMS API

> **Multi-tenant photography portfolio backend with portfolio-scoped APIs**

A complete NestJS backend solution for photography portfolio management featuring **portfolio-based data isolation** and comprehensive admin tools.

[![NestJS](https://img.shields.io/badge/NestJS-v10+-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7+-green?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Swagger](https://img.shields.io/badge/API_Docs-Swagger-blue?style=flat-square)](http://localhost:3000/api/docs)

## 🎯 **Portfolio-Based Architecture**

**Revolutionary Approach**: Unlike traditional portfolio systems, this API implements **true multi-tenancy** where each photographer's data is completely isolated.

### ✅ **What This Solves**
- **Data Isolation**: Each portfolio owner sees only their own data
- **Multi-Photographer Support**: Perfect for agencies or platforms
- **Scalable Design**: Add unlimited portfolios without conflicts
- **Clean APIs**: Portfolio ID scoping prevents data leakage

### 🔄 **API Structure**
```
/api/website/{portfolioId}/...  ← Portfolio-scoped public APIs
/api/cms/...                    ← Admin-only management APIs  
/api/auth/...                   ← Authentication APIs
```

## 🚀 Quick Start

### 1. Installation
```bash
# Install dependencies
npm install

# Setup environment variables
cp env.example .env
# Edit .env with your MongoDB URI and Cloudinary credentials
```

### 2. Database Setup
```bash
# Seed database with sample photographer data
node seed-enhanced-data.js
```

### 3. Start Development Server
```bash
# Start API server
npm run start:dev

# Server runs on http://localhost:3000
# Swagger docs at http://localhost:3000/api/docs
```

### 4. Test Portfolio APIs
```bash
# Test Saeed Sekka's portfolio data
export PORTFOLIO_ID="685fc7250667f2db1bd7cfc7"

# Get portfolio reviews
curl "http://localhost:3000/api/website/$PORTFOLIO_ID/reviews"

# Get portfolio albums  
curl "http://localhost:3000/api/website/$PORTFOLIO_ID/albums"

# Get portfolio profile
curl "http://localhost:3000/api/website/$PORTFOLIO_ID/profile"
```

## 🔐 Authentication

### Admin Login
```bash
# Login with seeded admin account
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "SaeedSekka@email.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "685fc7250667f2db1bd7cfc7",
    "email": "SaeedSekka@email.com",
    "firstName": "Saeed", 
    "lastName": "Sekka",
    "role": "admin"
  }
}
```

### Using Admin Token
```bash
# Use token for admin operations
export TOKEN="your_access_token_here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/cms/albums
```

## 📋 **Portfolio-Based API Reference**

### 🌐 **Public Portfolio APIs**

All public APIs require a `portfolioId` parameter to ensure data isolation.

#### **Reviews API**
```bash
# Get all reviews for a portfolio
GET /api/website/{portfolioId}/reviews
GET /api/website/{portfolioId}/reviews/featured
GET /api/website/{portfolioId}/reviews/stats

# Example
curl "http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/reviews?featured=true&limit=5"
```

#### **Albums API**
```bash
# Get all albums for a portfolio
GET /api/website/{portfolioId}/albums
GET /api/website/{portfolioId}/albums/featured
GET /api/website/{portfolioId}/albums/categories
GET /api/website/{portfolioId}/albums/search?q=query

# Get specific album
GET /api/website/{portfolioId}/albums/{albumId}
GET /api/website/{portfolioId}/albums/{albumId}/related

# Examples
curl "http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/albums"
curl "http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/albums/search?q=wedding"
```

#### **Profile API**
```bash
# Get portfolio profile
GET /api/website/{portfolioId}/profile

# Example
curl "http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/profile"
```

#### **Contact API**
```bash
# Get contact info for portfolio
GET /api/website/{portfolioId}/contact
GET /api/website/{portfolioId}/contact/info

# Submit contact form for portfolio
POST /api/website/{portfolioId}/contact

# Example
curl -X POST "http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "subject": "Wedding Photography",
    "message": "Interested in your services"
  }'
```

### 🎛️ **Admin CMS APIs** 

Admin APIs manage all portfolios (require authentication).

#### **Authentication**
```bash
POST /api/auth/register          # Register new user
POST /api/auth/login             # Login user  
POST /api/auth/logout            # Logout user
POST /api/auth/refresh           # Refresh access token
```

#### **Profile Management**
```bash
GET    /api/cms/profile                    # Get all profiles
POST   /api/cms/profile                    # Create profile
PATCH  /api/cms/profile/:id               # Update profile
DELETE /api/cms/profile/:id               # Delete profile
POST   /api/cms/profile/:id/upload-image  # Upload profile image
```

#### **Albums Management**
```bash
GET    /api/cms/albums                     # Get all albums
POST   /api/cms/albums                     # Create album
PATCH  /api/cms/albums/:id                # Update album
DELETE /api/cms/albums/:id                # Delete album
POST   /api/cms/albums/:id/upload-images  # Upload images/videos
PATCH  /api/cms/albums/:id/featured       # Toggle featured status
```

#### **Reviews Management**
```bash
GET    /api/cms/reviews                    # Get all reviews
POST   /api/cms/reviews                    # Create review
PATCH  /api/cms/reviews/:id               # Update review
DELETE /api/cms/reviews/:id               # Delete review
PATCH  /api/cms/reviews/:id/visibility    # Toggle visibility
PATCH  /api/cms/reviews/:id/featured      # Toggle featured status
```

#### **Contact Management**
```bash
GET    /api/cms/contacts                   # Get all contacts
GET    /api/cms/contacts/stats            # Get contact statistics
PATCH  /api/cms/contacts/:id/status       # Update contact status
PATCH  /api/cms/contacts/:id/notes        # Add admin notes
```

## 📊 **Example Responses**

### Portfolio Reviews Response
```json
{
  "reviews": [
    {
      "_id": "685fc7250667f2db1bd7cfd2",
      "reviewedBy": "685fc7250667f2db1bd7cfc7",
      "clientName": "Michael",
      "rating": 5,
      "title": "Fantastic Experience",
      "content": "Professional and creative photography...",
      "isVisible": true,
      "isFeatured": true
    }
  ],
  "stats": [{"_id": 5, "count": 4}],
  "meta": {
    "portfolioId": "685fc7250667f2db1bd7cfc7",
    "totalShown": 4,
    "filters": {
      "featured": false,
      "minimumRating": null,
      "limit": null
    }
  }
}
```

### Portfolio Albums Response
```json
{
  "albums": [
    {
      "_id": "685fc7250667f2db1bd7cfca",
      "createdBy": "685fc7250667f2db1bd7cfc7",
      "title": "Colorful India",
      "description": "Travel photography collaboration...",
      "category": "Travel",
      "projectType": "Collaboration",
      "isPublished": true,
      "isFeatured": true,
      "images": [
        {
          "url": "https://res.cloudinary.com/...",
          "caption": "Colorful streets of India"
        }
      ]
    }
  ],
  "meta": {
    "portfolioId": "685fc7250667f2db1bd7cfc7",
    "totalShown": 5
  }
}
```

## 🛠️ **Tech Stack**

### Core Framework
- **NestJS**: Node.js framework with TypeScript
- **MongoDB**: NoSQL database with Mongoose ODM
- **Passport.js**: Authentication middleware
- **JWT**: JSON Web Tokens for secure auth

### File Storage & Media
- **Cloudinary**: Image and video storage with transformations
- **Multer**: File upload handling
- **Sharp**: Image processing (if needed)

### Validation & Documentation  
- **class-validator**: DTO validation
- **class-transformer**: Data transformation
- **Swagger/OpenAPI**: API documentation
- **Jest**: Unit and integration testing

## ⚙️ **Configuration**

### Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio

# Authentication  
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# File Storage
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Server
PORT=3000
NODE_ENV=development
```

### Seeded Test Data
After running `node seed-enhanced-data.js`:

**Admin User:**
- Email: `SaeedSekka@email.com`
- Password: `admin123`
- Portfolio ID: `685fc7250667f2db1bd7cfc7`

**Customer User:**
- Email: `customer@example.com`  
- Password: `customer123`
- Portfolio ID: `685fc7250667f2db1bd7cfc8`

## 🐳 **Docker Support**

### Quick Start with Docker
```bash
# Build and start all services
docker-compose up

# Start in development mode
docker-compose -f docker-compose.dev.yml up

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Docker Services
- **API**: NestJS application (port 3000)
- **MongoDB**: Database with data persistence
- **Mongo Express**: Database admin UI (port 8081)

## 🧪 **Testing**

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov

# Test specific API endpoints
node test-api.js
```

### Manual API Testing
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"SaeedSekka@email.com","password":"admin123"}'

# Test portfolio reviews
curl "http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/reviews"

# Test portfolio albums
curl "http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/albums?limit=3"
```

## 📚 **API Documentation**

### Interactive Swagger UI
Visit `http://localhost:3000/api/docs` for:
- Complete API reference
- Interactive endpoint testing
- Request/response schemas
- Authentication examples
- Portfolio-scoped endpoint documentation

### Key Documentation Features
- **Portfolio ID Examples**: Real portfolio IDs for testing
- **Authentication Flow**: Complete auth examples  
- **Error Responses**: Detailed error handling
- **File Upload**: Media upload examples

## 🚀 **Deployment**

### Quick Deploy Options
1. **Railway**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)
2. **Render**: One-click deployment ready
3. **Docker**: Production-ready containers
4. **Traditional VPS**: PM2 configuration included

### Production Configuration
```bash
# Set environment variables
export NODE_ENV=production
export JWT_SECRET=your-production-secret
export MONGODB_URI=your-production-db-uri

# Build and start
npm run build
npm run start:prod
```

## 🔍 **Monitoring & Health**

### Health Check
```bash
GET /api/health
```

### Application Monitoring
- Built-in error handling and logging
- Request/response logging
- Database connection monitoring
- JWT token validation tracking

## 🎯 **Key Features**

### ✅ **Portfolio Data Isolation**
- Each portfolio has completely separate data
- No cross-portfolio data access
- Perfect for multi-photographer platforms

### ✅ **Professional Media Management**  
- High-quality image storage (up to 4000x4000px)
- Video upload and optimization
- Cloudinary integration with transformations

### ✅ **Comprehensive Admin Tools**
- Complete portfolio management
- Client review and testimonial system
- Contact inquiry tracking
- Media upload and organization

### ✅ **Developer-Friendly**
- Complete Swagger documentation  
- Portfolio-scoped API examples
- Docker support for easy deployment
- Comprehensive test coverage

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## 📄 **License**

This project is licensed under the ISC License.

---

**🎉 Ready to build amazing photography portfolios with proper data isolation!**

**Swagger Docs**: http://localhost:3000/api/docs  
**Test Portfolio**: http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/profile
