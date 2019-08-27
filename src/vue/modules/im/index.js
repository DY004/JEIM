/*
 * @Author: Qinyonglian
 * @Date: 2019-08-20 15:16:12
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-21 16:20:38
 */
import { install } from '../../install.js';
import index from './pages/index';
import Organ from './controller/Organ';
// 编辑器
const js = [
  '/static/ux/editor/ueditor1_4_3/ueditor.JEconfig.js',
  '/static/ux/editor/ueditor1_4_3/ueditor.all-min.js',
  '/static/ux/editor/ueditor1_4_3/formdesign/leipi.form.design.js',
  '/static/ux/editor/ueditor1_4_3/lang/zh-cn/zh-cn.js ',
];
JE.loadScript(js);

// 安装组件
install('im', index, () => {
  // 自动初始化组建
  const chatContent = document.createElement('div');
  chatContent.innerHTML = '<im></im>';
  document.body.appendChild(chatContent);
  Organ.init(JE.USER.zhId).then(() => {
    new Vue({
      el: chatContent,
    });
  });
});
