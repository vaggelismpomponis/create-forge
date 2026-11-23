import type { SkillType } from "../types.js";

export interface SkillDefinition {
  id: SkillType;
  filename: string;
  title: string;
  description: string;
  content: string;
}

export const CORE_SKILLS: SkillDefinition[] = [
  {
    id: "anti-slop-ui-design",
    filename: "anti-slop-ui-design.md",
    title: "Anti-Slop UI Design Directive",
    description:
      "Strict visual design standards forbidding generic AI gradients, boxed icons, and visual noise.",
    content: `# Anti-Slop UI Design Directive

## Non-Negotiable Visual Standards
- **Zero AI Gradients**: Never use purple-to-indigo, pink, or multi-stop pastel gradients on backgrounds, headers, or text. Use solid, high-contrast, purposeful color surfaces.
- **No Floating Blurred Blobs**: Forbid ambient radial gradient background blur circles (\`blur-3xl\`, \`bg-purple-500/20\`). They degrade text contrast and look unpolished.
- **Pure Unboxed Icons**: Icons (Lucide or SVG) must never sit inside a boxed background container (e.g. \`bg-emerald-50 rounded-lg p-2\`). Icons must be pure elements inline with text, aligned using flexbox.
- **No Pill Badges for Section Titles**: Category overlines and section headers must never be pill badges (\`border bg-emerald-50 rounded-full px-3 py-1\`). Use crisp uppercase typography: \`text-xs font-semibold uppercase tracking-widest text-zinc-500\`.
- **No Boxed Step Numbers**: Never wrap step counters or numbers inside boxed badges (\`border bg-white rounded px-2.5 py-1\`). Render numbers as pure typographic elements.
- **Subtle Surface Elevation**: Replace heavy drop shadows (\`shadow-xl\`, \`shadow-2xl\`) with crisp 1px borders (\`border border-zinc-200 dark:border-zinc-800\`) and minimal elevation (\`shadow-sm\`).
- **Interactive Radius Consistency**: Interactive elements (buttons, inputs) must use \`rounded-md\` or \`rounded-lg\`. Never use full pill buttons (\`rounded-full\`) for primary call-to-actions.
`,
  },
  {
    id: "mobile-first-css-layout",
    filename: "mobile-first-css-layout.md",
    title: "Mobile-First CSS & Layout Architecture",
    description:
      "Responsive layout rules enforcing true mobile-first Tailwind design and dynamic viewport heights.",
    content: `# Mobile-First CSS & Layout Architecture

## Layout & Responsive Rules
- **Strict Mobile-First Breakpoints**: Unprefixed Tailwind classes MUST target mobile devices (<640px). Only introduce \`sm:\`, \`md:\`, \`lg:\`, and \`xl:\` modifiers progressively for wider viewports.
- **Dynamic Viewport Heights**: Never use fixed \`h-screen\` or \`100vh\` on mobile containers, as mobile browser address bars collapse and cause overflow jitter. Always use \`min-h-dvh\` or \`h-dvh\`.
- **Fluid Containers**: Never set fixed pixel widths on parent containers (e.g. \`w-[400px]\` or \`w-[800px]\`). Use fluid constraints: \`w-full max-w-lg mx-auto\`.
- **Touch-Friendly Tap Targets**: Ensure interactive targets (buttons, links, form inputs) are at least 44x44px on mobile screens with appropriate touch padding.
- **Horizontal Overflow Prevention**: Ensure no tables, wide images, or code blocks trigger unintended horizontal page scrolling. Use \`overflow-x-auto\` strictly scoped to child containers.
`,
  },
  {
    id: "clean-react-architecture",
    filename: "clean-react-architecture.md",
    title: "Clean React Architecture & Strict TypeScript",
    description:
      "Component modularity, type safety, and elimination of useEffect misuse in modern React.",
    content: `# Clean React Architecture & Strict TypeScript

## Core Rules
- **Sub-150-Line Components**: Keep components modular, focused, and under 150 lines. Split complex components into cohesive child subcomponents and custom hooks.
- **Zero Any Policy**: Never use \`any\`. Use strict TypeScript interfaces, type unions, generics, or \`unknown\` with type guards.
- **Zero useEffect for Derived State**: Compute derived state during render or with \`useMemo\`. Never sync props to state or compute totals inside \`useEffect\`.
- **Zero useEffect for User Event Actions**: Trigger side effects (API mutations, navigation, toast notifications) inside event handlers, not reactively inside \`useEffect\`.
- **Default to Server Components (Next.js)**: Keep data fetching and static markup in React Server Components. Only add \`'use client'\` at the boundary where browser interactivity or state is required.
`,
  },
  {
    id: "backend-and-workflow-guardrails",
    filename: "backend-and-workflow-guardrails.md",
    title: "Backend & Workflow Guardrails",
    description: "Strict database discipline, manual DTO mapping, and robust API contracts.",
    content: `# Backend & Workflow Guardrails

## C# / .NET 8+ Directives
- **Zero AutoMapper**: NEVER use AutoMapper or reflection-based magic mappers. Always write explicit, compile-time safe extension methods for DTO projection (e.g. \`entity.ToDto()\`).
- **Read-Only Performance**: Always append \`.AsNoTracking()\` to read-only Entity Framework queries to eliminate unnecessary change tracking overhead.
- **CancellationToken Propagation**: Always accept and propagate \`CancellationToken cancellationToken\` through controllers, services, and repository layers down to async EF Core methods.
- **Clean Architecture Boundaries**: Keep domain entities isolated from API contracts. Controllers only accept and return DTOs/records.

## Supabase & SQL Guardrails
- **No Wildcard Queries**: Never execute \`select('*')\`. Always select explicitly named columns (e.g. \`select('id, name, created_at')\`) to minimize bandwidth and preserve index efficiency.
- **Row Level Security (RLS)**: Enforce RLS on every table. Provide explicit security policies for \`SELECT\`, \`INSERT\`, \`UPDATE\`, and \`DELETE\`.
- **Strict Error Handling**: Always check and handle \`{ data, error }\` returns from Supabase queries. Never assume queries succeed.
`,
  },
  {
    id: "forms-and-async-ux",
    filename: "forms-and-async-ux.md",
    title: "Forms & Asynchronous UX",
    description:
      "Accessible forms, mutation states, optimistic updates, and highest z-index modal isolation.",
    content: `# Forms & Asynchronous UX

## Modal Viewport Isolation & Highest Z-Index (MANDATORY)
- **Direct Body Portal**: ALL modals, dialogs, drawers, and overlay sheets MUST be portaled directly to \`document.body\` (using \`ReactDOM.createPortal\`) with \`z-[99999]\` (the absolute highest z-index across the application).
- **No Parent Stacking Traps**: Never render modal backdrops inside nested view containers where parent CSS stacking contexts (\`overflow-hidden\`, \`transform\`, \`filter\`, \`backdrop-blur\`) trap and clip the backdrop, leaving sidebars or topbars un-dimmed.
- **Accessibility & Focus Lock**: When open, modals must trap focus strictly inside the window (\`role="dialog"\`, \`aria-modal="true"\`), disable background scrolling (\`document.body.style.overflow = 'hidden'\`), close on \`Escape\`, and completely isolate focus so no background elements can be clicked or tabbed.

## Forms & Mutation States
- **Explicit Loading & Pending Feedback**: Disable submit buttons during pending mutations and display an inline spinner or loading label.
- **Inline Field Validation**: Display validation errors directly adjacent to the relevant input field, connected via \`aria-describedby\`.
- **Keyboard Navigation**: Form inputs must support logical tab progression and submit on \`Enter\` where appropriate.
`,
  },
  {
    id: "seo-and-web-performance",
    filename: "seo-and-web-performance.md",
    title: "SEO & Web Performance Directives",
    description:
      "Strict semantic HTML, Next.js metadata standards, and Core Web Vitals optimization.",
    content: `# SEO & Web Performance Directives

## Semantic HTML & Heading Hierarchy
- **Single H1 per Page**: Every public page must contain exactly one semantic \`<h1>\` tag representing the core document title.
- **Strict Heading Order**: Never skip heading levels (e.g. do not jump from \`<h1>\` directly to \`<h3>\`). Use semantic \`<h2>\` for sections and \`<h3>\` for cards/sub-sections.
- **Accessible Text Contrast**: Ensure text meets WCAG AA standards (minimum 4.5:1 contrast ratio against background surfaces).

## Next.js Metadata & Performance
- **Dynamic Metadata API**: Export typed \`Metadata\` or \`generateMetadata\` functions for all public routes with title, description, openGraph, and canonical URLs.
- **Optimized Media**: Always use Next.js \`<Image />\` or responsive picture elements with defined dimensions to eliminate layout shift (CLS).
`,
  },
  {
    id: "systematic-debugging",
    filename: "systematic-debugging.md",
    title: "Systematic Debugging Protocol",
    description: "Disciplined root-cause isolation and verification before applying code fixes.",
    content: `# Systematic Debugging Protocol

## Troubleshooting Methodology
1. **Reproduce & Isolate**: Replicate the bug with minimal inputs. Identify whether the issue originates in the UI layer, network transport, or backend/data layer.
2. **Inspect the Boundary**: Check API responses, TypeScript error logs, hydration differences, or database constraints before modifying business logic.
3. **Surgical Corrections**: Never apply speculative or randomized code changes. Understand the exact mechanism causing the failure before modifying code.
4. **Zero Comment Deletions**: Never silently remove existing logic or error handlers to bypass a bug.
`,
  },
  {
    id: "git-and-deployment-hygiene",
    filename: "git-and-deployment-hygiene.md",
    title: "Git & Deployment Hygiene",
    description: "Atomic conventional commits, secret protection, and local commit safety.",
    content: `# Git & Deployment Hygiene

## Commit Standards
- **Conventional Commits**: Format all commit messages according to Conventional Commits:
  - \`feat: add user authentication flow\`
  - \`fix: resolve modal z-index stacking trap on mobile\`
  - \`chore: update dependencies and biome config\`
- **Atomic Commits**: Keep commits focused on a single change. Do not bundle unrelated refactoring with feature code.
- **Zero Committed Secrets**: Never commit \`.env\`, \`.env.local\`, private keys, or API tokens. Enforce \`.gitignore\` rules strictly.
- **Local Commits Only**: Automated agent tooling must NEVER run \`git push\` without explicit user permission. Remote pushes are reserved exclusively for developer manual execution.
`,
  },
];

