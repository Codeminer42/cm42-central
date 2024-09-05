import { defineConfig, mergeConfig } from 'vitest/config';
import viteBaseConfig from './vite.base.config';

export default mergeConfig(
  viteBaseConfig,
  defineConfig({
    test: {
      include: ['spec/javascripts/**/*_spec.js'],
      globals: true,
    },
  })
);
