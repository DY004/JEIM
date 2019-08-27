/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 19:09:14
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-13 11:43:52
 */
/**
 * 群组会话模型
 */
export default class MemberItem {
  constructor(options) {
    this._init(options);
  }

  /**
   * 映射属性
   */
  _init(options) {
    this.createTime = options.createTime;
    this.details = options.details;
    this.groupId = options.groupId;
    this.id = options.id;
    this.manager = options.manager;
    this.userId = options.userId;
  }

  /**
   * 创建对象
   */
  static create(options) {
    return new MemberItem(options);
  }
}
