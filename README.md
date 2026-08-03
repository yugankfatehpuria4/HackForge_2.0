# 🚀 HackForge – AI-Powered Code Generator

> **Transform. Generate. Deploy.**  
Your AI-powered code generator that turns ideas into production-ready applications in seconds.

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-blue?logo=google)

🔗 **Live Demo:** *[Add link here]*  
📂 **Repository:** *[Add GitHub repo link here]*  

---

## 🎯 Overview

**HackForge** is a full-stack application that combines **Next.js** on the frontend with a **Node.js + Express backend**, powered by **Google Gemini AI** to intelligently generate complete, deployable codebases from plain English prompts.  
Choose your tech stack, watch your project structure build in real time, and manage all generated code through a sleek dashboard.

---

## 🌟 Key Features

- 🤖 **AI Code Generation** – Supports React, Next.js, Vue, Python, and more  
- ⚡ **Real-Time Output** – See your app scaffold appear instantly  
- 📂 **Project Dashboard** – Save, search, and favorite projects  
- 🔄 **Auto-Save & Manual Save** – Never lose your code  
- 📤 **Export & Download** – Copy or download generated files with one click  
- 🎨 **Modern UI** – Dark mode, glass morphism, and smooth animations  
- 🔐 **Authentication Ready** – Secure API & user project storage  
- 🚀 **Customizable Stacks** – Predefined templates or AI-recommended stacks

---

## 🛠️ Tech Stack

| Layer          | Technology                                |
|----------------|-------------------------------------------|
| **Frontend**   | Next.js 15, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion, Sonner |
| **Backend**    | Node.js, Express.js, MongoDB, Mongoose, Google Gemini AI, Redis, CORS |
| **Dev Tools**  | ESLint, Prettier, Nodemon                  |

---

## 🚀 Setup & Installation

### 🔧 Prerequisites
- Node.js 18+  
- MongoDB (local or Atlas)  
- Redis (local or cloud)  
- Google Gemini API key  

### ⚙️ Local Installation
```bash
git clone <repository-url>
cd hackforge
npm install
cd backend && npm install
```

## ⚙️ Environment Variables

### **Frontend** — `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:5002
```
> Inlined at build time. If it is missing, the app falls back to
> `http://localhost:5002`, but production builds must set it explicitly.

### **Backend** — `backend/.env`
```bash
PORT=5002
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000

# Optional — without MONGODB_URI the app still generates code,
# it just cannot save projects to the dashboard.
MONGODB_URI=mongodb://localhost:27017/hackforge
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 🚀 Optional Services
```bash
# macOS (Homebrew)
brew services start mongodb-community@7.0
brew services start redis
```

### 🖥️ Run Both Servers
```bash
# Terminal 1 — backend on :5002
npm run backend:dev

# Terminal 2 — frontend on :3000
npm run dev
```
Visit the app at → http://localhost:3000

Verify the backend is wired up correctly — `services.gemini` must be `true`
before code generation will work:
```bash
curl http://localhost:5002/health
```

---

## ✅ Checks

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
npm test            # Jest unit tests
npm run build       # Production build
```

---

## 📁 Folder Structure
```bash
hackforge/
├── app/            # Next.js App Router pages
├── components/     # UI & form components
├── backend/        # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── lib/            # Utilities (e.g., Redis cache)
├── public/         # Static assets
└── package.json
```
---

## 🗺️ Future Roadmap

- ✅ Authentication (Clerk or JWT-based)
- ✅ Template library for rapid prototyping
- 📦 Export full zipped project
- 🌐 Deploy to Netify/Render from dashboard 
- 📊 Analytics for token usage & generation time 

---

## 🤝 Author

Built with 💚 by **Yugank Fatehpuria**  
- AI by **Google Gemini**
- UI powered by **Shadcn/ui + Tailwind CSS**
- Hosting ready for **Netifly** & Render
