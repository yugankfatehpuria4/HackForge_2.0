#!/bin/bash

# HackForge Vercel Deployment Script
echo "🚀 Setting up HackForge for Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating local environment file..."
    cat > .env.local << EOF
# Vercel Environment Variables
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
EOF
    echo "✅ Created .env.local - Please update with your actual values"
fi

# Check if build script exists
if ! grep -q '"build"' package.json; then
    echo "⚠️  Warning: No build script found in package.json"
fi

# Check if dev script exists
if ! grep -q '"dev"' package.json; then
    echo "⚠️  Warning: No dev script found in package.json"
fi

echo "✅ Vercel deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your actual backend URL"
echo "2. Run 'vercel' to deploy"
echo "3. Follow the prompts to configure your project"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "📚 Documentation: https://vercel.com/docs"
