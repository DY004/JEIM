/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 16:07:04
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-22 16:19:25
 */


import { fetchAsync } from "../common/fetch";

/**
 * 获取最近的会话信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetRecentDialogs(param) {
  return fetchAsync('/instant/instant/news/getRecentDialogs', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then((data) => {
      if (data.success) {
        return data.obj || [];
      }
      JE.msg(data.message);
      return [];
    })
    .catch();
}

/**
 * 获取最近的聊天记录
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetDialogNews(param) {
  return fetchAsync('/instant/instant/news/getDialogNewIds', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then((data) => {
      if (data.success) {
        return data.obj || [];
      }
      JE.msg(data.message);
      return [];
    })
    .catch();
}

/**
 * 创建会话id
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchCreateDialogId(param) {
  return fetchAsync('/instant/instant/news/createDialogId', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then((data) => {
      if (data.success) {
        return data.obj || {};
      }
      JE.msg(data.message);
      return {};
    })
    .catch();
}

/**
 * 查询会话消息列表
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchActualInfo(param) {
  return fetchAsync('/instant/instant/actual/getActualInfo', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(data => data)
    .catch();
}

/**
 * 获取未读总条数
 * @param param
 * @returns {Promise<T | never>}
 */
export function getUnReadNums(param) {
  return fetchAsync('/instant/instant/news/getAllNoReadCount', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then((data) => {
      if (data.success) {
        return data.obj || 0;
      }
      JE.msg(data.message);
      return;
    })
    .catch();
}
/**
 * 未读变为已读
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchReadNum(param) {
  return fetchAsync('/instant/instant/news/updateNewsStatus', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then((data) => {
      if (data.success) {
        return data.obj || {};
      }
      JE.msg(data.message);
      return {};
    })
    .catch();
}
/**
 * 获取会话id
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetDialogId(param) {
  return fetchAsync('/instant/instant/news/getDialogId', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(data => data)
    .catch();
}
