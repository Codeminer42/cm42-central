module.exports = {
  test: /\.js(\.erb)?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    presets: ["@babel/preset-env"]
  }
}
