// Commit-Message Hook: Prüft Conventional Commits + Ticketnummer

const fs = require("fs");

// Commit-Message Datei einlesen
const file = process.argv[2];
if (!file) {
  console.error("[commit-msg] Keine Commit-Message-Datei übergeben.");
  process.exit(1);
}

const message = fs.readFileSync(file, "utf8").trim();
const [subject] = message.split(/\r?\n/);

// Merge-Commits zulassen
if (/^Merge /.test(subject)) {
  process.exit(0);
}

// Erlaubte Commit-Typen nach Conventional Commits
const TYPES = [
  "build", "chore", "ci", "docs", "feat", "fix",
  "perf", "refactor", "revert", "style", "test",
];

// Regex für Betreff-Regel
const conventional = new RegExp(
  `^(${TYPES.join("|")})(\\([a-zA-Z0-9_.\\/-]+\\))?(!)?: .{1,72}$`
);

// Regex für Ticket-Regel (z. B. PROJ-123)
const ticketPattern = /[A-Z]{2,}-\d+/;

const errors = [];

// Regeln prüfen
if (!conventional.test(subject)) {
  errors.push("Betreff entspricht nicht dem Schema (Conventional Commits).");
}
if (!ticketPattern.test(message)) {
  errors.push("Ticketnummer fehlt.");
}
if (subject.length > 72) {
  errors.push("Betreff darf maximal 72 Zeichen haben.");
}

// Fehlerausgabe
if (errors.length > 0) {
  console.error("\n❌ Commit abgebrochen.\n");
  console.error("Gefunden:\n  " + subject + "\n");
  console.error("Fehler:");
  for (const err of errors) console.error("  - " + err);
  console.error("\nBeispiele für gültige Commits:");
  console.error("  feat(api): add /users endpoint ABC-123");
  console.error("  fix(auth)!: reject weak passwords (SEC-42)");
  console.error("  docs(readme): add setup notes PROJ-7");
  process.exit(1);
}

// Alles korrekt
process.exit(0);
