<template>
  <div class="chat-tool-emoji">
    <!-- 表情面板 -->
    <div class="emoji-tabbox">
      <emoji-item
        v-for="item in emojis"
        :key="item"
        :ref="item.type"
        :data="item"
        :class="{active:item.type == activeEmoji}"
        class="emoji-box"
        v-on="$listeners"
        @refreshHistory="refreshHistory"
      />
    </div>
    <!-- 表情tab -->
    <div class="emoji-tabs">
      <div
        v-for="item in emojis"
        :key="item"
        :class="{active:item.type == activeEmoji}"
        class="emoji-tab"
        @tap="activeEmoji = item.type"
      >
        <i :class="item.icon" />
        {{ item.text }}
      </div>
    </div>
  </div>
</template>


<script>
import emojiJson from './emojis.json';
import EmojiItem from './emoji-item';

export default {
  name: 'ChatToolEmoji',
  components: {
    EmojiItem,
  },
  data() {
    const emjois = this.buildEmojiData(emojiJson);
    return {
      emojis: emjois,
      keyboardHeight: 300,
      emojiVisible: false,
      message: '',
      activeEmoji: emjois[1].type,
    };
  },
  mounted() {
    this.tabboxEl = JE.getEl('.emoji-tabbox');
    this.tabsEl = JE.getEl('.emoji-tabs');
  },
  methods: {
    /**
     * 刷新历史
     * @param {Object} data 表情数据
     */
    refreshHistory(data) {
      const vm = this.$refs.history[0];
      vm.$set(vm.data, 'items', data);
    },
    /**
     * 构建表情数据
     * @param {Object} emojiData 表情数据
     * @returns {Object}
     */
    buildEmojiData(emojiData) {
      const group = [{
        type: 'history', text: '最近', icon: 'jeicon jeicon-history-o', items: [],
      },
      {
        type: 'face', text: '表情', icon: 'jeicon jeicon-smile', items: [],
      }];
      const keyword = [
        { type: 'face', text: '表情', items: [] },
        { type: 'hand', text: '手势', items: [] },
      ];
      for (const key in emojiData) {
        const item = emojiData[key];
        keyword.forEach((word) => {
          if (item.keywords.indexOf(word.type) != -1) {
            word.items.push(item);
          }
        });
      }
      // 生成一个表情包
      keyword.forEach((word) => {
        group[1].items = group[1].items.concat(word.items);
      });

      // 生成表情数据
      group.forEach((word) => {
        const { items } = word;
        let temps = [];
        const groups = [];
        items.forEach((item, i) => {
          temps.push(item);
          if ((i + 1) % 24 == 0 || i == items.length - 1) {
            // groups.push(JE.clone(temps));
            groups.push(temps);
            temps = [];
          }
        });
        word.items = groups;
      });
      return group;
    },
  },
};
</script>

<style lang="scss" scoped>
  .chat-tool-emoji{
    position: relative;
    height:100%;
    .emoji-tabbox{
      height:500px;
      position: relative;
      .emoji-box{
        visibility: hidden;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -250px;
        &.active{
          visibility: visible;
        }
      }
    }
    .emoji-tabs{
      position: absolute;
      bottom:0;
      left:0;
      width:100%;
      height:40px;
      line-height: 40px;
      background-color: #efeff4;
      .emoji-tab{
        display: inline-block;
        padding:0 20px;
        font-size: 14px;
        color:#a0a0a0;
        &.active{
          background-color: #fafafa;
          color: #536DFE;
        }
      }
    }
  }
</style>
