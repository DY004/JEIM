/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 18:59:35
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-23 10:26:09
 */
import dayjs from 'dayjs';
import {
  fetchGetDialogNews,
} from '../actions/dialog';
import ChatItem from '../model/Chat';
import { dateFormat4Time, formatDateTime, getItem } from '../common/util';
import { CHAT_CONTENT_TYPE, CHAT_TYPE, EVENT_TYPE } from '../common/params';
import { EventBus } from '../common/eventBus';


export default class Chat {
  // 获取我的会话聊天记录
  newMsgList = [];

  /*
   * 创建对象
   */
  static create(vm) {
    return new Chat(vm);
  }

  constructor(vm) {
    this.vm = vm;
  }

  get people_list() {
    return window._im_people_list;
  }

  /*
  * 我的聊天历史记录
  * @param {*} lastId 最后一条
  * @param {*} actualId 会话Id
  * @param {*} userId  当前人的userId
  * @param {*} pageSize
  */
  async init(lastId, actualId, userId, pageSize) {
    const list = await fetchGetDialogNews({
      lastId, actualId, userId, pageSize,
    });
    return this.newMsgList = list.map((item) => {
      item.otherInfo = getItem('userid', item.sendUserId, this.people_list);
      return ChatItem.create(item, userId);
    });
  }

  /*
   * 通过ID来删除对应的Item
   * @param id
   * @return: {}
   */
  romoveGroupItem(key, id, list) {
    return list.splice(this.getGroupIndex(key, id, list), 1);
  }

  createMsgItem(message, userId) {
    // 消息内容
    message.content = message.body;
    message.actualId = message.dialogId;
    message.sendUserId = message.userId || message.sendUserId;
    message.type = message.type;
    // 人员的信息
    message.otherInfo = getItem('userid', message.sendUserId, this.people_list);

    return ChatItem.create(message, userId);
  }

  // 判断图片地址是否存在（404问题
  CheckImgExists(imgurl) {
    const ImgObj = new Image(); // 判断图片是否存在
    ImgObj.src = imgurl;
    // 判断图片是否返回的是http地址  不然还未返回成功
    const reg = /^(http?|ftp|file):\/\/.+$/;
    // 存在图片
    return !!reg.test(imgurl);
  }

  /*
   * @param {emoji}  选择表情
   * @param {chatMsgTxt} 内容
   * @return: 最后的内容
   */
  selectEmoji(emoji, chatMsgTxt) {
    this.setContent(emoji, true);
    return (chatMsgTxt += emoji);
  }

  /*
   * @param {html}  给编辑器里面增加的内容
   * @param {append} {dom} 编辑器的对象
   * @return:
   */
  setContent(html, append, dom) {
    if (append) {
      dom.execCommand('insertHtml', html);
    } else {
      dom.setContent(html);
    }
  }

  /*
   * @param {file} 点击图片放大
   * @return:
   */
  openFile(file) {
    const path = file.content.substr(0, file.content.indexOf('?'));
    let newPath = path.substr(path.indexOf('.com') + 4);
    if (!newPath) {
      newPath = file.content;
    }
    JE.File.openFileByPath(newPath, file.fileName);
  }

  /*
   * @param {file} 下载文件
   * @return:
   */
  downloadFile(e, file) {
    const $a = document.createElement('a');
    const path = JE.getFileUrl(file.content);
    $a.setAttribute('href', path);
    $a.setAttribute('download', file.fileName);
    $a.click();
  }

  /*
   * 时间格式化 5分钟之内不显示时间
   * @param {item, index}
   * @return:
   */
  buildTime(logList, item, index) {
    if (logList.length > 1) {
      const prevItem = logList[index - 1];
      if (prevItem) {
        const prevDate = dayjs(prevItem.createTime);
        const currDate = dayjs(item.createTime);
        // 测试，暂时用秒，正式可以按照分钟 minutes
        const seconds = currDate.diff(prevDate, 'seconds');
        return seconds > 5 * 60
          ? dateFormat4Time(item.createTime, true)
          : false;
      }
    }
    return dateFormat4Time(item.createTime, true);
  }

  // 点击放大或者缩小按钮
  clickZoom(fullScreen) {
    fullScreen = !fullScreen;
    const viewId = document.getElementById('_jewestview');
    if (viewId) {
      if (!fullScreen) {
        JE.setWestMenuVisible(false);
      } else {
        JE.setWestMenuVisible(true);
      }
    }

    EventBus.$emit(EVENT_TYPE.FULL_SCREEN, fullScreen);
  }

  /*
   * @param {message} 发送消息
   * @return:
   */
  handleSendMessage(content, chatInfo, User, fileName = '', audioTimeLength = '') {
    let message = content.replace(/(^\s*)|(\s*$)/g, '');
    if (!message) return false;
    message = message.length >= 500 ? message.substr(0, 500) : message;
    let params = {
      userId: User.getUserId(),
      deviceId: User.getUserId() + navigator.userAgent,
      type: chatInfo.type,
      dialogId: chatInfo.id,
      contentType: CHAT_CONTENT_TYPE.TEXT,
      body: message,
      lastUserName: User.getUser().username,
      otherText: JSON.stringify(User.getUser()),
      createTime: formatDateTime(new Date()),
      userName: User.getUser().username,
      fileName,
      audioTimeLength,
      sendUserId: User.getUserId(),
    };
    if (chatInfo.type === CHAT_TYPE.SINGLE) {
      params = {
        ...params,
        receiver:
          chatInfo.otherInfo.userid,
      };
    }
    if (chatInfo.type === CHAT_TYPE.GROUP) {
      params = {
        ...params,
        receiver: chatInfo.otherInfo.id,
      };
    }
    JE.WebSocket.getSocket().emit('message', params);
  }
}
