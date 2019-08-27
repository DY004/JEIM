const gulp =   require('gulp');//打包工具
const del = require('del');//删除文件
const runSequence = require('gulp-run-sequence');//任务执行顺序
require('./config/package/gulp/gulp-build');
//主入口
gulp.task('build', function (cb) {
  runSequence('clean', 'build-ext', 'build-resourse','build-rev',cb);
});

//删除build,dist
gulp.task('clean', function () {
  return del([__dirname + '/dist']);
});
