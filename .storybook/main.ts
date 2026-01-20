import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ]
,
  viteFinal: async (viteConfig: any) => {
    const build = viteConfig.build || {};
    const rollupOptions = build.rollupOptions || {};
    const output = Array.isArray(rollupOptions.output) ? rollupOptions.output : {
      ...(rollupOptions.output || {}),
    };

    const newRollup = {
      ...rollupOptions,
      output: {
        ...(output as object),
        // Leave manualChunks to Vite/Storybook defaults to avoid circular chunking
      },
    };

    return {
      ...viteConfig,
      build: {
        ...build,
        chunkSizeWarningLimit: 2000,
        rollupOptions: newRollup,
      },
    };
  }
};

export default config;