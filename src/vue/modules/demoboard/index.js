import {install} from '../../install.js'
import index from './index.vue'

//加载依赖平台信息
JE.loadChartScript(true);
//安装组件
install('demoboard',index);