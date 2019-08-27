

const webpack = require('webpack');
const chalk = require('chalk');
const util = require('./util');
const webpackConfig = require('./webpack.config.js')(util);

util.consoleInfo('开始构建vue项目');
// 入口文件
const entrys = Object.keys(webpackConfig.entry);

if (entrys.length === 0) {
  console.log(chalk.red('请先配置config下的entry入口目录'));
  process.exit();
}
// 删除目录
util.removeEntry(entrys);
// 构建标识
let initBbuild = false;
webpack(webpackConfig, (err, stats) => {
  if (!initBbuild) {
    process.stdout.write(
      `${stats.toString({
        assets: true,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        warnings: false,
      })}\n\n`
    );
    util.buildViews(entrys);
    initBbuild = true;
    if (!stats.hasErrors()) {
      console.log(chalk.cyan(' 构建成功！\n'));
    }
  } else {
    // 只输出修改的文件
    const { assets } = stats.compilation;
    for (const key in assets) {
      const file = assets[key];
      const entry = key.split('/')[0];
      if (file.emitted) {
        console.log(chalk.cyan(`[${entry}]：`), chalk.green(key));
      }
    }
    console.log(chalk.gray(new Date(stats.endTime).toString()), '\n');
  }
  util.copyComment(entrys);
});
