<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-19 10:29:04
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-26 10:04:30
 -->
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/common.scss";
@import "../../styles/rightView/chatEdit.scss";
</style>
<style>
.ip-chat-main .ip-chat-edit .ip-chat-text .emoji-vue-textarea .edui-editor {
  border-width: 0;
  background: transparent;
}
.el-textarea__inner{
  padding: 5px;
}
.el-popover{
  padding: 0;
  padding-bottom: 10px;
}
</style>
<template>
  <div
    id="ip-chat-main"
    class="ip-chat-main"
  >
    <div id="chat-header">
      <div class="ip-chat-header">
        <span v-if="chatInfo && chatInfo.otherInfo">
          {{ chatInfo.otherInfo.name }}
          <span v-if="chatInfo.type === '3'">{{ `(${chatInfo.otherInfo.groupUserNum})` }}</span>
        </span>

        <span
          @click="chat.clickZoom(fullScreen)"
          class="zooms"
        >
          <i
            :class="[!fullScreen ? 'jeicon-minus' : 'jeicon-max']"
            class="jeicon resize'"
          />
        </span>
      </div>
      <div class="ip-chat-subheader">
        <span
          v-for="item in chatTabList(chatInfo.type)"
          :key="item"
          :class="activeType === item.type ? 'span-active' : ''"
          @click="clickType(item.type)"
        >{{ item.name }}</span>
      </div>
      <member-list
        v-if="activeType === 'memberList' && memberShow"
        :top="contentPosition.top"
        :groupInfo="chatInfo"
      />
    </div>
    <!--中间聊天内容-->
    <div
      v-loading="showLoading"
      :style="{top: contentPosition.top, bottom: contentPosition.bottom}"
      class="chat-middle"
    >
      <p
        v-if="showHistory"
        @click="getMsgList(false)"
        class="ip-chat-load-history"
      >
        查看更多历史记录
      </p>
      <div
        id="loglist"
        class="loglist"
      >
        <!-- 聊天记录 -->
        <ul
          id="ip-chat-log"
          class="ip-chat-log"
        >
          <template v-for="(item,index) of logList">
            <li
              v-if="chat.buildTime(logList,item,index)"
              :key="item"
              style="margin: 10px 0 10px -30px; text-align: center;color:#d1c8c8;"
            >
              <div
                :key="item"
                v-html="chat.buildTime(logList,item,index)"
              />
            </li>
            <li
              :key="item"
              :class="[item.isSendMe ?'chat-me':'chat-other']"
            >
              <div
                @click="clickGroup(item)"
                v-html="item.userPhoto"
                class="chat-avatar"
              />
              <div class="chat-content">
                <div
                  :style="{ 'text-align': item.isSendMe ?'right':'left'}"
                  class="chat-color"
                  style="text-align:left;"
                >
                  {{ item.userName }}
                </div>
                <div
                  v-if="item.contentType == '1'"
                  v-html="item.content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)"
                  :class="[item.isSendMe ? 'bubble me' : 'bubble other']"
                  style="max-width:70%;"
                />
                <div v-if="item.contentType == '2'">
                  <img
                    :src="item.content"
                    alt
                  >
                </div>
                <div v-if="item.contentType === '3'">
                  <a
                    class="chat-file"
                    href="javascript:void(0);"
                  >
                    <div class="chat-file-con">
                      <div class="fileTitle">{{ item.fileName }}</div>
                      <div>
                        <i
                          :class="setIconfont(item.fileName).icon"
                          :style="{color:setIconfont(item.fileName).color?setIconfont(item.fileName).color:'#ccc'}"
                          class="jeicon"
                        />
                      </div>
                    </div>
                    <p class="chat-file-plant">捷信电脑版</p>
                  </a>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <!--底部发送&&testarea&&表情-->
    <div
      id="ip-chat-edit"
      class="ip-chat-edit"
    >
      <div class="chat-edit-tbar">
        <je-emoji-popover
          :placement="'top'"
          @select="selectEmoji"
        >
          <template #button>
            <span
              ref="emojiBtn"
              class="emoji"
            >
              <i class="jeicon jeicon-smile" />
            </span>
          </template>
        </je-emoji-popover>
      </div>
      <div class="ip-chat-text">
        <el-input
          ref="textareaValue"
          :autosize="{ minRows: 3, maxRows: 3}"
          v-model.trim="chatMsgTxt"
          @keyup.enter.native="getMaxLength"
          type="textarea"
          maxlength="500"
          class="emoji-vue-textarea"
          resize="none"
        />
      </div>
      <div class="chat-edit-bbar">
        <!-- 底部发送按钮 -->
        <button
          id="send"
          @click="handleSendMessage"
          class="ip-chat-fotter"
          title="enter发送"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import JEEmojiPopover from '../../components/emoji/index.vue';
