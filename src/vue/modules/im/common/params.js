/*
 * @Author: Qinyonglian
 * @Date: 2019-08-16 09:28:18
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-23 17:31:55
 */
/* 常量
 * @Author: qinyonglian
 * @Date: 2019-03-16
 */
// 会话类型

export const CHAT_TYPE = {
  SINGLE: '1', // 单聊
  PUSH: '2', // 推送
  GROUP: '3', // 群聊
};

// 聊天记录类型 YES
export const CHAT_CONTENT_TYPE = {
  TEXT: '1', // 普通文本
  IMG: '2', // 图片
  FILE: '3', // 附件
  VOICE: '4', // 语音
};

// 对群组的操作
export const MESSAGE_TYPE = {
  CREATED: '200', // 创建一个群组
  DISSMISS: '201', // 解散群组
  TRANSFER: '206', // 转让群组
  LICKOUT: '203', // 踢出群组
  SIGNOUT: '207', // 退出群组
  ADD: '202', // 添加成员到群组
  CHANGE_PHOTO_NAME: '205', // 修改群名称或者头像
  LIST_TYPE: '102', // 对会话列表置顶，勿扰，移除
};

// 对会话进行操作置顶，勿扰，移除
export const DIALOG_TYPE = {
  ADD: '1', // 添加操作
  CANCEL: '0', // 取消操作
  REMOVE: '1', // 移除会话
  TOP: '2', // 置顶
  DISTURB: '3', // 勿扰
};

export const EVENT_TYPE = {
  WINDOW_STATUS: 'WINDOW_STATUS', // 窗口状态 捷信点击 点击之后重要的一件事是列表的展示YES

  LEFT_HEIGHT: 'LEFT_HEIGHT', // 左侧栏列表的高度
  FULL_SCREEN: 'FULL_SCREEN', // 点击全屏或者非全屏
  TREE_NODE_ID: 'TREE_NODE_ID', // tree根节点
  NOW_OBJ: 'NOW_OBJ', // 点击tree元素的某一特定对象 YSE
  CREATE_SINGLE_CHAT: 'CREATE_SINGLE_CHAT', // 创建单聊
  CREATE_GROUP_CHAT: 'CREATE_GROUP_CHAT', // 创建群组
  OPEN_CHAT: 'OPEN_CHAT', // 打开聊天 YES
  WR_CHAT_STATUS: 'WR_CHAT_STATUS', // 勿扰的自动状态改变
  WR_CHANGE: 'WR_CHANGE', // 勿扰每次开启或者取消都要派发事件到首页改变
  ON_MESSAGE: 'ON_MESSAGE', // 新消息
  UPDATE_NEWS: 'UPDATE_NEWS', // 当有新消息的时候左侧的列表
  TREE_LIST: 'TREE_LIST', // 树的所有数据
  SEARCH_LIST: 'SEARCH_LIST', // 搜索数据单人
  FROM_ME: 'FROM_ME', // 单聊时候自己列表左侧消息
  GROUPLIST: 'GROUPLIST', // 群组不用缓存，重新刷新
  CLOSE: 'CLOSE', // 窗口关闭时候会话ID
  PROP_GROUP: 'PROP_GROUP', // 点击设置添加遮罩
  LEFT_CHANGE: 'LEFT_CHANGE', // 点击群设置修改的弹出框修改群名称
  LEFT_REMOVE: 'LEFT_REMOVE', // 点击群设置弹出框之解散群组
  LEFT_PHOTO: 'LEFT_PHOTO', // 是否修改群头像
  TITLE_COUNT: 'TITLE_COUNT', // 删除群成员或者转让群主重新刷新标题
  TITLE_OUTGROUP: 'TITLE_OUTGROUP', // 退出群组左侧列表重新改变
  LOOK_MEMBER: 'LOOK_MEMBER', // 查看成员
  HANDLEBACK: 'HANDLEBACK', // 右侧信息组件info-board的关闭按钮
  LISTENLIST: 'LISTENLIST', // 监听聊天列表是否有数据
  CLICKGROUP: 'CLICKGROUP', // 点击 讨论组tab按钮
};
