import axios from 'axios';
import qs from 'qs';
import Loading from '../components/loading/index.js';
/**
 * ajax请求
 * @param {*} url
 * @param {*} params
 * @param {*} options
 */
export default function fetch(url, params, options = {}) {
  return new Promise((resolve, reject) => {
    Loading(true);
    axios({
      method: options.type || 'post',
      url,
      params,
      data: options.isFormSubmit || options.type == 'post' ? qs.stringify(options.data) : options.data,
      responseType: options.responseType || 'json',
      headers: {
        Accept: options.Accept || 'application/json',
        'Content-Type': options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
      .then((res) => {
        const data = res.data || eval(`(${res.request.responseText})`);
        try {
          document.querySelector('.loading').remove();
        } catch (e) {
          document.querySelector('.loading').parentNode.removeChild(document.querySelector('.loading'));
        }
        resolve(data);
      })
      .catch((error) => {
        try {
          document.querySelector('.loading').remove();
        } catch (e) {
          document.querySelector('.loading').parentNode.removeChild(document.querySelector('.loading'));
        }
        reject(error);
      });
  });
}

/**
 * 获取指定url参数
 * @param {*} url url
 * @param {*} paraName  key
 */
export function getParam(url, paraName) {
  const arrObj = url.split('?');
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split('&');
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=');
      if (arr != null && arr[0] === paraName) {
        return arr[1];
      }
    }
    return '';
  }
  return '';
}
