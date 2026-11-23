import path from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../types.js";
import { getInstallCommand } from "../utils/package-manager.js";
import { initializeGitRepository } from "./git.ts";
import { CORE_SKILLS, generateAgentsMarkdown } from "./skills-content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function forgeProject(config: ProjectConfig): Promise<void> {
  const s = p.spinner();

  // 1. Create target directory
  s.start(`Forging project directory at ${pc.cyan(config.projectName)}...`);
  await fs.ensureDir(config.projectPath);

  // 2. Determine templates root
  // When running bundled from dist/ or tsx src/
  const candidateRoots = [
    path.resolve(__dirname, "../templates", config.stack),
    path.resolve(__dirname, "./templates", config.stack),
    path.resolve(__dirname, "../../templates", config.stack),
  ];
  const templatesRoot = candidateRoots.find((dir) => fs.existsSync(dir));

  if (!templatesRoot) {
    throw new Error(
      `Template for stack "${config.stack}" not found. Searched: ${candidateRoots.join(", ")}`,
    );
  }

  await fs.copy(templatesRoot, config.projectPath, {
    overwrite: true,
    filter: (src) =>
      !src.includes("node_modules") && !src.includes(".next") && !src.includes("dist"),
  });
  s.stop(pc.green("✔ Base architecture template copied."));

  // 3. Customize package.json (if exists in root or client)
  s.start("Configuring dependencies, scripts and tooling...");
  await customizePackageJson(config);
  await customizeTooling(config);
  s.stop(pc.green("✔ Tooling & linter configuration synchronized."));

  // 4. Inject 8 Core Engineering Skills & AGENTS.md
  s.start("Injecting production engineering guardrails & skills...");
  await injectSkills(config);
  s.stop(pc.green("✔ Injected 8 core skills, AGENTS.md, and AI rules."));

  // 5. Setup CI Workflow
  await injectCiWorkflow(config);

  // 6. Install dependencies if requested
  if (config.installDeps) {
    s.start(
      `Installing dependencies with ${pc.cyan(config.packageManager)} (this may take a moment)...`,
    );
    try {
      if (config.stack === "fullstack-dotnet") {
        // Install in client directory if fullstack
        const clientDir = path.join(config.projectPath, "src", "Client");
        if (fs.existsSync(clientDir)) {
          const [cmd, ...args] = getInstallCommand(config.packageManager).split(" ");
          await execa(cmd, args, { cwd: clientDir, stdio: "ignore" });
        }
      } else {
        const [cmd, ...args] = getInstallCommand(config.packageManager).split(" ");
        await execa(cmd, args, { cwd: config.projectPath, stdio: "ignore" });
      }
      s.stop(pc.green("✔ Dependencies installed successfully."));
    } catch (err) {
      s.stop(
        pc.yellow("⚠ Dependency installation encountered an issue; you can run install manually."),
      );
    }
  }

  // 7. Initialize Git repository
  if (config.initGit) {
    s.start("Initializing Git repository with atomic commit...");
    const gitSuccess = await initializeGitRepository(config.projectPath);
    if (gitSuccess) {
      s.stop(pc.green("✔ Initialized local Git repository (atomic commit created)."));
    } else {
      s.stop(
        pc.yellow("⚠ Git repository initialized, but commit skipped (check git config user.name)."),
      );
    }
  }
}

async function customizePackageJson(config: ProjectConfig): Promise<void> {
  const pkgPaths = [
    path.join(config.projectPath, "package.json"),
    path.join(config.projectPath, "src", "Client", "package.json"),
  ];

  for (const pkgPath of pkgPaths) {
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = config.projectName;

      // Adjust Supabase
      if (config.database === "supabase") {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies["@supabase/supabase-js"] = "^2.49.1";
      }

      // Adjust Linter scripts
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

async function customizeTooling(config: ProjectConfig): Promise<void> {
  // If Biome selected, write biome.json
  if (config.linter === "biome") {
    const biomeConfig = {
      $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
      vcs: {
        enabled: true,
        clientKind: "git",
        useIgnoreFile: true,
      },
      files: {
        ignoreUnknown: false,
        ignore: ["node_modules/**", ".next/**", "dist/**", "bin/**", "obj/**"],
      },
      formatter: {
        enabled: true,
        indentStyle: "space",
        indentWidth: 2,
        lineWidth: 100,
      },
      linter: {
        enabled: true,
        rules: {
          recommended: true,
        },
      },
      javascript: {
        formatter: {
          quoteStyle: "double",
          semicolons: "always",
        },
      },
    };
    await fs.writeJson(path.join(config.projectPath, "biome.json"), biomeConfig, { spaces: 2 });
  }

  // Write .gitignore
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

  // Write .env.example
  const envExample = `# Project Environment Variables
${config.database === "supabase" ? "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n" : ""}PORT=3000
NODE_ENV=development
`;
  await fs.writeFile(path.join(config.projectPath, ".env.example"), envExample, "utf-8");
}

async function injectSkills(config: ProjectConfig): Promise<void> {
  const skillsDir = path.join(config.projectPath, ".agent", "skills");
  await fs.ensureDir(skillsDir);

  const selectedSkills = CORE_SKILLS.filter((s) => config.skills.includes(s.id));

  // 1. Write individual skill files
  for (const skill of selectedSkills) {
    const skillPath = path.join(skillsDir, skill.filename);
    await fs.writeFile(skillPath, skill.content, "utf-8");
  }

  // 2. Write AGENTS.md
  const agentsMd = generateAgentsMarkdown(selectedSkills);
  await fs.writeFile(path.join(config.projectPath, "AGENTS.md"), agentsMd, "utf-8");

  // 3. Write .cursorrules
  const cursorRules = `# Cursor AI Rules & Directives
See AGENTS.md for full production directives.

- Anti-Slop UI: Never use purple gradients, floating blurred blobs, pill buttons, boxed icons, or boxed step counters.
- Mobile-First CSS: Unprefixed Tailwind targets mobile (<640px). Use min-h-dvh and w-full max-w-*.
- Modals: Always portal to document.body with z-[99999].
- Clean React: Sub-150-line components, no 'any', zero useEffect for derived state or user actions.
- Backend: In .NET, NEVER use AutoMapper—use explicit ToDto() extensions and .AsNoTracking(). In Supabase, never select('*').
`;
  await fs.writeFile(path.join(config.projectPath, ".cursorrules"), cursorRules, "utf-8");

  // 4. Write CLAUDE.md
  const claudeMd = `# Claude Code Directives
See AGENTS.md for full production directives.

- Follow strict Conventional Commits.
- Never push to remote git repositories automatically.
- Adhere to the 8 core engineering skills in .agent/skills/.
`;
  await fs.writeFile(path.join(config.projectPath, "CLAUDE.md"), claudeMd, "utf-8");
}

async function injectCiWorkflow(config: ProjectConfig): Promise<void> {
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
