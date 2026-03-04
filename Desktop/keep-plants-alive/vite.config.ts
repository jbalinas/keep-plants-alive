import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BASE = process.env.NODE_ENV === 'production' ? '/keep-plants-alive/' : '/';

export default defineConfig({
  plugins: [react()],
  base: BASE,
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
