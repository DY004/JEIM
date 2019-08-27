
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const crypto = require('crypto');
const copyDir = require('copy-dir');
const config = require('../../config.js');

const entryDir = config.entryDir || 'src/vue/modules/';// 入口目录
const proFolder = 'pro';// 默认输出目录
const output = config.output || proFolder;// 输出目录
const rootFolder = '../../../';
module.exports = {
  config,
  dev: process.env.NODE_ENV === 'development', // 开发
  consoleInfo(text) {
    console.log('');
    console.log('--------------------------------------');
    console.log(chalk.green(text));
    console.log('--------------------------------------');
    console.log('');
  },
  /**
   * 复制公共资源
   */
  copyComment(entrys) {
    const commentAsset = path.resolve(__dirname, rootFolder, 'dist/_assets');
    if (fs.existsSync(commentAsset)) {
      let count = 0;
      entrys.forEach((entry) => {
        copyDir(commentAsset, path.resolve(__dirname, rootFolder, `dist/${entry}/assets`), () => {
          count++;
          if (entrys.length == count) {
            this.deleteFolder(commentAsset);
            console.log('公共资源复制成功！');
            this.hashMap();
          }
        });
      });
    } else {
      this.hashMap();
    }

    const files = glob.sync('dist/**/*.*.js');
    files.forEach((file) => {
      const dir = path.resolve(__dirname, rootFolder, file);
      let folder = file.split('/');
      folder.shift(); // 删除dist
      folder.pop(); // 删除文件名
      folder = [''].concat(folder).concat(['assets', '']);// 组建替换目录
      if (!this.dev && config.cdn) {
        folder.splice(0, 1, config.cdn);
      }
      let content = fs.readFileSync(dir, 'utf8');
      content = content.replace(/"\.\/assets\//g, `"${folder.join('/')}`);
      fs.writeFileSync(dir, content, 'utf8');
    });
    console.log('插件js资源引用路径替换完成！');
  },
  removeEntry(entrys) {
    entrys.forEach((entry) => {
      const dir = path.resolve(__dirname, rootFolder, `dist/${entry}`);
      if (fs.existsSync(dir)) {
        this.deleteFolder(dir);
        console.log(chalk.green(`${dir} 删除成功！`));
      }
    });
  },
  buildPublicPath(url) {
    let paths = url.split('/');
    if (paths[0] == '_assets') {
      paths.splice(0, 1, '.', 'assets');
    } else {
      paths = paths.splice(paths.indexOf('assets'), paths.length);
      paths.unshift('.');
    }
    url = paths.join('/');
    return url;
  },
  /**
     * 资源文件目录
     * @param {资源路径} url
     * @param {资源类型} type
     */
  buildAssetsUrl(url, type, entrys) {
    const modules = path.join(entryDir); let // 截取业务模块目录
      name = `assets/${type}/[name]-[hash:10].[ext]`;// 默认资源目录
    if (url.indexOf(modules) != -1) {
      const folders = url.split(modules)[1].split(path.sep);
      entrys.forEach((entry) => {
        const _entry = entry.split('/').pop();
        if (folders[0] == _entry) {
          name = `${entry}/${name}`;
          return false;
        }
      });
    } else {
      name = `_${name}`;
    }
    return name;
  },
  /**
     * 自动构建入口文件
     */
  buildEntry() {
    const entrys = {};
    // 动态读取入口
    const files = glob.sync(`./${entryDir}/*/index.js`);
    files.forEach((f) => {
      const folders = f.split('/');
      let entry = folders[folders.length - 2];
      // 过滤入口文件
      if (config.entry && config.entry.length > 0) {
        if (!config.entry.includes(entry)) {
          entry = undefined;
        }
      }
      if (entry) {
        const configFile = path.resolve(__dirname, rootFolder, f.replace('index.js', 'config.json'));
        let _output = output;
        if (fs.existsSync(configFile)) {
          const cfg = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
          if (cfg.output && cfg.output.length > 0) {
            _output = cfg.output == entry ? '' : cfg.output.toLowerCase();
          }
        }
        entrys[`${_output}/${entry}`] = f;
      }
    });
    return entrys;
  },
  /**
     * 构建extjs视图文件
     */
  buildViews(entrys) {
    if (config.view == false) return;

    // 写入的文件夹
    const writeDir = path.join(__dirname, rootFolder, 'dist');
    // 模板
    const tpl = fs.readFileSync(path.join(__dirname, '../', 'tpl/View.js'), 'utf8');
    entrys.forEach((entry) => {
      const classArray = entry.split('/');
      const xtype = classArray.join('.').toLowerCase();
      classArray[0] = classArray[0].toUpperCase();// 包名大写
      classArray.push('View');
      const className = classArray.join('.');
      // 替换模版文件中的内容
      const info = tpl.replace(/{class}/g, className).replace(/{xtype}/g, xtype).replace(/{entry}/g, entry);
      let viewPath = '';
      if (this.dev) {
        viewPath = path.join(`${writeDir}/${entry}/View.js`);
      } else {
        const hash = crypto.createHash('md5').update(info).digest('hex').substr(0, 10);// MD5版本
        viewPath = path.join(`${writeDir}/${entry}/View-${hash}.js`);
      }
      fs.writeFileSync(viewPath, info, {
        encoding: 'UTF-8',
      });
    });
  },
  /**
     * 驼峰转-
     * @param {String} name
     */
  toLine(name) {
    return name.replace(/([A-Z])/g, '-$1').toLowerCase();
  },
  /**
   * 删除目录
   * @param {String} path 路径
   */
  deleteFolder(folder) {
    const me = this; let
      files = [];
    if (fs.existsSync(folder)) {
      files = fs.readdirSync(folder);
      files.forEach((file) => {
        const curPath = path.join(folder, file);
        if (fs.statSync(curPath).isDirectory()) { // recurse
          me.deleteFolder(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folder);
    }
  },
  hashMap() {
    if (config.hashMap == false) return;
    const hash = {};
    const distFolder = ['pro', 'plugin'];
    const folders = [{ base: 'dist/', exclude: ['login.html', '_assets/'] }, {
      base: 'src/ext/', dev: true, exclude: [], folder: `${proFolder}/`,
    }];
    folders.forEach((item) => {
      if (!item.dev || item.dev && this.dev) {
        const files = glob.sync(`${item.base}/**/*`);
        files.forEach((file) => {
          file = file.replace(item.base, item.folder || '');
          const paths = file.split('/');
          const hashName = paths.pop();
          if (hashName.includes('.')) {
            let flag = true;
            item.exclude.forEach((ex) => {
              if (file.startsWith(ex)) {
                flag = false;
                return false;
              }
            });
            if (flag) {
              const name = hashName.replace(/[-.](\d|[a-z]){10}/, '');
              // 项目文件映射信息，放入统一文件
              hash[paths.concat([name]).join('/')] = paths.concat([hashName]).join('/');
            }
          }
        });
      }
    });
    // 项目文件映射信息，放入统一文件
    let content = `window.__online_info__ && (window.__online_info__.hash_map=Object.assign({}, window.__online_info__.hash_map,${JSON.stringify(hash)}));`;
    // 复写样式
    const css = 'static/project/override.css';
    const cssFile = path.resolve(__dirname, '../../resourse', config.project, css);
    if (fs.existsSync(cssFile)) {
      const _dt = new Date().getTime();
      content += `document.write('<link rel="stylesheet" href="'+(window.__online_info__ && window.__online_info__.cdn || '')+'/${css}?${_dt}" />');`;
    }
    fs.writeFileSync(path.resolve(path.resolve(__dirname, rootFolder, 'dist'), 'project-url-hashmap.js'), content, 'utf-8');
    console.log(chalk.gray('<<<<<< project-url-hashmap.js 构建完成 '));
  },
};
