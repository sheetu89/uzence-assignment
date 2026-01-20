import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Raise the warning threshold to avoid noisy large-chunk messages during Storybook build
    chunkSizeWarningLimit: 2000,
  },
});
