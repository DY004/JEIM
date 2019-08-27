<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-19 10:15:52
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-20 13:50:10
 -->
<style rel="stylesheet/scss" lang="scss" scoped>
@import ".././styles/common.scss";
@import ".././styles/components/search.scss";
</style>

<template>
  <div class="chat-search-inner">
    <!--搜索部分-->
    <div class="chat-search-input">
      <i class="jeicon jeicon-search" />
      <input
        v-model="searchText"
        type="text"
        class="ip-search"
      >
      <i
        @click="clearKey"
        v-if="searchText"
        class="jeicon jeicon-error-circle"
        style="cursor: pointer"
      />
      <i
        @click.stop="visible"
        class="jeicon jeicon-plus"
      >
        <span
          ref="createdGroup"
          v-if="seen"
          @click.stop="getOrgchart"
        >创建讨论组</span>
      </i>
    </div>
    <!--搜索结果部分-->
    <div
      id="search-dialog"
      v-show="isShow"
      class="search-dialog"
    >
      <div
        v-show="searchResult.list.length>0"
        class="person-list"
      >
        <p class="title">
          同事
        </p>
        <div
          :key="index"
          v-for="(item, index) in searchResult.list"
          @click="clickSearch(item, '1')"
          @mouseenter="Mouseenter(item, '1')"
          @mouseleave="Mouseleave"
          :class="activeIndex === item.userid ? 'active' : ''"
          class="search-list"
        >
          <div>
            <div v-html="getUserPhoto(item.userid)" />
          </div>
          <p
            v-html="item.name"
            class="item-name"
            style="padding-left: 15px;"
          />
          <!--<p class="item.souce">{{item.group}}</p>-->
        </div>
        <div
          @click="clickAll('sing')"
          v-show="searchResult.isMore"
          class="all-search"
        >
          {{ singShow ? '查看全部' : '收起' }}
        </div>
      </div>
      <div
        v-show="owerGroup.list.length>0"
        class="group-list"
      >
        <p class="title">
          群聊
        </p>
        <div
          :key="index"
          v-for="(item, index) in owerGroup.list"
          @click="clickSearch(item, '3')"
          @mouseenter="Mouseenter(item, '3')"
          @mouseleave="Mouseleave"
          :class="activeIndex === item.id ? 'active' : ''"
          class="search-list"
        >
          <img
            v-if="item.photo"
            :src="item.photo"
            alt=""
          >
          <img
            v-if="!item.photo"
            src="../assets/org-default.png"
          >
          <div class="item-name">
            <p v-html="item.name" />
          </div>
        </div>
        <div
          @click="clickAll('group')"
          v-show="owerGroup.isMore"
          class="all-search"
        >
          {{ groupShow ? '查看全部' : '收起' }}
        </div>
      </div>
      <p
        v-if="searchResult.list.length==0&&owerGroup.list.length==0"
        style="color:#666;line-height:40px;text-align:center;"
      >
        暂无搜索内容
      </p>
    </div>
  </div>
</template>
<script>
import Dialog from '../controller/Dialog';
import User from '../controller/User';
import Group from '../controller/Group';
import { EVENT_TYPE } from '../common/params';
import { EventBus } from '../common/eventBus';

import Search from '../controller/Search';
import Organ from '../controller/Organ';

