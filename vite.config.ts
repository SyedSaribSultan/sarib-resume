import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resumeArtifacts } from './scripts/resume-artifacts';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), resumeArtifacts()],
  server: { port: 5173, open: true },
  build: {
    rollupOptions: {
      output: {
        // React and MUI/Emotion get their own long-lived vendor chunks. A
        // function is needed: the object form left React (CJS) inside mui.
        // motion is left to Rollup so its lazy features split off.
        manualChunks: isSsrBuild
          ? undefined
          : (id) => {
              if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
              if (/[\\/]node_modules[\\/](@mui|@emotion)[\\/]/.test(id)) return 'mui';
            },
      },
    },
  },
}));
