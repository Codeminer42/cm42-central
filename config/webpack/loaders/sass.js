const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { env } = require('../configuration.js')

module.exports = {
  test: /\.(scss|sass|css)$/i,
  use: [
    { loader: MiniCssExtractPlugin.loader },
    { loader: 'css-loader', options: { minimize: env.NODE_ENV === 'production' } },
    { loader: 'postcss-loader', options: { sourceMap: true } },
    'resolve-url-loader',
    { loader: 'sass-loader', options: { sourceMap: true } },
    "css-loader"
  ]
}
