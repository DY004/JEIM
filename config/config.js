
const merge = require('webpack-merge');
const fs = require('fs');
const path = require('path');

// 基础配置
let config = {
  server: '0.0.0.0',
  serverPort: '3001',
  project: process.env.PROJECT || 'jepaas', // 项目文件
};
const dev = process.env.NODE_ENV === 'development';// 开发环境
// eslint-disable-next-line import/no-dynamic-require
config = merge(config, require(`./config/${config.project}.js`));
// 自定义配置
const custom = path.resolve(__dirname, 'config.json');
if (dev && fs.existsSync(custom)) {
  config = merge(config, require('./config.json'));
}

// 处理登录logo
if (config.loginConfig) {
  config.loginImgs = ['ICO', 'LOGO', 'BGIMG', 'BGIMGBLUR'];
  config.loginImgs.forEach((attr) => {
    const img = config.loginConfig[attr];
    config.loginConfig[attr] = img.startsWith('/') ? img.substring(1) : img;
  });
}
module.exports = config;
