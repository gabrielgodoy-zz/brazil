import autoprefixer from 'autoprefixer';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
let path = require('path');

module.exports = {
  entry: ["babel-polyfill", "./src/assets/js/main.js"],
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader?sourceMap'
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader?sourceMap!postcss-loader!stylus-loader',
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.pug$/,
      loader: 'pug-loader?pretty'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.html$/,
      loader: 'file-loader'
    }, {
      test: /\.(eot|otf|woff|woff2|ttf|svg)$/,
      loader: 'url-loader?name=fonts/[name].[ext]',
    }, {
      test: /\.(png|jpg)$/,
      loader: 'file-loader?name=[name].[ext]',
    }],
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve('dist'),
  },
  postcss() {
    return [autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'],
      remove: false,
    })];
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/pages/index.pug',
    }),
    new HtmlWebpackPlugin({
      filename: 'links.html',
      template: './src/pages/links.pug',
    }),
    new HtmlWebpackPlugin({
      filename: 'sistema-politico.html',
      template: './src/pages/sistema-politico.pug',
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],
  resolve: {
    extensions: ['', '.js', '.pug', '.styl']
  }
};
