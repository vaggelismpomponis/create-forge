import path from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { CORE_SKILLS } from "../generator/skills-content.js";
import type {
  CliOptions,
  DatabaseType,
  LinterType,
  ProjectConfig,
  SkillType,
  StackType,
} from "../types.js";
import { detectPackageManager } from "../utils/package-manager.js";
import { checkTargetDirectory, validateProjectName } from "../utils/validator.js";

export async function runWizard(
  targetDirArg?: string,
  options: CliOptions = {},
): Promise<ProjectConfig | null> {
  p.intro(`${pc.bgCyan(pc.black(" CREATE FORGE "))} ${pc.dim("Production App Scaffolder")}`);

  // 1. Project Name / Target Directory
  let projectName = targetDirArg;
  if (!projectName) {
    const namePrompt = await p.text({
      message: "What is your project named?",
      placeholder: "my-app",
      defaultValue: "my-app",
      validate: (value) => validateProjectName(value),
    });

    if (p.isCancel(namePrompt)) {
      p.cancel("Operation cancelled.");
      return null;
    }
    projectName = namePrompt as string;
  }

  const projectPath = path.resolve(process.cwd(), projectName);
  const dirStatus = checkTargetDirectory(projectPath);

  if (dirStatus.exists && !dirStatus.isEmpty) {
    const overwrite = await p.confirm({
      message: `Directory "${pc.yellow(projectName)}" is not empty. Continue and overwrite existing files?`,
      initialValue: false,
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("Operation cancelled to protect existing files.");
      return null;
    }
  }

  // 2. Stack Selection
  let stack = options.stack;
  if (!stack) {
    const stackPrompt = await p.select({
      message: "Select an architecture stack:",
      options: [
        {
          value: "next",
          label: "Next.js 15 (App Router)",
          hint: "React 19, Server Components, TypeScript, strict anti-slop Tailwind",
        },
        {
          value: "vite-react",
          label: "Vite + React",
          hint: "Ultra-fast SPA, lightweight responsive layout, mobile/Capacitor-ready",
        },
        {
          value: "fullstack-dotnet",
          label: "Full-Stack .NET 10 + React",
          hint: "Clean Architecture C# Web API (Manual DTOs, .AsNoTracking) + React UI",
        },
        {
          value: "astro",
          label: "Astro",
          hint: "Content-first, zero-runtime JS baseline, optimal Core Web Vitals",
        },
      ],
      initialValue: "next",
    });

    if (p.isCancel(stackPrompt)) {
      p.cancel("Operation cancelled.");
      return null;
    }
    stack = stackPrompt as StackType;
  }

  // 3. Linter / Formatter
  let linter = options.linter;
  if (!linter) {
    const linterPrompt = await p.select({
      message: "Select linter & code formatter:",
      options: [
        {
          value: "biome",
          label: "Biome (Recommended)",
          hint: "Blazing fast single-tool linter & formatter in Rust",
        },
        {
          value: "eslint",
          label: "ESLint 9 + Prettier",
          hint: "Classic ecosystem tooling with flat config",
        },
      ],
      initialValue: "biome",
    });

    if (p.isCancel(linterPrompt)) {
      p.cancel("Operation cancelled.");
      return null;
    }
    linter = linterPrompt as LinterType;
  }

  // 4. Database / Backend preset
  let database = options.database;
  if (!database) {
    const dbPrompt = await p.select({
      message: "Select database / backend preset:",
      options: [
        {
          value: "supabase",
          label: "Supabase",
          hint: "TypeScript client, RLS policy templates, strict error handling",
        },
        {
          value: "none",
          label: "None / Custom Backend",
          hint: "Independent API layer or standalone client application",
        },
      ],
      initialValue: "supabase",
    });

    if (p.isCancel(dbPrompt)) {
      p.cancel("Operation cancelled.");
      return null;
    }
    database = dbPrompt as DatabaseType;
  }

  // 5. Engineering Skills & Guardrails
  const skillPrompt = await p.multiselect({
    message: "Select AI engineering skills to bake into project:",
    options: CORE_SKILLS.map((skill) => ({
      value: skill.id,
      label: skill.title,
      hint: skill.description,
    })),
    initialValues: CORE_SKILLS.map((skill) => skill.id),
    required: true,
  });

  if (p.isCancel(skillPrompt)) {
    p.cancel("Operation cancelled.");
    return null;
  }
  const skills = skillPrompt as SkillType[];

  // 6. Git Init
  let initGit = options.git;
  if (initGit === undefined) {
    const gitPrompt = await p.confirm({
      message: "Initialize a local Git repository with atomic commit?",
      initialValue: true,
    });

    if (p.isCancel(gitPrompt)) {
      p.cancel("Operation cancelled.");
      return null;
    }
    initGit = gitPrompt as boolean;
  }

  // 7. Install Dependencies
  const pm = detectPackageManager();
  let installDeps = options.install;
  if (installDeps === undefined) {
    const installPrompt = await p.confirm({
      message: `Install dependencies automatically with ${pc.cyan(pm)}?`,
      initialValue: true,
    });

    if (p.isCancel(installPrompt)) {
      p.cancel("Operation cancelled.");
      return null;
    }
    installDeps = installPrompt as boolean;
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
    packageManager: pm,
  };
}
