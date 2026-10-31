import fs from "node:fs";
import path from "node:path";

const dir = "dist/assets";
const NCHAR = /\p{Noncharacter_Code_Point}/gu;
const hex4 = (n) => "\\u" + n.toString(16).toUpperCase().padStart(4, "0");
const esc = (cp) => {
  if (cp <= 0xffff) return hex4(cp);
  const v = cp - 0x10000;
  return hex4(0xd800 + (v >> 10)) + hex4(0xdc00 + (v & 0x3ff));
};

let total = 0;
for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith(".js")) continue;
  const file = path.join(dir, name);
  const src = fs.readFileSync(file, "utf8");
  let count = 0;
  const out = src.replace(NCHAR, (ch) => {
    count++;
    return esc(ch.codePointAt(0));
  });
  if (count) {
    fs.writeFileSync(file, out, "utf8");
    console.log(`fixed ${count} noncharacter(s) in ${name}`);
    total += count;
  }
}
console.log(total ? `Done: ${total} fixed` : "No noncharacters found");
