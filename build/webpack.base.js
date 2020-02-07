const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const template = path.resolve(__dirname, '../public/index.html');

module.exports = {
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
        ],
        // exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: 'image/',
              limit: 4096,
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: ['file-loader'],
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template,
      filename: 'index.html',
    }),

  ],


}
