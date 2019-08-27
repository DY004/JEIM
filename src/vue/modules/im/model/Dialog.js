/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 16:07:04
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-22 15:52:24
 */
import * as Util from '../common/util';
/**
 * 会话数据模型
 */
export default class DialogItem {
  constructor(options) {
    this._init(options);
  }

  /**
   * 映射属性
   */
  _init(options) {
    // this._options = options;
    // 对于有些数据，这只是初步进行优化，还需要在列表页获取一些属性photo  otherInfo receiver；获取的来源有很多： 通过userId来获取；或者是通过组织树中查询； 或者是说在列表页进行二次处理；目前采用最后一种方式
    // 会话id
    this.id = options.id;
    // 对于群而言，最后一个发送消息的人
    this.lastUserName = options.lastUserName;
    // 未读消息的个数
    this.nums = options.nums;
    // 群聊还是单聊
    this.type = options.type;
    // 勿扰
    this.wr = options.wr;
    // 置顶
    this.zd = options.zd;
    // 最后一条消息的类型
    this.contentType = options.msgType || options.contentType;
    // 对方的信息
    this.otherInfo = options.otherInfo;
    // 接受信息的ID
    this.receiver = options.receiver;
    // 最后一条未处理的消息
    this.oldLastMsg = options.lastMsg;
    // 更新时间未处理
    this.oldUpdateTime = options.updateTime;
  }

  // 格式化最后一条消息
  get lastMsg() {
    return Util.changeLastMsg(this.contentType, this.oldLastMsg, 13);
  }

  // 格式花更新时间
  get updateTime() {
    return Util.changeTime(this.oldUpdateTime);
  }

  /**
   * 创建对象
   */
  static create(options) {
    return new DialogItem(options);
  }
}
