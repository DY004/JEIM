/*
 * @Author: Qinyonglian
 * @Date: 2019-08-09 14:31:33
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-23 17:44:00
 */

/**
 * 会话列表控制器
 */
import DialogItem from '../model/Dialog';
import { CHAT_TYPE } from '../common/params';
import { getItem, getItemIndex } from '../common/util';
import {
  fetchGetRecentDialogs, fetchCreateDialogId, fetchReadNum, getUnReadNums,
} from '../actions/dialog';
import { fetchGetUserInfoByIds } from '../actions/organ';
import { fetchGroups } from '../actions/group';
import { EventBus } from '../common/eventBus';
// 和以前不一样的是，人员的头像现在以及群组的头像，总数都是从otherInfo中获取，调用的时候要注意

// 对应列表控制器

export default class Dialog {
  constructor(vm) {
    this.vm = vm;
  }

  newsList = [];

  unReadNum = 0;

  get people_list() {
    return window._im_people_list;
  }

  // 获取初始数据
  async init(userId) {
    const res = await fetchGetRecentDialogs({ userId, page: 1, pageSize: 50 });
    // 获取单聊的接受者集合
    const userIds = this.getIdList(res, CHAT_TYPE.SINGLE, userId);
    if (userIds.length > 0) {
      this.newsList = await this.getSingOtherInfo(userIds, res, userId);
    }

    // 群聊集合groupIds信息，处理otherInfo
    const groupIds = this.getIdList(res, CHAT_TYPE.GROUP, userId);
    if (groupIds.length > 0) {
      this.newsList = await this.getGroupOtherInfo(groupIds, res, userId);
    }

    // 获取群组的接受者集合
    this.newsList = this.newsList.map((item) => {
      // 在调取这个方法的时候，加上otherInfo字段
      item.receiver = this.getReceiver(item, userId);
      return DialogItem.create(item);
    });
    return this.newsList;
  }

  // 获取群组的接受者集合 && 单聊的接受者集合
  getIdList(list, type, userId) {
    const idList = [];
    list.map((item) => {
      if (type === item.type) {
        idList.push(this.getReceiver(item, userId));
      }
    });
    return idList;
  }

  async getSingOtherInfo(userIds, list, userId) {
    const userInfoListRes = await fetchGetUserInfoByIds({
      userIds: userIds.join(','),
    });
    // 对单聊的otherInfo处理
    return list.map((item) => {
      if (item.type === CHAT_TYPE.SINGLE) {
        const userInfoTemp = userInfoListRes.filter(userInfo => userInfo.userid === this.getReceiver(item, userId));
        userInfoTemp[0] && (item.photo = userInfoTemp[0].photo = JE.getUserPhoto(userInfoTemp[0].userid, true));
        userInfoTemp[0].name = userInfoTemp[0].username;
        item.otherInfo = userInfoTemp[0] || {};
      }
      return item;
    });
  }
  /*
    * 给群聊人员加otherInfo
    * @param {type}
    * @return: Item
    */

  async getGroupOtherInfo(groupIds, list, userId) {
    const groupListRes = await fetchGroups({
      groupIds: groupIds.join(','),
      userId,
    });
    return list.map((item) => {
      if (item.type == CHAT_TYPE.GROUP) {
        const userInfoTemp = groupListRes.filter(group => (group.id == this.getReceiver(item, userId)));
        userInfoTemp[0].name = userInfoTemp[0].name.length > 20 ? `${userInfoTemp[0].name.slice(0, 20)}...` : userInfoTemp[0].name;
        return { ...item, otherInfo: userInfoTemp[0] || {} };
      }
      return item;
    });
  }

  // 获取接收者
  getReceiver(item, userId) {
    return userId == item.rightId ? item.leftId : item.rightId;
  }

