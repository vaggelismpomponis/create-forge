import pc from "picocolors";

export function printBanner(version = "1.0.0"): void {
  const line = pc.dim("─".repeat(56));
  console.log();
  console.log(line);
  console.log(
    `  ${pc.bold(pc.white("CREATE FORGE"))} ${pc.dim(`v${version}`)}  ${pc.cyan("•")}  ${pc.dim("Production Architecture CLI")}`,
  );
  console.log(`  ${pc.dim("Strict engineering standards, anti-slop UI & AI guardrails")}`);
  console.log(line);
  console.log();
}
