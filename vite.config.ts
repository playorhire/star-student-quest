import { defineConfig } from '@lovable.dev/vite-tanstack-config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      tslib: path.resolve(__dirname, 'node_modules/tslib/tslib.es6.mjs'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
});
