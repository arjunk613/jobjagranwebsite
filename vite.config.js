import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Specifies the output directory for the build
  },
  server: {
    host: true, // Ensures the server is accessible externally
  },
});