export default {
  name: 'SearchInput',
  data() {
    return {
      searchText: '', // 关键字
      seen: false,
      searchList: [],
      groupLists: [],
      personList: window._im_people_list,
      searchResult: {
        list: [],
        isMore: false,
      },
      owerGroup: {
        list: [],
        isMore: false,
      },
      info: {},
      dialog: new Dialog(),
      group: new Group(),
      search: new Search(),
      organ: new Organ(),
      isShow: false,
      activeIndex: null, // 鼠标移上去活跃的index
      singShow: true, // 查看更多同事默认显示
      groupShow: true, // 查看群组默认显示
    };
  },
  watch: {
    searchText(nv) {
      if (nv) {
        this.searchResult = this.search.searchList(nv, '1', true, this.personList);
        this.owerGroup = this.search.searchList(nv, '3', true, this.groupLists);
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    singShow(nv) {
      if (!nv) {
        this.searchResult = this.search.searchList(this.searchText, '1', false, this.personList);
      } else {
        this.searchResult = this.search.searchList(this.searchText, '1', true, this.personList);
      }
    },
    groupShow(nv) {
      if (!nv) {
        this.owerGroup = this.search.searchList(this.searchText, '3', false, this.groupLists);
      } else {
        this.owerGroup = this.search.searchList(this.searchText, '3', true, this.groupLists);
      }
    },
  },
  mounted() {
    document.removeEventListener('click', this.closeProp);
    EventBus.$on(EVENT_TYPE.WINDOW_STATUS, (target) => {
      if (!target) {
        this.getAllGroups();
      }
    });
  },
  methods: {
    // 清空输入的内容
    clearKey() {
      this.isShow = false;
      this.searchText = '';
    },
    // 获取所有群聊
    async getAllGroups() {
      this.groupLists = await this.group.init(User.getUserId());
    },
    // 点击查看全部
    clickAll(type) {
      if (type === 'sing') {
        this.singShow = !this.singShow;
      } else if (type === 'group') {
        this.groupShow = !this.groupShow;
      }
    },
    // 鼠标移上去处理样式
    Mouseenter(item, type) {
      if (type === '1') {
        this.activeIndex = item.userid;
      } else {
        this.activeIndex = item.id;
      }
    },
    // 鼠标移出去处理样式
    Mouseleave() {
      this.activeIndex = null;
    },
    // 鼠标点击事件
    async clickSearch(item, type) {
      if (type === '1') {
        if (User.getUserId() === item.userid) {
          JE.msg('自己不能和自己聊天哈~');
          return false;
        }
        const newItem = await this.dialog.createSingleChat(User.getUserId(), item.userid);
        EventBus.$emit(EVENT_TYPE.CREATE_SINGLE_CHAT, newItem);
      } else if (item.id) {
        const newGroup = await this.dialog.createGroupChat(User.getUserId(), item.id, item);
        EventBus.$emit(EVENT_TYPE.CREATE_GROUP_CHAT, newGroup);
      }

      this.isShow = false;
      this.searchText = '';
    },

    // 获取头像
    getUserPhoto(id) {
      return JE.getUserPhoto(id, true);
    },
    // 点击加号获取平台组织树
    getOrgchart() {
      const me = this;
      JE.vue.selectUser({
        title: '',
        multiple: true,
        valueType: 'list',
        callback(obj) {
          me.seen = false;
          me.personCallback(obj);
        },
      });
    },
    // 人员回调获取人员数组
    personCallback(obj) {
      if (obj && obj.length > 0) {
        const persons = [];
        obj.forEach((item) => {
          const idStr = item.id.split('_');
          let photo = '';
          if (item.bean.PHOTO) {
            const path = item.bean.PHOTO.split('*');
            photo = path[path.length - 1];
          }

          persons.push({
            ...item,
            id: idStr && idStr.length > 0 ? idStr[idStr.length - 1] : item.id,
            name: item.text,
            icon: photo ? JE.getFileUrl(photo) : '',
          });
        });
        this.getPersonIds(persons);
      }
    },
    // 指定范围中id 集合是个字符串，多人的话是以逗号分开
    async getPersonIds(persons) {
      if (persons.length === 1) {
        // 单聊
        const tmpObj = persons[0] || {};
        if (User.getUserId() === tmpObj.id) {
          JE.msg('自己不能和自己聊天哈~');
          return false;
        }
        JE.msg('群聊中至少要添加除自己2人哦~');
        return false;

        // eslint-disable-next-line no-unreachable
        this.dialog.createSingleChat(User.getUserId(), tmpObj.id);
      }
      if (persons.length === 2) {
        const isHas = persons.find(item => item.id === User.getUserId());
        if (isHas && Object.keys(isHas).length) {
          JE.msg('群聊中至少要添加除自己2人哦~');
          return false;
        }
      }
      const personIds = [];
      const personNames = [];
      if (persons && persons.length > 0) {
        persons.forEach((item) => {
          personIds.push(item.id);
          personNames.push(item.name);
        });
      }
      const index = personIds.findIndex(item => item === User.getUserId());
      if (index > -1) {
        const item = personIds[index];
        const name = personNames[index];
        personIds.splice(index, 1);
        personIds.unshift(item);
        personNames.splice(index, 1);
        personNames.unshift(name);
      } else {
        personIds.unshift(User.getUserId());
        this.searchList.map((items) => {
          if (items.id === User.getUserId()) {
            personNames.unshift(items.name);
          }
        });
      }
      // 群聊 此处创建聊天

      const createRes = await this.group.createGroup(personNames.join('、'), personIds.join(','), User.getUserId(), User.getUser().username || User.getUser().name);
      if (createRes.id) {
        const groupObj = await this.dialog.createGroupChat(User.getUserId(), createRes.id, createRes);
        EventBus.$emit(EVENT_TYPE.CREATE_GROUP_CHAT, groupObj);
      }
    },
    // 鼠标移到加号
    visible() {
      this.seen = true;
      document.addEventListener('click', this.closeProp);
    },
    // 点击其他区域隐藏创建讨论组
    closeProp(e) {
      if (this.$refs.createdGroup) {
        if (!this.$refs.createdGroup.contains(e.target)) {
          this.seen = false;
        }
      }
    },
  },

};
</script>
