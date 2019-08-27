/**
 * ajax请求
 * @param {*} url
 * @param {*} params
 * @param {*} options
 */
export default function fetch(url, params, options = {}) {
  return new Promise((resolve, reject) => {
    params = options.data || params;
    JE.ajax({
      url:url,
      params:params,
      async:true,
      urlMaps:false,
      success: function (response) {
        var data = JE.getAjaxData(response, options.text);
        resolve(data)
      },
      failure: function (response) {
        reject(response)
      }
    });
  })
}
