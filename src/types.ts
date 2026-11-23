export type StackType = "next" | "vite-react" | "fullstack-dotnet" | "astro";
export type LinterType = "biome" | "eslint";
export type DatabaseType = "supabase" | "none";
export type SkillType =
  | "anti-slop-ui-design"
  | "mobile-first-css-layout"
  | "clean-react-architecture"
  | "backend-and-workflow-guardrails"
  | "forms-and-async-ux"
  | "seo-and-web-performance"
  | "systematic-debugging"
  | "git-and-deployment-hygiene";

export interface ProjectConfig {
  projectName: string;
  projectPath: string;
  stack: StackType;
  linter: LinterType;
  database: DatabaseType;
  skills: SkillType[];
  initGit: boolean;
  installDeps: boolean;
  packageManager: "npm" | "pnpm" | "bun" | "yarn";
}

export interface CliOptions {
  stack?: StackType;
  linter?: LinterType;
  database?: DatabaseType;
  git?: boolean;
  install?: boolean;
  yes?: boolean;
}
