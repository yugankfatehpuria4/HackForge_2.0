# 🚀 HackForge - AI-Powered Code Generator

Transform your ideas into production-ready code with the power of AI. HackForge is a full-stack application that combines Next.js frontend with Node.js backend, powered by Google Gemini AI for intelligent code generation.

## ✨ Features

### 🤖 AI Code Generation
- **Intelligent Prompt Processing**: Describe your app idea in natural language
- **Multi-Framework Support**: Generate code for React, Next.js, Vue, Python, and more
- **Production-Ready Output**: Get complete, deployable codebases
- **Real-time Generation**: Watch as AI crafts your project structure
- **Customizable Tech Stacks**: Choose from predefined stacks or let AI decide

### 📊 Project Dashboard
- **Project History**: Automatically save all generated projects
- **Search & Filter**: Find projects by title, framework, or tags
- **Favorites System**: Mark and organize your favorite projects
- **Project Management**: View, edit, and delete saved projects
- **Metadata Tracking**: Generation time, tokens used, and model information

### 🔧 Code Management
- **Auto-Save**: Projects are automatically saved to your dashboard
- **Manual Save**: Additional save options for custom projects
- **Copy to Clipboard**: One-click code copying
- **Download Files**: Export generated code as text files
- **Multi-File Support**: Handle complex project structures

### 🎨 Modern UI/UX
- **Dark Theme**: Beautiful gradient backgrounds with neon accents
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Glass Morphism**: Modern glass-effect components
- **Loading States**: Elegant loading animations and progress indicators

### 🔐 Authentication Ready
- **Clerk Integration**: User authentication system (temporarily disabled)
- **User Management**: Individual project storage and management
- **Secure API**: Protected routes and user-specific data

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations
- **Sonner**: Toast notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database for project storage
- **Mongoose**: MongoDB object modeling
- **Google Gemini AI**: AI code generation
- **Redis**: Caching for improved performance
- **CORS**: Cross-origin resource sharing

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Auto-restart for development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Redis (for caching)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Set up environment variables**

   Create `.env.local` in the root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5002
   ```

   Create `backend/.env`:
   ```env
   # Server Configuration
   PORT=5002
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/hackforge

   # AI API Keys
   GEMINI_API_KEY=your_gemini_api_key_here

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # API Configuration
   API_VERSION=v1
   MAX_REQUEST_SIZE=10mb

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Security
   JWT_SECRET=hackforge_jwt_secret_key_2024
   ENCRYPTION_KEY=hackforge_encryption_key_2024

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   ```

4. **Start MongoDB** (if using local)
   ```bash
   brew services start mongodb-community@7.0
   ```

5. **Start Redis** (for caching)
   ```bash
   brew services start redis
   ```

6. **Run the development servers**

   In one terminal:
   ```bash
   npm run dev
   ```

   In another terminal:
   ```bash
   npm run backend:dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
hackforge/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Project history dashboard
│   ├── generate/                 # AI code generation
│   ├── templates/                # Template library
│   ├── api/                      # API documentation
│   ├── documentation/            # User guides
│   ├── tutorials/                # Learning resources
│   ├── blog/                     # News and updates
│   ├── community/                # Community hub
│   ├── about/                    # Company info
│   ├── careers/                  # Job opportunities
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx               # Root layout
│   ├── error.tsx                # Error handling
│   ├── global-error.tsx         # Global error handling
│   ├── not-found.tsx            # 404 page
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── header.tsx              # Navigation header
│   ├── footer.tsx              # Site footer
│   ├── prompt-form.tsx         # Code generation form
│   ├── code-output.tsx         # Generated code display
│   └── ui/                     # Shadcn/ui components
├── backend/                     # Node.js backend
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── middleware/             # Express middleware
│   ├── config/                 # Configuration files
│   ├── server.js              # Express server
│   └── .env                   # Backend environment
├── lib/                        # Utility libraries
│   └── cache.ts               # Redis cache service
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

## 🔌 API Endpoints

