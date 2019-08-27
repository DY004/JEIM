/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 18:59:35
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-21 17:05:56
 */
import {
  fetchAddGroupMember,
  fetchGroupDetail,
  fetchTransferAdmin,
  fetchoutGroup,
  fetchDelGroupMember,
} from '../actions/group';
import MemberItem from '../model/Member';


export default class Member {
  // 某个群组群组成员列表
  memberList = [];

  get people_list() {
    return window._im_people_list;
  }

  /**
   * 创建对象
   */
  static create(vm) {
    return new Member(vm);
  }

  constructor(vm) {
    this.vm = vm;
  }

  /*
   * 获取某一个item
   * @param id
   * @return: {}
   */
  getItem(key, id, list) {
    return list.find(item => item[key] === id);
  }

  /*
   * 通过ID来获取某一个item的索引值
   * @param id
   * @return: {}
   */
  getItemIndex(key, id, list) {
    return list.findIndex(item => item[key] === id);
  }

  /*
   * 通过ID来删除对应的Item
   * @param id
   * @return: {}
   */
  romoveMemberItem(key, id, list) {
    return list.splice(this.getItemIndex(key, id, list), 1);
  }

  /*
   * 转让群主
   * @param {*} groupId 群组 id
   * @param {*} userId userid
   * @param {*} newUserId 转让之后userId
   */
  async transferAdmin(groupId, newUserId, userId) {
    const res = await fetchTransferAdmin({
      groupId,
      newUserId,
      userId,
    });
    if (!Object.keys(res).length) {
      return this.memberList.map((item) => {
        item.userId === userId && (item.manager = '2');
        item.userId === newUserId && (item.manager = '0');
      });
    }
  }

  /*
   * 删除群组成员
   * @param {*} groupId  群组 id
   * @param {*} userIds  userid  多个逗号隔开
   */
  async delMember(groupId, userIds, userId) {
    const res = await fetchDelGroupMember({
      groupId,
      userIds,
      userId,
    });
    // 说明删除成功
    if (!Object.keys(res).length) {
      this.romoveMemberItem('groupId', groupId, this.memberList);
    }
  }

  /*
   * 添加群组成员
   * @param {*} groupId 群组 id
   * @param {*} userIds userid  多个逗号隔开
   */
  async addMember(groupId, userIds, userId, userName) {
    const res = await fetchAddGroupMember({
      groupId,
      userIds,
      userId,
      userName,
    });
    res.map((item) => {
      const Item = MemberItem.create(item);
      this.memberList.push(Item);
    });
    return this.memberList;
  }

  /*
   * 退出群组
   * @param {*} groupId 群组 id
   * @param {*} userIds
   */
  async outGroup(groupId, userId) {
    const res = await fetchoutGroup({
      groupId,
      userId,
    });
    return this.getNewMemberList(res, groupId, this.memberList);
  }

  /*
   * 退出群组 群成员没有这个人
   * @param 群组ID
   * @return:
   */
  getNewMemberList(res, groupId, list) {
    return (!Object.keys(res).length && this.romoveMemberItem('id', groupId, list));
  }

  /*
   * 获取群组人员列表
   * @param {*} groupId  群组 id
   * @param {*} userId 当前登录用户id
   */
  async getMemberList(groupId, userId) {
    const res = await fetchGroupDetail({
      groupId,
      userId,
    });
    return res.map((item) => {
      item.details = this.getItem('userid', item.userId, this.people_list);
      return MemberItem.create(item);
    });
  }
}
