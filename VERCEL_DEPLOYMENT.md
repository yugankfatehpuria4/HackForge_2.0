# 🚀 HackForge Vercel Deployment Guide

This guide will help you deploy the HackForge frontend on Vercel, a modern cloud platform optimized for Next.js applications.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Repository**: Your code pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Backend Service**: Deployed on Render or another platform
4. **Environment Variables**: Configured for production

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

Create a `.env.local` file with your production values:

```bash
# Vercel Environment Variables
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
```

### 2. Backend Service

Ensure your backend is deployed and accessible:
- **Render**: `https://your-backend.onrender.com`
- **Railway**: `https://your-backend.railway.app`
- **Heroku**: `https://your-backend.herokuapp.com`

## 🚀 Deployment Steps

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `hackforge-frontend`
   - Directory: `./` (current directory)
   - Override settings: `N`

### Option 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`
   - Add `NEXT_PUBLIC_SITE_URL`

### Option 3: Automatic Deployment Script

1. **Run the deployment script**
   ```bash
   ./deploy-vercel.sh
   ```

2. **Update environment variables**
   ```bash
   nano .env.local
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration

### Vercel Configuration (vercel.json)

The project includes a `vercel.json` file with:

- **Build Configuration**: Optimized for Next.js
- **Security Headers**: XSS protection, content type options
- **Function Settings**: Extended timeout for API routes
- **Environment Variables**: Template for production values

### Next.js Configuration

The project is optimized for Vercel with:

- **Standalone Output**: For better performance
- **Image Optimization**: Enabled for Vercel
- **Trailing Slash**: Enabled for compatibility

## 🔍 Health Checks

Your Vercel deployment includes:

- **Automatic Health Checks**: Vercel monitors your application
- **Build Status**: Real-time build monitoring
- **Performance Metrics**: Core Web Vitals tracking

## 📊 Monitoring

Vercel provides comprehensive monitoring:

- **Analytics**: Page views, performance metrics
- **Functions**: Serverless function monitoring
- **Edge Network**: Global performance data
- **Real-time Logs**: Live application logs

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs
   
   # Build locally first
   npm run build
   ```

2. **Environment Variables**
   - Ensure all variables are set in Vercel dashboard
   - Check variable names match exactly
   - Verify backend URL is accessible

3. **CORS Issues**
   - Update backend CORS settings
   - Ensure frontend URL is in allowed origins
   - Check API endpoint accessibility

4. **Performance Issues**
   - Enable Vercel Analytics
   - Optimize images and assets
   - Use Next.js Image component

### Debug Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Test locally
vercel dev

# Build locally
npm run build

# Check environment variables
vercel env ls
```

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Vercel's environment variable management
   - Rotate API keys regularly

2. **Security Headers**
   - XSS protection enabled
   - Content type sniffing disabled
   - Frame options set to deny

3. **API Security**
   - Validate all inputs
   - Use HTTPS only
   - Implement rate limiting on backend

## 📈 Performance Optimization

### Vercel Optimizations

1. **Edge Network**
   - Global CDN for static assets
   - Automatic caching
   - Geographic optimization

2. **Image Optimization**
   - Automatic WebP conversion
   - Responsive images
   - Lazy loading

3. **Code Splitting**
   - Automatic bundle splitting
   - Dynamic imports
   - Route-based code splitting

### Custom Optimizations

1. **Bundle Analysis**
   ```bash
   npm run build
   npx @next/bundle-analyzer
   ```

2. **Performance Monitoring**
   - Enable Vercel Analytics
   - Monitor Core Web Vitals
   - Track user experience metrics

## 💰 Cost Optimization

### Free Tier Limits

- **100GB Bandwidth**: Per month
- **100GB Storage**: For assets
- **100GB Function Execution**: Serverless functions
- **Unlimited Deployments**: No deployment limits

### Paid Plans

- **Pro Plan**: $20/month
  - 1TB bandwidth
  - 1TB storage
  - Custom domains
  - Team collaboration

- **Enterprise Plan**: Custom pricing
  - Advanced security
  - Priority support
  - Custom integrations

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

## 🆘 Support

If you encounter issues:

1. Check Vercel's status page
2. Review deployment logs
3. Verify environment variables
4. Test locally first
5. Contact Vercel support

## 🚀 Advanced Features

### Custom Domains

1. **Add Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS settings

2. **SSL Certificate**
   - Automatic SSL provisioning
   - Wildcard certificates
   - Custom certificates

### Preview Deployments

- **Automatic Previews**: For every PR
- **Branch Deployments**: For feature branches
- **Environment Variables**: Per-branch configuration

### Edge Functions

- **Global Edge Network**: Deploy functions worldwide
- **Low Latency**: Sub-100ms response times
- **Automatic Scaling**: Based on demand

---

**Happy Deploying! 🚀**
