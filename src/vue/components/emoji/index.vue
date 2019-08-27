<!-- 表情弹出框 -->
<style rel="stylesheet/scss" lang="scss" >
.je-vue-emoji-popover {
  padding: 0;
  .emoji-mart {
    border: 0 !important;
    .emoji-mart-emoji {
      span {
        background-image: url(./assets/emoji.png) !important;
      }
    }
  }
}
</style>
<template>
  <mu-popover
    :open.sync="visible"
    :lazy="true"
    placement="bottom-start"
    :trigger="triggerEl"
  >
    <picker
      set="apple"
      emoji="point_up"
      :sheet-size="16"
      :i18n="pickerI18n"
      :include="['recent','people']"
      :show-preview="false"
      :show-search="false"
      :show-skin-tones="false"
      @select="selectEmoji"
    />
    <slot
      slot="reference"
      name="button"
    />
  </mu-popover>
</template>
<script>
import { Picker } from "emoji-mart-vue";
import { Popover } from 'muse-ui';
Vue.use(Popover);
export default {
  name: 'JeEmojiPopover',
  components: { Picker },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    triggerEl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pickerI18n: {
        search: "搜索",
        notfound: "没有找到表情",
        categories: {
          search: "搜索结果",
          recent: "常用",
          people: "表情符号和人物",
          nature: "动物与自然",
          foods: "食物与饮料",
          activity: "活动",
          places: "旅行与地点",
          objects: "物体",
          symbols: "符号",
          flags: "旗帜",
          custom: "自定义"
        }
      }
    }
  },
  methods: {
    selectEmoji (emoji) {
      this.$emit('select', emoji.native, emoji);
      this.visible = false;
    }
  }
}
</script>

