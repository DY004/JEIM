import { install } from '../../install.js';
import index from './index.vue';

// 加载依赖平台信息
JE.loadScript(['/static/ux/moment/moment.min.js']);
// 安装组件
install('home', index);
