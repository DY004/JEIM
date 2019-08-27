module.exports = {
  remark: 'JEPAAS绿色版',
  cdn: '',
  proxyServerUrl: 'http://localhost:8080', // 代理服务器地址
  entry: ['home', 'login', 'demoboard', 'im'], // 打包的入口
  loginConfig: { // 登录配置
    TITLE: 'JEPaaS云平台', // 名称
    ICO: '/static/favicon.ico',
    LOGO: '/static/project/login/logo.png', // logo
    BGIMG: '', // 登录背景图,
    BGIMGBLUR: '', // 登录背景图-小图,
    FINDPASSWORD: true, // 找回密码,
    FASTLOGIN: true, // 快捷登录
    OTHERLOGIN: { // 其他登录
      DTTALK: true, // 钉钉
      WECHAT: true, // 微信
      QQ: true, // QQ
      APP: true, // 轻云蒜瓣app
      PHONE: true, // 动态登录
    },
    ACCOUNT: [// 账户类型
      { type: 'USERNAME', enable: false, text: '用户名' }, // 允许用户名登录
      { type: 'ACCOUNT', enable: true, text: '账号' }, // 允许账号登录
      { type: 'PHONE', enable: true, text: '手机' }, // 允许手机登录
      { type: 'EMAILE', enable: false, text: '邮箱' }, // 允许邮箱登录
      { type: 'JOBNO', enable: false, text: '工号' }, // 允许工号登录
    ],
  },
};
