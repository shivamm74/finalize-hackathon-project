# FoodFlow (resQfood)

Real-time food rescue platform: match surplus donations with nearby shelters and coordinate volunteer pickups.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth + Postgres, Vercel.

## Setup

1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env.local`. Project URL and publishable key belong there (never commit real keys).
3. In the [Supabase SQL Editor](https://supabase.com/dashboard/project/segjlartiyxhwxlncypc/sql), paste and run `supabase/schema.sql`. That creates profiles and operations tables plus RLS.
4. Authentication → URL configuration: add `http://localhost:3000/auth/callback` (and your Vercel URL) as a redirect.
5. Start the app:

```bash
npm run dev
```

Sign up at `/signup`. Signed-in users are stored in `auth.users` and `public.profiles`. Dashboard routes require a session.

## Deploy on Vercel

1. Push this folder to GitHub, import it in Vercel (framework: Next.js, no extra settings).
2. Add env vars in Project Settings: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (your Vercel URL).
3. In Supabase, Authentication, URL configuration, add `https://<your-app>.vercel.app/auth/callback`.

## Folder map

- `app/` pages and routes (Next.js App Router)
- `components/` UI (`ui/` shadcn, `shared/`, `layout/`, `donations/`, `dashboard/`, `auth/`)
- `lib/` logic: `auth/actions.ts` (server actions), `auth/session.ts` (server-only), `supabase/`, `store.tsx` (demo state), `mock-data.ts`
- `types/` TypeScript types, `supabase/schema.sql` database