### Code Generation
- `POST /api/generate` - Generate code from prompt
- `GET /health` - Server health check

### Project Management
- `POST /api/projects` - Create new project
- `GET /api/projects` - Get user projects (with search/pagination)
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/favorite` - Toggle favorite status

## 🎯 Key Features Explained

### 1. AI Code Generation
The core feature uses Google Gemini AI to transform natural language descriptions into complete codebases:

```typescript
// Example prompt
"Build a modern e-commerce store with cart functionality"
```

**Features:**
- Intelligent prompt parsing
- Framework detection and selection
- Multi-file project generation
- Production-ready code output
- Error handling and validation

### 2. Project Dashboard
A comprehensive dashboard for managing generated projects:

**Features:**
- Search projects by title, content, or tags
- Sort by creation date, title, or framework
- Pagination for large project collections
- Favorite/unfavorite projects
- Delete projects with confirmation
- View project details in modal
- Export project metadata

### 3. Auto-Save System
Projects are automatically saved with rich metadata:

**Metadata includes:**
- Project title (auto-generated or custom)
- Original prompt
- Generated code
- Framework detection
- Tags extraction
- Generation time
- AI model used
- Token usage

### 4. Modern UI Components
Built with modern design principles:

**Design System:**
- Glass morphism effects
- Neon text animations
- Smooth page transitions
- Responsive grid layouts
- Loading states and skeletons
- Toast notifications

### 5. Caching System
Redis-based caching for improved performance:

**Cache Features:**
- API response caching
- Session storage
- Rate limiting
- Performance optimization

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5002
```

**Backend (backend/.env):**
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5002
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/hackforge
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Database Schema

**Project Model:**
```javascript
{
  userId: String,
  title: String,
  prompt: String,
  generatedCode: String,
  framework: String,
  tags: [String],
  isFavorite: Boolean,
  metadata: {
    tokensUsed: Number,
    generationTime: Number,
    model: String
  },
  timestamps: true
}
```

## 🚀 Deployment

### Quick Start
Run the deployment preparation script:
```bash
./deploy.sh
```

### Deployment Options

#### Option 1: Vercel (Frontend) + Render (Backend) - Recommended
- **Frontend**: Deploy to Vercel for optimal Next.js performance
- **Backend**: Deploy to Render for reliable API hosting
- **Database**: MongoDB Atlas for data storage
- **Cache**: Redis Cloud for caching

#### Option 2: Render (Both Services)
- Use the included `render.yaml` for automatic deployment
- Both frontend and backend on Render platform

### Environment Setup
1. **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

2. **Backend (backend/.env)**
   ```env
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   MONGODB_URI=your_mongodb_atlas_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   REDIS_URL=your_redis_cloud_url
   ```

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key
- Redis Cloud account (optional)
- GitHub repository

### Deployment Platforms
- **Vercel**: [vercel.com](https://vercel.com)
- **Render**: [render.com](https://render.com)
- **MongoDB Atlas**: [mongodb.com/atlas](https://mongodb.com/atlas)
- **Redis Cloud**: [redis.com](https://redis.com)

## 🛡 Security Features

- **Rate Limiting**: API endpoints protected against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Graceful error responses
- **Environment Variables**: Secure configuration management
- **JWT Authentication**: Secure user sessions

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement changes
   - Test locally
   - Submit pull request

2. **Testing**
   - Unit tests for backend functions
   - Integration tests for API endpoints
   - E2E tests for critical user flows

3. **Deployment**
   - Automatic deployment on main branch
   - Environment-specific configurations
   - Database migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check `/documentation` page
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join discussions in `/community`
- **Email**: support@hackforge.dev

## 🎉 Acknowledgments

- **Google Gemini AI** for powerful code generation
- **Next.js Team** for the amazing React framework
- **Shadcn/ui** for beautiful components
- **Framer Motion** for smooth animations
- **MongoDB** for reliable data storage
- **Redis** for fast caching

---

**Built with ❤️ by the HackForge Team**

*Transform your ideas into reality with AI-powered development.*# HackForge-2.0
