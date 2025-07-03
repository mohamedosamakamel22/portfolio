# 📸 Photography Portfolio CMS

> **Professional multi-tenant photography portfolio management system with admin CMS and portfolio-scoped public APIs**

A complete full-stack solution for photographers to manage their portfolios, with separate isolated data for each photographer and powerful admin tools.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Portfolio_API-blue?style=for-the-badge)](http://localhost:3000/api/docs)
[![NestJS](https://img.shields.io/badge/NestJS-v10+-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7+-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)

## 🎯 **Key Innovation: Portfolio-Based API Architecture**

Unlike typical photography portfolio systems, this CMS implements **true multi-tenancy** where:
- Each photographer has their own isolated data space
- All public APIs are scoped by portfolio ID
- No data leakage between different photographers
- Perfect for photography agencies or multi-photographer platforms

## ✨ Features

### 🏗️ **Multi-Tenant Architecture**
- **Portfolio Isolation**: Each photographer's data is completely separate
- **Scoped APIs**: All endpoints require portfolio ID for data filtering
- **Individual Branding**: Each portfolio can have its own branding and content
- **Scalable Design**: Add unlimited photographers without data conflicts

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/Customer)
- Secure password hashing and reset functionality
- Portfolio-level data access control

### 🎛️ **Admin CMS Dashboard**
- Complete portfolio management interface
- Media upload with Cloudinary integration
- Client review and testimonial management
- Contact inquiry management with status tracking
- Analytics and statistics dashboard

### 🌐 **Portfolio-Scoped Public APIs**
- Individual photographer profile pages
- Portfolio-specific album galleries
- Filtered reviews and testimonials
- Portfolio-scoped contact forms
- Advanced search within specific portfolios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Cloudinary account (for media storage)

### 1. Clone & Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio

# Install dependencies
npm run setup

# Start development server
npm run start:dev
```

### 2. Test the Portfolio APIs
```bash
# Run the interactive demo
npm run demo

# Or test manually
curl http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/reviews
```

### 3. Explore the API
```bash
# Open interactive documentation
npm run docs
# Visit: http://localhost:3000/api/docs
```

## 🎮 **Interactive Demo**

Test the portfolio-based architecture with our built-in demo:

```bash
# Run comprehensive API demo
npm run demo
```

**Demo Output:**
```
🎯 Photography Portfolio CMS - API Demo
✅ Found 4 reviews for portfolio 685fc7250667f2db1bd7cfc7
✅ Found 5 albums for portfolio 685fc7250667f2db1bd7cfc7  
✅ Profile: Saeed Sekka (Photography • Photo Editing • Designer)
✅ Data isolation working: No data leaked from other portfolios
✅ Authentication successful
```

## 🏗️ **Portfolio-Based API Architecture**

### **NEW: Multi-Tenant Endpoints**
All public APIs are now scoped by portfolio ID:

```
/api/website/{portfolioId}/...
```

### **Portfolio ID Examples**
- **Saeed Sekka (Admin)**: `685fc7250667f2db1bd7cfc7`
- **Customer Portfolio**: `685fc7250667f2db1bd7cfc8`

### **API Examples**

#### Get Portfolio Reviews
```bash
GET /api/website/685fc7250667f2db1bd7cfc7/reviews
# Returns only reviews for this specific photographer
```

#### Get Portfolio Albums
```bash
GET /api/website/685fc7250667f2db1bd7cfc7/albums
# Returns only albums created by this photographer
```

#### Search Within Portfolio
```bash
GET /api/website/685fc7250667f2db1bd7cfc7/albums/search?q=wedding
# Searches only within this photographer's albums
```

## 🔐 Admin Access

### Login Credentials
```
Email: SaeedSekka@email.com
Password: admin123
```

### Admin Endpoints
```bash
# Login to get admin token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"SaeedSekka@email.com","password":"admin123"}'

# Use token for admin operations
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/cms/albums
```

## 📁 Project Structure

```
portfolio/
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── cms/               # Admin CMS controllers
│   │   ├── website/           # Portfolio-scoped public APIs
│   │   ├── albums/            # Album management
│   │   ├── reviews/           # Review management
│   │   ├── profile/           # Profile management
│   │   └── schemas/           # MongoDB schemas
│   ├── seed-enhanced-data.js  # Database seeding
│   ├── SETUP.md               # Quick setup guide
│   └── README.md              # Backend documentation
├── demo-portfolio-apis.js     # Interactive API demo
├── package.json               # Root scripts
└── README.md                  # This file
```

## 🌐 API Documentation

Interactive Swagger documentation with all endpoints and examples:
- **Local**: http://localhost:3000/api/docs
- **Test all endpoints directly in the browser**
- **Portfolio-scoped examples included**

## 🛠️ Tech Stack

- **Backend**: NestJS (Node.js + TypeScript)
- **Database**: MongoDB with Mongoose ODM  
- **Authentication**: JWT with Passport.js
- **File Storage**: Cloudinary (images & videos)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer

## 🎯 Use Cases

### For Photography Agencies
- Manage multiple photographers in one system
- Each photographer has isolated portfolio data
- Centralized admin control with individual portfolio access

### For Individual Photographers
- Complete portfolio management system
- Professional API for custom websites
- Client testimonial and review management
- Contact form and inquiry tracking

### For Developers
- Portfolio-scoped API integration
- Clean multi-tenant architecture
- Comprehensive documentation and examples
- Ready-to-deploy backend solution

## 📖 Learn More

- [**Backend Documentation**](./backend/README.md) - Complete API reference
- [**Quick Setup Guide**](./backend/SETUP.md) - 5-minute setup
- [**Deployment Guide**](./backend/DEPLOYMENT.md) - Production deployment
- [**Testing Guide**](./backend/TESTING.md) - API testing examples

## 🎮 **Available Scripts**

```bash
# Setup & Development
npm run setup          # Install dependencies + seed database
npm run start:dev       # Start development server
npm run demo           # Run interactive API demo
npm run docs           # Open API documentation

# Testing
npm run test           # Run unit tests
npm run test:e2e       # Run integration tests

# Production
npm run build          # Build for production
npm run start:prod     # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Happy coding! 🎉 Build amazing photography portfolios with isolated data architecture!**

# Photography Portfolio Backend

A complete NestJS backend for a photography portfolio with CMS and public website endpoints.

## 🚀 Quick Deploy to Railway (FREE)

### Step 1: Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your portfolio repository
6. Railway will automatically detect it's a Node.js app

### Step 3: Set Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```
MONGODB_URI=mongodb+srv://osamakamelmohamed6:x2NRTuaw630wnw0x@cluster0.jkbgwct.mongodb.net/portfolio?retryWrites=true&w=majority
CLOUDINARY_URL=cloudinary://464657318314657:xAc3DCSTR5_Hiak7jDDpWmIgeoA@egyptismycountry
CLOUDINARY_CLOUD_NAME=egyptismycountry
CLOUDINARY_API_KEY=464657318314657
CLOUDINARY_API_SECRET=xAc3DCSTR5_Hiak7jDDpWmIgeoA
JWT_SECRET=photography-portfolio-super-secret-jwt-key-change-in-production-2024
JWT_REFRESH_SECRET=photography-portfolio-super-secret-refresh-jwt-key-change-in-production-2024
JWT_ACCESS_TOKEN_EXPIRATION=
JWT_REFRESH_TOKEN_EXPIRATION=
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com,http://localhost:3000
BCRYPT_SALT_ROUNDS=12
MAX_FILE_SIZE=20971520
MAX_FILES_PER_REQUEST=20
APP_NAME=Photography Portfolio CMS
APP_VERSION=1.0.0
APP_DESCRIPTION=Professional Photography Portfolio CMS with Admin Panel
```

### Step 4: Access Your API
Your API will be available at:
- **API Base**: `https://your-app-name.railway.app/api`
- **Swagger Docs**: `https://your-app-name.railway.app/api/docs`

### 🔑 Default Admin Credentials
- **Email**: `admin@portfolio.com`
- **Password**: `admin123`

## 📚 API Documentation

Once deployed, visit `/api/docs` for complete Swagger documentation.

## 🏗️ Local Development

```bash
cd backend
npm install
npm run start:dev
```

## 🎯 Features

- ✅ Complete CMS with admin panel
- ✅ Public website endpoints
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ File upload with Cloudinary
- ✅ MongoDB integration
- ✅ Swagger documentation
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Security headers
- ✅ Compression
- ✅ Request logging

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/          # Authentication & Authorization
│   ├── cms/           # Admin CMS endpoints
│   ├── website/       # Public website endpoints
│   ├── profile/       # Profile management
│   ├── reviews/       # Reviews management
│   ├── albums/        # Albums management
│   ├── contact/       # Contact form
│   ├── cloudinary/    # File upload service
│   └── schemas/       # MongoDB schemas
```

## 🔧 Environment Variables

Copy `backend/env.example` to `backend/.env` and update the values.

## 🚀 Alternative Free Deployment Options

1. **Render** - 750 hours/month free
2. **Vercel** - Generous free tier
3. **Heroku** - 550-1000 dyno hours/month free
4. **Railway** - $5 credit monthly (recommended)

## 📞 Support

For deployment issues, check the Railway logs in your project dashboard. # portfolio
# portfolio
