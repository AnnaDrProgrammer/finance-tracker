import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // ← добавляем импорт
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← добавляем плагин
  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
    },
  },
});
