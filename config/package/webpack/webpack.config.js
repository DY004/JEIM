

const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (util) => {
  const { config } = util;// 系统配置信息
  const root = path.resolve(__dirname, '../../../');// 根目录
  const output = path.resolve(__dirname, '../../../', 'dist');// 输出目录
  const srcRoot = path.resolve(__dirname, '../../../', 'src/vue');// 源码目录
  const { dev } = util;

  let cfg = {};
  if (dev) {
    cfg = require('./webpack.dev.js');
  } else {
    cfg = require('./webpack.prod.js');
  }

  const entry = util.buildEntry();
  const entrys = Object.keys(entry);
  // 构建登录页
  const plugins = [];
  if (entrys.includes('pro/login')) {
    const { loginConfig } = config;
    const dt = new Date().getTime();
    config.loginImgs.forEach((attr) => {
      loginConfig[attr] && (loginConfig[attr] += `?${dt}`);
    });
    plugins.push(new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../../', 'config/package/tpl/login.html'),
      inject: false,
      filename: 'login.html',
      chunks: ['pro/login'],
      minify: true, // 不压缩
      config: config.loginConfig,
      images: config.loginImgs,
      cdn: dev ? '' : config.cdn || '',
    }));
  }

  return merge({
    entry,
    context: root,
    devtool: 'none',
    externals: { // 不打包的第三方库
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'element-ui': 'ELEMENT',
    },
    stats: {
    },
    output: {
      path: output,
      filename: dev ? '[name]/index.min.js' : '[name]/index.min-[contenthash:10].js',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.css', '.less'],
      alias: {
        '@': root,
        '@_src': srcRoot,
      },
    },
    module: {
      rules: [
        {
          test: /\.(css|postcss|scss)(\?.*)?$/,
          include: srcRoot,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(css|postcss|less)(\?.*)?$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            { loader: 'less-loader', options: { javascriptEnabled: true } },
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: srcRoot,
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          include: srcRoot,
          options: {
            limit: 10000,
            publicPath: util.buildPublicPath,
            name(url) {
              return util.buildAssetsUrl(url, 'images', entrys);
            },
          },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          include: srcRoot,
          options: {
            limit: 10000,
            publicPath: util.buildPublicPath,
            name(url) {
              return util.buildAssetsUrl(url, 'media', entrys);
            },
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          include: srcRoot,
          options: {
            limit: 10000,
            publicPath: util.buildPublicPath,
            name(url) {
              return util.buildAssetsUrl(url, 'fonts', entrys);
            },
          },
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({ // 抽取css
        filename: dev ? '[name]/index.min.css' : '[name]/index.min-[contenthash:10].css',
        chunkFilename: dev ? '[name]/index.min.css' : '[name]/index.min-[contenthash:10].css',
      }),
      ...plugins,
    ],
  }, cfg);
};
