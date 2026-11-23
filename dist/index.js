#!/usr/bin/env node

// src/index.ts
import path3 from "path";
import * as p3 from "@clack/prompts";
import { Command } from "commander";
import pc4 from "picocolors";

// src/generator/engine.ts
import path from "path";
import { fileURLToPath } from "url";
import * as p from "@clack/prompts";
import { execa as execa2 } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

// src/utils/package-manager.ts
import { execSync } from "child_process";
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("yarn")) return "yarn";
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return "pnpm";
  } catch {
  }
  try {
    execSync("bun --version", { stdio: "ignore" });
    return "bun";
  } catch {
  }
  return "npm";
}
function getInstallCommand(pm) {
  switch (pm) {
    case "pnpm":
      return "pnpm install";
    case "bun":
      return "bun install";
    case "yarn":
      return "yarn";
    default:
      return "npm install";
  }
}
function getRunCommand(pm, script) {
  switch (pm) {
    case "pnpm":
      return `pnpm ${script}`;
    case "bun":
      return `bun ${script}`;
    case "yarn":
      return `yarn ${script}`;
    default:
      return `npm run ${script}`;
  }
}

// src/generator/git.ts
import { execa } from "execa";
async function initializeGitRepository(projectPath) {
  try {
    await execa("git", ["init"], { cwd: projectPath });
    await execa("git", ["add", "-A"], { cwd: projectPath });
    await execa(
      "git",
      [
        "commit",
        "-m",
        "chore: initialize project via create-forge with production engineering standards"
      ],
      { cwd: projectPath }
    );
    return true;
  } catch (error) {
    return false;
  }
}

