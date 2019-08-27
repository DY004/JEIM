<!-- 冒泡列表项 -->

<style rel="stylesheet/scss" lang="scss" >
.pro-crm-home-bubble-listitem {
  color: #333;
  font-size: 12px;
  padding: 10px 5px 10px 50px;
  position: relative;
  .info {
    color: grey;
    .comment,
    .zan,
    .reply,
    .remove {
      cursor: pointer;

      i {
        font-size: 14px;
      }
      i.zaned {
        color: #f7ba2a;
      }
    }
    .right {
      float: right;
    }
  }

  .photo {
    position: absolute;
    left: 5px;
    top: 5px;
    width: 36px;
    height: 36px;
    border-radius: 100%;

    .je-user-photo {
      cursor: auto;
    }
  }

  .images {
    position: absolute;
    right: 5px;
    bottom: 0;
    cursor: pointer;
    color: grey;
    font-size: 14px;
  }
}
.content {
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  line-height: 24px;
  padding: 4px 0;

  .comment-reply {
    margin-right: 10px;
    color: #2f6bcf;
  }
  .content-images {
    img {
      max-width: 200px;
      margin: 10px;
      cursor: pointer;
      margin-left: 0;
    }
  }
}
.pro-crm-home-bubble-listitem-top {
  padding: 10px 5px;
  .info-top{
      height: 50px;
      padding-left: 50px;
      position: relative;
      .headerImg{
          position: absolute;
          left: 0;
          top: 7px;
      }
      .userName,.mpTime{
          color: #808080;
          line-height: 25px;
      }
  }
}
.zanUser{
    margin-top: 25px;
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    max-height: 115px;
    overflow: hidden;
    position: relative;
    .zanUserPhoto{
        display: inline-block;
        margin: 10px;
    }
    .showBtn,.hideBtn{
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 3px;
      border-color: #f2f2f3;
    }
}
</style>
<template>
  <div
    class="pro-crm-home-bubble-listitem"
    :class="{'pro-crm-home-bubble-listitem-top': type == 'info'}"
  >
    <div class="info">
      <div
        v-if="type == 'info'"
        class="info-top"
      >
        <div
          class="headerImg"
          v-html="info.photo"
        />
        <div class="userName">
          {{ info.name }}
        </div>
        <div class="mpTime">
          {{ info.time }}
        </div>
      </div>
      <!-- 姓名 -->
      <span
        v-if="type != 'info'"
        class="name"
      >{{ info.name }}</span>
      <!-- 详情时间 -->
      <span
        v-if="type == 'comment'"
        class="time"
        style="margin-left:20px;"
      >{{ info.time }}</span>

      <!-- 列表样式 -->
      <div
        v-if="type == 'list'"
        class="right"
      >
        <!-- 时间 -->
        <span class="time">{{ info.time }}</span>
        <!-- 评论 -->
        <span
          class="comment"
          @click="doComment()"
        >
          <i class="jeicon jeicon-message" /> {{ item.MPXX_PLL }}
        </span>
        <!-- 点赞 -->
        <span
          class="zan"
          @click="doZan()"
        >
          <i
            class="jeicon"
            :class="{
              'jeicon-thumbs-up-o':item.JE_BEST!=1,
              'jeicon-thumbs-up':item.JE_BEST==1,
              'zaned':item.JE_BEST==1
            }"
          /> {{ item.MPXX_DZL }}
        </span>
      </div>
      <!-- 评论楼层 -->
      <div
        v-if="type == 'comment'"
        class="right"
      >
        {{ index+1 }}楼
      </div>
    </div>
    <!-- 内容 -->
    <div class="content">
      <span
        v-if="type=='comment' && item.COMMENT_LX == 'reply'"
        class="comment-reply"
      >@{{ item.COMMENT_BPLRNAME }}</span>
      {{ info.content }}
      <div
        v-if="type != 'list'"
        class="content-images"
      >
        <img
          v-for="image in info.images"
          :key="image"
          :src="image.src"
          :alt="image.name"
          @click="openFile(image)"
        >
      </div>
    </div>
    <!-- 详情样式 -->
    <div
      v-if="type == 'info'"
      class="info"
      style="padding-top:5px;"
    >
      <!-- 评论 -->
      <span
        class="comment"
        @click="doComment()"
      >
        <i class="jeicon jeicon-message" /> {{ item.MPXX_PLL }} 评论
      </span>
      <!-- 点赞 -->
      <span
        class="zan"
        style="margin:0 15px;"
        @click="doZan()"
      >
        <i
          class="jeicon"
          :class="{'jeicon-thumbs-up-o':item.JE_BEST!=1,'jeicon-thumbs-up':item.JE_BEST==1,'zaned':item.JE_BEST==1}"
        />
        {{ item.MPXX_DZL }}
        点赞
      </span>
      <span
        v-if="info.userId == user"
        class="remove"
        @click="doRemove()"
      >
        <i class="fa fa-trash-o" /> 删除
      </span>
    </div>
    <div
      v-if="type != 'list'"
      class="zanUser"
    >
      <el-tooltip
        v-for="(user,index) in getDozanInfo"
        :key="index"
        :content="user.name"
        placement="top"
      >
        <div
          class="zanUserPhoto"
          v-html="user.photo"
        />
      </el-tooltip>
      <el-button
        v-if="getDozanInfo.length>30 && hideShow"
        class="showBtn"
        icon="el-icon-arrow-down"
        circle
        @click="showMore"
      />
      <el-button
        v-if="showHide"
        class="hideBtn"
        icon="el-icon-arrow-up"
        circle
        @click="hideMore"
      />
    </div>
    <!-- 评论样式 -->
    <div
      v-if="type == 'comment'"
      class="info"
      style="padding-top:5px;"
    >
      <!-- 评论 -->
      <span
        v-if="info.userId != user"
        class="reply"
        style="margin-right:15px;"
        @click="doReplyComment()"
      >
        <i class="jeicon jeicon-message" /> 回复
      </span>
      <span
        v-if="info.userId == user"
        class="remove"
        @click="doRemove()"
      >
        <i class="fa fa-trash-o" /> 删除
      </span>
    </div>
    <!-- 头像 -->
    <div
      v-if="type != 'info'"
      class="photo"
      v-html="info.photo"
    />
    <i
      v-if="item.MPXX_MPXX_STATE=='1' && type == 'list'"
      class="jeicon jeicon-image-o images"
      @click="openFile(info,'all')"
    />
  </div>
