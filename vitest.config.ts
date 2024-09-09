import { defineConfig, mergeConfig } from 'vitest/config';
import viteBaseConfig from './vite.base.config';
import path from 'path';

export default mergeConfig(
  viteBaseConfig,
  defineConfig({
    test: {
      include: [
        'spec/javascripts/**/*_spec.js',
        'spec/javascripts/**/*_spec.jsx',
      ],
      globals: true,
      setupFiles: path.join(__dirname, 'spec/javascripts/support/setup.js'),
      environment: 'jsdom',
    },
  })
);