import MemberList from './member-list';
import { EventBus } from '../../common/eventBus';
import { EVENT_TYPE, CHAT_TYPE } from '../../common/params';
import User from '../../controller/User';
import Chat from '../../controller/Chat';
import Dialog from '../../controller/Dialog';
import * as Util from '../../common/util';

export default {
  name: 'ChatEdit',
  components: {
    'je-emoji-popover': JEEmojiPopover,
    MemberList,
  },
  data() {
    return {
      activeType: 'chatEdit',
      memberShow: false,
      logList: [], // 历史记录,
      lastId: 0,
      chatInfo: { }, // 点击穿过来的数据
      pageSize: 50,
      showHistory: '',
      fullScreen: true,
      contentPosition: {
        top: '',
        bottom: '',
      }, // 聊天记录高度
      chat: Chat.create(this),
      chatTab: [
        { type: 'chatEdit', name: '聊天' },
        { type: 'memberList', name: '成员' },
      ],
      chatMsgTxt: '',
      editor: null,
      Dialog: Dialog.create(this),
      show: false,
      haveMore: true, // 是否有更多消息
      divScroll: 0,
    };
  },
  mounted() {
    EventBus.$on(EVENT_TYPE.OPEN_CHAT, (target) => {
      // 展开聊天内容
      // 赋值当前
      this.chatInfo = target;
      this.lastId = 0;
      this.getMsgList(true);
      this.getHeight();
      this.memberShow = false;
      this.activeType = 'chatEdit';
      this.logList = [];
    });
    EventBus.$on(EVENT_TYPE.WINDOW_STATUS, (target) => {
      this.show = target;
    });

    // socket 发送消息监听
    EventBus.$on(EVENT_TYPE.ON_MESSAGE, async (message) => {
      if (this.show) {
        return;
      }
      if (message.type === CHAT_TYPE.SINGLE || message.type === CHAT_TYPE.GROUP) {
        if (this.chatInfo.id === message.dialogId) {
          this.logList.push(this.chat.createMsgItem(message, User.getUserId()));
          this.getHeight();
          this.scrollChatBottom();
        }
      }
      // if (message.type == CHAT_TYPE.PUSH) {
      //   const data = JSON.parse(message.data);
      //   if (data.type === '101') {
      //     if (this.chatInfo.type == CHAT_TYPE.SINGLE && data.params.actualId == this.chatInfo.id) {
      //       await this.Dialog.getReadNums(User.getUserId(), this.chatInfo.id, '2');
      //     }
      //   }
      // }
    });
    EventBus.$on(EVENT_TYPE.FULL_SCREEN, (fullScreen) => {
      this.fullScreen = fullScreen;
    });

    // 监听消息对话框 滚动  如果滚动到顶  还有更多回话消息，要显示查看更多，
    this.$nextTick(() => {
      const scrollContainer = this.$el.querySelector('.ip-chat-log');
      scrollContainer.addEventListener('scroll', (e) => {
        if (e.target.scrollTop == 0 && this.logList.length >= 50 && this.haveMore) {
          this.showHistory = true;
        }
      });
    });

    /*  // //编辑器集成   TODO
    const me = this;
    // 配置项
    const editorCfg = {
      autoHeightEnabled: false,
      initialFrameWidth: '100%',
      initialFrameHeight: 90,
      enableAutoSave: false,
      allowDivTransToP: false, // 阻止div标签自动转换为p标签
      // 关闭字数统计
      wordCount: false,
      // 关闭elementPath
      elementPathEnabled: false,
      enableContextMenu: false,
      contextMenu: [],
      imageUrlType: 'url',
      toolbars: [],
      // focus: true,
      retainOnlyLabelPasted: true,
      catchRemoteImageEnable: false,
      // pasteplain: true,
    };
    me.editor = UE.getEditor(this.$refs.textareaValue.$el.childNodes[0], editorCfg);
    // 编辑器准备完毕后，触发事件
    me.editor.addListener('ready', () => {
      UE.dom.domUtils.on(me.editor.body, 'keypress', (event) => {
        if (event.keyCode == 13) {
          event.preventDefault();
          event.stopPropagation();
          // me.handleSendMessage();
        }
      });
    }); */
  },
  destroyed() {
    // this.editor.destroy();
    EventBus.$off(EVENT_TYPE.FULL_SCREEN);
  },
  methods: {
    // 选择表情
    selectEmoji(emoji) {
      this.chatMsgTxt += emoji;
      // this.setContent(emoji, true);
    },
    // 在textarea中点击enter键 发送消息
    getMaxLength() {
      this.handleSendMessage();
      return false;
    },
    // 点击发送按钮
    handleSendMessage() {
      this.chat.handleSendMessage(this.chatMsgTxt, this.chatInfo, User);
      this.chatMsgTxt = '';
    },

    // 处理字体图标
    setIconfont(name) {
      return JE.getFileIcon(name);
    },
    chatTabList(type) {
      if (type === CHAT_TYPE.SINGLE) return (this.chatTab.slice(0, 1));
      if (type === CHAT_TYPE.GROUP) return this.chatTab;
    },
    // 初始化组件的高度
    getHeight() {
      this.$nextTick(() => {
        this.contentPosition.top = `${document.getElementById('chat-header').offsetHeight + 15}px`;
        this.contentPosition.bottom = `${document.getElementById('ip-chat-edit').offsetHeight}px`;
        this.$refs.textareaValue.focus();
      });
    },

    // 获取历史聊天记录 || 查看更多历史记录
    async getMsgList(loadMore) {
      this.showHistory = false;
      this.haveMore = true;
      const data = await this.chat.init(
        this.lastId,
        this.chatInfo.id,
        User.getUserId(),
        this.pageSize,
      );
      if (data.length) {
        this.lastId = data[0].id;
      }
      if (data.length < 50) {
        this.haveMore = false;
        this.showHistory = false;
      }
      if (!loadMore) {
        this.logList = data.concat(this.logList);
        this.scrollChatBottomChange();
      } else {
        this.logList = data;
        this.scrollChatBottom();
      }
    },

    // 查看群组成员
    clickType(type) {
      this.activeType = type;
      this.activeType === 'chatEdit' ? (this.memberShow = false) : (this.memberShow = true);
    },
    // 加载更多回话消息
    scrollChatBottomChange() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.ip-chat-log');
        container.scrollTop = container.scrollHeight - this.divScroll;
        this.divScroll = container.scrollHeight;
      });
    },

    // 滚动到最后一条消息
    scrollChatBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.ip-chat-log');
        container.scrollTop = container.scrollHeight;
        this.divScroll = container.scrollHeight;
      });
    },
    // 群聊点击成员头像
    clickGroup(em) {
      const otherInfo = Util.getItem('userid', em.sendUserId, window._im_people_list);
      EventBus.$emit(EVENT_TYPE.NOW_OBJ, { ...em, otherInfo });
    },

  },
};
</script>