</template>
<script>

export default {
  name: 'BubbleListitem',
  props: ['item', 'type', 'index', 'dozaner'],
  data() {
    return {
      type: this.type, // list,info,comment
      item: this.item,
      index: this.index,
      zanCount: 0,
      dozanList: [],
      showHide: false,
      hideShow: true,
    };
  },
  computed: {
    user() {
      return JE.USER.userId;
    },
    info() {
      const info = this.item;
      const item = {
        name: info.MPXX_FSRNC || info.SY_CREATEUSERNAME,
        userId: info.MPXX_FSRZJ || info.SY_CREATEUSERID,
        time: this.formatTime(info.MPXX_FSSJ || info.SY_CREATETIME),
        content: (info.MPXX_XXNR || info.COMMENT_PLNR).trim() || '  ',
        id: info.JE_CIRCLE_MPXX_ID || info.JE_CIRCLE_COMMENT_ID,
        images: Ext.decode(info.MPXX_MPTP || info.COMMENT_PLTP || '[]'),
      };
      if (item.images !== null) {
        for (let i = 0; i < item.images.length; i++) {
          item.images[i].src = item.images[i].src || item.images[i].privateUrl || JE.getFileUrl(item.images[i].url) || JE.getFileUrl(item.images[i].path);
        }
      }

      item.photo = JE.getUserPhoto(item.userId, true);
      return item;
    },
    getDozanInfo() {
      if (this.dozaner) {
        this.showHide = false;
        this.hideShow = true;
        this.$nextTick(() => {
          document.querySelector('.zanUser').style.maxHeight = '115px';
        });
        this.dozanList = [];
        this.dozaner.forEach((item) => {
          this.dozanList.push({
            photo: JE.getUserPhoto(item, true),
            name: JE.__USERS__[item].name,
          });
        });
      }
      return this.dozanList;
    },
  },
  methods: {
    showMore() {
      document.querySelector('.zanUser').style.maxHeight = `${document.querySelector('.zanUser').scrollHeight}px`;
      this.showHide = true;
      this.hideShow = false;
    },
    hideMore() {
      document.querySelector('.zanUser').style.maxHeight = '115px';
      this.showHide = false;
      this.hideShow = true;
    },
    /**
     * 格式化日期
     */
    formatTime(time) {
      const d = moment(time).fromNow();
      if (d.indexOf('天') !== -1) {
        return time.substr(0, 10);
      }
      return d;
    },
    /**
     * 评论
     */
    doComment() {
      this.$emit('doComment', this.item, this.index);
    },
    /**
     * 打开文件
     */
    openFile(img, type) {
      if (type === 'all') {
        img = img.images[0];
      }
      if (img) {
        JE.File.openFileByPath((img.path || img.url), img.name);
      } else {
        JE.msg('图片不存在！');
      }
    },
    /**
     * 点赞
     */
    doZan() {
      const me = this; const
        { item } = this;
      if (me.zanCount === 6) {
        JE.msg('操作频繁，请稍后再试');
        return;
      }
      me.zanCount++;

      if (me.zanCount === 6) {
        setTimeout(() => {
          me.zanCount = 0;
        }, 1000 * 60 * 5);
      }
      const zan = item.JE_BEST == 0 ? 1 : 0;
      const obj = JE.ajax({
        url: '/je/portal/homePortal/thumbsUp',
        params: {
          source: 'bubble',
          jebest: zan,
          id: item.JE_CIRCLE_MPXX_ID,
        },
      });

      if (obj.success) {
        JE.msg(obj.obj);
        item.JE_BEST = zan;
        item.MPXX_DZL += zan ? 1 : -1;
        if (item.MPXX_DZL < 0) item.MPXX_DZL = 0;
      }
      this.$emit('doZan', this.item, this.index);
    },
    /**
     * 删除
     */
    doRemove() {
      this.$emit('doRemove', this.item, this.index);
    },
    doReplyComment() {
      this.$emit('doReplyComment', this.item, this.index);
    },
  },
};
</script>
