import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resumeArtifacts } from './scripts/resume-artifacts';

export default defineConfig({
  plugins: [react(), resumeArtifacts()],
  server: { port: 5173, open: true },
  build: {
    rollupOptions: {
      output: {
        // Split the vendor graph so React, MUI/emotion, and motion are
        // cached independently of app code across deploys.
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          motion: ['motion'],
        },
      },
    },
  },
});
