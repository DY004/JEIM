import Cookies from 'js-cookie';
import dragVerify from 'vue-drag-verify';
import {
  fetchLogin,
  fetchSendValidateCode,
  fetchUpdatePwd,
  fetchGetIndustry,
  fetchCheckValidate,
  fetchSearchUserCode,
  fetchSetQRcode,
  fetchQRlogin,
  fetchState,
  checkingUser,
  phoneBlur,
} from '../js/login';
import {
  QQ_APPID,
  QQ_REDIRECT_URI,
} from '../js/config';
import {
  loadCache,
  generateQRcode,
  dingTalkLogin,
  weChatLogin,
  getDingTalkUserInfo,
  getWeChatUserInfo,
} from '../js/loginUtil.js';
import {
  getParam,
} from '../js/common.js';
import loginLogo from '../assets/logo.png';
import loginBgimg from '../assets/bg/plus_bg_01_h.jpg';
import loginBgimgblur from '../assets/bg/plus_bg_01_s.jpg';
import LOGIN_CONFIGPZ from './login_config.js';

export default {
  name: 'Login',
  components: {
    dragVerify,
  },
  data() {
    // 登录验证密码还是验证码
    const validatePass = (rule, value, callback) => {
      if (!this.isNoteLogin) {
        if (!this.loginFrom.pwd) {
          return callback(new Error('请输入密码'));
        }
        callback();
      } else {
        if (!this.loginFrom.validateCode) {
          return callback(new Error('请输入短信验证码'));
        }
        callback();
      }
    };
    // 验证短信验证码
    const validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入短信验证码'));
      }
      callback();
    };
    // 验证账号
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账号'));
      }
      callback();
    };
    // 验证两次密码是否一致
    const validatePass2 = (rule, value, callback) => {
      if (this.findPwdFrom.oldPwd !== this.findPwdFrom.newPwd) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    // 验证密码
    const validateFindPwdPass = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!value) {
        callback(new Error('请输入密码!'));
      } else if (!reg.test(value)) {
        callback(new Error('密码格式不正确，请输入6位以上字母+数字'));
      } else {
        callback();
      }
    };
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!value) {
        callback(new Error('请输入邮箱!'));
      } else if (!reg.test(value)) {
        callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    };
    // 验证企业
    const validateEnterpriseName = (rule, value, callback) => {
      const reg = /^[\u4E00-\u9FA5]+$/;
      if (!value) {
        callback(new Error('请输入企业!'));
      } else if (!reg.test(value)) {
        callback(new Error('企业名称格式不正确'));
      } else {
        callback();
      }
    };
    // 验证姓名
    const validateName = (rule, value, callback) => {
      const reg = /^[\u4E00-\u9FA5A-Za-z]+$/;
      if (!value) {
        callback(new Error('请输入真实姓名!'));
      } else if (!reg.test(value)) {
        callback(new Error('真实姓名格式不正确'));
      } else {
        callback();
      }
    };
    // 根据页面变量替换默认值
    const LOGIN_CONFIG = window.LOGIN_CONFIG || LOGIN_CONFIGPZ;

    return {
      LOGIN_CONFIG,
      LOGIN_CONFIG_LOGO: LOGIN_CONFIG.LOGO || loginLogo,
      LOGIN_CONFIG_BGIMG: LOGIN_CONFIG.BGIMG || loginBgimg,
      LOGIN_CONFIG_BGIMGBLUR: LOGIN_CONFIG.BGIMGBLUR || loginBgimgblur,
      handlerIcon: 'el-icon-d-arrow-right1',
      successIcon: 'el-icon-circle-check',
      background: '#F5F5F5',
      progressBarBg: '#BBEA94',
      completedBg: '#BBEA94',
      handlerBg: '#fff',
      text: '请将滑块拖动到右侧',
      successText: '验证通过',
      width: 338,
      height: 32,
      textSize: '12px',
      isCircle: 'true',
      dragVerifyinput: false,
      dragVerifycode: '',

      typeText: '', // 快捷登录
      appInfo: {},
      isLoaded: true, // 是否加载完成
      login: true,
      showMessageFlag: false, // 表单不显示错误提示
      form: {},
      remberStatus: true, // 是否记住登录状态
      level: 0, // 密码强度
      pwd: '', // 登录用密码
      validateCode: '', // 登录用验证码
      loginFrom: {
        phone: '',
        pwd: '',
        validateCode: '',
      }, // 登录
      rulesLoginFrom: {
        phone: [{
          validator: validatePhone,
          trigger: 'blur',
        }],
        pwd: [{
          validator: validatePass,
          trigger: 'blur',
        }],
        validateCode: [{
          validator: validatePass,
          trigger: 'blur',
        }],
      },
      loginFormErrorMsg: '',
      loginType: true, // 登录类型
      isNoteLogin: false, // 密码输入方式 /是否验证码
      sendAuthCode: true, // 验证码
      auth_time: 0, // 验证码时间
      findPwd: false, // 找回密码
      findPwdFrom1: {}, // 找回密码
      rulesfindPwdFrom1: {
        phone: [{
          validator: validatePhone,
          trigger: 'blur',
        }],
        validateCode: [{
          validator: validateCode,
          trigger: 'blur',
        }],
      },
      findPwdForm1ErrorMsg: '', // 错误是
      findPwdFrom: {}, // 找回密码
      rulesfindPwdFrom: {
        oldPwd: [{
          validator: validateFindPwdPass,
          trigger: 'blur',
        }],
        newPwd: [{
          validator: validatePass2,
          trigger: 'blur',
        }],
      },
      findPwdFormErrorMsg: '', // 错误
      findPwdState: '1', // 找回密码
      updateSuccess: false, // 密码修改成功
      showQrCode: false, // 显示二维码
      bgImgUrlIn: '', // 背景图片
      bgImgUrlOut: '', // 背景图片
      showImg: false, // 背景图片
      filterBlur: 20, // 背景图片效果
      showCompany: false, // 显示公司
      companyList: [], // 公司列表
      industryList: [], // 行业列表
      dsfState: '', // 第三方登录的state
      placeHoldertext: '',
    };
  },
  computed: {},
  watch: {
    loginFrom: {
      deep: true,
      handler(newVal, oldVal) {
        // this.pwd = ''
        this.validateCode = '';
      },
    },
  },
  created() {
    const state = getParam(window.location.href, 'state');
    if (state) {
      const app = state.substring(0, 2);
      this.isLoaded = false;
      if (app === 'DT') {
        this.getAppUserInfo('dt');
      } else if (app === 'WX') {
        this.getAppUserInfo('wx');
      }
    }
  },
  mounted() {
    if (Cookies.get('phone')) {
      this.loginFrom.phone = Cookies.get('phone');
    }
    // 回车登录
    document.onkeydown = (event) => {
      const e = event || window.event;
      if (e && e.keyCode === 13) {
        if (this.loginType && this.login) {
          this.loginSubmit('loginFrom');
        }
      }
    };
    loadCache();
  },
  methods: {
    // 登录
    loginSubmit(formName) {
      if (!this.isNoteLogin) {
        if (!this.loginFrom.pwd) {
          this.loginFrom.pwd = this.pwd;
        }
      }
      if (this.dragVerifyinput) {
        const { isPassing } = this.$refs.Verify;
        if (!isPassing) {
          this[this.formErrorMsg('loginFrom')] = '请先滑动解锁';
          return;
        }
      }
      this.$refs[formName].validate(async (valid, fields) => {
        if (valid) {
          if (this.isNoteLogin) {
            // 校验验证码
            const validateCodeRes = await this.validatePhoneCode(
              this.loginFrom.phone,
              'LOGIN',
              this.loginFrom.validateCode
            );
            if (!validateCodeRes.success) {
              // this.messageTip(validateCodeRes.msg || validateCodeRes.message)
              this[this.formErrorMsg('loginFrom')] = validateCodeRes.msg || validateCodeRes.message;
              return false;
            }
            this.sendLogin('code', {
              j_username: this.loginFrom.phone,
              j_code: this.loginFrom.validateCode,
              state: '',
            });
            this.$nextTick(() => {
              this.clearCookie('__jeplus_info__');
              this.clearCookie('__qc_wId');
              this.clearCookie('authorization');// 删除cookie值
              this.clearCookie('pgv_pvid');
              this.clearCookie('phone');
            });
          } else {
            this.sendLogin('pwd', {
              j_username: this.loginFrom.phone,
              j_password: this.loginFrom.pwd || this.pwd,
              j_code: this.dragVerifycode,
            });
            this.$nextTick(() => {
              this.clearCookie('__jeplus_info__');
              this.clearCookie('__qc_wId');
              this.clearCookie('authorization');// 删除cookie值
              this.clearCookie('pgv_pvid');
              this.clearCookie('phone');
            });
          }
        } else {
          this.formError('loginFormErrorMsg', fields);
        }
      });
    },
    clearCookie(name) {
      this.setCookie(name, '', -1);
    },
    setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = `expires=${d.toUTCString()}`;
      document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;// path=/是根路径
    },
    // 找回密码第一步
    findPwdFrom1Next(formName) {
      this.$refs[formName].validate(async (valid, fields) => {
        if (valid) {
          // 校验验证码
          const validateCodeRes = await this.validatePhoneCode(
            this.findPwdFrom1.phone,
            'ZH',
            this.findPwdFrom1.validateCode
          );
          this.findPwdState = '3';
        } else {
          this.formError('findPwdForm1ErrorMsg', fields);
        }
      });
    },
    // 找回密码第三步提交
    findPwdLogin(formName) {
      this.$refs[formName].validate(async (valid, fields) => {
        if (valid) {
          const params = {
            j_username: this.findPwdFrom1.phone,
            j_password: this.findPwdFrom.oldPwd,
            code: this.findPwdFrom1.validateCode,
            type: 'PHONE',
            j_dept: this.findPwdFrom1.deptId,
          };
          const res = await fetchUpdatePwd(params);
          if (res.success) {
            this.updateSuccess = true;
            this.findPwd = false;
          } else {
            // this.messageTip('设置密码失败')
            this[this.formErrorMsg('findPwdFrom')] = '设置密码失败';
          }
        } else {
          this.formError('findPwdFormErrorMsg', fields);
        }
      });
    },
    // 处理登录类型占位符
    placeHolder(account) {
      let placeHoldertext = '';
      account.filter((accountitem) => {
        if (accountitem.enable) {
          placeHoldertext += `${accountitem.text}/`;
        }
      });
      return placeHoldertext.substr(0, placeHoldertext.length - 1);
    },
    // 获取验证码
    async getValidateCode(phone, type, formName) {
      let message = '';
      if (!phone) {
        message = '请输入手机号/账户';
      } else {
        const regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!regPhone.test(phone)) {
          message = '手机号格式不正确，需重新输入';
        }
      }
      this[this.formErrorMsg(formName)] = message;
      if (this.sendAuthCode && !message) {
        const res = await fetchSendValidateCode({
          email: phone,
          type: 'PHONE',
          cz: type,
        });
        if (res.success) {
          this.sendAuthCode = false;
          this.auth_time = 59;
          // this.messageTip('验证码发送成功', 'success')
          const auth_timetimer = setInterval(() => {
            this.auth_time--;
            if (this.auth_time <= 0) {
              this.sendAuthCode = true;
              clearInterval(auth_timetimer);
            }
          }, 1000);
        } else {
          this[this.formErrorMsg(formName)] = res.msg || res.message;
          // this.messageTip(res.msg || res.message)
        }
      }
    },
    // 验证验证码
    validatePhoneCode(phone, type, code) {
      return fetchCheckValidate({
        email: phone,
        type: 'PHONE',
        cz: type,
        code,
      });
    },
    // 验证表单字段
    customValidateForm(formName, Booleans) {
      const fieldsStr = this.formErrorMsg(formName);
      if (Booleans) {
        // const regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})||(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        const { phone } = this.loginFrom;
        // if (!regPhone.test(phone)) {
        if (!phone.trim()) {
          // let message = '手机号格式不正确，需重新输入';
          const message = '登录账号不能为空，请重新输入';
          this[this.formErrorMsg(formName)] = message;
        } else {
          // 如果是手机号失去焦点  请求后台   处理滑动解锁是否展示
          this.isShowDragVerify(phone);
        }
      } else {
        this.$refs[formName].validate((valid, fields) => {
          if (valid) {
            this[fieldsStr] = '';
          } else {
            for (const prop in fields) {
              if (this[fieldsStr] !== fields[prop][0].message) {
                this[fieldsStr] = '';
              }
              break;
            }
          }
        });
      }
    },
    // 手机号失去焦点，请求后台接口
    async isShowDragVerify(phone) {
      // 请求后台
      // 规则说明：
      // 1、密码登录，密码错误2次后，显示 滑动验证区域。
      // 2、滑动操作后，允许点击登录按钮。
      // 注：1、输入手机号后，失去焦点，需要调用后台方法，获取该手机号登录密码错误次数。
      //  2、显示 滑动验证时，需要调用后台接口，获取验证码。
      //  3、点击登录时，需要后台校验 滑动验证 是否通过。
      //  4、密码错误5次，禁用账号

      // const isPassing = this.$refs.Verify.isPassing;
      const phoneafterBlur = await phoneBlur({ j_username: phone });
      if (!phoneafterBlur.success) {
        this.dragVerifyinput = true;
        this.dragVerifycode = phoneafterBlur.obj;
      }
    },
    // 对应表单的错误提示字段
    formErrorMsg(formName) {
      let errorMsg;
      switch (formName) {
        case 'loginFrom':
          errorMsg = 'loginFormErrorMsg';
          break;
        case 'findPwdFrom1':
          errorMsg = 'findPwdForm1ErrorMsg';
          break;
        case 'findPwdFrom':
          errorMsg = 'findPwdFormErrorMsg';
          break;
      }
      return errorMsg;
    },
    // 表单提示
    formError(label, fields) {
      for (const prop in fields) {
        this[label] = fields[prop][0].message || '';
        return false;
      }
    },
    // 密码强度检查
    pwdStrengthWatch(val) {
      const reg1 = /^[a-z0-9]{6,20}$/;
      if (val && val.length >= 6) {
        if (!reg1.test(val)) {
          this.level = 3;
        } else {
          this.level = 2;
        }
      } else {
        this.level = 0;
      }
    },
    // 重置校验规则
    resetForm(formName) {
      const oldPhone = this.loginFrom.phone;
      this.$refs[formName].resetFields();
      if (formName === 'loginFrom') {
        this.loginFrom.phone = oldPhone;
      }
    },
    // 快捷登录扫码返回
    quickLoginBack() {
      this.showQrCode = false;
    },
    // 获取用户名下公司
    async getUserList(phone, password) {
      const params = {
        userCode: phone,
      };
      if (password) {
        params.password = password;
      }
      const userRes = await fetchSearchUserCode(params);
      if (userRes.success) {
        this.companyList = userRes.obj;
      } else {
        this.companyList = [];
      }
      return userRes;
    },
    // 发送登录
    async sendLogin(type, params) {
      /* params.expiration = this.remberStatus ? '1' : '0'
      params.clientType = 'PC' */
      let param = {};
      if (type === 'code') {
        param = {
          j_username: params.j_username,
          loginType: 'PHONE',
          j_code: params.j_code,
          state: params.state,
          isNew: 1,
        };
      } else if (type === 'pwd') {
        param = {
          j_username: params.j_username,
          j_password: params.j_password,
          code: params.j_code,
          isNew: 1,
        };
      } else if (type === 'dsf') {
        param = params;
      }

      const res = await fetchLogin(param);
      if (res.success) {
        if (param.j_username) {
          Cookies.set('phone', param.j_username, {
            expires: 30,
          });
        }
        if (res.code === 'OK') {
          Cookies.set('authorization', res.obj, {
            expires: 365,
          });
          // this.$message('登录成功！');
          window.location.href = '/index.html';
        } if (res.code === 'CHECK') {
          /* Cookies.set('authorization', res.obj, {
            expires: 365
          }); */
          // location.href = '/index.html';
          this.companyList = JSON.parse(res.obj);
          this.login = false;
          this.showCompany = true;
        }
      } else {
        // 滑动解锁 赋予新的code值
        if (res.code == 'WARNCODE') {
          this.dragVerifycode = res.obj;
          this.dragVerifyinput = true;
          // this[this.formErrorMsg('loginFrom')] = '';
        } else if (res.code == 'NOTCERTIFIED') {
          this.$notify({
            title: '提示',
            message: '第三方认证失败，请先账号密码登录进行认证！',
            duration: 0,
          });
        }
        this[this.formErrorMsg('loginFrom')] = res.message || res.msg;
        // this.$message(res.message || res.msg);
        // this.messageTip(res.message || res.msg)
      }
    },
    // 背景图片
    loadedImg() {
      let count = 10;
      const timeClear = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(timeClear);
          this.showImg = true;
        }
        this.filterBlur = `blur(${count}px)`;
      }, 50);
    },
    // 快捷登录
    async otherLogin(type) {
      window.loginVue = this;
      this.showQrCode = true;
      this.dsfState = await this.getState(type);

      switch (type) {
        case 'DT':
          this.typeText = '钉钉';
          dingTalkLogin('qr_container', this.dsfState);
          break;
        case 'WX':
          this.typeText = '微信';
          weChatLogin('qr_container', this.dsfState);
          break;
        case 'QQ':
          this.showQrCode = false;
          QC.Login.showPopup({
            appId: QQ_APPID,
            redirectURI: `${QQ_REDIRECT_URI}&state=${this.dsfState}`,
            state: this.dsfState,
          });
          console.log(QC.Login.check());
          if (QC.Login.check()) {
            QC.Login.getMe((openId, accessToken) => {
              console.log('accessToken', accessToken);
              window.qqAccessToken = accessToken;
              const qqurl = `https://graph.qq.com/oauth2.0/me?access_token=${accessToken}&unionid=1`;

              const fetchJsonp = function (url) {
                const body = document.getElementsByTagName('body')[0];
                // 插入一个script
                const script = document.createElement('script');
                script.setAttribute('src', url);
                body.appendChild(script);
              };

              // 插入一个script
              const script1 = document.createElement('script');
              script1.innerHTML = `function callback(data){window.loginVue.getOtherAppLogin({
                id: 'qq',
                authResult: {
                  access_token: window.qqAccessToken,
                  state:window.loginVue.dsfState,
                  unionId: data.unionid
                }
              })}`;
              document.body.appendChild(script1);
              // 调用
              fetchJsonp(qqurl);
            });
          } else {
            this.$notify({
              title: '提示',
              message: '第三方认证失败，请先账号密码登录进行认证！',
              duration: 0,
            });
          }
          break;
        case 'SB':
          this.typeText = '轻云蒜瓣';
          this.setQRcode(this.dsfState);
          break;
      }
    },
    /**
     * 获取状态码
     */
    async getState(type) {
      try {
        const stateLogin = await fetchState({ loginType: type, type: 'PC' });
        if (stateLogin.success) {
          return stateLogin.obj.STATE;
        }
        return '';
      } catch (e) {
        return `${type}_${new Date().getTime()}`;
      }
    },
    // 获取第三方登录用户信息
    async getAppUserInfo(type) {
      try {
        let res;
        if (type === 'dt') {
          res = await getDingTalkUserInfo();
        } else {
          res = await getWeChatUserInfo();
        }
        this.getOtherAppLogin({
          id: type,
          authResult: {
            openid: res.unionid,
            access_token: res.access_token,
          },
        });
      } catch (err) {
        this.isLoaded = true;
      }
    },
    // 获取其他app是否注册
    getOtherAppLogin(res) {
      if (res.authResult) {
        const state = getParam(window.location.href, 'state');
        this.sendLogin('dsf', {
          isNew: '1',
          state: state || res.authResult.state,
          code: res.authResult.unionId,
          cid: '', // 不传
          apkId: '', // 不传
          aokKey: '', // 不传
          token: '', // 不传
          type: '',
        });
      } else {
        this.isLoaded = true;
      }
    },
    // 从第三方扫码之后处理逻辑
    async directThreeLogin(params) {
      /* if (companyList.length > 0 && companyList.length <= 1) {
        const obj = companyList[0] */
      const tempParams = {
        loginType: params.loginType,
        // j_username: obj.phone,
        j_username: params.phone,
        code: params.code,
        state: params.state,
        isNew: 1,
        // deptId: obj.DEPTID || 'default'
        deptId: params.DEPTID || 'default',
      };
      this.sendLogin('dsf', tempParams);
      /* } else if (companyList.length <= 0) {
        JE.message_msg('该认证方式没有绑定，请使用手机登录哈~')
        location.href = '/index.html'

      } else {
        this.login = false
        this.showCompany = true
      } */
    },
    // 蒜瓣二维码登录
    async setQRcode(state) {
      const qrText = generateQRcode('qr_container');
      document.getElementById('qr_container').style.paddingTop = '30px';
      const qrcode = await fetchSetQRcode({
        code: qrText,
        state,
      });
      if (qrcode.success) {
        const qrInterval = setInterval(async () => {
          const res = await fetchQRlogin({
            code: qrText,
            token: 1,
          });
          if (res.success) {
            if (res.obj) {
              clearInterval(qrInterval);
              Cookies.set('authorization', res.obj.token);
              location.href = '/index.html';
            }
          } else {
            clearInterval(qrInterval);
            // this.messageTip('二维码失效，请重新扫描')
            this.setQRcode();
          }
        }, 3000);
      }
    },
    messageTip(msg, type = 'warning') {
      // Message[type]({
      //   showClose: true,
      //   message: msg || ''
      // })
    },
  },
};
