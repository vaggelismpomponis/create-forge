# create-forge

> Modern enterprise-grade CLI generator to scaffold web applications and sites pre-configured with strict production engineering standards, anti-slop design directives, and AI skill guardrails.

---

## ⚡ Quick Start

Run instantly without installation:

```bash
# Interactive wizard
npx create-forge my-app

# Or with specific package managers
npm create forge@latest my-app
pnpm create forge my-app
bun create forge my-app
```

Or install globally:

```bash
npm install -g create-forge
forge init
```

---

## 🏗 Supported Architectures & Stacks

| Stack | Framework | Highlights |
|---|---|---|
| **Next.js 15** | Next.js 15 App Router | React 19, Server Components, Mobile-first Tailwind, Body-portaled modal |
| **Vite + React** | Vite + React SPA | Ultra-fast client SPA, mobile/Capacitor-ready, TypeScript |
| **Full-Stack .NET** | C# .NET 10 + React | Clean Architecture, Zero AutoMapper, manual DTO mappings, `.AsNoTracking()` |
| **Astro** | Astro | Content-first, single semantic H1, zero client JS runtime overhead |

---

## 🛡 Baked-in 8 Core Engineering Directives

Every project created with `create-forge` automatically injects `AGENTS.md` and `.agent/skills/` containing:

1. **`anti-slop-ui-design`**: Zero generic purple/pink gradients, zero floating blurred blobs, pure unboxed icons, no pill buttons or boxed step badges. Crisp 1px structural borders and high-contrast surfaces.
2. **`mobile-first-css-layout`**: Unprefixed Tailwind targets mobile (`<640px`). Progressive `sm:`, `md:`, `lg:` breakpoints. Fluid widths (`w-full max-w-*`) and dynamic viewport units (`min-h-dvh`).
3. **`clean-react-architecture`**: Sub-150-line modular components, no `any`, zero `useEffect` abuse for derived state or user actions. Default to Server Components.
4. **`backend-and-workflow-guardrails`**: In C#/.NET, NEVER use AutoMapper—explicit manual `ToDto()` extension projections, `.AsNoTracking()` on reads, and `CancellationToken` propagation. In Supabase, never `select('*')`, always enforce RLS.
5. **`forms-and-async-ux`**: Accessible forms, loading indicators on mutations, and **mandatory modal viewport isolation** (`ReactDOM.createPortal(..., document.body)` with `z-[99999]`, focus lock, and background scroll prevention).
6. **`seo-and-web-performance`**: Next.js Metadata API, semantic HTML headings (single `<h1>` per page), optimal Core Web Vitals.
7. **`systematic-debugging`**: Root-cause analysis, reproduction before modification, zero silent logic deletions.
8. **`git-and-deployment-hygiene`**: Conventional Commits, branch hygiene, secret protection, local-only commits without unauthorized remote pushes.

---

## 🛠 CLI Flags (Non-Interactive / CI Mode)

```bash
create-forge [project-directory] [options]

Options:
  -v, --version           Output the current version
  -s, --stack <type>      Stack: next | vite-react | fullstack-dotnet | astro
  -l, --linter <type>     Linter: biome | eslint
  -d, --database <type>   Database preset: supabase | none
  -g, --git               Initialize local Git repository with atomic commit
  --no-git                Skip git initialization
  -i, --install           Install dependencies automatically
  --no-install            Skip dependency installation
  -y, --yes               Skip prompts and use defaults
  -h, --help              Display help
```

### Example CI Command
```bash
npx create-forge my-saas --stack next --linter biome --database supabase --git --install
```

---

## 📜 License
MIT © 2026
