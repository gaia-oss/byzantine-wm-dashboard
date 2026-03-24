# Byzantine Prime — Wealth Manager Portal

Standalone Next.js dashboard for CGPs, MFOs, and independent wealth managers distributing Byzantine Prime to their end clients.

## Quick Start

```bash
tar xzf byzantine-wm-dashboard-v2.tar.gz
cd byzantine-wm-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** with custom Byzantine design tokens
- **Recharts** for data visualizations
- **@tanstack/react-table** for sortable/filterable data tables
- **Framer Motion** for micro-animations
- **Lucide React** for icons
- **Manrope** font (Google Fonts)

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard Home | KPI cards, AUM chart, client funnel, activity feed |
| `/clients` | Client Management | Searchable table, filter by status/type, sortable columns |
| `/clients/[id]` | Client Detail | AUM chart, commission tier timeline, fee adjustment, transaction history |
| `/commissions` | Commissions & Earnings | Earnings breakdown, commission tiers, revenue projection calculator |
| `/fees` | Management Fees | Default fee config, per-client overrides, impact calculator |
| `/pipeline` | Invite & Track | Kanban pipeline, invite form, referral link, conversion stats |
| `/settings` | Settings | Profile, payout preferences, notifications, language, support |

## Design System

- **Primary color:** Byzantium Purple `#702963`
- **Aesthetic:** Institutional premium fintech (Swan.io / Ramp / Mercury)
- **Light theme**, glassmorphism cards, generous whitespace
- **Desktop-first** (1440px+), fully responsive
- **Font:** Manrope

## i18n

Built-in English and French. Language switcher in sidebar and settings page.

## Swapping mock data for real APIs

The app uses a service layer (`src/lib/services.ts`) with mock data. Each function has a TODO comment showing the real API endpoint to swap in:

| Function | Endpoint | Method |
|----------|----------|--------|
| `fetchDashboardKPIs` | `GET /api/dashboard/overview` | GET |
| `fetchClients` | `GET /api/clients` | GET |
| `fetchClientById` | `GET /api/clients/:id` | GET |
| `fetchClientTransactions` | `GET /api/clients/:id/transactions` | GET |
| `fetchCommissionBreakdown` | `GET /api/commissions` | GET |
| `fetchQuarterlyPayouts` | `GET /api/payouts` | GET |
| `fetchAumHistory` | `GET /api/dashboard/aum-history` | GET |
| `fetchInvitations` | `GET /api/invitations` | GET |
| `sendInvitation` | `POST /api/invitations` | POST |
| `updateClientFee` | `PATCH /api/clients/:id/fees` | PATCH |
| `fetchProfile` | `GET /api/profile` | GET |
| `updateProfile` | `PATCH /api/profile` | PATCH |

Each service function simulates an async API call. To connect real APIs, replace the function body with a `fetch()` call — the types and return signatures stay the same.

## Commission Structure (from CGP rev share agreement)

| AUM Bracket | Year 1 (bps) | Year 2 (bps) | Year 3+ (bps) |
|-------------|-------------|-------------|---------------|
| 50K – 1M€  | 28          | 12          | 10            |
| 1M – 5M€   | 28          | 12          | 10            |
| 5M – 10M€  | 36          | 16          | 12            |
| 10M€+      | 40          | 20          | 15            |

Calculated on average daily AUM per quarter. Paid quarterly for 36 months per client. 10M€+ auto-renews with no time limit.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard Home
│   ├── layout.tsx         # Root layout (sidebar + header)
│   ├── globals.css        # Design tokens + utility styles
│   ├── clients/
│   │   ├── page.tsx       # Client list
│   │   └── [id]/page.tsx  # Client detail
│   ├── commissions/page.tsx
│   ├── fees/page.tsx
│   ├── pipeline/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── layout/            # Sidebar, Header
│   ├── ui/                # KpiCard, StatusBadge, FunnelPills, Skeleton
│   ├── charts/            # AumChart
│   └── dashboard/         # ActivityFeed
├── lib/
│   ├── mock-data.ts       # Realistic demo data
│   └── services.ts        # API service layer (swap mock for real)
├── i18n/
│   ├── context.tsx        # React Context for locale
│   └── translations.ts   # EN + FR translations
└── types/
    └── index.ts           # All TypeScript interfaces
```

## What your CPO needs to know

- **Build passes with zero errors** — `npm run build` compiles all 8 routes
- **Mock data is pre-loaded** — the dashboard is demo-ready out of the box
- **API layer is ready** — `src/lib/services.ts` has typed async functions, just swap the body for real `fetch()` calls
- **i18n is built in** — English + French, add more locales by extending `src/i18n/translations.ts`
- **All commission logic matches the CGP agreement** — tiered structure, 3-year degressive, quarterly average AUM calculation
