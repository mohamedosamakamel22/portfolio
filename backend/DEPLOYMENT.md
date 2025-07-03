# 🚀 Free Deployment Guide

This guide shows you how to deploy your Photography Portfolio CMS API on various free hosting platforms.

## 🎯 Quick Deploy Options

### 1. Railway (Recommended) ⭐

**Why Railway?**
- Free tier with $5/month credits
- Automatic deployments from GitHub
- Built-in MongoDB and Redis
- Custom domains
- Great developer experience

**Steps:**
1. Push your code to GitHub
2. Visit [railway.app](https://railway.app)
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect NestJS and deploy

**Environment Variables:**
```
MONGODB_URI=your_railway_mongodb_url
CLOUDINARY_URL=cloudinary://464657318314657:xAc3DCSTR5_Hiak7jDDpWmIgeoA@egyptismycountry
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
PORT=3000
```

### 2. Render.com

**Steps:**
1. Create account at [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Environment: Node

**Free MongoDB Options:**
- MongoDB Atlas (512MB free)
- Use Render's PostgreSQL + Mongoose

### 3. Vercel (API Routes)

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ]
}
```
3. Deploy: `vercel --prod`

### 4. Heroku (Limited Free Tier)

**Steps:**
1. Install Heroku CLI
2. Create `Procfile`:
```
web: npm run start:prod
```
3. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

## 🗃️ Free Database Options

### MongoDB Atlas
- 512MB free tier
- Perfect for small to medium apps
- Global clusters
- Setup: [mongodb.com/atlas](https://mongodb.com/atlas)

### PlanetScale (MySQL)
- 10GB free tier
- Great performance
- Branching database feature

### Supabase (PostgreSQL)
- 500MB free tier
- Real-time subscriptions
- Built-in auth (optional)

## 🖼️ Image Storage (Already Configured)

Your app is already configured with Cloudinary:
- 25GB monthly bandwidth
- 25,000 transformations/month
- Perfect for photography portfolios

## 📋 Deployment Checklist

### Before Deployment:
- [ ] Set strong JWT secrets
- [ ] Configure CORS for your domain
- [ ] Set up MongoDB connection
- [ ] Test all API endpoints
- [ ] Create admin user
- [ ] Seed initial data

### Environment Variables Required:
```env
MONGODB_URI=your_database_connection_string
CLOUDINARY_URL=your_cloudinary_url
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
PORT=3000
NODE_ENV=production
```

### Security Settings:
```typescript
// Update CORS in main.ts for production
app.enableCors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true,
});
```

## 🔧 One-Click Deploy

### Railway Deploy Button
Add this to your README:
```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/your-template)
```

### Vercel Deploy Button
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yourrepo)
```

## 🏗️ Docker Deployment

### Docker Hub
1. Build and push:
```bash
docker build -t username/portfolio-api .
docker push username/portfolio-api
```

2. Deploy anywhere that supports Docker

### Digital Ocean App Platform
- $5/month for basic tier
- Direct Docker support
- Auto-scaling

## 🎛️ Production Tips

### 1. Health Check Endpoint
Add to your main controller:
```typescript
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

### 2. Database Connection Pooling
```typescript
MongooseModule.forRoot(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
```

### 3. Rate Limiting
```bash
npm install @nestjs/throttler
```

### 4. Logging
```bash
npm install winston nest-winston
```

## 🔍 Monitoring

### Free Monitoring Tools:
- **UptimeRobot**: Free uptime monitoring
- **LogTail**: Free log management
- **Sentry**: Error tracking (5k errors/month free)

## 💾 Backup Strategy

### MongoDB Atlas Backups:
- Free tier includes basic backups
- Set up automated backups in Atlas dashboard

### Cloudinary Backups:
- Use backup add-on or sync to S3

## 🚀 Quick Start Commands

```bash
# 1. Clone and setup
git clone your-repo
cd backend
npm install

# 2. Environment setup
cp env.example .env
# Edit .env with your values

# 3. Development
npm run start:dev

# 4. Production build
npm run build
npm run start:prod

# 5. Docker development
docker-compose up

# 6. Deploy to Railway
railway login
railway deploy
```

## 📞 Support

If you encounter deployment issues:
1. Check the logs in your hosting platform
2. Verify environment variables
3. Test database connectivity
4. Check CORS settings

Happy deploying! 🎉 