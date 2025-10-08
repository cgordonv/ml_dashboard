import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src/components/ui');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(entry.name)) fixFile(p);
  }
}

function fixFile(file) {
  let txt = fs.readFileSync(file, 'utf8');
  const before = txt;
  // Replace "@radix-ui/react-foo@1.2.3" -> "@radix-ui/react-foo"
  txt = txt.replace(/"(@radix-ui\/[a-z\-]+)@[0-9.]+"/g, '"$1"');
  // Also handle single-quoted imports just in case
  txt = txt.replace(/'(@radix-ui\/[a-z\-]+)@[0-9.+]+'/g, "'$1'");
  if (txt !== before) {
    fs.writeFileSync(file, txt, 'utf8');
    console.log('Fixed:', file);
  }
}

if (fs.existsSync(ROOT)) {
  walk(ROOT);
} else {
  console.error('Path not found:', ROOT);
  process.exit(1);
}
