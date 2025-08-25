// Prüft Conventional Commits + Ticketnummer

const fs = require("fs");

const file = process.argv[2];
if(!file) {
    console.error("[commit-msg] Pfad zur Commit-Message fehlt");
    process.exit(1);
}

const raw = fs.readFileSync(file, "utf8").trim();
const lines = raw.split(/\r?\n/);
const subject = lines[0] || "";

//Merge-Commit enable
if (/^Merge /.test(subject)) process.exit(0);

//Erlaubte Types
const TYPES = [
    "build", "chore", "ci", "docs", "feat", "fix",
    "perf", "refactor", "revert", "style", "test",
];

//Betreff Regel
const conventional = new RegExp(
    `^(${TYPES.join("|")})(\\([a-zA-Z0-9_.\\/-]+\\))?(!)?: .{1,72}$`
)

//Ticket Regel
const hasTicket = /[A-Z]{2,}-\d+/.test(raw);

const errors = [];

if (!conventional.test(subject)) {
    errors.push('Betreff entspricht nicht subject')
}

if (!hasTicket) {
    errors.push("Ticketnummer Fehlt")
}

if (subject.length > 72) {
    errors.push("Betreff max 72 Zeichen")
}

if (errors.length){
console.error("\n Commit abgebrochen.\n");
  console.error("Gefunden:\n  " + subject + "\n");
  console.error("Fehler:");
  for (const e of errors) console.error("  - " + e);
  console.error("\nBeispiele gültiger Messages:");
  console.error('  feat(api): add /users endpoint ABC-123');
  console.error('  fix(auth)!: reject weak passwords (SEC-42)');
  console.error('  docs(readme): add setup notes PROJ-7');
  process.exit(1);
}

process.exit(0);