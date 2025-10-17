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
    enforce: 'post',
    transform(src, id) {
      if (id.endsWith(".jsx")) {
        const attribute = localDataAttributeFromFilePath(id);
        src = src.replace(/(<[^> /]+)/g, (_, tag) => {
          // console.log(tag);
          return `${tag} ${attribute}`;
        });

        console.log(attribute, id);

        return { code: src, map: null };
      } else if (id.endsWith(".css")) {
        const attribute = "[" + localDataAttributeFromFilePath(id) + "]";
        console.log(attribute, id);
        const startStyleContentIndex = src.indexOf("const __vite__css = \"") + 21;
        const endStyleContentIndex = src.indexOf("__vite__updateStyle(");
        const styleContent = src.substring(startStyleContentIndex, endStyleContentIndex);
        const localyzedStyles = styleContent.replace(/([};]|^)(\s*)([^;}]+)(?={)/g, (_, start, leftPad, selectors) => {
          selectors = selectors.replace(/\\n|\\r/g, "").trim();
          const localSelector = selectors.split(",").map(selector => {
            selector = selector.trim();
            if (selector.startsWith("@")) {
              return selector;
            }

            return selector.split(/\s+/g).map(section => {
              section = section.trim();
              if (section.startsWith("&") || section.startsWith(":")) {
                return section;
              }
              console.log("???????????", section);
              if (section.startsWith("_") || section.startsWith("#_") || section.startsWith("._")) {
                return section.replace("_", "");
              }
              const values = section.split(":");
              values[0] += attribute;
              // TODO :has(.class) is not handled here
              return values.join(":");
            }).join(" ");
          }).join(",");
          return start + leftPad + localSelector;
        });

        src = src.substring(0, startStyleContentIndex) + localyzedStyles + src.substring(endStyleContentIndex);

        return src;
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
