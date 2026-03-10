import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/New-folder/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        hosting: resolve(__dirname, 'hosting.html')
      }
    }
  }
});