  /*
    * 创建单聊会话
    * @param {} leftId 创建者
    * @param {*} rightId 接收者
    * @param {*} otherInfo 拼接的接收这的详细信息
    */
  async createSingleChat(leftId, rightId, otherInfo = {}) {
    // 如果没有发送者或者发送者和接受者一样，则创建不成功
    if (rightId && (leftId === rightId)) {
      JE.msg('自己不能和自己说话哦~');
      return false;
    }
    otherInfo = getItem('userid', rightId, this.people_list);
    const res = await this.createDialogId(rightId, leftId, CHAT_TYPE.SINGLE);
    return {
      ...res,
      otherInfo,
    };
    // this.insertItem(Item, rightId);
  }

  /*
    * 获取会话id
    * @param {*} friendUserId 朋友id
    * @param {*} userId 当前userId
    * @param {*} type 1/对话2/群组
    */
  async createDialogId(friendUserId, userId, type) {
    return (await fetchCreateDialogId({
      friendUserId,
      userId,
      type,
    }));
  }

  /*
   * 创建群聊会话
   * @param {} leftId 当前的userId
   * @param {*} rightId 群组的id
   * @param {*} otherInfo 群组的详细信息
   */
  async createGroupChat(leftId, rightId, otherInfo = {}) {
    const res = await this.createDialogId(rightId, leftId, CHAT_TYPE.GROUP);
    return {
      ...res,
      otherInfo,
    };
    // this.insertItem(Item, rightId);
  }

  // 创建一个新的会话,单聊或者群聊,插入列表适当的位置
  insertItem(Item, userId) {
    // 判断是单聊或者群聊
    if (Item.type === '1' || Item.type === '3') {
      Item.receiver = this.getReceiver(Item, userId);
      // 根据会话ID，找到会话的索引值
      const index = getItemIndex('id', Item.id, this.newsList);
      // 找到对应索引的Item
      let noTopIndex = 0;
      // 如果存在 index > -1
      if (index > -1) {
        const item = this.newsList[index];
        // 通过索引将原来this.newsList 去掉
        this.newsList.splice(index, 1);
        // 重新赋值几个重要参数；置顶，勿扰，个数
        // Item.zd = item.zd;
        // Item.wr = item.wr;
        Item.nums = item.nums || 0;
        this.newsList.unshift(DialogItem.create(Item));
        // 看创建Item是否是置顶，为了确保在列表中的位置
        // if (Item.zd) {
        //   this.newsList.unshift(createItem);
        // } else {
        //   // 这边处理的有问题，需要找到第一个不是置顶的，但是有一种特殊的情况，就是全部都是置顶的时候；那么非置顶的noTopIndex返回就是-1；
        //   // 现在的方案是定义一个变量，循环list数据，遇到置顶就+=1；然后获取到索引值
        //   this.newsList.map(items => noTopIndex = items.zd ? noTopIndex += 1 : 0);
        //   this.newsList.splice(noTopIndex, 0, createItem);
        // }
      } else {
        const createItem = DialogItem.create(Item);
        this.newsList.map(items => noTopIndex = items.zd ? noTopIndex += 1 : 0);
        this.newsList.splice(noTopIndex, 0, createItem);
      }
      return this.newsList;
    }
  }

  /*
   * 会话置顶，移除，勿扰功能
   * @param actualId 会话ID
   * @param userId 当前用户的userId
   * @param status
   * @param type
   */
  async groupActual(actualId, userId, status, type) {
    const res = await fetchGroupsActual({
      actualId,
      userId,
      status,
      type,
    });
    if (res.success) {
      return res.obj || {};
    }
    JE.msg(res.message);
    return {};
  }

  //   找第一个不是置顶的index
  findNoTopIndex(list, key) {
    let noTopIndex = 0;
    return (list.map(items => noTopIndex = items[key] ? noTopIndex += 1 : 0));
  }

