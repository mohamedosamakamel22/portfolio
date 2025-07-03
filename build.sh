#!/bin/bash

echo "🚀 Building Portfolio Backend..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Build the backend
echo "🔨 Building backend..."
npm run build

echo "✅ Build completed successfully!" 