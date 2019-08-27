/*
 * @Author: Qinyonglian
 * @Date: 2019-08-21 19:16:15
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-21 19:16:15
 */

/* socket推送消息处理1单聊，2群操作， 3群聊
 * @Author: Qinyonglian
 * @Date: 2019-08-21 19:16:15
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-22 13:28:42
 */

// import * as Common from './common';
import * as Util from './../common/util';
import DialogItem from './../model/Dialog';
// import { MESSAGE_TYPE, DIALOG_TYPE, CHAT_TYPE } from './list';


export default class Message {
    /**
   * 创建对象
   */
  static create(vm) {
    return new Message(vm);
  }

  constructor(vm) {
    this.vm = vm;
  }
}
