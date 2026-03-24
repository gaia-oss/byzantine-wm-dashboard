# Byzantine Prime — Wealth Manager Dashboard

## Project overview

Dashboard Next.js pour les CGPs, MFOs, et gestionnaires de patrimoine indépendants distribuant Byzantine Prime à leurs clients finaux. Permet de gérer les clients (pipeline d'onboarding KYC), monitorer l'AUM & commissions, configurer les management fees, et suivre les payouts trimestriels.

100% client-side avec mock data, prêt pour branchement API réelle (service layer dans `src/lib/services.ts`).

## Commands

- `npm run dev` : Dev server (localhost:3000)
- `npm run build` : Production build (Turbopack)
- `npm run start` : Start production
- `npm run check` : Lint + format (check only, Biome)
- `npm run check:fix` : Lint + format + fix (Biome)
- `npm run test` : Run tests (Vitest, watch mode)
- `npm run test:run` : Run tests once (CI)

## Stack technique

- **Framework** : Next.js 16, App Router, React 19, TypeScript 6 (strict)
- **Styling** : Tailwind CSS 4 avec design tokens Byzantine (via `@theme` dans globals.css)
- **State** : React Context (i18n), `useState` local, `useAsyncData` hook custom
- **Charts** : Recharts (LineChart, BarChart)
- **Tables** : @tanstack/react-table (prêt, pas encore utilisé directement)
- **Animations** : Framer Motion (stagger, fade-in)
- **Icons** : Lucide React
- **Linting/Formatting** : Biome (remplace ESLint + Prettier). Double quotes, semicolons, trailing commas.
- **Testing** : Vitest
- **Font** : Manrope (Google Fonts)
- **Path alias** : `@/*` → `src/*`

## Ce qu'on n'utilise PAS

- ESLint / Prettier (Biome)
- Jest (Vitest)
- Redux / Zustand / TanStack Query (React Context + hook useAsyncData)
- SCSS Modules (Tailwind CSS avec design tokens)
- Axios (fetch natif dans le service layer)
- styled-components / Emotion (Tailwind)
- Auth / ECDSA (mock data, pas d'API réelle pour l'instant)

## Structure des dossiers

```
src/
├── app/                    # Pages App Router (orchestration, pas de logique lourde)
│   ├── layout.tsx          # Root layout (Sidebar + Header + I18nProvider)
│   ├── page.tsx            # Dashboard overview
│   ├── globals.css         # Design tokens + utility styles (glass-card, data-table, badges)
│   ├── clients/
│   │   ├── page.tsx        # Client list avec filtres/tri
│   │   └── [id]/page.tsx   # Client detail
│   ├── commissions/page.tsx
│   ├── fees/page.tsx
│   ├── pipeline/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── layout/             # Sidebar, Header
│   ├── ui/                 # KpiCard, StatusBadge, FunnelPills, Skeleton
│   ├── charts/             # AumChart
│   ├── dashboard/          # ActivityFeed
│   ├── clients/            # ClientTable, ClientFilters, FeeEditor, CommissionTierCard, TransactionTable, CommissionHistoryTable
│   ├── commissions/        # RevenueCalculator
│   ├── pipeline/           # InviteForm, PipelineKanban, InvitationsTable
│   └── settings/           # ProfileForm, PayoutPreferences, NotificationPreferences
├── hooks/
│   └── useAsyncData.ts     # Generic async data fetching hook (remplace useEffect boilerplate)
├── lib/
│   ├── format.ts           # Shared formatting utils (formatCurrency, formatDate, getTierBps, etc.)
│   ├── mock-data.ts        # Demo data (15 clients, 20 transactions, KPIs)
│   └── services.ts         # API service layer avec TODO pour branchement réel
├── i18n/
│   ├── context.tsx         # React Context pour locale (EN/FR)
│   └── translations.ts    # ~156 clés de traduction
└── types/
    └── index.ts            # Toutes les interfaces TypeScript
```

## Conventions code

- Double quotes (") partout (configuré dans Biome)
- Semicolons obligatoires
- Trailing commas
- Sentence case dans l'UI (pas de Title Case)
- `"use client"` en haut de chaque fichier qui utilise des hooks

## Formatting

Après chaque modification, lancer `npm run check:fix` pour lint, format, et organiser les imports. Config dans `biome.json`.

## Conventions

### Pages = orchestrateurs fins

Les pages dans `app/` ne doivent contenir **aucune logique métier ni UI lourde**. Elles :
- Appellent `useAsyncData` pour le data fetching
- Composent des composants extraits depuis `components/`
- Gèrent le layout de la page (grid, spacing)

### Composants

- Un fichier `.tsx` par composant, dans le dossier feature correspondant
- Props typées via interface dans le même fichier
- Named exports (pas de default exports, sauf pages App Router)
- `"use client"` en haut de chaque composant qui utilise des hooks

### Formatting partagé

**Toujours** utiliser les fonctions de `src/lib/format.ts` :
- `formatCurrency(amount)` — jamais de `new Intl.NumberFormat` inline
- `formatDate(dateStr)` — jamais de `.toLocaleDateString()` inline
- `formatBps(value)` — pour les basis points
- `getTierBps(aum, year)` — logique de commission centralisée
- `getNextPayoutDate()` — calcul du prochain payout trimestriel

### Service layer

Toute donnée passe par `src/lib/services.ts`. **Jamais** importer `mock-data.ts` directement depuis une page ou un composant (sauf `COMMISSION_TIERS` qui est de la donnée de référence statique).

### Data fetching

Utiliser le hook `useAsyncData` :
```tsx
const { data, loading, error } = useAsyncData(
  () => Promise.all([fetchA(), fetchB()]).then(([a, b]) => ({ a, b })),
  [] // deps
);
```

### Styling

- Tailwind CSS 4 avec design tokens définis dans `globals.css` (@theme block)
- Classes utilitaires custom : `glass-card`, `data-table`, `badge`, `badge-success`, etc.
- Couleur primaire : Byzantium Purple `#702963`
- Palette sémantique : `text-primary`, `text-secondary`, `text-muted`, `surface`, `border`, etc.
- Mobile-first, responsive via Tailwind breakpoints (sm → md → lg → xl)

### i18n

- English + French intégré via React Context
- Accès : `const { t } = useI18n()`
- Toutes les strings UI doivent passer par `t.section.key`

## Design system

- **Aesthetic** : Institutional premium fintech (Swan.io / Ramp / Mercury)
- **Light theme**, glassmorphism cards, generous whitespace
- **Couleurs** : voir `@theme` dans `globals.css`
- **Border radius** : `--radius-sm` (8px) → `--radius-xl` (20px)
- **Font** : Manrope (300-800)

## Commission structure (ref: CGP rev share agreement)

| AUM Bracket | Year 1 (bps) | Year 2 (bps) | Year 3+ (bps) |
|-------------|-------------|-------------|---------------|
| 50K – 1M€  | 28          | 12          | 10            |
| 1M – 5M€   | 28          | 12          | 10            |
| 5M – 10M€  | 36          | 16          | 12            |
| 10M€+      | 40          | 20          | 15            |

Calculé sur l'AUM moyen journalier par trimestre. Payé trimestriellement pendant 36 mois par client. 10M€+ auto-renew sans limite de temps.

## API endpoints (pour branchement futur)

Chaque fonction dans `services.ts` a un commentaire TODO avec l'endpoint réel :

| Function | Endpoint | Method |
|----------|----------|--------|
| `fetchDashboardKPIs` | `GET /api/dashboard/overview` | GET |
| `fetchClients` | `GET /api/clients` | GET |
| `fetchClientById` | `GET /api/clients/:id` | GET |
| `fetchCommissionBreakdown` | `GET /api/commissions` | GET |
| `fetchAumHistory` | `GET /api/dashboard/aum-history` | GET |
| `fetchInvitations` | `GET /api/invitations` | GET |
| `sendInvitation` | `POST /api/invitations` | POST |
| `updateClientFee` | `PATCH /api/clients/:id/fees` | PATCH |
| `fetchProfile` | `GET /api/profile` | GET |
| `updateProfile` | `PATCH /api/profile` | PATCH |

## Git

- Prefixes : feat:, fix:, clean:, refactor:, docs:, test:, chore:
- Message = le but du changement
- Jamais de Co-Authored-By
