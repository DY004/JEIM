<!-- 表情弹出框 -->
<template>
  <el-popover
    :placement="placement"
    trigger="click"
  >
    <picker
      :sheet-size="16"
      :i18n="pickerI18n"
      :include="['recent','people']"
      :show-preview="false"
      :show-search="false"
      :show-skin-tones="false"
      @select="selectEmoji"
      set="apple"
      style="border:0"
      emoji="point_up"
    />
    <slot
      slot="reference"
      name="button"
    />
  </el-popover>
</template>
<script>
import { Picker } from 'emoji-mart-vue';

export default {
  name: 'JeEmojiPopover',
  components: { Picker },
  props: {
    placement: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      pickerI18n: {
        search: '搜索',
        notfound: '没有找到表情',
        categories: {
          search: '搜索结果',
          recent: '常用',
          people: '表情符号和人物',
          nature: '动物与自然',
          foods: '食物与饮料',
          activity: '活动',
          places: '旅行与地点',
          objects: '物体',
          symbols: '符号',
          flags: '旗帜',
          custom: '自定义',
        },
      },
    };
  },
  methods: {
    selectEmoji(emoji) {
      this.$emit('select', emoji.native, emoji);
    },
  },
};
</script>
