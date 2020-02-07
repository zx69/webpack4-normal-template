const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, //该方式可以让@import引入的css文件再次执行一边css打包loader
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    port: '8081',
    historyApiFallback: true, // 解决单页面路由问题，
    contentBase: '../dist',
    open: true,  //自动打开浏览器
    hot: true,  // 开启热替换, css代码跟新不刷新页面
    // proxy: {
    //   index: '', // 将index设置为空，可以对根路径进行转发
    //   'api/get': 'xxxx.com/api', // 第一种方式，直接代理到api路径
    //   'api/vue': {  // 第二种方式，在路径需要临时替换时使用
    //     target: 'xxxx.com/api',
    //     pathRewrite: {
    //       'head': 'demo'  //此时访问head路径将被代理到demo下
    //     },
    //     secure: false,  //对https请求的配置，false为支持https
    //     changeOrigin: true  //做代理分发时允许访问其他网站，突破网站限制，建议在开发环境使用
    //   },
    // }
  },
});
