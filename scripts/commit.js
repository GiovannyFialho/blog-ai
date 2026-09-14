import { confirm, input, select } from "@inquirer/prompts";
import { execFileSync } from "node:child_process";
import { styleText } from "node:util";

const commitTypes = [
  {
    value: "feat",
    name: "feat",
    description: "New feature",
  },
  {
    value: "fix",
    name: "fix",
    description: "Bug fix",
  },
  {
    value: "refactor",
    name: "refactor",
    description: "Code refactoring without changing behavior",
  },
  {
    value: "perf",
    name: "perf",
    description: "Performance improvement",
  },
  {
    value: "test",
    name: "test",
    description: "Add or modify tests",
  },
  {
    value: "docs",
    name: "docs",
    description: "Documentation",
  },
  {
    value: "style",
    name: "style",
    description: "Formatting or style changes",
  },
  {
    value: "build",
    name: "build",
    description: "Build system or dependencies",
  },
  {
    value: "ci",
    name: "ci",
    description: "CI/CD changes",
  },
  {
    value: "chore",
    name: "chore",
    description: "General maintenance",
  },
  {
    value: "revert",
    name: "revert",
    description: "Revert a previous commit",
  },
];

function styleChoice(text, selected) {
  if (selected) {
    return styleText(["cyan", "bold"], text);
  }

  return styleText("gray", text);
}

try {
  console.log();

  const type = await select({
    message: "What type of commit is this?",
    choices: commitTypes,
    theme: {
      style: {
        highlight: (text) => styleChoice(text, true),
        description: (text) => styleText("gray", text),
      },
    },
  });

  const scope = await input({
    message: "What is the scope? (optional)",
  });

  const description = await input({
    message: "What is the description?",
    validate: (value) => {
      if (!value.trim()) {
        return "The commit description cannot be empty.";
      }

      return true;
    },
  });

  const commitMessage = `${type}${scope.trim() ? `(${scope.trim()})` : ""}: ${description.trim()}`;

  console.log();
  console.log(`Commit: ${styleText(["cyan", "bold"], commitMessage)}`);
  console.log();

  const shouldCommit = await confirm({
    message: "Confirm commit?",
    default: true,
  });

  if (!shouldCommit) {
    console.log("\nCommit cancelled.");
    process.exitCode = 0;
  } else {
    execFileSync("git", ["commit", "-m", commitMessage], {
      stdio: "inherit",
    });
  }
} catch (error) {
  if (error.name === "ExitPromptError") {
    console.log("\nCommit cancelled.");
    process.exitCode = 0;
  } else {
    console.error(`\n${styleText(["red", "bold"], "Error:")} ${error.message}`);
    process.exitCode = 1;
  }
}
