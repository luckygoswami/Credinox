import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          uiComponents: [
            './src/components/AuthForm',
            './src/components/CredentialsList',
            './src/components/Dashboard',
            './src/components/EditCredentialForm',
            './src/components/PasswordGenerator',
            './src/components/PasswordWrapper',
            './src/components/NewCredentialForm',
          ],
        },
      },
    },
  },
});