// src/generator/skills-content.ts
var CORE_SKILLS = [
  {
    id: "anti-slop-ui-design",
    filename: "anti-slop-ui-design.md",
    title: "Anti-Slop UI Design Directive",
    description: "Strict visual design standards forbidding generic AI gradients, boxed icons, and visual noise.",
    content: `# Anti-Slop UI Design Directive

## Non-Negotiable Visual Standards
- **Zero AI Gradients**: Never use purple-to-indigo, pink, or multi-stop pastel gradients on backgrounds, headers, or text. Use solid, high-contrast, purposeful color surfaces.
- **No Floating Blurred Blobs**: Forbid ambient radial gradient background blur circles (\`blur-3xl\`, \`bg-purple-500/20\`). They degrade text contrast and look unpolished.
- **Pure Unboxed Icons**: Icons (Lucide or SVG) must never sit inside a boxed background container (e.g. \`bg-emerald-50 rounded-lg p-2\`). Icons must be pure elements inline with text, aligned using flexbox.
- **No Pill Badges for Section Titles**: Category overlines and section headers must never be pill badges (\`border bg-emerald-50 rounded-full px-3 py-1\`). Use crisp uppercase typography: \`text-xs font-semibold uppercase tracking-widest text-zinc-500\`.
- **No Boxed Step Numbers**: Never wrap step counters or numbers inside boxed badges (\`border bg-white rounded px-2.5 py-1\`). Render numbers as pure typographic elements.
- **Subtle Surface Elevation**: Replace heavy drop shadows (\`shadow-xl\`, \`shadow-2xl\`) with crisp 1px borders (\`border border-zinc-200 dark:border-zinc-800\`) and minimal elevation (\`shadow-sm\`).
- **Interactive Radius Consistency**: Interactive elements (buttons, inputs) must use \`rounded-md\` or \`rounded-lg\`. Never use full pill buttons (\`rounded-full\`) for primary call-to-actions.
`
  },
  {
    id: "mobile-first-css-layout",
    filename: "mobile-first-css-layout.md",
    title: "Mobile-First CSS & Layout Architecture",
    description: "Responsive layout rules enforcing true mobile-first Tailwind design and dynamic viewport heights.",
    content: `# Mobile-First CSS & Layout Architecture

## Layout & Responsive Rules
- **Strict Mobile-First Breakpoints**: Unprefixed Tailwind classes MUST target mobile devices (<640px). Only introduce \`sm:\`, \`md:\`, \`lg:\`, and \`xl:\` modifiers progressively for wider viewports.
- **Dynamic Viewport Heights**: Never use fixed \`h-screen\` or \`100vh\` on mobile containers, as mobile browser address bars collapse and cause overflow jitter. Always use \`min-h-dvh\` or \`h-dvh\`.
- **Fluid Containers**: Never set fixed pixel widths on parent containers (e.g. \`w-[400px]\` or \`w-[800px]\`). Use fluid constraints: \`w-full max-w-lg mx-auto\`.
- **Touch-Friendly Tap Targets**: Ensure interactive targets (buttons, links, form inputs) are at least 44x44px on mobile screens with appropriate touch padding.
- **Horizontal Overflow Prevention**: Ensure no tables, wide images, or code blocks trigger unintended horizontal page scrolling. Use \`overflow-x-auto\` strictly scoped to child containers.
`
  },
  {
    id: "clean-react-architecture",
    filename: "clean-react-architecture.md",
    title: "Clean React Architecture & Strict TypeScript",
    description: "Component modularity, type safety, and elimination of useEffect misuse in modern React.",
    content: `# Clean React Architecture & Strict TypeScript

## Core Rules
- **Sub-150-Line Components**: Keep components modular, focused, and under 150 lines. Split complex components into cohesive child subcomponents and custom hooks.
- **Zero Any Policy**: Never use \`any\`. Use strict TypeScript interfaces, type unions, generics, or \`unknown\` with type guards.
- **Zero useEffect for Derived State**: Compute derived state during render or with \`useMemo\`. Never sync props to state or compute totals inside \`useEffect\`.
- **Zero useEffect for User Event Actions**: Trigger side effects (API mutations, navigation, toast notifications) inside event handlers, not reactively inside \`useEffect\`.
- **Default to Server Components (Next.js)**: Keep data fetching and static markup in React Server Components. Only add \`'use client'\` at the boundary where browser interactivity or state is required.
`
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
`
  },
  {
    id: "forms-and-async-ux",
    filename: "forms-and-async-ux.md",
    title: "Forms & Asynchronous UX",
    description: "Accessible forms, mutation states, optimistic updates, and highest z-index modal isolation.",
    content: `# Forms & Asynchronous UX

## Modal Viewport Isolation & Highest Z-Index (MANDATORY)
- **Direct Body Portal**: ALL modals, dialogs, drawers, and overlay sheets MUST be portaled directly to \`document.body\` (using \`ReactDOM.createPortal\`) with \`z-[99999]\` (the absolute highest z-index across the application).
- **No Parent Stacking Traps**: Never render modal backdrops inside nested view containers where parent CSS stacking contexts (\`overflow-hidden\`, \`transform\`, \`filter\`, \`backdrop-blur\`) trap and clip the backdrop, leaving sidebars or topbars un-dimmed.
- **Accessibility & Focus Lock**: When open, modals must trap focus strictly inside the window (\`role="dialog"\`, \`aria-modal="true"\`), disable background scrolling (\`document.body.style.overflow = 'hidden'\`), close on \`Escape\`, and completely isolate focus so no background elements can be clicked or tabbed.

## Forms & Mutation States
- **Explicit Loading & Pending Feedback**: Disable submit buttons during pending mutations and display an inline spinner or loading label.
- **Inline Field Validation**: Display validation errors directly adjacent to the relevant input field, connected via \`aria-describedby\`.
- **Keyboard Navigation**: Form inputs must support logical tab progression and submit on \`Enter\` where appropriate.
`
  },
  {
    id: "seo-and-web-performance",
    filename: "seo-and-web-performance.md",
    title: "SEO & Web Performance Directives",
    description: "Strict semantic HTML, Next.js metadata standards, and Core Web Vitals optimization.",
    content: `# SEO & Web Performance Directives

## Semantic HTML & Heading Hierarchy
- **Single H1 per Page**: Every public page must contain exactly one semantic \`<h1>\` tag representing the core document title.
- **Strict Heading Order**: Never skip heading levels (e.g. do not jump from \`<h1>\` directly to \`<h3>\`). Use semantic \`<h2>\` for sections and \`<h3>\` for cards/sub-sections.
- **Accessible Text Contrast**: Ensure text meets WCAG AA standards (minimum 4.5:1 contrast ratio against background surfaces).

## Next.js Metadata & Performance
- **Dynamic Metadata API**: Export typed \`Metadata\` or \`generateMetadata\` functions for all public routes with title, description, openGraph, and canonical URLs.
- **Optimized Media**: Always use Next.js \`<Image />\` or responsive picture elements with defined dimensions to eliminate layout shift (CLS).
`
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
`
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
`
  }
];
function generateAgentsMarkdown(skills) {
  return `# AGENTS.md - Production Engineering Directives

This project operates under strict enterprise engineering standards. Any AI assistant or developer working on this codebase must adhere to the core directives below.

---

## 1. Non-Negotiable Core Directives

- **Zero AI Visual Slop**: Never use purple/indigo/pink gradients, floating blurred blobs, pill-shaped buttons (\`rounded-full\` on CTAs/inputs), pill/boxed section title badges (\`border bg-emerald-50 rounded-md/full\`), background boxes or borders on icon containers (\`bg-emerald-50 rounded-lg\`), boxed numberings/step badges (\`border bg-white rounded px-2.5 py-1\`), emoji section badges, or heavy shadows (\`shadow-xl\`). Icons must be pure unboxed elements inline with text. Category overlines and step counters must be pure unboxed uppercase typography (\`tracking-widest text-xs\`). Use flat high-contrast surfaces, crisp \`1px\` borders for structural cards only, and \`rounded-md\`/\`rounded-lg\` for interactive elements.
- **Strict Mobile-First CSS**: Unprefixed Tailwind classes MUST target mobile (\`<640px\`). Only add \`sm:\`, \`md:\`, \`lg:\` progressively. Never use fixed pixel widths (\`w-[400px]\`) or \`100vh\` (\`h-screen\`); use \`w-full max-w-*\` and \`min-h-dvh\`.
- **Modal Viewport Isolation, Portal & Highest Z-Index**: ALL modals, dialogs, drawers, and overlay sheets MUST be portaled directly to \`document.body\` (using \`ReactDOM.createPortal\`) with \`z-[99999]\` (the absolute highest z-index across the application). Never render modal backdrops inside nested view containers where parent CSS stacking contexts (\`overflow-hidden\`, \`transform\`, \`filter\`, \`backdrop-blur\`) trap and clip the backdrop, leaving sidebars or topbars un-dimmed. When open, modals must trap focus strictly inside the window (\`role="dialog"\`, \`aria-modal="true"\`), disable background scrolling (\`document.body.style.overflow = 'hidden'\`), close on \`Escape\`, and completely isolate focus so no background elements can be clicked or tabbed.
- **Clean React & TypeScript**: Keep components under 150 lines. Never use \`any\`. Never use \`useEffect\` for derived state or user event actions. Default to Server Components in Next.js.
- **Backend & Database Discipline**: In C#/.NET 8+, NEVER use AutoMapper\u2014always write explicit manual DTO mapping extension methods (\`ToDto()\`), use \`.AsNoTracking()\` for reads, and propagate \`CancellationToken\`. In Supabase/SQL, never use \`select('*')\`, always handle errors, and enforce RLS.
- **Surgical Edits & Zero Lazy Output**: Never output \`// ... existing code ...\` or \`// TODO\` placeholders. Never write obvious narrative comments. Never silently delete existing logic, alter database schemas, or install new packages without explicit permission.
- **Local Commits Only (Never Push to Remote)**: NEVER execute \`git push\` under any circumstances. All Git operations are strictly limited to local staging and commits (\`git add\`, \`git commit\`). Remote pushing is reserved exclusively for the user to review and execute manually.

---

## 2. Active Engineering Skills

${skills.map((s) => `- **\`${s.id}\`**: ${s.description} (Read full instructions in \`.agent/skills/${s.filename}\`)`).join("\n")}

