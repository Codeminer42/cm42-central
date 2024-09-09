import { mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import viteBaseConfig from './vite.base.config';

export default mergeConfig(
  viteBaseConfig,
  defineConfig({
    plugins: [RubyPlugin()],
  })
);
