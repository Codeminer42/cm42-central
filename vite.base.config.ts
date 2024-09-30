import { defineConfig } from 'vite';
import path from 'path';
import PrecompileEjs from './app/assets/javascripts/libs/precompile_ejs';

const aliasMap = {
  vendor: path.join(__dirname, 'vendor/assets/javascripts'),
  collections: path.join(__dirname, 'app/assets/javascripts/collections'),
  mixins: path.join(__dirname, 'app/assets/javascripts/mixins'),
  models: path.join(__dirname, 'app/assets/javascripts/models'),
  templates: path.join(__dirname, 'app/assets/javascripts/templates'),
  views: path.join(__dirname, 'app/assets/javascripts/views'),
  libs: path.join(__dirname, 'app/assets/javascripts/libs'),
  components: path.join(__dirname, 'app/assets/javascripts/components'),
  controllers: path.join(__dirname, 'app/assets/javascripts/controllers'),
  reducers: path.join(__dirname, 'app/assets/javascripts/reducers'),
  actions: path.join(__dirname, 'app/assets/javascripts/actions'),
  central: path.join(__dirname, 'app/assets/javascripts/central'),
  store: path.join(__dirname, 'app/assets/javascripts/store'),
  gritter: 'gritter/js/jquery.gritter.min.js',
};

const alias = Object.entries(aliasMap).map(([key, value]) => ({
  find: key,
  replacement: value,
}));

export default defineConfig({
  plugins: [PrecompileEjs()],
  esbuild: {
    loader: 'jsx',
    include: [
      'app/**/*.jsx',
      'spec/javascripts/**/*.jsx',
      // Add these lines to allow all .js files to contain JSX
      'app/**/*.js',
      'spec/javascripts/**/*.js',
    ],
    exclude: [],
  },
  resolve: {
    alias: [...alias],
  },
});
