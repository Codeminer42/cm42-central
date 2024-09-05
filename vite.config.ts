import { mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import PrecompileEjs from './app/assets/javascripts/libs/precompile_ejs';
import viteBaseConfig from './vite.base.config';

export default mergeConfig(
  viteBaseConfig,
  defineConfig({
    plugins: [RubyPlugin(), PrecompileEjs()],
  })
);
