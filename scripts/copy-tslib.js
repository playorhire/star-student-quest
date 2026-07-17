import { cp, mkdir } from 'fs/promises';
import path from 'path';

async function main() {
  const root = path.resolve('.');
  const src = path.join(root, 'node_modules', 'tslib');
  const dest = path.join(root, '.vercel', 'output', 'functions', '__server.func', 'node_modules', 'tslib');
  try {
    await mkdir(dest, { recursive: true });
    // copy entire tslib folder (preserves modules and esm files)
    await cp(src, dest, { recursive: true });
    console.log('copied tslib to', dest);
  } catch (err) {
    console.error('failed to copy tslib:', err);
    process.exit(1);
  }
}

main();
