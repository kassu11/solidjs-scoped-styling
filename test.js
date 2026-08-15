import { diffLines } from "diff";
import { transform } from "./solidjs-scoped-styling.js";
import * as fs from "node:fs";
import * as path from "node:path";


function scanFolder(folderPath) {
  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const itemPath = path.join(folderPath, item.name);

    if (!item.name.match(/\.scoped\.(css|jsx)$/)) {
      console.error(`❌ Test file name must end in ".scoped.jsx/css", but the file name is: "${item.name}"`);
      continue;
    }

    if (!item.isDirectory()) {
      const [input, answer] = fs.readFileSync(itemPath, "utf8").split("/* =============== EXPECTED OUTPUT =============== */").map(v => v?.trim());
      // Change file name to make the hash always same... 
      // It's annoing when changing file names to fix up the hashes, also windows and linux handles the paths differently, so the hash does not match
      const output = transform(input, item.name.replace(/.*(\.scoped\.(css|jsx)$)/, (_, fileType) => "test" + fileType ));
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
        console.log("\n\n")
      } else {
        console.log(`✅ Test "${item.name}" passed`);
      }
    }
  }
}

scanFolder("./tests");
