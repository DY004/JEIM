import QRCode from 'qrcodejs2';
import {
  DINGTALK_APPID,
  DINGTALK_REDIRECT_URI,
  DINGTALK_APP_SECRET,
  WX_REDIRECT_URI,
  WX_APPID,
  WX_SECRET,
} from './config';
import {
  fetcWXToken,
  fetcGetDingTalkUserInfo,
} from './login';
import {
  getParam,
} from './common';

/**
 * 加载缓存
 */
export function loadCache() {
  setTimeout(() => {
    const dingTalk = document.createElement('script');
    dingTalk.src = '//g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js';
    document.body.appendChild(dingTalk);
    const weixin = document.createElement('script');
    weixin.src = '//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
    document.body.appendChild(weixin);
  }, 1000);
}

/**
 * 生成二维码
 * @param {*} domId  dom
 * @param {*} option {}
 */
export function generateQRcode(domId, option = {}) {
  document.getElementById(domId).innerHTML = '';
  document.getElementById(domId).style = '';
  let randomNum = '';
  if (!option.text) {
    for (let i = 0; i < 6; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }
  }
  const text = option.text || randomNum;
  new QRCode(domId, {
    width: option.width || 200,
    height: option.height || 200,
    text,
  });
  document.getElementById(domId).title = '';
  return text;
}

/**
 *
 * 钉钉登录
 * @export
 * @param {*} domId
 * @param {*} width
 * @param {*} height
 * @param {*} style
 */
export function dingTalkLogin(domId, state, style, width, height) {
  document.getElementById(domId).innerHTML = '';
  document.getElementById(domId).style = '';
  const tempState = state || `DTstate${new Date().getTime()}`;
  DDLogin({
    id: domId,
    goto: encodeURIComponent(
      `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${DINGTALK_APPID}&response_type=code&scope=snsapi_login&state=${tempState}&redirect_uri=${DINGTALK_REDIRECT_URI}`
    ),
    style: style || 'border:none;background-color:#FFFFFF;margin-top:-10px',
    width: width || '250',
    height: height || '250',
  });
  const hanndleMessage = (event) => {
    const { origin } = event;
    if (origin === 'https://login.dingtalk.com') {
      const loginTmpCode = event.data;
      if (loginTmpCode) {
        window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${DINGTALK_APPID}&response_type=code&scope=snsapi_login&state=${tempState}&redirect_uri=${DINGTALK_REDIRECT_URI}&loginTmpCode=${loginTmpCode}`;
      }
    }
  };
  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('message', hanndleMessage, false);
  } else if (typeof window.attachEvent !== 'undefined') {
    window.attachEvent('onmessage', hanndleMessage);
  }
}

/**
 * 获取钉钉登录用户信息
 * @export
 */
export function getDingTalkUserInfo() {
  return new Promise((async (resolve, reject) => {
    const dingTalkRes = await fetcGetDingTalkUserInfo({
      appid: DINGTALK_APPID,
      appsecret: DINGTALK_APP_SECRET,
      code: getParam(window.location.href, 'code'),
    });
    if (dingTalkRes.errcode <= 0) {
      resolve({
        openid: dingTalkRes.openid,
        access_token: dingTalkRes.access_token,
      });
    } else {
      reject(dingTalkRes);
    }
  }));
}

/**
 *
 * 微信登录
 * @export
 * @param {*} domId
 */
export function weChatLogin(domId, state, width, height) {
  document.getElementById(domId).innerHTML = '';
  document.getElementById(domId).style = '';
  const tempState = state || `WXstate${new Date().getTime()}`;
  new WxLogin({
    self_redirect: false,
    id: domId,
    appid: `${WX_APPID}`,
    scope: 'snsapi_login',
    href: 'data:text/css;base64,CgouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjEwcHg7fQouaW1wb3dlckJveCAudGl0bGUge2Rpc3BsYXk6IG5vbmU7fQouaW1wb3dlckJveCAuaW5mbyB7ZGlzcGxheTpub25lfQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6bm9uZX0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30KCg==',
    redirect_uri: encodeURIComponent(WX_REDIRECT_URI),
    state: tempState,
  });
  const iframeList = document.getElementById(domId).childNodes;
  if (iframeList.length > 0) {
    const iframeNode = iframeList[0];
    iframeNode.width = width || 250;
    iframeNode.height = height || 300;
  }
}

/**
 *
 * 获取微信登录用户信息
 * @export
 * @returns
 */
export async function getWeChatUserInfo() {
  return new Promise((async (resolve, reject) => {
    const wxres = await fetcWXToken({
      appid: WX_APPID,
      secret: WX_SECRET,
      code: getParam(window.location.href, 'code'),
      grant_type: 'authorization_code',
    });
    if (wxres.openid) {
      resolve({
        openid: wxres.openid,
        access_token: wxres.access_token,
        unionid: wxres.unionid,
      });
    } else {
      reject(wxres);
    }
  }));
}
