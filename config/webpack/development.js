// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
const sharedConfig = require('./shared.js')
const { env, settings, output } = require('./configuration.js')

module.exports = merge(sharedConfig, {
  plugins: [
    new ManifestPlugin({
      publicPath: output.manifest.publicPath,
      writeToFileEmit: env.NODE_ENV !== 'test'
    })
  ],
  devtool: 'cheap-eval-source-map',

  stats: {
    errorDetails: true
  },

  output: {
    pathinfo: true
  },

  devServer: {
    clientLogLevel: 'none',
    https: settings.dev_server.https,
    host: settings.dev_server.host,
    port: settings.dev_server.port,
    contentBase: output.path,
    publicPath: output.publicPath,
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }
})
