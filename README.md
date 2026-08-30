# Local Shop Platform (V1)

A small local shop platform: a Next.js storefront with a Supabase backend and a
Cloudflare-hosted frontend, built as a pnpm workspace monorepo.

```
apps/web       Next.js 15 storefront (App Router, SSR on Cloudflare)
packages/ui    @shop-platform/ui — shared React + Tailwind component library
packages/config @shop-platform/config — shared app configuration
packages/types  @shop-platform/types — shared TypeScript database types
supabase/      Backend: migrations, seed, CLI config
```

## Architecture

| Layer      | Technology                                                          |
| ---------- | ------------------------------------------------------------------- |
| Web app    | Next.js 15 (React 19, TypeScript, Tailwind CSS), App Router         |
| Backend    | Supabase (Postgres + RLS + storage)                                 |
| Frontend   | Cloudflare (OpenNext adapter → Cloudflare Worker + static assets)   |
| Tooling    | pnpm workspace, Node.js 22                              |
| CI/CD      | GitHub Actions (`.github/workflows/ci.yml`)              |

This is **not** a Kotlin Multiplatform / Gradle project. There are no Android,
iOS, or shared-KMP targets — the pipeline intentionally has no Gradle or macOS
runner requirements.

### Data flow

Server components load data from Supabase via `apps/web/src/lib/data.ts`
(public anon key only). The service-role key is used only in
`apps/web/src/lib/admin-data.ts` on the server and is **never** inlined into the
frontend bundle.

## Repository layout

```
apps/web/
  src/app/          App Router pages (/, /products, /products/[slug], /categories,
                    /api/analytics, not-found)
  src/components/   Header, Footer, product/category components, admin UI
  src/lib/          data access, supabase clients, unit tests
  open-next.config.ts    OpenNext Cloudflare adapter config
  wrangler.jsonc         Cloudflare Worker config (deploy entry)
  vitest.config.ts       unit test runner
packages/ui/        shadcn-style components + utilities (source-consumed)
supabase/
  migrations/       001_schema, 002_rls, 003_storage
  seed.sql          demo data (applied manually / via `supabase db reset`)
  config.toml       local Supabase CLI configuration
```

## Prerequisites

- **Node.js** ≥ 22 (as installed on the runner and expected locally)
- **pnpm** 11.24.0 (managed via `corepack`: `corepack enable`)
- **Supabase CLI** 2.114.0, e.g. `npm install -g supabase@2.114.0`
- **Wrangler** (bundled as a devDependency) for local deploy dry-runs
- No Xcode / macOS toolchain required (no iOS target)

## Local development

Copy `.env.example` to `apps/web/.env.local` and fill in the Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321        # or remote
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/public key>
```

Install and run the storefront:

```bash
pnpm install
pnpm dev          # next dev on http://localhost:3000
```

### Build common packages

```bash
pnpm --filter="./packages/*" build            # type-checks + builds ui/config/types
```

### Typecheck and unit tests

```bash
pnpm typecheck                                # tsc --noEmit across the web app
pnpm test                                     # vitest run (unit tests)
```

### Build the web app (SSR, for local verification)

```bash
cd apps/web
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... pnpm build
```

### Build + deploy the Cloudflare Worker

```bash
cd apps/web
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... pnpm build:cf
pnpm exec wrangler deploy --dry-run           # validate the bundle without deploying
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... pnpm deploy:cf
```

`build:cf` runs the OpenNext Cloudflare adapter (`opennextjs-cloudflare build`),
which produces `apps/web/.open-next/worker.js` plus static assets.
`wrangler deploy` uploads that as a Cloudflare Worker.

### Supabase

```bash
supabase start                    # local stack (Postgres + Studio)
supabase db reset                 # apply migrations + seed locally
supabase db push                  # push pending migrations to the linked remote
```

To push migrations to a remote project without linking:

```bash
supabase db push --db-url "postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"
```

## CI/CD (GitHub Actions)

Source of truth: `.github/workflows/ci.yml`.

```
merge_request / push (any branch)            push to main
        │                                        │
        ▼                                        ▼
   ┌─────────────┐                    ┌─────────────┐
   │  ci         │  ───────────────►  │  ci         │
   └──────┬──────┘                    └──────┬──────┘
          ▼                                  ▼
   (validate + build only)          ┌──────────────────┐
                                    │      main only   │
                                    └────────┬─────────┘
                                      ┌──────┴──────┐
                                      ▼             ▼
                             supabase_deploy  cloudflare_deploy
```

- **Pull requests / feature branches**: the `ci` job runs install (frozen
  lockfile) → common packages build → typecheck → unit tests → OpenNext
  Cloudflare worker build → `wrangler deploy --dry-run`. Broken code is caught
  before merge; no deployments happen.
- **`main` pushes**: once `ci` passes, `supabase_deploy` and `cloudflare_deploy`
  run in parallel (tracked against the `production` environment). Deployments
  never run from arbitrary branches.

### Required repository variables

Configure these under Settings → Secrets and variables → Actions.

Secrets (`secrets`):

| Secret                        | Purpose                                        |
| ----------------------------- | ---------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`        | Cloudflare token (Workers Scripts edit)        |
| `SUPABASE_DB_PASSWORD`        | DB password for the Supabase project           |
| `SUPABASE_PUBLISHABLE_KEY`    | Public publishable key (browser-safe)          |
| `SUPABASE_ANON_KEY`           | Public anon key, fallback for the web build    |

Variables (`vars`):

| Variable                | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID                          |
| `CLOUDFLARE_PROJECT_NAME` | Worker name (defaults to `shop-platform`)   |
| `SUPABASE_PROJECT_ID`   | Supabase project reference (the slug)          |
| `SUPABASE_PROJECT_REGION` | Pooler region, e.g. `us-east-1`            |

Secrets never appear in the repository. The web build only receives the
browser-safe `NEXT_PUBLIC_*` values, derived from `SUPABASE_PROJECT_ID` plus
`SUPABASE_PUBLISHABLE_KEY`/`SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_SECRET` /
`SUPABASE_SECRET_KEY` are server-only and must never be added to the variables
consumed by the `ci` build job.

### Runner configuration

All jobs run on a Linux runner (Node 22). No macOS/Xcode runner is needed —
there is no iOS target. pnpm install caches via `pnpm/action-setup` + the GitHub
default cache keyed on `pnpm-lock.yaml`.

## Environment strategy

`development` / `production` are not split into separate environments
beyond the workflow rules above: PR/branch pipelines build and validate;
only the `main` pipeline deploys to production (tracked via the
`production` environment on both deploy jobs).

## Quality gates

The pipeline fails (no `|| true`, no `continue-on-error`) when any of these
fail: pnpm install (frozen lockfile), common packages build, TypeScript
typecheck, unit tests, the OpenNext Cloudflare build, the `wrangler --dry-run`
bundle validation, or either production deployment.