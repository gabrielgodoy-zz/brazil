import autoprefixer from 'autoprefixer';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
import ExtractTextPlugin from 'extract-text-webpack-plugin';
let path = require('path');

module.exports = {
  entry: ["babel-polyfill", "./src/assets/js/main.js"],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        'style-loader', 'css-loader'),
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract(
        'style-loader', 'css-loader!postcss-loader!stylus-loader'),
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
      loader: 'url-loader?limit=30000&name=./fonts/[name].[ext]',
    }, {
      test: /\.(png|jpg)$/,
      loader: 'file-loader?name=./images/[name].[ext]',
    }],
  },
  output: {
    filename: 'main.js',
    path: path.resolve('dist')
  },
  postcss() {
    return [autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'],
      remove: false
    })];
  },
  plugins: [
    new ExtractTextPlugin('main.css'),

    // Optimizes the order that the files are bundled
    new webpack.optimize.OccurenceOrderPlugin(),

    // Eliminates duplicated packages when generating bundle
    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
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
    new HtmlWebpackPlugin({
      filename: 'graficos.html',
      template: './src/pages/graficos.pug',
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
