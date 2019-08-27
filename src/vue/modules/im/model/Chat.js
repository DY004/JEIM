/*
 * @Author: Qinyonglian
 * @Date: 2019-08-13 16:45:11
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-21 14:45:14
 */
// import { CHAT_TYPE } from '../common/params'
// import * as Util from '../common/util'
// import { joinSafe } from 'upath';
/**
 * 会话数据模型
 */
export default class chatItem {
  constructor(options, userId) {
    // 当前登录用户的userId
    this.userId = userId;
    this._init(options, userId);
  }

  /**
   * 映射属性
   */
  _init(options) {
    // 文件类型
    this.contentType = options.contentType;
    // 消息内容
    this.content = options.content;
    // 录音时长
    this.audioTimeLength = options.audioTimeLength || 0;
    // 创建消息的时间
    this.createTime = options.createTime;
    // 会话的ID
    this.actualId = options.actualId;
    // 文件的名称
    this.fileName = options.fileName;
    // 某一条消息的ID
    this.id = options.id;
    // 消息的已读以及未读标识 T代表已读
    this.readMsg = options.readMsg || 'F';
    // 发送者的sendUserId
    this.sendUserId = options.sendUserId;
    // 当前是群组还是个人会话
    this.type = options.newType;
    // 当前消息的唯一标识
    this.msgUID = options.msgUID;
    // 是否离职
    this.userPresence = options.userPresence || false;
    // 会话的唯一ID
    this.msgUID = options.msgUID;
    // 人员的名字
    this.userName = options.otherInfo.name;
    // 人员的头像
    this.userPhoto = options.otherInfo.photo;
  }


  // 添加一字段来证明是自己发的还是别人发的消息
  get isSendMe() {
    return this.userId === this.sendUserId;
  }

  /**
   * 创建对象
   */
  static create(options, userId) {
    return new chatItem(options, userId);
  }
}
