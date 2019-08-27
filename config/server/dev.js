/**
 * 代理服务
 */
const express = require('express');
const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs');
const request = require('request');
const chalk = require('chalk');
// 控制台输出颜色
EventEmitter.prototype._maxListeners = 100;
// 配置信息
const config = require('./../config.js');

const serverUrl = config.proxyServerUrl;
const cdn = config.cdn || '';
if (!config.proxyServerUrl) {
  console.log(chalk.red('请在config/config.json中配置代理服务器地址：proxyServerUrl'));
  process.exit();
  return;
}
// 服务对象
const app = express();
if (cdn.length) {
  // 如果有cdn，将hash-map改为本地
  app.all(['/', '/index.html'], (req, res) => {
    request(`${serverUrl}/index.html`, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        body = body.replace(`${cdn}/static/js/hash-map.js`, '/static/js/hash-map.js');
        res.send(body);
      }
    });
  });
}


// 本地资源
const statics = [
  { router: '/login.html', proxy: '/dist/login.html' },
  { router: '/project-url-hashmap.js', proxy: '/dist/project-url-hashmap.js' },
  { router: '/login', proxy: '/dist/login' },
  { router: '/static', proxy: '/dist/static' },
  { router: '/static', proxy: `/config/resourse/${config.project}/static` },
  { router: '/plugin', proxy: '/dist/plugin' },
  { router: '/pro', proxy: '/dist/pro' },
  { router: '/pro', proxy: '/src/ext' },
];
statics.map((item) => {
  app.use(item.router, express.static(item.cdn ? item.cdn : path.resolve(__dirname, '../../', `.${item.proxy || item.router}`)));
});


// 路由代理
const routers = [
  { router: '/static', folder: 'STATIC', proxy: cdn }, // 静态资源
  { router: '/', folder: 'SERVER', proxy: serverUrl }, // 数据请求
];

routers.map((item) => {
  if (item.proxy) {
    const { folder } = item; // 目录描述
    const { proxy } = item; // 代理
    app.use(item.router, (req, res) => {
      console.log(chalk.gray(`[${folder}] ${proxy}`) + req.originalUrl);
      let url = proxy + req.originalUrl;

      // 添加本地映射
      if (req.originalUrl.startsWith('/static/js/hash-map.js')) {
        request(url, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            const _dt = new Date().getTime();
            body += [
              ';\n',
              'window.__online_info__.cdn="";',
              `document.write('<script type="text/javascript" src="/project-url-hashmap.js?${_dt}"></script>');`,
            ].join('');
            res.send(body);
          }
        });
      } else {
        // 如果本地没有，请求cdn
        if (proxy != cdn && ['pro', 'plugin'].includes(req.originalUrl)) {
          const file = path.resolve(__dirname, '../../', `dist${req.originalUrl.split('?')[0]}`);
          if (!fs.existsSync(file)) {
            url = (cdn || proxy) + req.originalUrl;
          }
        }
        // 如果请求出错，404
        req.pipe(request(url)).on('error', (err) => {
          console.log(chalk.red(`[Error] ${err.message}`));
          console.log(chalk.red(url));
          res.status(404).end();
        }).pipe(res);
      }
    });
  }
});
// 打包vue文件
require('./../package/webpack/webpack.js');

// 启动服务
app.listen(config.serverPort, config.server, () => {
  console.log('');
  console.log(`本地服务已启动，请访问：${chalk.green(`http://localhost:${config.serverPort}`)}`);
  console.log('');
});
