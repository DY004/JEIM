

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

// 生产环境
const webpackConfig = {
  watch: false,
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            safari10: true,
          },
        },
        sourceMap: false,
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },
  plugins: [
    /*
      new BundleAnalyzerPlugin({
        analyzerPort: 8080,
        generateStatsFile: false
      }) */
  ],
};

module.exports = webpackConfig;
