import { install } from '../../install.js';
import Login from './page/login.vue';
// 安装组件
install('login', Login, () => {
  // 自动初始化组建
  const loginDom = document.createElement('div');
  loginDom.innerHTML = '<login></login>';
  document.body.appendChild(loginDom);
  new Vue({
    el: loginDom,
  });
});
