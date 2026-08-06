# 🚀 HackForge – AI-Powered Code Generator

> **Transform. Generate. Deploy.**  
Your AI-powered code generator that turns ideas into production-ready applications in seconds.

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![xAI Grok](https://img.shields.io/badge/xAI-Grok-black?logo=x)

📂 **Repository:** https://github.com/yugankfatehpuria4/HackForge_2.0

---

## 🎯 Overview

**HackForge** is a full-stack application that combines **Next.js** on the frontend with a **Node.js + Express backend**, powered by **xAI Grok** to intelligently generate complete, deployable codebases from plain English prompts.  
Choose your tech stack, watch your project structure build in real time, and manage all generated code through a sleek dashboard.

---

## 🌟 Key Features

- 🤖 **AI Code Generation** – Supports React, Next.js, Vue, Python, and more  
- ⚡ **Real-Time Output** – See your app scaffold appear instantly  
- 📂 **Project Dashboard** – Save, search, and favorite projects  
- 🔄 **Auto-Save & Manual Save** – Never lose your code  
- 📤 **Export & Download** – Copy or download generated files with one click  
- 🎨 **Modern UI** – Dark mode, glass morphism, and smooth animations  
- 🔐 **JWT Authentication** – Email/password accounts; projects are private to their owner  
- 🚀 **Customizable Stacks** – Predefined templates or AI-recommended stacks

---

## 🛠️ Tech Stack

| Layer          | Technology                                |
|----------------|-------------------------------------------|
| **Frontend**   | Next.js 15, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion, Sonner |
| **Backend**    | Node.js, Express.js, MongoDB, Mongoose, xAI Grok, JWT, Redis, CORS |
| **Dev Tools**  | ESLint, Prettier, Nodemon                  |

---

## 🚀 Setup & Installation

### 🔧 Prerequisites
- Node.js 18+  
- MongoDB (local or Atlas)  
- Redis (local or cloud)  
- xAI Grok API key ([console.x.ai](https://console.x.ai))  

### ⚙️ Local Installation
```bash
git clone https://github.com/yugankfatehpuria4/HackForge_2.0.git
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
XAI_API_KEY=your_xai_api_key

# Optional, defaults to grok-3
GROK_MODEL=grok-3
FRONTEND_URL=http://localhost:3000

# Signs auth tokens. Generate one with:
#   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
# If unset, a throwaway secret is generated per process and everyone is
# signed out on restart. Always set this in production.
JWT_SECRET=your_jwt_secret

# Optional — without MONGODB_URI the app still generates code,
# it just cannot save projects or create accounts.
MONGODB_URI=mongodb://localhost:27017/hackforge
REDIS_HOST=localhost
REDIS_PORT=6379
```

> `FRONTEND_URL` is the CORS allow-list. If it does not exactly match the
> origin the browser is using, every request fails with `Failed to fetch`.

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

Verify the backend is wired up correctly — `services.grok` must be `true`
before code generation will work, and `services.database` must be `true`
before you can create an account or save projects:
```bash
curl http://localhost:5002/health
```

---

## 🔐 Authentication

Code generation is open to everyone. Saving projects requires an account,
and each project is visible only to the user who created it.

```bash
# create an account
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"at-least-8-chars"}'

# use the returned token
curl http://localhost:5002/api/projects \
  -H "Authorization: Bearer <token>"
```

Identity is taken from the signed token only — a `userId` in the query
string or request body is ignored. Tokens are valid for 7 days.

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

- ✅ Authentication (JWT-based, implemented)
- ✅ Template library for rapid prototyping
- 📦 Export full zipped project
- 🌐 Deploy to Netify/Render from dashboard 
- 📊 Analytics for token usage & generation time 

---

## 🤝 Author

Built with 💚 by **Yugank Fatehpuria**  
- AI by **xAI Grok**
- UI powered by **Shadcn/ui + Tailwind CSS**
- Hosting ready for **Netifly** & Render
