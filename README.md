# Twelve Leaves

A habit tracker where consistency grows a garden. Every completion earns
growth points that advance a plant and unlock new species in a personal
collection.

## Stack

Next.js 14 (App Router) · PostgreSQL (Neon) · Drizzle ORM · Better Auth ·
Tailwind CSS · Framer Motion · Vercel

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run db:push              # push schema to your database
npm run db:seed              # seed the plant catalog
npm run dev
```

### Environment variables

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | Random 32+ char string (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | App base URL, e.g. `http://localhost:3000` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store, for avatar uploads |

None of these are committed. `.env.local` is gitignored.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Production build / run |
| `npm run db:generate` / `db:push` / `db:studio` | Drizzle schema tooling |
| `npm run db:seed` | Seeds the plant catalog |
| `npm run lint` | ESLint |


## Status :
This application is still undergoing changes. Expect breaking changes.
