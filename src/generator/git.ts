import { execa } from "execa";

export async function initializeGitRepository(projectPath: string): Promise<boolean> {
  try {
    // 1. git init
    await execa("git", ["init"], { cwd: projectPath });

    // 2. git add -A
    await execa("git", ["add", "-A"], { cwd: projectPath });

    // 3. git commit
    await execa(
      "git",
      [
        "commit",
        "-m",
        "chore: initialize project via create-forge with production engineering standards",
      ],
      { cwd: projectPath },
    );

    return true;
  } catch (error) {
    // If git fails (e.g. user identity not configured), don't crash the whole scaffolder
    return false;
  }
}
