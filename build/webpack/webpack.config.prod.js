const webpack = require('webpack')
const env = require('../env')

const ENTRY = env.ENTRY
const OUTPUT = env.OUTPUT
const NODE_ENV = env.NODE_ENV

const webpackConfig = {
  devtool: 'source-map',
  entry: {
    index: ENTRY
  },
  output: {
    path: OUTPUT,
    filename: 'js/index.js',
    sourceMapFilename: 'source-map/[name].source.map',
    library: 'diff_three_way',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': NODE_ENV,
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      compress: {
        warnings: false
      },
      sourceMap: true,
      comments: false
    })
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ]
  }
}

module.exports = webpackConfig
