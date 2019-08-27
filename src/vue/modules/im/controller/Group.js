/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 18:59:35
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-20 18:15:18
 */
import {
  fetchMyGroups,
  fetchCreateGroup,
  fetchGroupsUpdate,
  fetchGroups,
  fetchGroupsAvatar,
  fetchRemoveGroup,
} from '../actions/group';
import GroupItem from '../model/Group';


export default class Group {
  // 我的群组列表
  groupList = [];

  /**
   * 创建对象
   */
  static create(vm) {
    return new Group(vm);
  }

  constructor(vm) {
    this.vm = vm;
  }

  /*
   * 我的群组列表
   * @param {*} userId
   */
  // eslint-disable-next-line class-methods-use-this
  async init(userId) {
    const list = await fetchMyGroups({ userId });
    return list.map(item => GroupItem.create(item));
  }

  /*
  * 创建群组
  * @param {*} groupName 群组名称
  * @param {*} memberUserIds  组成员
  * @param {*} createUserId  创建人
  * @param {*} createUserName  创建人姓名
  */
  async createGroup(groupName, memberUserIds, createUserId, createUserName) {
    const params = {
      name: groupName,
      userId: createUserId,
      userIds: memberUserIds,
      userName: createUserName,
    };
    const res = await fetchCreateGroup(params);
    return (GroupItem.create(res));
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
  getGroupIndex(key, id, list) {
    return list.findIndex(item => item[key] === id);
  }

  /*
   * 通过ID来删除对应的Item
   * @param id
   * @return: {}
   */
  romoveGroupItem(key, id, list) {
    return list.splice(this.getGroupIndex(key, id, list), 1);
  }

  /*
  * 修改群名称和头像fetchGroupsAvatar
  * @param {*} groupId  群组id
  * @param {*} groupName  修改之后的的群名称
  * @param {*} photo  当前的群头像
  * @param {*} userId   当前操作人的Id
  * @param {*} type   1是群名称； 2是群头像， 3是群名称和群头像
  */
  async upDatedGroupTitle(groupId, groupName, photo = '', userId, type) {
    const res = await fetchGroupsUpdate({
      groupId,
      groupName,
      photo,
      userId,
      type,
    });
    return res;
    // const item = this.getItem('id', groupId, this.groupList)
    // item.name = res.name;
    // item.photo = res.photo;
  }

  /*
   * 上传群头像的裁剪功能
   * @param {*} 上传头像的各个参数
   */
  static async groupAvatar(params) {
    const res = await fetchGroupsAvatar(params);
    return res;
  }

  /*
  * 解散群组
  * @param {*} groupId 群组 id
  * @param {*} userId
  */
  async removeGroup(groupId, userId) {
    const res = await fetchRemoveGroup({
      groupId,
      userId,
    });
    return res;
  }


  /*
   * 根据id获取群组信息
   * @param {*} groupId 群组 id
   * @param {*} userId
   */
  async getGroupInfo(groupId, userId) {
    const res = await fetchGroups({
      groupIds: groupId,
      userId,
    });
    return res;
  }
}
