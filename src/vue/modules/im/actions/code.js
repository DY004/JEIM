/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 16:07:04
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-13 09:41:53
 */

import fetchAsync from '@/helper/httpUtil';
import { HOST_BASIC } from '../../../constants/config';

/*
 * 扫码确认登录
 * @param {}
 * @returns
 */
export function getCode(param) {
  return fetchAsync(`${HOST_BASIC}/rbac/login/setPhoneQRcode`, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
  }).then(data => data)
    .catch();
}

/*
 * 通知获取全部消息
 * @param {}
 * @return:
 */
export function getNoticeNumber(param) {
  return fetchAsync(`${HOST_BASIC}/je/portal/homePortal/loadUserMsg`, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}

/*
 * 通知未读变已读
 * @param {}
 * @return:
 */
export function getNoticeRead(param) {
  return fetchAsync(`${HOST_BASIC}/je/doUpdate`, {}, {
    type: 'post',
    data: param,
  })
    .then(data => data)
    .catch();
}


/*
 * 通知全部设为已读
 * @param {}
 * @return:
 */
export function readAll() {
  return fetchAsync(`${HOST_BASIC}/je/portal/homePortal/readAllUserMsg`, {}, {
    type: 'post',
    data: '',
  }).then(data => data)
    .catch();
}


/*
 * 加载日志详情
 * @param tableCode, whereSql
 * @return:
 */
export function loadDailydetail(id) {
  return fetchAsync(`${HOST_BASIC}/je/load`, {}, {
    type: 'post',
    data: {
      tableCode: 'JE_CIRCLE_REPORT',
      whereSql: `AND JE_CIRCLE_REPORT_ID='${id}'`,
    },
  }).then(data => data)
    .catch();
}
