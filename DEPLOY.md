# Deploy — MindfulChat (free)

Hosted on **Vercel** (free) with a **free Postgres** (Neon/Supabase).

## 1. Import the repo
1. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import **`Kamara888/chat_boot-`**.
3. Vercel auto-detects Next.js and runs `next build`.

## 2. Add a database
1. Create a **free Postgres** at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. Copy the connection string into `DATABASE_URL` (below).
3. Push the Prisma schema (run once, locally, against the remote DB):
   ```bash
   npx prisma db push
   ```
   The schema is also pushed automatically on every deploy by the
   `.github/workflows/db-sync.yml` workflow — but it needs `DATABASE_URL`
   added as a **GitHub Actions secret** (repo → Settings → Secrets → Actions).

## 3. Environment variables
In Vercel → Project → **Settings → Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | From Neon/Supabase |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your deployed URL |
| `NEXTAUTH_SECRET` | any random string | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console | only if using Google sign-in |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console | only if using Google sign-in |
| `NVIDIA_API_KEY` | your key | default AI provider |
| `AI_BASE_URL` / `AI_API_KEY` / `AI_MODEL` | *(optional)* | switch to Groq/Ollama (see `.env.example`) |

> Google TTS stays on the **browser fallback** (no action needed) and voice (Web Speech API) works in Chrome/Edge.

## 4. Deploy
Vercel builds automatically on every push to `main`. After the first deploy, set
`NEXTAUTH_URL` to the live URL and redeploy.

## 5. Google sign-in (optional)
In Google Cloud Console → Credentials → OAuth client, add the authorized redirect URI:
`https://your-app.vercel.app/api/auth/callback/google`
