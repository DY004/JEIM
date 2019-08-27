const gulp = require('gulp');//打包工具
const chalk = require('chalk');//控制台输出颜色
const path = require('path');//路径
const fs = require('fs');//路径
const uglify = require('gulp-uglify');//压缩混淆js
const minifyCss = require("gulp-minify-css");//压缩混淆css
const rev = require('gulp-rev');//
const revCollector = require('gulp-rev-collector');//
const filter = require('gulp-filter');//过滤器
const mergeStream = require('merge-stream');//合并任务流
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const util = require('./../webpack/util');
const config = util.config;

const jsFilter = filter(['**/*.js'], { restore: true });
const cssFilter = filter(['**/*.css'], { restore: true });
const proFolder = 'pro';
//构建项目
gulp.task('build-ext', function () {
  if (!fs.existsSync(path.resolve(__dirname,'../../../','src/ext'))){
    return;
  }
  util.consoleInfo('开始构建项目');
  let folder = ['src/ext/**/*'];
  //打包包含的入口文件
  if (config.entry && config.entry.length > 0) {
    folder = [];
    config.entry.forEach((entry) => {
      folder.push(`src/ext/${entry}/**/*`);
    });
  }
  return gulp.src(folder, { base: 'src/ext' })
    .pipe(jsFilter)
    .pipe(babel({
        "plugins": ["transform-remove-strict-mode"]
    }))
    .pipe(uglify())
    .on('error', function (e) {
      console.log(e);
    })
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore)
    .pipe(rev())
    .pipe(gulp.dest('dist/' + proFolder))
    .on('end', function () {
      console.log(chalk.gray('<<<<<< 构建完成 '));
    });
});
//监听
gulp.task('watch', function () {
  console.log(chalk.green('开启 src/ext/**/* 文件监听'));
  return watch('./src/ext/**/*', function () {
    util.hashMap();
  });
});
//资源文件
gulp.task('build-resourse', function () {
  util.consoleInfo('开始构建resourse资源');
  var base = `config/resourse/${config.project}`;
  let folder = [`${base}/**/*`];

  //处理登录图片
  var loginCfg = config.loginConfig;
  var imgs = [];
  config.loginImgs.forEach((attr)=>{
    var img = loginCfg[attr];
    if(img && img.length){
      folder.push('!**/'+img);
      imgs.push(base+'/'+img);
    }
  })
  //hash后缀
  const resourse = gulp.src(folder)
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest('resourse.json'))
    .pipe(gulp.dest('dist'));

    //配置的文件，不缓存
  const file = gulp.src(imgs, { base: base })
      .pipe(gulp.dest('dist'))
  return mergeStream(resourse,file)
    .on('end', function () {
      console.log(chalk.gray('<<<<<< Resourse 构建完成 '));
    });
});

gulp.task('build-rev',()=>{
  //映射hash
  return gulp.src(['dist/resourse.json', 'dist/static/**/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist/static'))
    .on('end', () => {
      var file = path.resolve(__dirname, '../../../', 'dist/resourse.json');
      if (fs.existsSync(file)) {
        var hashMap = JSON.parse(fs.readFileSync(file));
        var css = 'static/project/override.css',
          hashCss = hashMap[css];
        if (hashCss) {
          fs.renameSync(path.resolve(__dirname, '../../../dist', hashCss), path.resolve(__dirname, '../../../dist', css));
        }
        fs.unlinkSync(file);
      }
      //构建hash-map.js
    });
})
