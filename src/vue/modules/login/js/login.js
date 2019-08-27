import fetch from './common';
import * as api from './api';

// 简单加密参数
const compileStr = (params) => {
  const strs = { j_dept: 'd', j_username: 'u', j_password: 'p' };
  for (const key in strs) {
    if (params.hasOwnProperty(key)) {
      params[strs[key]] = window.btoa(window.btoa(params[key]));
      delete params[key];
    }
  }
};

/**
 * 登录
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchLogin(param) {
  compileStr(param);
  return fetch(api.POST_LOGIN, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(data => data)
    .catch();
}

/**
 *发送短信验证码
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchSendValidateCode(param) {
  return fetch(api.POST_SEND_VALIDATECODE, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 *修改密码
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchUpdatePwd(param) {
  compileStr(param);
  return fetch(api.POST_UPDATE_PWD, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 *查询用户是否存在
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchHasUser(param) {
  return fetch(api.POST_HAS_USER, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 *查询企业
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchSearchUserCompany(param) {
  return fetch(api.GET_SEARCH_COMPANY, param, {})
    .then(data => data)
    .catch();
}

/**
 *查询行业
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetIndustry(param) {
  return fetch(api.GET_INDUSTRY, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 *核对验证码
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchCheckValidate(param) {
  return fetch(api.POST_CHECK_VALIDATECODE, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}


/**
 *查询用户绑定
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchSearchUserCode(param) {
  return fetch(api.POST_USER_CODE, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 * 发送状态机
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchCreateState(param) {
  return fetch(api.POST_APP_CREATE_STATE, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 *获取钉钉token
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetcDingTalkToken(param) {
  return fetch(api.GET_DINGTALK_TOKEN, param, {})
    .then(data => data)
    .catch();
}

/**
 *获取钉钉token
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetcGetDingTalkUserInfo(param) {
  return fetch(api.GET_DINGTALK_TOKEN, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 * 获取钉钉持久授权码  url?access_token
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchDingTalkPersistent(getParam, param) {
  return fetch(api.GET_DINGTALK_PERSISTENT_CODE, getParam, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 * 获取钉钉SNS_TOKEN  url?access_token
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchDingTalkSNSToken(param) {
  return fetch(api.GET_DINGTALK_SNS_TOKEN, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 * 获取钉钉用户信息  url?sns_token
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchDingTalkUserInfo(param) {
  return fetch(api.GET_DINGTALK_USERINFO, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 *获取微信token
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetcWXToken(param) {
  return fetch(api.GET_WX_TOKEN, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 * 设置二维码
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchSetQRcode(param) {
  return fetch(api.POST_SET_QRCODE, {}, {
    type: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 * 二维码登录
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchQRlogin(param) {
  return fetch(api.POST_QR_LOGIN, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/**
 * 状态码
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchState(param) {
  return fetch(api.GET_STATE, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(data => data)
    .catch();
}

/**
 * 检查用户
 * @param param
 * @returns {Promise<T | never>}
 */
export function checkingUser(param) {
  return fetch(api.POST_CHECK_USER, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(data => data)
    .catch();
}
/**
 * 手机号失去焦点
 * @param param
 * @returns {Promise<T | never>}
 */
export function phoneBlur(param) {
  return fetch(api.POST_PHONE_BLUR, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}
