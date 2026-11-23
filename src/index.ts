import path from "node:path";
import * as p from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { forgeProject } from "./generator/engine.js";
import { CORE_SKILLS } from "./generator/skills-content.js";
import { runWizard } from "./prompts/wizard.js";
import type { CliOptions, DatabaseType, LinterType, ProjectConfig, StackType } from "./types.js";
import { printBanner } from "./utils/banner.js";
import { getRunCommand } from "./utils/package-manager.js";

const VERSION = "1.0.0";

async function main() {
  const program = new Command();

  program
    .name("create-forge")
    .description("Scaffold modern apps with strict production engineering standards & AI skills")
    .version(VERSION, "-v, --version", "Output the current version")
    .argument("[project-directory]", "Directory to create the project in")
    .option("-s, --stack <type>", "Stack type: next, vite-react, fullstack-dotnet, astro")
    .option("-l, --linter <type>", "Linter type: biome, eslint")
    .option("-d, --database <type>", "Database preset: supabase, none")
    .option("-g, --git", "Initialize git repository")
    .option("--no-git", "Do not initialize git repository")
    .option("-i, --install", "Install dependencies")
    .option("--no-install", "Do not install dependencies")
    .option("-y, --yes", "Skip interactive prompts and use defaults")
    .parse(process.argv);

  const [targetDir] = program.args;
  const opts = program.opts();

  printBanner(VERSION);

  let config: ProjectConfig | null = null;

  if (opts.yes) {
    // Non-interactive fast mode
    const rawTarget = targetDir || "my-app";
    const projectPath = path.resolve(process.cwd(), rawTarget);
    const projectName = path.basename(projectPath);
    config = {
      projectName,
      projectPath,
      stack: (opts.stack as StackType) || "next",
      linter: (opts.linter as LinterType) || "biome",
      database: (opts.database as DatabaseType) || "supabase",
      skills: CORE_SKILLS.map((s) => s.id),
      initGit: opts.git !== false,
      installDeps: opts.install !== false,
      packageManager: "npm",
    };
  } else {
    // Interactive wizard
    config = await runWizard(targetDir, opts as CliOptions);
  }

  if (!config) {
    process.exit(0);
  }

  // Execute project scaffolding
  try {
    await forgeProject(config);

    p.note(
      `${pc.dim("Stack:")}    ${pc.cyan(config.stack)}\n` +
        `${pc.dim("Linter:")}   ${pc.cyan(config.linter)}\n` +
        `${pc.dim("Database:")} ${pc.cyan(config.database)}\n` +
        `${pc.dim("Skills:")}   ${pc.cyan(`${config.skills.length} core skills injected (.agent/skills)`)}`,
      "Configuration Summary",
    );

    const devCmd = getRunCommand(config.packageManager, "dev");
    const installReminder = config.installDeps
      ? ""
      : `\n  ${pc.cyan(`${config.packageManager} install`)}`;
    p.outro(
      `${pc.bold(pc.green("✔ Project forged successfully!"))}${pc.dim("\n\nNext steps:")}\n  ${pc.cyan(`cd ${config.projectName}`)}${installReminder}\n  ${pc.cyan(devCmd)}\n`,
    );
  } catch (error) {
    p.cancel(pc.red(`Failed to forge project: ${(error as Error).message}`));
    console.error(error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