---

*Generated by [create-forge](https://github.com/developer/create-forge)*
`;
}

// src/generator/engine.ts
var __filename2 = fileURLToPath(import.meta.url);
var __dirname2 = path.dirname(__filename2);
async function forgeProject(config) {
  const s = p.spinner();
  s.start(`Forging project directory at ${pc.cyan(config.projectName)}...`);
  await fs.ensureDir(config.projectPath);
  const candidateRoots = [
    path.resolve(__dirname2, "../templates", config.stack),
    path.resolve(__dirname2, "./templates", config.stack),
    path.resolve(__dirname2, "../../templates", config.stack)
  ];
  const templatesRoot = candidateRoots.find((dir) => fs.existsSync(dir));
  if (!templatesRoot) {
    throw new Error(
      `Template for stack "${config.stack}" not found. Searched: ${candidateRoots.join(", ")}`
    );
  }
  await fs.copy(templatesRoot, config.projectPath, {
    overwrite: true,
    filter: (src) => !src.includes("node_modules") && !src.includes(".next") && !src.includes("dist")
  });
  s.stop(pc.green("\u2714 Base architecture template copied."));
  s.start("Configuring dependencies, scripts and tooling...");
  await customizePackageJson(config);
  await customizeTooling(config);
  s.stop(pc.green("\u2714 Tooling & linter configuration synchronized."));
  s.start("Injecting production engineering guardrails & skills...");
  await injectSkills(config);
  s.stop(pc.green("\u2714 Injected 8 core skills, AGENTS.md, and AI rules."));
  await injectCiWorkflow(config);
  if (config.installDeps) {
    s.start(
      `Installing dependencies with ${pc.cyan(config.packageManager)} (this may take a moment)...`
    );
    try {
      if (config.stack === "fullstack-dotnet") {
        const clientDir = path.join(config.projectPath, "src", "Client");
        if (fs.existsSync(clientDir)) {
          const [cmd, ...args] = getInstallCommand(config.packageManager).split(" ");
          await execa2(cmd, args, { cwd: clientDir, stdio: "ignore" });
        }
      } else {
        const [cmd, ...args] = getInstallCommand(config.packageManager).split(" ");
        await execa2(cmd, args, { cwd: config.projectPath, stdio: "ignore" });
      }
      s.stop(pc.green("\u2714 Dependencies installed successfully."));
    } catch (err) {
      s.stop(
        pc.yellow("\u26A0 Dependency installation encountered an issue; you can run install manually.")
      );
    }
  }
  if (config.initGit) {
    s.start("Initializing Git repository with atomic commit...");
    const gitSuccess = await initializeGitRepository(config.projectPath);
    if (gitSuccess) {
      s.stop(pc.green("\u2714 Initialized local Git repository (atomic commit created)."));
    } else {
      s.stop(
        pc.yellow("\u26A0 Git repository initialized, but commit skipped (check git config user.name).")
      );
    }
  }
}
async function customizePackageJson(config) {
  const pkgPaths = [
    path.join(config.projectPath, "package.json"),
    path.join(config.projectPath, "src", "Client", "package.json")
  ];
  for (const pkgPath of pkgPaths) {
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = config.projectName;
      if (config.database === "supabase") {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies["@supabase/supabase-js"] = "^2.49.1";
      }
      if (config.linter === "biome") {
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies["@biomejs/biome"] = "^1.9.4";
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.lint = "biome lint .";
        pkg.scripts.format = "biome format --write .";
        pkg.scripts.check = "biome check .";
      } else {
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies.eslint = "^9.20.0";
        pkg.devDependencies.prettier = "^3.5.0";
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.lint = "eslint .";
        pkg.scripts.format = "prettier --write .";
      }
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }
  }
}
async function customizeTooling(config) {
  if (config.linter === "biome") {
    const biomeConfig = {
      $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
      vcs: {
        enabled: true,
        clientKind: "git",
        useIgnoreFile: true
      },
      files: {
        ignoreUnknown: false,
        ignore: ["node_modules/**", ".next/**", "dist/**", "bin/**", "obj/**"]
      },
      formatter: {
        enabled: true,
        indentStyle: "space",
        indentWidth: 2,
        lineWidth: 100
      },
      linter: {
        enabled: true,
        rules: {
          recommended: true
        }
      },
      javascript: {
        formatter: {
          quoteStyle: "double",
          semicolons: "always"
        }
      }
    };
    await fs.writeJson(path.join(config.projectPath, "biome.json"), biomeConfig, { spaces: 2 });
  }
  const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
dist/
out/
build/
bin/
obj/

# Environment files
.env
.env*.local
!.env.example

# Debug and editor
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
`;
  await fs.writeFile(path.join(config.projectPath, ".gitignore"), gitignoreContent, "utf-8");
  const envExample = `# Project Environment Variables
${config.database === "supabase" ? "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n" : ""}PORT=3000
NODE_ENV=development
`;
  await fs.writeFile(path.join(config.projectPath, ".env.example"), envExample, "utf-8");
}
async function injectSkills(config) {
  const skillsDir = path.join(config.projectPath, ".agent", "skills");
  await fs.ensureDir(skillsDir);
  const selectedSkills = CORE_SKILLS.filter((s) => config.skills.includes(s.id));
  for (const skill of selectedSkills) {
    const skillPath = path.join(skillsDir, skill.filename);
    await fs.writeFile(skillPath, skill.content, "utf-8");
  }
  const agentsMd = generateAgentsMarkdown(selectedSkills);
  await fs.writeFile(path.join(config.projectPath, "AGENTS.md"), agentsMd, "utf-8");
  const cursorRules = `# Cursor AI Rules & Directives
See AGENTS.md for full production directives.

- Anti-Slop UI: Never use purple gradients, floating blurred blobs, pill buttons, boxed icons, or boxed step counters.
- Mobile-First CSS: Unprefixed Tailwind targets mobile (<640px). Use min-h-dvh and w-full max-w-*.
- Modals: Always portal to document.body with z-[99999].
- Clean React: Sub-150-line components, no 'any', zero useEffect for derived state or user actions.
- Backend: In .NET, NEVER use AutoMapper\u2014use explicit ToDto() extensions and .AsNoTracking(). In Supabase, never select('*').
`;
  await fs.writeFile(path.join(config.projectPath, ".cursorrules"), cursorRules, "utf-8");
  const claudeMd = `# Claude Code Directives
See AGENTS.md for full production directives.

- Follow strict Conventional Commits.
- Never push to remote git repositories automatically.
- Adhere to the 8 core engineering skills in .agent/skills/.
`;
  await fs.writeFile(path.join(config.projectPath, "CLAUDE.md"), claudeMd, "utf-8");
}
async function injectCiWorkflow(config) {
  const workflowDir = path.join(config.projectPath, ".github", "workflows");
  await fs.ensureDir(workflowDir);
  const ciYaml = `name: Production CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: '${config.packageManager === "npm" ? "npm" : "npm"}'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter & Formatter Check
        run: ${config.linter === "biome" ? "npx @biomejs/biome check ." : "npm run lint"}

      - name: Validate Build
        run: npm run build
`;
  await fs.writeFile(path.join(workflowDir, "ci.yml"), ciYaml, "utf-8");
}

