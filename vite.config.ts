import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'import.meta.env.APP_NAME': JSON.stringify('JSON Map'),
    'import.meta.env.APP_VERSION': JSON.stringify('1.0.0'),
    'import.meta.env.APP_ICON': JSON.stringify('/favicon.png'),
    'import.meta.env.APP_FAVICON': JSON.stringify('/favicon.png'),
    'import.meta.env.APP_BANNER': JSON.stringify('/favicon.png')
  }
});