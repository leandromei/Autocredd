#!/bin/bash

echo "🚀 Starting frontend build process..."

# Verify we're in the right directory
if [ ! -d "frontend_bolt" ]; then
    echo "❌ Error: frontend_bolt directory not found"
    exit 1
fi

# Enter frontend directory
cd frontend_bolt

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Build the project
echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - no dist directory created"
    exit 1
fi

echo "✅ Build successful!"

# Go back to root
cd ..

# Create static directory
echo "📁 Setting up static files..."
mkdir -p static

# Copy built files
echo "📋 Copying build files..."
cp -r frontend_bolt/dist/* static/

# Verify copy was successful
if [ ! -f "static/index.html" ]; then
    echo "❌ Error: Failed to copy build files"
    exit 1
fi

echo "✅ Frontend build completed successfully!"
echo "📂 Files in static directory:"
ls -la static/

exit 0 