export function generateAgentsMarkdown(skills: SkillDefinition[]): string {
  return `# AGENTS.md - Production Engineering Directives

This project operates under strict enterprise engineering standards. Any AI assistant or developer working on this codebase must adhere to the core directives below.

---

## 1. Non-Negotiable Core Directives

- **Zero AI Visual Slop**: Never use purple/indigo/pink gradients, floating blurred blobs, pill-shaped buttons (\`rounded-full\` on CTAs/inputs), pill/boxed section title badges (\`border bg-emerald-50 rounded-md/full\`), background boxes or borders on icon containers (\`bg-emerald-50 rounded-lg\`), boxed numberings/step badges (\`border bg-white rounded px-2.5 py-1\`), emoji section badges, or heavy shadows (\`shadow-xl\`). Icons must be pure unboxed elements inline with text. Category overlines and step counters must be pure unboxed uppercase typography (\`tracking-widest text-xs\`). Use flat high-contrast surfaces, crisp \`1px\` borders for structural cards only, and \`rounded-md\`/\`rounded-lg\` for interactive elements.
- **Strict Mobile-First CSS**: Unprefixed Tailwind classes MUST target mobile (\`<640px\`). Only add \`sm:\`, \`md:\`, \`lg:\` progressively. Never use fixed pixel widths (\`w-[400px]\`) or \`100vh\` (\`h-screen\`); use \`w-full max-w-*\` and \`min-h-dvh\`.
- **Modal Viewport Isolation, Portal & Highest Z-Index**: ALL modals, dialogs, drawers, and overlay sheets MUST be portaled directly to \`document.body\` (using \`ReactDOM.createPortal\`) with \`z-[99999]\` (the absolute highest z-index across the application). Never render modal backdrops inside nested view containers where parent CSS stacking contexts (\`overflow-hidden\`, \`transform\`, \`filter\`, \`backdrop-blur\`) trap and clip the backdrop, leaving sidebars or topbars un-dimmed. When open, modals must trap focus strictly inside the window (\`role="dialog"\`, \`aria-modal="true"\`), disable background scrolling (\`document.body.style.overflow = 'hidden'\`), close on \`Escape\`, and completely isolate focus so no background elements can be clicked or tabbed.
- **Clean React & TypeScript**: Keep components under 150 lines. Never use \`any\`. Never use \`useEffect\` for derived state or user event actions. Default to Server Components in Next.js.
- **Backend & Database Discipline**: In C#/.NET 8+, NEVER use AutoMapper—always write explicit manual DTO mapping extension methods (\`ToDto()\`), use \`.AsNoTracking()\` for reads, and propagate \`CancellationToken\`. In Supabase/SQL, never use \`select('*')\`, always handle errors, and enforce RLS.
- **Surgical Edits & Zero Lazy Output**: Never output \`// ... existing code ...\` or \`// TODO\` placeholders. Never write obvious narrative comments. Never silently delete existing logic, alter database schemas, or install new packages without explicit permission.
- **Local Commits Only (Never Push to Remote)**: NEVER execute \`git push\` under any circumstances. All Git operations are strictly limited to local staging and commits (\`git add\`, \`git commit\`). Remote pushing is reserved exclusively for the user to review and execute manually.

---

## 2. Active Engineering Skills

${skills.map((s) => `- **\`${s.id}\`**: ${s.description} (Read full instructions in \`.agent/skills/${s.filename}\`)`).join("\n")}

---

*Generated by [create-forge](https://github.com/developer/create-forge)*
`;
}