// src/prompts/wizard.ts
import path2 from "path";
import * as p2 from "@clack/prompts";
import pc2 from "picocolors";

// src/utils/validator.ts
import fs2 from "fs-extra";
function validateProjectName(name) {
  if (!name || name.trim().length === 0) {
    return "Project name cannot be empty.";
  }
  const trimmed = name.trim();
  if (!/^[a-zA-Z0-9-_]+$/.test(trimmed)) {
    return "Project name can only contain alphanumeric characters, hyphens, and underscores.";
  }
  return void 0;
}
function checkTargetDirectory(targetDir) {
  if (!fs2.existsSync(targetDir)) {
    return { exists: false, isEmpty: true };
  }
  const files = fs2.readdirSync(targetDir);
  return {
    exists: true,
    isEmpty: files.length === 0 || files.length === 1 && files[0] === ".git"
  };
}

// src/prompts/wizard.ts
async function runWizard(targetDirArg, options = {}) {
  p2.intro(`${pc2.bgCyan(pc2.black(" CREATE FORGE "))} ${pc2.dim("Production App Scaffolder")}`);
  let projectName = targetDirArg;
  if (!projectName) {
    const namePrompt = await p2.text({
      message: "What is your project named?",
      placeholder: "my-app",
      defaultValue: "my-app",
      validate: (value) => validateProjectName(value)
    });
    if (p2.isCancel(namePrompt)) {
      p2.cancel("Operation cancelled.");
      return null;
    }
    projectName = namePrompt;
  }
  const projectPath = path2.resolve(process.cwd(), projectName);
  const dirStatus = checkTargetDirectory(projectPath);
  if (dirStatus.exists && !dirStatus.isEmpty) {
    const overwrite = await p2.confirm({
      message: `Directory "${pc2.yellow(projectName)}" is not empty. Continue and overwrite existing files?`,
      initialValue: false
    });
    if (p2.isCancel(overwrite) || !overwrite) {
      p2.cancel("Operation cancelled to protect existing files.");
      return null;
    }
  }
  let stack = options.stack;
  if (!stack) {
    const stackPrompt = await p2.select({
      message: "Select an architecture stack:",
      options: [
        {
          value: "next",
          label: "Next.js 15 (App Router)",
          hint: "React 19, Server Components, TypeScript, strict anti-slop Tailwind"
        },
        {
          value: "vite-react",
          label: "Vite + React",
          hint: "Ultra-fast SPA, lightweight responsive layout, mobile/Capacitor-ready"
        },
        {
          value: "fullstack-dotnet",
          label: "Full-Stack .NET 10 + React",
          hint: "Clean Architecture C# Web API (Manual DTOs, .AsNoTracking) + React UI"
        },
        {
          value: "astro",
          label: "Astro",
          hint: "Content-first, zero-runtime JS baseline, optimal Core Web Vitals"
        }
      ],
      initialValue: "next"
    });
    if (p2.isCancel(stackPrompt)) {
      p2.cancel("Operation cancelled.");
      return null;
    }
    stack = stackPrompt;
  }
  let linter = options.linter;
  if (!linter) {
    const linterPrompt = await p2.select({
      message: "Select linter & code formatter:",
      options: [
        {
          value: "biome",
          label: "Biome (Recommended)",
          hint: "Blazing fast single-tool linter & formatter in Rust"
        },
        {
          value: "eslint",
          label: "ESLint 9 + Prettier",
          hint: "Classic ecosystem tooling with flat config"
        }
      ],
      initialValue: "biome"
    });
    if (p2.isCancel(linterPrompt)) {
      p2.cancel("Operation cancelled.");
      return null;
    }
    linter = linterPrompt;
  }
  let database = options.database;
  if (!database) {
    const dbPrompt = await p2.select({
      message: "Select database / backend preset:",
      options: [
        {
          value: "supabase",
          label: "Supabase",
          hint: "TypeScript client, RLS policy templates, strict error handling"
        },
        {
          value: "none",
          label: "None / Custom Backend",
          hint: "Independent API layer or standalone client application"
        }
      ],
      initialValue: "supabase"
    });
    if (p2.isCancel(dbPrompt)) {
      p2.cancel("Operation cancelled.");
      return null;
    }
    database = dbPrompt;
  }
  const skillPrompt = await p2.multiselect({
    message: "Select AI engineering skills to bake into project:",
    options: CORE_SKILLS.map((skill) => ({
      value: skill.id,
      label: skill.title,
      hint: skill.description
    })),
    initialValues: CORE_SKILLS.map((skill) => skill.id),
    required: true
  });
  if (p2.isCancel(skillPrompt)) {
    p2.cancel("Operation cancelled.");
    return null;
  }
  const skills = skillPrompt;
  let initGit = options.git;
  if (initGit === void 0) {
    const gitPrompt = await p2.confirm({
      message: "Initialize a local Git repository with atomic commit?",
      initialValue: true
    });
    if (p2.isCancel(gitPrompt)) {
      p2.cancel("Operation cancelled.");
      return null;
    }
    initGit = gitPrompt;
  }
  const pm = detectPackageManager();
  let installDeps = options.install;
  if (installDeps === void 0) {
    const installPrompt = await p2.confirm({
      message: `Install dependencies automatically with ${pc2.cyan(pm)}?`,
      initialValue: true
    });
    if (p2.isCancel(installPrompt)) {
      p2.cancel("Operation cancelled.");
      return null;
    }
    installDeps = installPrompt;
  }
  return {
    projectName,
    projectPath,
    stack,
    linter,
    database,
    skills,
    initGit,
    installDeps,
    packageManager: pm
  };
}

