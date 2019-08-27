# IM即时通讯 1.0.0

## 项目简介
**IM即时通讯**，是基于 [**JEPAAS低代码开发平台**](https://gitee.com/jepaas/jepaas/blob/develop/README.md) 的一套站内社交、企业办公、多功能业务产品。



## 功能特性
- 好友聊天
- 群组聊天
- 通讯录

## 项目结构
```
插件目录：src/vue/modules/im

├─actions           //ajax二次封装接口返回数据
│  ├─dialog.js      //会话列表
│  ├─group.js       //讨论组
│  └─organ.js       //组织树
├─assets            //资源文件
├─common            //公共类库
│  ├─eventBus.js    //组件传值，事件总线
│  ├─fetch.js       //数据请求
│  ├─params.js      //常量
│  └─util.js        //公用方法
├─components        //组件
│  ├─emoji          //表情
│  ├─search.vue     //搜索
│  └─tree.vue       //组织树
├─controller        //控制器
├─model             //数据模型
├─pages             //页面
├─styles            //样式
└─index.js          //入口文件
```

## 安装部署
- 代码集成（参考项目代码集成）
- 添加 IM 启用变量【JE_IM_ENABLE】，功能菜单：开发->核心引擎->系统变量
  ![](images/JE_IM_ENABLE.PNG)
- 清空变量缓存，刷新页面开始使用


