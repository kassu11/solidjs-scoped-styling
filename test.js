import { diffLines } from "diff";
import { transform } from "./solidjs-scoped-styling.js";
import * as fs from "node:fs";
import * as path from "node:path";


function scanFolder(folderPath) {
  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const itemPath = path.join(folderPath, item.name);

    if (!item.isDirectory()) {
      const [input, answer] = fs.readFileSync(itemPath, "utf8").split("/* =============== EXPECTED OUTPUT =============== */").map(v => v?.trim());
      const output = transform(input, item.name);
      if (answer !== output) {
        console.error(`❌ Test "${item.name}" failed`);
        console.log("======================= EXPECTED =======================");
        console.log(answer);
        console.log("===================== ACTUAL OUTPUT ====================");
        console.log(output);
        console.log("========================= DIFF =========================");

        diffLines(output, answer).forEach(part => {
          if (part.added) {
            const color = '\x1b[32m';
            process.stdout.write(color + part.value + '\x1b[0m');
          } else if (part.removed) {
            const color = '\x1b[31m';
            process.stdout.write(color + part.value + '\x1b[0m');
          }
        });
      } else {
        console.log(`✅ Test "${item.name}" passed`);
      }
    }
  }
}

scanFolder("./tests");
