# Deployment Guide

HackForge deploys as **two independent services**:

| Service  | What it is        | Recommended host        | Start command |
|----------|-------------------|-------------------------|---------------|
| Frontend | Next.js 15 app    | Vercel *(or Render)*    | `next start`  |
| Backend  | Express REST API  | Render                  | `node server.js` |

They are decoupled on purpose — the frontend is static-heavy and benefits from a
CDN, while the API needs a long-lived Node process, a database connection, and
an outbound AI call. The frontend reaches the API through `NEXT_PUBLIC_API_URL`.

> **The single most common deployment failure is a CORS/URL mismatch.** The
> backend's `FRONTEND_URL` must exactly match the origin the browser is on, and
> the frontend's `NEXT_PUBLIC_API_URL` must exactly match the backend's public
> URL. Get these two right and almost everything else follows.

---

## 1. Prerequisites

- A **MongoDB Atlas** cluster (free M0 tier is fine) — required for accounts and
  saved projects. Without it the API still generates code; auth and project
  routes return a clear `503`.
- A **Groq API key** from [console.groq.com/keys](https://console.groq.com/keys)
  (keys start with `gsk_`). xAI keys (`xai-`) also work — the provider is
  detected from the key prefix.
- A **JWT secret**. Generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

In Atlas, add `0.0.0.0/0` to the network access list — Render does not publish
static egress IPs on its lower tiers.

---

## 2. Backend on Render

The repo ships a [`render.yaml`](render.yaml) blueprint that provisions the API,
the frontend, and a Key Value (Redis) cache in one step.

**Blueprint (recommended)** — in the Render dashboard choose
**New → Blueprint**, point it at the repo, and Render reads `render.yaml`.

**Manual** — **New → Web Service**, then:

| Setting        | Value                |
|----------------|----------------------|
| Root Directory | `backend`            |
| Build Command  | `npm ci --omit=dev`  |
| Start Command  | `npm start`          |
| Health Check   | `/health`            |

Set these environment variables:

```bash
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url        # exact origin, no trailing slash
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
JWT_SECRET=<64+ random hex chars>
REDIS_URL=redis://...                         # optional; cache no-ops without it
```

`PORT` is injected by Render and already read by `server.js` — don't hardcode it.

`FRONTEND_URL` accepts a **comma-separated list**, which is how you allow a
Vercel production domain and its preview domains at once:

```bash
FRONTEND_URL=https://hackforge.vercel.app,https://hackforge-git-main-you.vercel.app
```

Verify with:

```bash
curl https://your-backend.onrender.com/health
```

`services.ai` must be `true` before code generation works; `services.database`
must be `true` before accounts or saved projects work.

> On Render's free tier the service sleeps after ~15 minutes idle, so the first
> request afterwards takes ~30s. This is expected, not a bug.

---

## 3. Frontend on Vercel

Import the repo at [vercel.com/new](https://vercel.com/new), then **set the
Root Directory to `frontend`** (Settings → General → Root Directory).

> This is the one setting that must be changed by hand. Left at the repo root,
> Vercel finds a `package.json` with no `next` dependency and the build fails
> with "No Next.js version detected". Point it at `frontend` and everything
> else — framework detection, build command, output directory — is correct
> automatically.

Set one environment variable (**Production**, **Preview**, and **Development**):

```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### The complete frontend environment

That really is the whole list. The frontend reads exactly one variable —
`process.env.NEXT_PUBLIC_API_URL` in [`frontend/lib/api.ts`](frontend/lib/api.ts)
— and nothing else:

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No locally, **yes in production** | Base URL of the Express API. Defaults to `http://localhost:5002`. |

Anything else you may have seen in an older `.env.local` — `SENTRY_DSN`,
`NEXT_PUBLIC_SENTRY_DSN`, `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD`,
`CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — is **dead**. Sentry was
removed, Clerk was never wired up, and Redis is backend-only. Delete them; they
do nothing.

Everything else the project needs (database, AI key, JWT secret, cache) is
**backend** configuration and belongs in `backend/.env` or the Render dashboard.
See [`backend/env.example`](backend/env.example).

> `NEXT_PUBLIC_*` values are **inlined into the client bundle at build time**,
> not read at runtime. Changing this variable requires a **redeploy** — a
> restart will not pick it up. This surprises people constantly.

With Root Directory set, only `frontend/` is uploaded, so the API can never
reach the build. [`frontend/.vercelignore`](frontend/.vercelignore) trims the
test files on top of that.

After the first deploy, go back to Render and set `FRONTEND_URL` to the Vercel
URL, then redeploy the backend.

### Frontend on Render instead

`render.yaml` also defines the frontend as a Render web service
(`npm ci && npm run build` / `npm start`). Use it if you'd rather keep both
services on one platform; otherwise delete that block.

---

## 4. Post-deploy checklist

```bash
# 1. API is up and fully configured
curl https://your-backend.onrender.com/health

# 2. Code generation works end-to-end
curl -X POST https://your-backend.onrender.com/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"A JavaScript function that adds two numbers.","saveToHistory":false}'

# 3. Accounts work (needs MONGODB_URI)
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"at-least-8-chars"}'
```

Then load the frontend, open the browser devtools **Network** tab, and generate
something. A failed request here is almost always CORS — the backend logs
`⚠️ Blocked CORS request from <origin>. Add it to FRONTEND_URL.`

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Failed to fetch` in the browser | Origin missing from the CORS allow-list | Add the exact origin to `FRONTEND_URL` and redeploy the backend |
| Requests go to `undefined/api/...` | `NEXT_PUBLIC_API_URL` unset at **build** time | Set it in Vercel and **redeploy** |
| `AI API key is not configured` | `GROQ_API_KEY` unset, or still the placeholder | Set a real `gsk_…` / `xai-…` key |
| `Database is not connected` (503) | `MONGODB_URI` unset or Atlas IP allow-list blocking | Set the URI; allow `0.0.0.0/0` in Atlas |
| Signed out after every deploy | `JWT_SECRET` unset, so a random one is generated per process | Set a fixed `JWT_SECRET` |
| Provider returns `401` | Key/provider mismatch | Groq keys start with `gsk_`, xAI keys with `xai-`; check for stray quotes or spaces |
| First request takes ~30s | Render free-tier cold start | Expected; upgrade the plan to avoid it |

---

## 6. Security notes

- No secrets are committed. `.env*` files are gitignored; `frontend/env.example`
  and `backend/env.example` document the shape only.
- `JWT_SECRET` should be set via `generateValue: true` in the blueprint or
  entered in the dashboard — never in the repo.
- Project routes derive the user id from the **verified token**, never from the
  request body or query string.
- `vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options`, and
  `Referrer-Policy` on all responses.
- Rate limits are applied per route: 20 auth attempts / 15 min, 10 generations /
  15 min, 100 project requests / 15 min.
