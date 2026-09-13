import { execFileSync } from "node:child_process";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

const types = [
  ["feat", "Nova funcionalidade"],
  ["fix", "Correção de bug"],
  ["refactor", "Refatoração sem mudança de comportamento"],
  ["perf", "Melhoria de performance"],
  ["test", "Adição ou alteração de testes"],
  ["docs", "Documentação"],
  ["style", "Formatação ou estilo"],
  ["build", "Build ou dependências"],
  ["ci", "CI/CD"],
  ["chore", "Manutenção geral"],
  ["revert", "Reverte um commit anterior"],
];

const rl = createInterface({ input, output });

function ask(question) {
  return rl.question(question);
}

try {
  console.log("\nConventional Commit\n");

  console.log("Escolha o tipo do commit:\n");

  types.forEach(([type, description], index) => {
    console.log(`${index + 1}. ${type.padEnd(10)} - ${description}`);
  });

  const typeAnswer = await ask("\nTipo: ");
  const typeIndex = Number(typeAnswer) - 1;
  const selectedType = types[typeIndex]?.[0];

  if (!selectedType) {
    throw new Error("Tipo de commit inválido.");
  }

  const scope = (await ask("Escopo (opcional): ")).trim();
  const description = (await ask("Descrição: ")).trim();

  if (!description) {
    throw new Error("A descrição do commit não pode ser vazia.");
  }

  const commitMessage = `${selectedType}${scope ? `(${scope})` : ""}: ${description}`;

  console.log(`\nCommit: ${commitMessage}\n`);

  const confirm = await ask("Confirmar? (s/N): ");

  if (confirm.toLowerCase() !== "s") {
    console.log("\nCommit cancelado.");
    process.exitCode = 0;
  } else {
    execFileSync("git", ["commit", "-m", commitMessage], {
      stdio: "inherit",
    });
  }
} catch (error) {
  console.error(`\nErro: ${error.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
