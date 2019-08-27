/*
 * @Author: Qinyonglian
 * @Date: 2019-04-22 09:29:27
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-09 16:49:29
 */

import fetch from '../../../static/js/common';
/**
 * ajax请求
 * @param {*} url
 * @param {*} params
 * @param {*} options
 */
export function fetchAsync(url, params, options = {}) {
    if (JE.systemConfig.IM_PROXY_URL) {
        url = /\/instant\/instant\//gi.test(url.replace(/\s+/g,'')) ? JE.systemConfig.IM_PROXY_URL + url : url;
    }
    return fetch(url,params,options);
}
