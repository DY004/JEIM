<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-16 09:28:18
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-20 13:47:31
 -->
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/common.scss";
</style>
<template>
  <div
    v-loading="showLoad"
    class="group-outer"
  >
    <div
      v-if="lists.length === 0"
      class="list-no-data"
    >
      <i class="jeicon jeicon-Page" />
      <p>暂无数据</p>
    </div>
    <div
      v-for="(item,index) of lists"
      :key="index"
      :class="['ip-list-item',listIndex===index?'ip-list-item-active':'']"
      @click.stop="handleItems(item,index)"
    >
      <!-- 服务号/群组 -->
      <div class="list-div">
        <div class="item-avatar">
          <img
            v-if="item.photo"
            :src="item.photo"
          >
          <p
            v-else
            class="item-avatar-text"
          >
            群组
          </p>
        </div>
        <div class="item-content">
          <p class="item-name">
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../common/eventBus';
import { EVENT_TYPE } from '../../common/params';
import User from '../../controller/User';
import Dialog from '../../controller/Dialog';
import Group from '../../controller/Group';

export default {
  name: 'GroupList',
  data() {
    return {
      lists: [],
      listIndex: 0,
      showLoad: true,
      Dialog: new Dialog(),
      Group: new Group(),
    };
  },
  mounted() {
    this.getGroupList();
    // 监听 点击讨论组tab
    EventBus.$on(EVENT_TYPE.CLICKGROUP, () => {
      this.getGroupList();
    });
  },
  methods: {
    // 列表点击
    async handleItems(item, index) {
      this.listIndex = index;
      const newGroup = await this.Dialog.createGroupChat(User.getUserId(), item.id, item);
      EventBus.$emit(EVENT_TYPE.CREATE_GROUP_CHAT, newGroup);
    },
    // 获取我的群组信息
    async getGroupList() {
      this.lists = await this.Group.init(User.getUserId());
      this.showLoad = false;
    },
  },
};
</script>
