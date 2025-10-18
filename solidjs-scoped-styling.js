export default function solidSfcPlugin() {
  return {
    name: "vite-solidjs-scoped-styling",
    transform(src, id) {
      if (id.endsWith(".scoped.jsx")) {
        const attribute = localDataAttributeFromFilePath(id);
        return src.replace(/(<[^> /]+)/g, (_, tag) => `${tag} ${attribute}`);
      }
      else if (id.endsWith(".scoped.css")) {
        const attribute = "[" + localDataAttributeFromFilePath(id) + "]";

        // Get list of all queries inside the file
        return src.replace(/(}|;|^|{)(\s*)([^;}]+?)(\s*)(?={)/g, (match, start = "", leftPad1 = "", queries, rightPad1 = "") => {
          // Query is media or container query skip current query
          if (queries.startsWith("@")) {
            return match;
          }

          // Loop through queries
          const formatedQueries = queries.split(",").map(query => {
            let returnQuery = "";

            let scopeCurrentSelector = true;
            let hasSelector = false;
            let isPseudoClass = false;
            const pseudoSelectorScope = [];
            const attributeScope = [];
            const attributeScopeCharacters = {
              "\"": "\"",
              "'": "'",
              "[": "]",
            };

            for (let i = 0; i < query.length; i++) {
              // Position starts with either attribute or string
              if (queries[i - 1] !== "\\" && queries[i] in attributeScopeCharacters) {
                attributeScope.push(queries[i]);
                returnQuery += query[i];
              }
              // Position ends with either attribute or string
              else if (attributeScope.length && queries[i - 1] !== "\\" && queries[i] === attributeScopeCharacters[attributeScope.at(-1)]) {
                attributeScope.pop();
                returnQuery += query[i];
              }
              // Prevent selector splitting inside attribute or string inside attribute
              else if (attributeScope.length) {
                returnQuery += query[i];
              }
              // Position char ends the current selector
              // Check if we want to scope the selector
              else if (query[i] === " " || query[i] === ")" || query[i] === "+" || query[i] === "~" || query[i] === ">" || query[i] === "\n" || query[i] === "\r") {
                if (scopeCurrentSelector && hasSelector) {
                  returnQuery += attribute;
                }
                // If selector was already scoped before the pseudo selector no need to rescope the selector
                // This check will just make CSS file little smaller
                if (query[i] === ")") {
                  const selectorAlreadyScoped = pseudoSelectorScope.pop();
                  scopeCurrentSelector = selectorAlreadyScoped;
                } else {
                  scopeCurrentSelector = true;
                }
                hasSelector = false;
                isPseudoClass = false;
                returnQuery += query[i];
              }
              // No need to scope the current selector because the parent should handle the scoping
              else if (query[i] === "&") {
                scopeCurrentSelector = false
                isPseudoClass = false;
                returnQuery += query[i];
              }
              // Selector contains pseudo selector with arguments
              // Scope the pseudo selectors insides if they need it
              else if (isPseudoClass && query[i] === "(") {
                pseudoSelectorScope.push(scopeCurrentSelector);
                // These pseudo classes don't take classes as input so don't scope them
                // We don't want :nth-child(3) to become: :nth-child(3[data-k-234234])
                // Pseudo class that we want to scope could be :has, :where: :is, :not etc.
                if (
                  equalsBackwards("child(", query, i) ||
                  equalsBackwards("type(", query, i) ||
                  equalsBackwards(":dir(", query, i) ||
                  equalsBackwards(":state(", query, i) ||
                  equalsBackwards(":host(", query, i) ||
                  equalsBackwards(":context(", query, i)
                ) {
                  scopeCurrentSelector = false;
                } else {
                  scopeCurrentSelector = true
                }
                hasSelector = false;
                returnQuery += query[i];
              }
              // Position start normal pseudo selector or pseudo selector with arguments
              // args: :not(.class) no args: :hover
              else if (query[i] === ":") {
                // Don't scope :root, if there are any other pseudo selectors that you should not scope add them here
                if (equalsforwards(queries, ":root", i)) {
                  scopeCurrentSelector = false;
                }
                else if (scopeCurrentSelector) {
                  returnQuery += attribute;
                }
                scopeCurrentSelector = false;
                isPseudoClass = true;
                returnQuery += query[i];
              }
              // Selector is prefixed with "_" don't scope the selector
              else if (hasSelector === false && queries[i] === "_") {
                scopeCurrentSelector = false;
              }
              // Position should have ".", "#", and rest of UTF-8 characters
              else {
                hasSelector = true;
                returnQuery += query[i];
              }
            }

            if (scopeCurrentSelector && hasSelector) {
              returnQuery += attribute;
            }

            return returnQuery;
          }).join(",");

          return start + leftPad1 + formatedQueries + rightPad1;
        });
      }
    },
  };
}

const splitmix32 = (a) => {
  return () => {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

const equalsBackwards = (string, string2, index) => {
  return equalsforwards(string, string2, index - (string.length - 1));
}

const equalsforwards = (string, string2, index) => {
  for (let i = 0; i < string.length; i++) {
    if (string2[i + index] !== string[i]) {
      return false;
    }
  }

  return true;
}

const stringBetweenTwoChars = (a, b) => {
  const aCode = a.charCodeAt(0);
  const bCode = b.charCodeAt(0);
  const start = Math.min(aCode, bCode);
  const end = Math.max(aCode, bCode) + 1;

  return String.fromCharCode(...Array.from({ length: end - start }, (_, i) => start + i));
}


const chars = stringBetweenTwoChars("0", "9") + stringBetweenTwoChars("a", "z") + stringBetweenTwoChars("A", "Z");

const removeFileType = filePath => filePath.replace(/\.[^.]+$/, "");

function randomHasFromFilePath(filePath) {
  const filePathWithoutEnding = removeFileType(filePath);
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
