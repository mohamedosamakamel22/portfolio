# 🚀 **Quick Setup Guide**

Get your Photography Portfolio CMS up and running in 5 minutes!

## 📋 **Prerequisites**

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** (local or cloud) ([MongoDB Atlas Free](https://www.mongodb.com/atlas))
- **Cloudinary** account ([Free Account](https://cloudinary.com/))

## ⚡ **One-Command Setup**

### Option 1: From Root Directory
```bash
# Clone and setup everything
git clone <your-repo-url>
cd portfolio

# Install and seed database (one command!)
npm run setup

# Start development server
npm run start:dev
```

### Option 2: Manual Setup
```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Setup environment
cp env.example .env
# Edit .env with your credentials (see below)

# 3. Seed database
node seed-enhanced-data.js

# 4. Start server
npm run start:dev
```

## 🔧 **Environment Setup**

Copy `backend/env.example` to `backend/.env` and fill in:

```env
# MongoDB (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# Cloudinary (Required for file uploads)  
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# JWT Secrets (Can use defaults for development)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Server (Optional)
PORT=3000
NODE_ENV=development
```

### 🌍 **MongoDB Setup (Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account → Create cluster
3. Go to "Connect" → "Connect your application"
4. Copy connection string to `MONGODB_URI`

### 📸 **Cloudinary Setup (Free)**
1. Go to [Cloudinary](https://cloudinary.com/)
2. Create free account
3. Go to Dashboard → Copy "API Environment variable"
4. Paste as `CLOUDINARY_URL` in your .env

## ✅ **Verify Setup**

### 1. API is Running
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","database":"connected"}
```

### 2. Test Portfolio API
```bash
# Get Saeed Sekka's portfolio
curl http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/profile
```

### 3. Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"SaeedSekka@email.com","password":"admin123"}'
```

## 🌐 **Access Points**

- **API Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health
- **Test Portfolio**: http://localhost:3000/api/website/685fc7250667f2db1bd7cfc7/profile

## 🆔 **Test Portfolio IDs**

- **Saeed Sekka (Admin)**: `685fc7250667f2db1bd7cfc7`
- **Customer Portfolio**: `685fc7250667f2db1bd7cfc8`

## 🔐 **Login Credentials**

**Admin Account:**
- Email: `SaeedSekka@email.com`
- Password: `admin123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## 🚨 **Common Issues**

### ❌ "Cannot find package.json"
**Solution**: Make sure you're in the `backend` directory or use root scripts:
```bash
# From root directory
npm run start:dev

# OR from backend directory  
cd backend && npm run start:dev
```

### ❌ "MongooseError: Operation failed"
**Solution**: Check your `MONGODB_URI` in `.env` file

### ❌ "Cloudinary must be configured"
**Solution**: Add `CLOUDINARY_URL` to your `.env` file

## 🎯 **Next Steps**

1. **Explore API**: Visit http://localhost:3000/api/docs
2. **Test Endpoints**: Use the interactive Swagger UI
3. **Build Frontend**: Use the portfolio-scoped APIs
4. **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**🎉 Happy coding! Your photography portfolio CMS is ready!** 