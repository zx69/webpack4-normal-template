const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // filename: '[name].css',
              // chunkFilename: '[name].css',
              publicPath: '../',
            },
          },
          // 'style-loader',  使用MiniCssExtractPlugin时就不能使用style-loader了
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, //该方式可以让@import引入的css文件再次执行一边css打包loader
            }
          },
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].chunk.css',
    }),
    // pwa
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助 ServiceWorkers 快速启用
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true
    }),

  ],
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({   // 压缩js代码
        cache: true,   // 启用文件缓存
        parallel: true,  // 使用多进程并行执行任务来提高构建效率
        sourceMap: true,  // 将错误消息位置映射到模块
        terserOptions: {
          drop_console: true,  // 打包时剔除所有console.log
          drop_debugger: true  // 打包时剔除所有debugger
        }
      }),
      new OptimizeCssAssetsPlugin({}), // 压缩css代码
    ],
    splitChunks: {
      chunks: 'all',
      // chunks: 'async', // async表示只对异步代码进行分割
      minSize: 30000,  // 当超过指定大小时做代码分割
      // maxSize: 200000,  // 当大于最大尺寸时对代码进行二次分割
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '_',
      name: true,
      cacheGroups: {  // 缓存组：如果满足vendor的条件，就按vender打包，否则按default打包
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 权重越大，打包优先级越高
          // filename: 'js/vender.js'  //将代码打包成名为vender.js的文件
          name: 'vender',
        },
        default: {
          minChunks: 2,
          priority: -20,
          name: 'common',
          // filename: 'js/common.js',
          reuseExistingChunk: true, // 是否复用已经打包过的代码
        },
      },
    },
    // Figure out which exports are used by modules to mangle export names, omit unused exports and generate more efficient code.
    // 即使用tree-shaking
    usedExports: true,
  },
})
