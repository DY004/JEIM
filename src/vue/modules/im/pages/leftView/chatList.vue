<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-19 10:15:52
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-26 10:32:20
 -->
<style rel="stylesheet/scss" lang="scss" >
@import "../../styles/common.scss";
@import "../../styles/leftView/chatlist.scss";
</style>
<template>
  <div class="new-list-outer">
    <div class="new-list-inner">
      <div
        v-show="chatList.length === 0"
        class="list-no-data"
      >
        <i class="jeicon jeicon-Page" />
        <p>暂无数据</p>
      </div>
      <div
        v-for="(item,index) in chatList"
        :key="index"
        :class="listIndex == item.id ? 'bg-click' : '' "
        @click="handleItem(item, index)"
        class="ip-list-item"
      >
        <div class="common-div">
          <div v-if="item.type===CHAT_TYPE.SINGLE">
            <div v-html="item.otherInfo.photo" />
          </div>
          <div v-if="item.type===CHAT_TYPE.GROUP">
            <p class="item-avatar item-avatar-text">
              群组
            </p>
          </div>
          <div class="item-time">
            <p
              class="item-name"
            >
              {{ item.otherInfo.name }}
            </p>
            <p class="item-msg">
              <span v-if="item.type==CHAT_TYPE.GROUP">{{ item.lastUserName }}:</span>{{ item.lastMsg }}
            </p>
          </div>
          <div class="item-right">
            <p v-html="item.updateTime" />
            <span
              v-if="item.nums"
              :class="{'inside10':item.numsCls}"
              class="msg-nums"
            >{{ item.nums }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../common/eventBus';
import { EVENT_TYPE, CHAT_TYPE } from '../../common/params';
import Dialog from '../../controller/Dialog';
import User from '../../controller/User';

export default {
  name: 'NewsList',
  data() {
    return {
      chatList: [], // 聊天列表
      listIndex: 0, // 当前选中的聊天对话框
      CHAT_TYPE,
      dialog: new Dialog(),
    };
  },
  mounted() {
    EventBus.$on(EVENT_TYPE.ON_MESSAGE, async (message) => {
      if (message.type === CHAT_TYPE.SINGLE || message.type === CHAT_TYPE.GROUP) {
        this.chatList = await this.dialog.updateNewsList(message, User.getUserId(), this.listIndex);
      }
    });
    // 监听切换聊天 首次加载  默认选中第一个聊天项
    EventBus.$on(EVENT_TYPE.WINDOW_STATUS, (target) => {
      if (!target) {
        this.getChatList(User.getUserId());
      }
    });
    // 创建了新的单聊
    EventBus.$on(EVENT_TYPE.CREATE_SINGLE_CHAT, (target) => {
      this.dialog.insertItem(target, User.getUserId());
      this.handleItem(target);
    });
    // 创建了新的群聊
    EventBus.$on(EVENT_TYPE.CREATE_GROUP_CHAT, (target) => {
      this.dialog.insertItem(target, User.getUserId());
      this.handleItem(target);
    });
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.CREATE_GROUP_CHAT);
    EventBus.$off(EVENT_TYPE.WINDOW_STATUS);
    EventBus.$off(EVENT_TYPE.CREATE_SINGLE_CHAT);
  },
  methods: {
    // 点击展开右侧聊天信息
    handleItem(item) {
      this.$set(item, 'nums', 0);
      window.sessionStorage.setItem('chat-dialog-id', item.id);
      if (this.listIndex == item.id) return false;
      this.listIndex = item.id; // 当前选中的会话ID
      //  需要在点击的时候处理消息总数
      this.dialog.clickDialogItem(User.getUserId(), item.id, '2', item, EVENT_TYPE.OPEN_CHAT);
    },
    // 获取消息列表
    async getChatList(userId) {
      this.chatList = await this.dialog.init(userId);
      this.chatList.length ? this.handleItem(this.chatList[0]) : EventBus.$emit(EVENT_TYPE.LISTENLIST);
    },
  },
};
</script>
