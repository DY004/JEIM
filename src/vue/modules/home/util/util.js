export default {
  doReadMark(type, id) {
    let params = {};
    let url = '';
    // eslint-disable-next-line default-case
    switch (type) {
      case 'bubble':
        url = '/je/doUpdate';
        params = {
          tableCode: 'CRM_USER_MESSAGE',
          USERMSG_YD: '1',
          CRM_USER_MESSAGE_ID: id,
        };
        break;
      case 'notice':
        url = '/je/doUpdate';
        params = {
          tableCode: 'JE_SYS_USERMSG',
          JE_SYS_USERMSG_ID: id,
          USERMSG_YD: '1',
        };
        break;
      case 'news':
        url = '/je/readFuncEdit';
        params = {
          tableCode: 'JE_SYS_NOTICE',
          funcCode: 'JE_SYS_NOTICE',
          pkValue: id,
        };
        break;
      case 'log':
        url = '/je/readFuncEdit';
        params = {
          tableCode: 'JE_CIRCLE_REPORT',
          funcCode: 'JE_CIRCLE_REPORT',
          pkValue: id,
        };
        break;
      case 'postil':
        url = '/je/readFuncEdit';
        params = {
          tableCode: 'JE_CORE_POSTIL',
          funcCode: 'JE_CORE_POSTIL',
          pkValue: id,
        };
        break;
    }
    return JE.ajax({ url, params });
  },
  formatKeyword(text, keyword) {
    return keyword ? text.replaceAll(keyword, `<span class="keyword">${keyword}</span>`) : text;
  },
};
