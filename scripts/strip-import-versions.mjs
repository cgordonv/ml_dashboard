import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src');

// Replace "package@1.2.3" -> "package" inside import strings
const RE_DQ = /"(@?[\w-]+(?:\/[\w-]+)*)@[0-9][0-9a-zA-Z\.\-\+]*"/g;  // double quotes
const RE_SQ = /'(@?[\w-]+(?:\/[\w-]+)*)@[0-9][0-9a-zA-Z\.\-\+]*/g;   // single quotes

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) fixFile(p);
  }
}

function fixFile(file) {
  let txt = fs.readFileSync(file, 'utf8');
  const before = txt;
  txt = txt.replace(RE_DQ, '"$1"').replace(RE_SQ, "'$1'");
  if (txt !== before) {
    fs.writeFileSync(file, txt);
    console.log('Fixed:', file);
  }
}

if (fs.existsSync(ROOT)) walk(ROOT);
else {
  console.error('Path not found:', ROOT);
  process.exit(1);
}
