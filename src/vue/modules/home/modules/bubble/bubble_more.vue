<!-- 冒泡更多 -->
<style rel="stylesheet/scss" lang="scss" >
.pro-crm-home-bubble-more {
  .bubble-more {
    width: 1250px;
    height: 100%;
    margin: 0 auto;
    overflow: auto;
    position: relative;
    .el-card__header {
      font-size: 18px;
      font-weight: bold;
    }
    .el-col {
      .el-card {
        min-height: 840px;
      }
    }
    .bubble-type {
      color: #2f6bcf;
      cursor: pointer;
      float: right;
      line-height: 24px;
    }
    .comment-box {
      padding-left: 10px;
      color: #333333;

      .selectImages {
        padding: 0 4px;
        .remove {
          cursor: pointer;
          padding: 0 5px;
          font-size: 14px;
          color: #d24e58;
        }
      }
      .el-textarea {
        margin: 20px 0;
      }
      .comment-box-title {
        font-size: 16px;
      }
      .comment-box-bottom {
        .emoji,
        .image {
          color: darkgray;
          cursor: pointer;
          margin-right: 10px;
        }
        .button-box {
          float: right;
          .el-button {
            width: 100px;
            margin-left: 20px;
            background-color: #2f6bcf;
            border: 0;
          }
        }
      }
    }
  }
  .el-dialog.is-fullscreen {
    background-color: #f0f2f5;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__close {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 20px;
      cursor: pointer;
    }
    .el-dialog__close:hover {
      color: #2f6bcf;
    }
  }
}
</style>
<template>
  <div class="pro-crm-home-bubble-more">
    <el-dialog
      :visible.sync="visible"
      top="0"
      custom-class="more-dialog"
      fullscreen
    >
      <div
        ref="bubbleMoreScroll"
        class="bubble-more"
      >
        <el-row
          :gutter="20"
          style="margin-right:0"
        >
          <el-col :span="18">
            <el-card class="box-card">
              <div slot="header">
                冒个泡吧亲
                <el-dropdown
                  slot="searchType"
                  class="bubble-type"
                  trigger="click"
                  placement="bottom"
                  @command="changeType"
                >
                  <span class="el-dropdown-link">
                    {{ activeType.text }}<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item) in types"
                      :key="item"
                      :command="item.code"
                    >
                      {{ item.text }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="info-content">
                <div class="comment-box">
                  <el-input
                    v-model="message"
                    clearable
                    type="textarea"
                    :rows="4"
                    maxlength="600"
                    show-word-limit
                    placeholder="说你想说的(600字以内)..."
                  />
                  <div class="comment-box-bottom">
                    <span
                      ref="emojiBtn"
                      class="emoji"
                      @click="showEmojis"
                    >
                      <i class="jeicon jeicon-smile" /> 选择表情
                    </span>
                    <je-emoji-popover
                      :visible="visibleEmoji"
                      :trigger-el="triggerEl"
                      @select="selectEmoji"
                    />
                    <span
                      class="image"
                      @click="selectImage"
                    >
                      <i class="jeicon jeicon-image-o" /> 选择图片
                    </span>
                    <span
                      v-for="(file,index) in selectImages"
                      :key="index"
                      class="selectImages"
                    >
                      {{ file.name }} <span
                        class="remove"
                        @click="removeImage(file,index)"
                      >x</span>
                    </span>
                    <div class="button-box">
                      <span class="num">{{ messageLength }}/600</span>
                      <el-button
                        type="primary"
                        size="medium"
                        @click="sendMsg"
                      >
                        冒 泡
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              <bubble-list
                ref="newList"
                :page-size="15"
                type="new"
                item-type="info"
                @doAct="doAct"
                @doComment="doComment"
              />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header">
                热门冒泡
              </div>
              <bubble-list
                ref="hotList"
                :page-size="12"
                type="hot"
                autoload
                @doComment="doComment"
              />
            </el-card>
          </el-col>
        </el-row>
        <i
          class="el-dialog__close el-icon el-icon-close"
          @click="visible=false"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BubbleList from './bubble_list.vue';
import JEEmojiPopover from '../../../../components/emoji/index.vue';

export default {
  name: 'BubbleMore',
  components: { BubbleList, 'je-emoji-popover': JEEmojiPopover },
  props: [],
  data() {
    return {
      selectImages: [],
      visible: false,
      types: [
        { text: '最新冒泡', code: 'new' },
        { text: '我的冒泡', code: 'my' },
      ],
      activeType: {},
      message: '',
      messageLength: 0,
      visibleEmoji: false,
      triggerEl: '',
    };
  },
  watch: {
    message(nv) {
      this.messageLength = nv.length;
    },
  },

  mounted() {
    const me = this;
    me.activeType = me.types[0];
    me.$nextTick(() => {
      Ext.get(me.$el.querySelector('.more-dialog')).on('scroll', (e, t) => {
        me.visibleEmoji = false; // emoji 表情弹框隐藏
        const sign = 50;
        const scrollDistance = t.scrollHeight - t.scrollTop - t.clientHeight;

        if (scrollDistance < sign && !me.getList().loading) {
          me.nextPage();
        }
      });
    });
  },
  methods: {
    doAct() {
      this.getList('hot').loadPage();
    },
    showEmojis() {
      this.visibleEmoji = !this.visibleEmoji;
      this.triggerEl = this.$refs.emojiBtn;
    },
    /**
     * 冒泡
     */
    sendMsg() {
      if (JE.isEmpty(this.message.trim())) {
        JE.msg('不可以发送空内容~');
        return;
      }
      const obj = JE.ajax({
        url: '/je/portal/homePortal/sendBubbleMsg',
        params: { MPXX_XXNR: this.message, MPXX_MPTP: Ext.encode(this.selectImages) },
      });
      if (obj.success) {
        JE.msg('冒泡成功~');
        this.message = '';
        this.selectImages = [];
        this.getList().data.unshift(obj.obj);
        this.getList('hot').loadPage();
      }
    },
    changeType(type) {
      const me = this;
      me.activeType = me.types[type == 'my' ? 1 : 0];
      const list = me.getList('new');
      list.type = me.activeType.code;
      list.loadPage(1, type);
    },
    /**
     * 选择表情
     */
    selectEmoji(emoji) {
      this.message += emoji;
    },
    /**
     * 选择图片
     */
    selectImage() {
      const me = this;
      JE.uploadFile({
        fileTypes: 'jpg;png;gif;jpeg',
        params: {
          returnType: 'all',
          jeFileType: 'PROJECT',
        },
        callback(file) {
          delete file.docInfo;
          delete file.size;
          me.selectImages = [file];
        },
      });
    },
    /**
     * 删除图片
     */
    removeImage(file, index) {
      this.selectImages.splice(index, 1);
    },
    getList(type) {
      const types = type || 'new';
      return this.$refs[`${types}List`];
    },
    show() {
      const me = this;
      me.visible = true;
      me.$nextTick(() => {
        me.getList().loadPage();
        me.getList('hot').loadPage();
      });
    },
    nextPage() {
      const me = this;
      me.getList().scrollPage(me.activeType.code);
    },
    doComment(item, index) {
      this.$emit('showInfo', item, index);
    },
  },
};
</script>
