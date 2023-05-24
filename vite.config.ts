import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import path from 'path'
import PrecompileEjs from './app/assets/javascripts/libs/precompile_ejs'
import * as esbuild from 'esbuild'
import fs from 'fs'

const rollupPlugin = (matchers) => ({
  name: "js-in-jsx",
  load(id) {
    if (matchers.some(matcher => matcher.test(id))) {
      const file = fs.readFileSync(id, { encoding: "utf-8" });
      return esbuild.transformSync(file, { loader: "jsx" });
    }
  }
});

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
}

const alias = Object.entries(aliasMap).map(([key, value]) => ({ find: key, replacement: value }))

export default defineConfig({
  plugins: [
    RubyPlugin(),
    PrecompileEjs()
  ],
  // build: {
  //   rollupOptions: {
  //     external: [
  //       'cloudinary_js/js/jquery.ui.widget',
  //       'cloudinary_js/js/jquery.iframe-transport',
  //       'cloudinary_js/js/jquery.fileupload'
  //     ]
  //   }
  // },
  esbuild: {
    loader: "jsx",
    include: [
      "app/**/*.jsx",
      "app/**/*.tsx",
      // "node_modules/**/*.jsx",
      // "node_modules/**/*.tsx",

      // Add these lines to allow all .js files to contain JSX
      "app/**/*.js",
      // "node_modules/**/*.js",

      // Add these lines to allow all .ts files to contain JSX
      "app/**/*.ts",
      // "node_modules/**/*.ts",
    ],
    exclude: [],
  },
  resolve: {
    alias: [
      ...alias,
      // {
      //   find: /jquery\.ui\.widget/,
      //   replacement: require.resolve('cloudinary_js/js/jquery.ui.widget_ajkshdkja')
      // }
    ]
  }
})
