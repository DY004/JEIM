import {
  HOST,
} from './config';

// 登录接口
export const POST_LOGIN = `${HOST}/rbac/login/login`;
// 发送验证码
export const POST_SEND_VALIDATECODE = `${HOST}/rbac/login/sendRandom`;
// 修改密码
export const POST_UPDATE_PWD = `${HOST}/rbac/login/modifyPw`;
// 校验验证码
export const POST_CHECK_VALIDATECODE = `${HOST}/rbac/login/validateRandom`;
// 用户信息
export const POST_USER_CODE = `${HOST}/rbac/login/getIdentityByUserCode`;
// 检查用户
export const POST_CHECK_USER = `${HOST}/rbac/login/checkUser`;
// 二维码轮询
export const POST_QR_LOGIN = `${HOST}/rbac/login/getQRcodeLoginInfo`;
// 查询行业
export const GET_INDUSTRY = `${HOST}/je/saas/saasYh/searchUsertrade`;
// 查询企业
export const GET_SEARCH_COMPANY = `${HOST}/rbac/login/searchUserCompany`;
// 设置二维码
export const POST_SET_QRCODE = `${HOST}/rbac/login/setQRcode`;
// 钉钉获取token
export const GET_DINGTALK_TOKEN = `${HOST}/rbac/login/transferDingTalk`;
// 微信token
export const GET_WX_TOKEN = `${HOST}/rbac/login/transferWeChat`;
// 钉钉获取code
export const GET_DINGTALK_PERSISTENT_CODE = 'https://oapi.dingtalk.com/sns/get_persistent_code';
// 钉钉获取SNStoken
export const GET_DINGTALK_SNS_TOKEN = 'https://oapi.dingtalk.com/sns/get_sns_token';
// 钉钉获取用户信息
export const GET_DINGTALK_USERINFO = 'https://oapi.dingtalk.com/sns/getuserinfo';
// 发送状态机
export const POST_APP_CREATE_STATE = `${HOST}/rbac/login/getDsfIdentityByUserCode`;
// 状态码// edit qinyongian
export const GET_STATE = `${HOST}/rbac/login/createState`;
// 手机号失去焦点
export const POST_PHONE_BLUR = `${HOST}/rbac/login/checkLoginCode`;
