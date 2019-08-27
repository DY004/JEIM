<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-23 13:37:10
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-23 13:42:12
 -->
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/common.scss";
@import "../../styles/rightView/memberList.scss";
</style>
<template>
  <div
    :style="{'top': `${parseInt(top)+2}px`,'bottom': '0'}"
    class="ip-chat-member"
  >
    <ul class="userContainer">
      <li
        v-for="(item,index) of memberList"
        :key="index"
        style="list-style:none"
      >
        <el-popover
          placement="bottom"
          trigger="click"
        >
          <div
            class="member-message"
          >
            <div class="member-left">
              <p
                v-html="item.details.photo"
                class="memner-img"
              />
              <p class="member-name">
                {{ item.details.name }}
              </p>
              <p class="member-title">
                {{ item.details.sentrynames }}
              </p>
            </div>
            <div class="member-right">
              <div>
                <label>部门</label>
                <p>{{ item.details.deptname || '暂无' }}</p>
              </div>
              <div>
                <label>手机</label>
                <p>{{ item.details.usercode || '暂无' }}</p>
              </div>
              <div>
                <label>座机</label>
                <p>{{ item.details.zuoji || '暂无' }}</p>
              </div>
              <div>
                <label>邮箱</label>
                <p>{{ item.details.companyemail || '暂无' }}</p>
              </div>
            </div>
            <div
              @click="sendMessage(item)"
              class="send-button"
            >
              发捷信
            </div>
          </div>
          <div
            slot="reference"
            class="member-class"
          >
            <div
              v-html="item.details.photo"
              class="header"
            />
            <div class="name">
              {{ item.details.name }}
            </div>
            <div
              v-if="item.manager==='0'"
              class="teamLeader"
            >
              群主
            </div>
          </div>
        </el-popover>
      </li>
    </ul>
  </div>
</template>
<script>
import Member from '../../controller/Member';
import User from '../../controller/User';
import Dialog from '../../controller/Dialog';
import { EventBus } from '../../common/eventBus';
import { EVENT_TYPE } from '../../common/params';

export default {
  name: 'MemberList',
  props: {
    top: {
      type: String,
      default: '0',
    },
    // 获取群组信息
    groupInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      memberList: [],
      member: new Member(),
      Dialog: new Dialog(),
    };
  },
  mounted() {
    // 获取群组成员list
    this.member.getMemberList(this.groupInfo.otherInfo.id, User.getUserId()).then((list) => {
      this.memberList = list;
    });
  },
  methods: {
    getUserPhoto(id) {
      return JE.getUserPhoto(id, true);
    },
    async sendMessage(item) {
      const newItem = await this.Dialog.createSingleChat(User.getUserId(), item.userId);
      EventBus.$emit(EVENT_TYPE.CREATE_SINGLE_CHAT, newItem);
    },
  },
};
</script>
