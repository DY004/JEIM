/*
 * @Author: Qinyonglian
 * @Date: 2019-08-09 16:48:05
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-20 19:54:00
 */

import { fetchGetUserInfoById } from '../actions/organ';

export default class User {
  static _user = {};

  constructor(userId) {
    User._userId = userId;
    this.initUser(userId);
  }

  /**
   * 初始化当前用户
   * @param {*} userId
   */
  initUser = async (userId) => {
    const res = await fetchGetUserInfoById({
      userId,
    });
    User._user = res.success ? res.obj : {} || null;
  }

  /**
   * 获取当前用户
   */
  static getUser() {
    return this._user;
  }

  /**
   * 获取当前用户userId
   */
  static getUserId() {
    return this._user.userId || this._user.userid;
  }
}
