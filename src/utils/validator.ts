import path from "node:path";
import fs from "fs-extra";

export function validateProjectName(name: string): string | undefined {
  if (!name || name.trim().length === 0) {
    return "Project name cannot be empty.";
  }

  const trimmed = name.trim();
  if (!/^[a-zA-Z0-9-_]+$/.test(trimmed)) {
    return "Project name can only contain alphanumeric characters, hyphens, and underscores.";
  }

  return undefined;
}

export function checkTargetDirectory(targetDir: string): { exists: boolean; isEmpty: boolean } {
  if (!fs.existsSync(targetDir)) {
    return { exists: false, isEmpty: true };
  }

  const files = fs.readdirSync(targetDir);
  return {
    exists: true,
    isEmpty: files.length === 0 || (files.length === 1 && files[0] === ".git"),
  };
}
