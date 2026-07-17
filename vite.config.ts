import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  ssr: {
    // Exclude client-only libraries from the server bundle to avoid bundling "use client" directives
    external: [
      /@radix-ui\//,
      /@tanstack\/react-router/,
      'sonner'
    ]
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
});
