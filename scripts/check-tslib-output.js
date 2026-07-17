import { access } from 'fs/promises';
import path from 'path';

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const dest = path.join(process.cwd(), '.vercel', 'output', 'functions', '__server.func', 'node_modules', 'tslib');
  const modulesIndex = path.join(dest, 'modules', 'index.js');
  const esm = path.join(dest, 'tslib.es6.mjs');

  if (!(await exists(dest))) {
    console.error('FAIL: tslib directory not found in function output:', dest);
    process.exit(1);
  }

  if (!(await exists(modulesIndex)) && !(await exists(esm))) {
    console.error('FAIL: tslib found but no expected entry files (modules/index.js or tslib.es6.mjs)');
    process.exit(1);
  }

  console.log('OK: tslib present in function output');
  process.exit(0);
}

main();
