

// 开发环境，启用监听
const webpackConfig = {
  watch: true,
  watchOptions: {
    poll: 1000, // 监测修改的时间(ms)
    aggregateTimeout: 500, // 防止重复按键，500毫米内算按键一次
    ignored: /node_modules/, // 不监测
  },
  mode: 'development',
};

module.exports = webpackConfig;
