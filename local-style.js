export function splitmix32(a) {
  return function() {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

export default function solidSfcPlugin() {
  return {
    name: "vite-plugin-solid-sfc",
    transform(src, id) {
      if (id.endsWith(".jsx")) {
        const attribute = localDataAttributeFromFilePath(id);
        return src.replace(/(<[^> /]+)/g, (_, tag) => `${tag} ${attribute}`);
      }
      else if (id.endsWith(".css")) {
        const attribute = "[" + localDataAttributeFromFilePath(id) + "]";

        // Get list of all queries inside the file
        return src.replace(/(}|;|^)((\\n|\\r|\s)*)([^;}]+?)((\\n|\\r|\s)*)(?={)/g, (match, start = "", leftPad1 = "", _a, queries, rightPad1 = "", _b) => {
          // Query is media query skip current query
          if (queries.startsWith("@")) {
            return match;
          }

          // Loop through queries
          const formatedQueries = queries.split(",").map(query => {
            return query.replace(/((\s|\\n|\\r|^)+)(.+?)((\s|\\n|\\r|$)+)/g, (match, leftPad1 = "", _a, selector, rightPad1 = "", _b) => {
              // We can skip & because the parent should already have scoped styling
              // Also skip :hover and pseudo elements
              // TODO :has(.class) is not handled here
              if (selector.startsWith("&") || selector.startsWith(":")) {
                return match;
              }

              // Use "_" to make styling global
              if (selector.startsWith("_") || selector.startsWith("#_") || selector.startsWith("._")) {
                return leftPad1 + selector.replace("_", "") + rightPad1;
              }

              const selectors = selector.split(":");
              selectors[0] += attribute;
              // TODO :has(.class) is not handled here
              return leftPad1 + selectors.join(":") + rightPad1;
            });
          }).join(",");

          return start + leftPad1 + formatedQueries + rightPad1;
        });
      }
    },
  };
}

const stringBetweenTwoChars = (a, b) => {
  const aCode = a.charCodeAt(0);
  const bCode = b.charCodeAt(0);
  const start = Math.min(aCode, bCode);
  const end = Math.max(aCode, bCode) + 1;

  return String.fromCharCode(...Array.from({ length: end - start }, (_, i) => start + i));
}


const chars = stringBetweenTwoChars("0", "9") + stringBetweenTwoChars("a", "z") + stringBetweenTwoChars("A", "Z");

function randomHasFromFilePath(filePath) {
  const filePathWithoutEnding = filePath.replace(/\.[^.]+$/, "");
  const randomHash = Array(8).fill(0);
  filePathWithoutEnding.split("").reduce((acc, char, i) => {
    const random = splitmix32(char.charCodeAt(0) * acc);
    randomHash[i % randomHash.length] = chars[Math.ceil(random() * 100_000) % chars.length];
    return Math.ceil(random() * 100_000);
  }, 3);

  return randomHash.join("");
}

function localDataAttributeFromFilePath(filePath) {
  return "data-k-" + randomHasFromFilePath(filePath);
}
