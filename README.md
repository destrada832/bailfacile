# BailFacile — Quebec Rental Management SaaS

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to supabase.com → New project → Name: "bailfacile"
2. Copy Project URL and anon key
3. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run

### 3. Configure environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase URL and keys
```

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel
1. Push to GitHub
2. In Vercel: Import repository
3. Add all .env variables in Vercel settings
4. Deploy

### 6. Connect domain
In Vercel project settings → Domains → Add `bailfacile.ca`
In Namecheap → Advanced DNS → Add CNAME record pointing to `cname.vercel-dns.com`

## Architecture
- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS
- **Auth + DB**: Supabase (PostgreSQL + Row Level Security)
- **Payments**: Stripe subscriptions
- **Hosting**: Vercel
- **Domain**: bailfacile.ca (Namecheap)

## Key pages
- `/` — Landing page with free calculator
- `/calculateur-loyer` — Public SEO calculator page
- `/dashboard` — Main dashboard
- `/properties` — Property/unit management
- `/renewals` — Renewal deadline tracker
- `/calculator` — Full TAL calculator (authenticated)
- `/settings` — Plan & billing
