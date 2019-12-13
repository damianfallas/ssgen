const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var glob = require("glob");

function generateHtmlPlugins() {
  return glob.sync('./src/**/*.{html,hbs}', {"ignore": ['./src/components/*', './src/layouts/*']} ).map(item => {
    return new HtmlWebpackPlugin({
        // filename: path.parse(item).name + '.html', 
        filename: path.resolve(__dirname, '') + path.parse(item).dir.replace('./src/pages', '/dist') + '/' + path.parse(item).name + '.html', 
        template: item
    });
  });
}
const htmlPlugins = generateHtmlPlugins()

module.exports = {
  entry : path.resolve(__dirname, 'src', 'assets', 'js', 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist', 'assets', 'js')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    writeToDisk: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      { 
        test: /\.hbs$/, 
        loader: "handlebars-loader",
        query: {
          partialDirs: [
              path.join(__dirname, 'src', 'components'),
              path.join(__dirname, 'src', 'layouts'),
          ]
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ] 
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')]
    }),
    new webpack.LoaderOptionsPlugin({})
  ].concat(htmlPlugins)
}