<template>
  <div
    :class="{history:data.type == 'history'}"
    class="emoji-box"
  >
    <template v-if="data.type == 'history'">
      <div class="emoji-body">
        <template v-if="data.items.length > 0">
          <span
            v-for="(item,index) in data.items"
            :key="index"
            class="emoji-item"
            @tap="selectEmoji(item,false)"
          >
            {{ item }}
          </span>
        </template>
        <div
          v-if="data.items.length == 0"
          class="emoji-body-empty"
        >
          您还没有使用表情哦。
        </div>
      </div>
    </template>
    <template v-if="data.type != 'history'">
      <div class="mui-slider">
        <div class="mui-slider-group">
          <div
            v-for="(emoji,index) in data.items"
            :key="index"
            :class="{'mui-active':index==0}"
            class="mui-slider-item"
          >
            <div class="emoji-body">
              <span
                v-for="(item,i) in emoji"
                :key="i"
                class="emoji-item"
                @tap="selectEmoji(item.char)"
              >
                {{ item.char }}
              </span>
              <!-- <span
                    @tap="removeEmoji"
                    class="emoji-remove jeicon jeicon-error"
                  /> -->
            </div>
          </div>
        </div>
        <div class="mui-slider-indicator">
          <div
            v-for="(emoji,index) in data.items"
            :key="index"
            :class="{'mui-active':index==0}"
            class="mui-indicator"
          />
        </div>
        <!-- <div
          @tap="deleteIcon"
          class="deleteIcon"
        >
          <i class="jeicon jeicon-delete-o" />
        </div> -->
      </div>
    </template>
  </div>
</template>


<script>

export default {
  name: 'ChatToolEmoji',
  components: {
  },
  props: {
    data: {
      type: Object,
      default() { return {}; },
    },
  },
  data() {
    return {
      historyKey: '_emoji_history_',
    };
  },
  mounted() {
    if (this.data.type == 'history') {
      const historys = JE.split(JE.getLSItem(this.historyKey), ',');
      this.$set(this.data, 'items', historys);
    }
  },
  methods: {
    /**
     * 添加表情
     * @param {Object} char 表情信息
     * @param {Boolean} [history] 记录缓存
     */
    selectEmoji(char, history) {
      // 不记录缓存
      if (history != false) {
        const historys = JE.split(JE.getLSItem(this.historyKey), ',');
        const index = historys.indexOf(char);
        if (index != -1) {
          historys.splice(index, 1);
        }
        historys.unshift(char);
        // 最多一页 24个
        if (historys.length > 24) {
          historys.pop();
        }
        this.$emit('refreshHistory', historys);// 刷新历史记录
        JE.setLSItem(this.historyKey, historys.join(','));
      }
      this.$emit('selectEmoji', char);
    },
    // 删除已输入的图标
    /* deleteIcon() {
      this.$emit('deleteIcons');
    }, */
  },
};
</script>
<style>
.mui-slider-indicator {
  bottom: 0;
}
</style>
<style lang="scss" scoped>

.deleteIcon {
  position: absolute;
  bottom: 0;
  right: 32px;
  width: 20px;
  z-index: 99;
  .jeicon-delete-o {
    font-size: 19px;
  }
}
.emoji-box {
  width: 100%;
  height: 100%;

  & > .mui-slider {
    height: 100%;
    .mui-slider-item {
      text-align: center;
    }
  }
  &.history {
    text-align: center;
    .emoji-body {
      height: 100%;
    }
  }

  .emoji-body {
    display: inline-block;
    width: 360px;
    text-align: left;
    position: relative;
    .emoji-body-empty {
      color: #a0a0a0;
      width: 100%;
      text-align: center;
      position: absolute;
      top: 50%;
      margin-top: -20px;
      font-size: 14px;
    }

    .emoji-item {
      font-size: 24px;
      padding: 32px 10px;
      width: 60px;
      text-align: center;
      display: inline-block;
    }
    .emoji-remove {
      position: absolute;
      bottom: 0;
      right: 10px;
      width: 60px;
      padding: 5px;
    }
  }
}
</style>