// src/utils/banner.ts
import pc3 from "picocolors";
function printBanner(version = "1.0.0") {
  const line = pc3.dim("\u2500".repeat(56));
  console.log();
  console.log(line);
  console.log(
    `  ${pc3.bold(pc3.white("CREATE FORGE"))} ${pc3.dim(`v${version}`)}  ${pc3.cyan("\u2022")}  ${pc3.dim("Production Architecture CLI")}`
  );
  console.log(`  ${pc3.dim("Strict engineering standards, anti-slop UI & AI guardrails")}`);
  console.log(line);
  console.log();
}

// src/index.ts
var VERSION = "1.0.0";
async function main() {
  const program = new Command();
  program.name("create-forge").description("Scaffold modern apps with strict production engineering standards & AI skills").version(VERSION, "-v, --version", "Output the current version").argument("[project-directory]", "Directory to create the project in").option("-s, --stack <type>", "Stack type: next, vite-react, fullstack-dotnet, astro").option("-l, --linter <type>", "Linter type: biome, eslint").option("-d, --database <type>", "Database preset: supabase, none").option("-g, --git", "Initialize git repository").option("--no-git", "Do not initialize git repository").option("-i, --install", "Install dependencies").option("--no-install", "Do not install dependencies").option("-y, --yes", "Skip interactive prompts and use defaults").parse(process.argv);
  const [targetDir] = program.args;
  const opts = program.opts();
  printBanner(VERSION);
  let config = null;
  if (opts.yes) {
    const rawTarget = targetDir || "my-app";
    const projectPath = path3.resolve(process.cwd(), rawTarget);
    const projectName = path3.basename(projectPath);
    config = {
      projectName,
      projectPath,
      stack: opts.stack || "next",
      linter: opts.linter || "biome",
      database: opts.database || "supabase",
      skills: CORE_SKILLS.map((s) => s.id),
      initGit: opts.git !== false,
      installDeps: opts.install !== false,
      packageManager: "npm"
    };
  } else {
    config = await runWizard(targetDir, opts);
  }
  if (!config) {
    process.exit(0);
  }
  try {
    await forgeProject(config);
    p3.note(
      `${pc4.dim("Stack:")}    ${pc4.cyan(config.stack)}
${pc4.dim("Linter:")}   ${pc4.cyan(config.linter)}
${pc4.dim("Database:")} ${pc4.cyan(config.database)}
${pc4.dim("Skills:")}   ${pc4.cyan(`${config.skills.length} core skills injected (.agent/skills)`)}`,
      "Configuration Summary"
    );
    const devCmd = getRunCommand(config.packageManager, "dev");
    const installReminder = config.installDeps ? "" : `
  ${pc4.cyan(`${config.packageManager} install`)}`;
    p3.outro(
      `${pc4.bold(pc4.green("\u2714 Project forged successfully!"))}${pc4.dim("\n\nNext steps:")}
  ${pc4.cyan(`cd ${config.projectName}`)}${installReminder}
  ${pc4.cyan(devCmd)}
`
    );
  } catch (error) {
    p3.cancel(pc4.red(`Failed to forge project: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
