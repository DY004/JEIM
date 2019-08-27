import 'babel-polyfill'
/**
 * 注册组件
 * @param {String} name 组件标签，模块名要与标签名一致
 * @param {Object} cfg 配置项
 * @param {Function} callback 声明组件后的回调函数
 */
export function install(name,cfg,callback) {
    if(!window.Vue)return;
    window.Vue.component(name, cfg);
    callback && callback();
}