  /* 消息为1 || 3的时候处理逻辑
    * @param message 消息
    * @param type 捷信是否显示
    * @param list 会话列表
    * @param UserId 当前登录用户
    * @return: newsList
    */
  async updateNewsList(message, userId, listIndex) {
    // message.updateTime = message.date;
    // message.lastMsg = message.body;

    // 获取当前消息在list中的索引值
    const index = getItemIndex('id', message.dialogId, this.newsList);
    // 判断是否是当前登录用户
    const isUser = (message.userId == userId);
    const isIndex = (message.dialogId == listIndex);
    // 如果存在
    if (index > -1) {
      // 如果要是存在的话，list先截取调这个item
      const item = this.newsList[index];
      this.newsList.splice(index, 1);
      const updateObj = {
        ...item,
        updateTime: message.date,
        lastMsg: message.body,
        lastUserName: message.userName,
        // eslint-disable-next-line no-nested-ternary
        nums: !isIndex ? (isUser ? item.nums : ++item.nums) : 0,
      };
      // const createItem = DialogItem.create(updateObj);
      this.newsList.unshift(DialogItem.create(updateObj));
      // item.zd && (this.newsList.unshift(createItem));
      // item.zd || (this.newsList.splice(this.findNoTopIndex(list, 'zd'), 0, createItem))
    } else {
      // 如果没有的话，就创建一个单聊会话
      if (message.type === CHAT_TYPE.SINGLE) {
        // 找到receiver
        const rightId = isUser ? message.receiver : message.userId;
        const leftId = !isUser ? message.receiver : message.userId;
        const res = await this.createSingleChat(leftId, rightId);
        // // 在调取这个方法的时候，加上otherInfo字段
        // res.receiver = this.getReceiver(res, userId);
        res.updateTime = message.date;
        res.lastMsg = message.body;
        !isUser && (res.nums = 1);
        this.insertItem(res, userId);
        // this.newsList.unshift(DialogItem.create(res));
      }

      if (message.type === CHAT_TYPE.GROUP) {
        // 返回来的是一个数组
        const groupInfo = (await fetchGroups({
          groupIds: message.receiver,
          userId,
        }))[0];
        if (groupInfo && groupInfo.id) {
          // 创建一个群聊会话
          const groupObj = await this.createGroupChat(
            groupInfo.id,
            JE.getCurrentUser().id,
            groupInfo
          );
          groupObj.updateTime = message.date;
          // 修改最后一条消息格式
          groupObj.lastMsg = message.body;
          !isUser && (groupObj.nums = 1);
          groupObj.lastUserName = message.lastUserName;
          groupObj.groupUserNum = groupInfo.groupUserNum;
          this.insertItem(groupObj, userId);
        }
      }
    }
    return this.newsList;
  }

  /*
     * 点击列表变为已读
     * @param {*} userId 当前userId
     * @param {*} actualId 对话ID
     * @param {*} status 消息状态0:未发送,1正在发送,2:已接收
     */
  async getReadNums(userId, actualId, status) {
    return await fetchReadNum({
      userId,
      actualId,
      status,
    });
  }

  /*
    * 点击列表处理逻辑
    * @param {*} userId 当前userId
    * @param {*} actualId 对话ID
    * @param {*} status 消息状态0:未发送,1正在发送,2:已接收
    * @param {*} item 当前的item
    */
  async clickDialogItem(userId, actualId, status, item, method) {
    const res = await this.getReadNums(userId, actualId, status);
    !Object.keys(res).length && (item.nums = 0);
    EventBus.$emit(method, item);
    return item;
  }

  /*
     * 获取未读的消息总条数
     * @param {*} userId 当前userId
     */
  async getUnReadNum(userId) {
    return this.unReadNum = await getUnReadNums({
      userId,
    });
  }

  /*
     * 当消息不断增加的时候，未读的消息处理逻辑
     * @param {*} userId 当前userId
     */
  getMessageUnRead() {
    JE.playAudio(JE.buildCdnUrl('/static/ux/media/IM.mp3'));
    this.unReadNum += 1;
    if (this.unReadNum > 99) {
      this.unReadNum = '99+';
    } else if (this.unReadNum <= 0) {
      this.unReadNum = null;
    }
    return this.unReadNum;
  }

  /**
   * 创建对象
   */
  static create(vm) {
    return new Dialog(vm);
  }
}
