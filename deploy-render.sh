#!/bin/bash

# HackForge Render Deployment Script
echo "🚀 Setting up HackForge for Render deployment..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "📦 Installing Render CLI..."
    curl -s https://api.render.com/downloads/install-render-cli.sh | bash
fi

# Create .env.production if it doesn't exist
if [ ! -f .env.production ]; then
    echo "📝 Creating production environment file..."
    cp env.production.example .env.production
    echo "✅ Created .env.production - Please update with your actual values"
fi

# Update package.json scripts for production
echo "🔧 Updating package.json for production..."

# Check if build script exists
if ! grep -q '"build"' package.json; then
    echo "⚠️  Warning: No build script found in package.json"
fi

# Check if start script exists
if ! grep -q '"start"' package.json; then
    echo "⚠️  Warning: No start script found in package.json"
fi

echo "✅ Render deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.production with your actual values"
echo "2. Push your code to GitHub"
echo "3. Connect your repository to Render"
echo "4. Deploy using the render.yaml configuration"
echo ""
echo "🔗 Render Dashboard: https://dashboard.render.com"
echo "📚 Documentation: https://render.com/docs"
