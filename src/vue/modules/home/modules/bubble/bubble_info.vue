<!-- 冒泡详情 -->
<style rel="stylesheet/scss" lang="scss" >
.pro-crm-home-bubble-info {
  .bubble-info {
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
    .comment-box {
      padding: 0 10px 30px 10px;
      color: #333333;

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

        .selectImages {
          padding: 0 4px;
          .remove {
            cursor: pointer;
            padding: 0 5px;
            font-size: 14px;
            color: #d24e58;
          }
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
  <div class="pro-crm-home-bubble-info">
    <el-dialog
      :visible.sync="visible"
      top="0"
      custom-class="info-dialog"
      fullscreen
    >
      <div class="bubble-info">
        <el-row
          :gutter="20"
          style="margin-right:0"
        >
          <el-col :span="18">
            <el-card class="box-card">
              <div slot="header">
                冒泡详情
              </div>
              <div class="info-content">
                <div style="padding:10px">
                  <bubble-listitem
                    :item="item"
                    :index="index"
                    :dozaner="dozaner"
                    type="info"
                    @doComment="focusInput"
                    @doZan="doZan"
                    @doRemove="doRemove"
                  />
                </div>
                <div class="comment-box">
                  <div class="comment-box-title">
                    评论
                  </div>
                  <el-input
                    ref="messageInput"
                    v-model="message"
                    clearable
                    type="textarea"
                    :rows="4"
                    maxlength="500"
                    show-word-limit
                    placeholder="我有话要说(500字以内)..."
                  />
                  <div class="comment-box-bottom">
                    <span
                      ref="emojiBtn"
                      class="emoji"
                      @click.stop.prevent="showEmoji"
                    >
                      <i class="jeicon jeicon-smile" /> 选择表情
                    </span>
                    <je-emoji-popover
                      :visible="visibleEmojiInfo"
                      :trigger-el="triggerEl"
                      @select="selectEmoji"
                    />

                    <span
                      class="image"
                      @click.stop.prevent="selectImage"
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
                      <span class="num">{{ messageLength }}/500</span>
                      <el-button
                        type="primary"
                        size="medium"
                        @click.stop.prevent="doComment"
                      >
                        评 论
                      </el-button>
                    </div>
                  </div>
                </div>
                <div
                  v-loading="loading"
                  class="comment-list"
                >
                  <bubble-listitem
                    v-for="(item,index) of comments"
                    :key="index"
                    :item="item"
                    :index="index"
                    type="comment"
                    @doReplyComment="doReplyComment"
                    @doRemove="removeComment"
                  />
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header">
                热门冒泡
              </div>
              <bubble-list
                ref="list"
                :page-size="12"
                type="hot"
                autoload
                @doComment="refreshComment"
              />
            </el-card>
          </el-col>
        </el-row>
        <i
          class="el-dialog__close el-icon el-icon-close"
          @click.stop.prevent="closeDz"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BubbleList from './bubble_list.vue';
import BubbleListitem from './bubble_listitem.vue';
import JEEmojiPopover from '../../../../components/emoji/index.vue';
// import func from './vue-temp/vue-editor-bridge';

export default {
  name: 'BubbleInfo',
  components: { BubbleList, BubbleListitem, 'je-emoji-popover': JEEmojiPopover },
  props: ['item', 'index'],
  data() {
    return {
      visible: false,
      item: this.item,
      replyComment: null,
      index: this.index,
      loading: false,
      message: '',
      selectImages: [],
      comments: [],
      dozaner: [],
      visibleEmojiInfo: false,
      triggerEl: '',
    };
  },
  computed: {
    messageLength() {
      return this.message.length;
    },
  },
  mounted() {
    const me = this;
    me.$nextTick(() => {
      Ext.get(me.$el.querySelector('.info-dialog')).on('scroll', () => {
        me.visibleEmojiInfo = false; // emoji 表情弹框隐藏
      });

      Ext.get(me.$el.querySelector('.info-dialog')).on('click', () => {
        me.visibleEmojiInfo = false; // emoji 表情弹框隐藏
      });
    });
  },
  methods: {
    showEmoji() {
      this.visibleEmojiInfo = !this.visibleEmojiInfo;
      this.triggerEl = this.$refs.emojiBtn;
    },
    show() {
      const me = this;
      me.visible = true;
      me.resetComment();
      me.$nextTick(() => {
        me.loadComments();
        me.$refs.list.loadPage();
      });
    },

    /**
     * 重置评论信息
     */
    resetComment() {
      this.message = '';
      this.replyComment = null;
      this.selectImages = [];
    },
    /**
     * 获得焦点
     */
    focusInput() {
      this.$refs.messageInput.focus();
      this.resetComment();
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
    /**
     * 刷新当前评论
     */
    refreshComment(item, index) {
      this.item = item;
      this.index = index;
      this.resetComment();
      this.loadComments();
    },

    /**
     * 删除评论
     */
    removeComment(item, index) {
      const me = this;
      JE.confirm('确定删除吗?', (btn) => {
        if (btn == 'ok') {
          me.comments.splice(index, 1);
          JE.msg('删除成功！');
          JE.ajax({ url: '/je/portal/homePortal/removeComment', async: true, params: { ids: item.JE_CIRCLE_COMMENT_ID, tableCode: 'JE_CIRCLE_COMMENT' } });
        }
      });
    },
    doRemove(item) {
      const me = this;
      JE.confirm('确定删除吗?', (btn) => {
        if (btn == 'ok') {
          JE.msg('删除成功！');
          JE.ajax({ url: '/je/portal/homePortal/removeBubble', async: true, params: { ids: item.JE_CIRCLE_MPXX_ID, tableCode: 'JE_CIRCLE_MPXX' } });
          me.visible = false;
        }
      });
    },
    /**
     * 评论
     */
    doComment() {
      this.visibleEmojiInfo = false;
      const type = this.replyComment == null ? 'comment' : 'reply';
      const params = {
        userId: this.item.MPXX_FSRZJ,
        userName: this.item.MPXX_FSRNC,
        MPXX_XXNR: this.item.MPXX_XXNR,
        COMMENT_YW_ID: this.item.JE_CIRCLE_MPXX_ID,
        COMMENT_YW_CODE: 'bubble',
        COMMENT_YW_NAME: '冒泡',
        COMMENT_LX: type,
        COMMENT_PLNR: this.message,
        COMMENT_PLTP: Ext.encode(this.selectImages),
      };
      if (type == 'reply') {
        params.userId = this.replyComment.SY_CREATEUSERID;
        params.userName = this.replyComment.SY_CREATEUSERNAME;
        params.COMMENT_FJPL_ID = this.replyComment.JE_CIRCLE_COMMENT_ID;
        params.COMMENT_PLNR = params.COMMENT_PLNR.replaceAll(`@${params.userName}`, '');
      }

      if (params.COMMENT_PLNR == '') {
        JE.msg('内容不能为空哦~');
        return false;
      }
      const obj = JE.ajax({
        url: '/je/portal/homePortal/doComment',
        params,
      });
      if (obj.success) {
        JE.msg('发布评论成功~');
        this.comments.unshift(obj.obj);
        if (type == 'comment') {
          this.item.MPXX_PLL++;
        }
      } else {
        JE.alert('发布评论失败~');
      }
      this.resetComment();
    },
    /**
     * 回复
     */
    doReplyComment(item) {
      this.message = `@${item.SY_CREATEUSERNAME} `;
      this.replyComment = item;
      this.$refs.messageInput.focus();
    },
    /**
     * 加载评论
     */
    loadComments() {
      const me = this;
      me.loading = true;
      const obj = JE.ajax({
        url: '/je/portal/homePortal/findBubbleInfo',
        params: { id: this.item.JE_CIRCLE_MPXX_ID },
        async: true,
        success(response) {
          const data = JE.getAjaxData(response);
          if (data.success) {
            me.comments = data.obj.PL;
            me.dozaner = data.obj.DZRID;
          }
          me.loading = false;
        },
      });
    },
    closeDz() {
      const me = this;
      me.visible = false;
      me.$emit('buildData', '');
    },
  },
};
</script>
