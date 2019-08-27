<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../styles/common.scss";
    @import "../../styles/leftView/index.scss";
</style>
<template>
  <div class="left-content">
    <div
      id="search-container"
      class="search-container"
    >
      <search-view />
    </div>
    <div
      id="ip-chat-toolbar"
      class="ip-chat-toolbar"
    >
      <div class="parent-toolbar">
        <div
          v-for="(item, index) in toolbarList"
          :key="index"
          :class="[activeIndex === item.index ? 'toolbar-active' : '']"
          @click="clickToolbar(item.index)"
          class="common-toolbar"
        >
          {{ item.value }}
        </div>
      </div>
      <div
        v-for="(item,index) in childrenLists"
        v-show="activeIndex !== 'dh'"
        :key="index"
        @click="clickToolbar(item.index)"
        class="common-toolbar children-toolbar"
      >
        <span :class="[childrenActive === item.index ? 'childrenBar-active' : '']">{{ item.value }}</span>
      </div>
    </div>
    <div
      class="list-chat"
    >
      <keep-alive exclude="group-list">
        <component
          :is="currentComponent"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import searchView from '../../components/search';
import ChatList from './chatList'; // 对话列表
import GroupList from './groupList'; // 讨论组
import Colleague from './colleague';
import { EventBus } from '../../common/eventBus';
import { EVENT_TYPE } from '../../common/params';
// 通讯录
export default {
  name: 'LeftContent',
  components: {
    searchView,
    GroupList,
    ChatList,
    Colleague,
  },
  data() {
    return {
      toolbarList: [
        { value: '对话', index: 'dh' },
        { value: '通讯录', index: 'txl' },
      ], // bar列表内容
      childrenLists: [
        { value: '同事', index: 'ts' },
        { value: '讨论组', index: 'tlz' },
      ],
      activeIndex: 'dh', // 默认是active是对话
      childrenActive: 'ts', // 同事或者通讯录的默认
      currentComponent: 'chat-list',
    };
  },
  mounted() {
    // 创建了新的群聊
    EventBus.$on(EVENT_TYPE.CREATE_GROUP_CHAT, () => {
      this.setStatus();
    });
    // 创建了新的单聊
    EventBus.$on(EVENT_TYPE.CREATE_SINGLE_CHAT, () => {
      this.setStatus();
    });
    // 监听 右侧信息面板的关闭按钮事件
    EventBus.$on(EVENT_TYPE.HANDLEBACK, () => {
      this.setStatus();
    });
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.CREATE_GROUP_CHAT);
    EventBus.$off(EVENT_TYPE.HANDLEBACK);
    EventBus.$off(EVENT_TYPE.CREATE_SINGLE_CHAT);
  },
  methods: {
    setStatus() {
      this.currentComponent = 'chat-list';
      this.activeIndex = 'dh';
    },
    // 动态的获取高度
    getHeight() {
      const toolbarHeihgt = document.getElementById('ip-chat-toolbar').offsetHeight;
      const searchHeight = document.getElementById('search-container').offsetHeight;
      this.listTop = toolbarHeihgt + searchHeight + 15;
    },
    clickToolbar(index) {
      if (index === 'txl' || index === 'dh') {
        this.activeIndex = index;
      }
      if (index === 'tlz' || index === 'ts') {
        this.activeIndex = 'txl';
        this.childrenActive = index;
      }
      switch (index) {
        case 'dh':
          this.currentComponent = 'chat-list';
          break;
        case 'txl':
          this.currentComponent = 'colleague';
          this.childrenActive = 'ts';
          break;
        case 'ts':
          this.currentComponent = 'colleague';
          break;
        case 'tlz':
          this.currentComponent = 'group-list';
          EventBus.$emit(EVENT_TYPE.CLICKGROUP);
          break;
        default:
          break;
      }
      setTimeout(() => {
        this.getHeight();
      }, 100);
    },
  },
};
</script>
