<!-- 冒泡列表 -->

<style rel="stylesheet/scss" lang="scss" >
    .pro-crm-home-bubble-list{
        padding-top:15px;
        overflow: hidden;
        .scroll-body{
            height:100%;
        }
        .item{
            color: #333;
            font-size: 12px;
            padding:8px 5px 8px 50px;
            position: relative;
            .info{
                color:grey;
                .comment,
                .zan{
                    cursor: pointer;

                    i{
                        font-size: 14px;
                    }
                    i.zaned{
                        color:#f7ba2a;
                    }
                }
            }
            .content{
                overflow: hidden;
                // white-space: nowrap;
                // text-overflow: ellipsis;
                line-height: 24px;
            }

            .photo{
                position: absolute;
                left:5px;
                top:5px;
                width: 36px;
                height: 36px;
                border-radius: 100%;

                .je-user-photo{
                    cursor: auto;
                }
            }

            .images{
                position: absolute;
                right: 5px;
                bottom: 0;
                cursor: pointer;
                color: grey;
                font-size: 14px;
            }
        }
    }
</style>
<template>
  <div
    v-loading="loading"
    class="pro-crm-home-bubble-list"
  >
    <div
      ref="scrollBody"
      class="scroll-body"
      :style="{overflow:autoScroll?'auto':'hidden'}"
    >
      <bubble-listitem
        v-for="(item,index) of data"
        :key="index"
        :item="item"
        :index="index"
        :type="itemType"
        @doComment="doComment"
        @doZan="doZan"
        @doRemove="doRemoveItem"
      />
    </div>
  </div>
</template>
<script>
import BubbleListitem from './bubble_listitem.vue';

export default {
  name: 'BubbleList',
  components: { BubbleListitem },
  props: {
    pageSize: Number,
    itemType: {
      type: String,
      default: 'list',
    },
    type: String,
    autoload: Boolean,
    autoScroll: Boolean,
  },
  data() {
    return {
      loading: true,
      type: this.type,
      page: 1,
      totalCount: 0,
      pageSize: this.pageSize,
      itemType: this.itemType,
      autoload: this.autoload,
      data: [],
    };
  },
  computed: {
    start() {
      return (this.page - 1) * JE.toNum(this.pageSize);
    },
    totalPage() {
      return parseInt(this.totalCount / JE.toNum(this.pageSize)) + (this.totalCount % JE.toNum(this.pageSize) > 0 ? 1 : 0);
    },
  },
  watch: {
    type(nv, ov) {
      this.loadPage();
    },
  },
  mounted() {
    if (this.autoload) {
      this.loadPage();
    }
  },
  updated() {
    const me = this;
    if (me.autoScroll) {
      // 设置隐藏滚动条
      setTimeout(() => {
        const clientWidth = 270;// me.$el.clientWidth>0?me.$el.clientWidth:270;
        const width = clientWidth + 20;
        const { scrollBody } = me.$refs;

        scrollBody.style.width = `${width}px`;
        scrollBody.style.paddingRight = '20px';
      }, 10);
    }
  },
  methods: {
    resetPage(page) {
      const me = this;
      if (JE.isEmpty(page)) {
        me.page = 1;
        me.totalCount = 0;
      } else {
        this.page = page < 1 ? 1 : (page > this.totalPage && this.totalPage > 0 ? this.totalPage : page);
      }
    },
    loadPage(page, type) {
      const me = this;
      me.resetPage(page);
      me.loading = true;
      me.loadData(type, (data) => {
        me.totalCount = data.totalCount;
        me.data = data.rows;
        me.loading = false;
      });
    },
    scrollPage(type) {
      const me = this;
      if (this.page < this.totalPage) {
        this.page++;
        me.loading = true;
        me.loadData(type, (data) => {
          me.totalCount = data.totalCount;
          me.data = me.data.concat(data.rows);
          me.loading = false;
        });
      } else {
        return false;
      }
    },
    /**
         * 评论
         */
    doComment(item, index) {
      if (this._events.doComment) {
        this.$emit('doComment', item, index);
      } else {
        this.$emit('showInfo', item);
      }
    },
    /**
         * 点赞
         */
    doZan(item, index) {
      this.$set(this.data, index, item);
      this.$emit('doAct');
    },
    loadData(type, callback) {
      const me = this;
      JE.ajax({
        url: '/je/portal/homePortal/findBubbleMsg',
        params: {
          position: 'more',
          type: type || this.type || 'new',
          start: this.start,
          limit: this.pageSize || 10,
        },
        async: true,
        success(response) {
          const data = JE.getAjaxData(response);
          if (callback) {
            callback(data.obj);
          }
        },
      });
    },
    /**
         * 删除冒泡
         */
    doRemoveItem(item, index) {
      const me = this;
      JE.confirm('确定删除吗?', (btn) => {
        if (btn === 'ok') {
          me.data.splice(index, 1);
          JE.msg('删除成功！');
          JE.ajax({ url: '/je/portal/homePortal/removeBubble', async: true, params: { ids: item.JE_CIRCLE_MPXX_ID, tableCode: 'JE_CIRCLE_MPXX' } });

          me.$emit('doAct');
        }
      });
    },
  },
};
</script>
