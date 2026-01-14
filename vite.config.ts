import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importante: añade esta línea

export default defineConfig({
  plugins: [react()],
  base: '/', 
  resolve: {
    alias: {
      // Esto le dice a Vite que "@" significa la carpeta "src"
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
