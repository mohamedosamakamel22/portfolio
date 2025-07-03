#!/bin/bash

echo "🚀 Starting Portfolio Backend Deployment..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build successful"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your production values."
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign up/Login with GitHub"
echo "   - Click 'New Project'"
echo "   - Select 'Deploy from GitHub repo'"
echo "   - Select your portfolio repository"
echo "   - Railway will automatically detect it's a Node.js app"
echo ""
echo "3. Set environment variables in Railway:"
echo "   - Go to your project settings"
echo "   - Add all variables from your .env file"
echo ""
echo "4. Your API will be available at:"
echo "   https://your-app-name.railway.app/api"
echo "   https://your-app-name.railway.app/api/docs"
echo ""
echo "🔑 Default admin credentials:"
echo "   Email: admin@portfolio.com"
echo "   Password: admin123" 