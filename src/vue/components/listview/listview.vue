<!--
    列表集合
    @event  load 加载事件
    @param  pageSize 每页条数
    @param  totalCount  总条数
    @param  loading  加载遮罩
-->
<style lang="scss">
    .je-vue-listview{
        padding: 10px;

        .listview-body{
            overflow: auto;
            position: relative;
            .listview-item{
                position: relative;
                font-size: 14px;
                color: #333333;
                &:hover{
                    color:#2f6bcf;
                }
            }
            .empty-text{
                background-image: url(./assets/je-nodata.png);
                background-size: 100% 100%;
                width: 120px;
                height: 130px;
                position: absolute;
                left: 50%;
                top: 50%;
                margin-top: -60px;
                margin-left: -65px;
            }
        }
        .je-vue-pagebar{
            margin-top: 10px;
        }
    }
</style>
<template>
  <div class="je-vue-listview">
    <div
      class="listview-body"
      :style="bodyStyle"
    >
      <div class="listview-items">
        <slot name="listitem" />
      </div>
      <!-- 数据项 -->
      <div
        v-show="totalCount == 0"
        class="empty-text"
      />
    </div>
    <!-- 分页条 -->
    <je-pagebar
      ref="pagebar"
      :page-size="pageSize"
      :total-count="totalCount"
      @load="_buildData"
    />
  </div>
</template>
<script>
    import PageBar from './pagebar.vue';
    export default {
        name:'JeListview',
        components:{'je-pagebar':PageBar},
        props:{
            itemHeight:{
                type:Number,
                default:50
            },
            emptyHeight:{
                type:Number,
                default:60
            },
            pageSize:{
                type:Number,
                default:10
            },
            totalCount:{
                type:Number,
                default:0
            }
        },
        data() {
            return {};
        },
        computed:{
            bodyStyle:function(){
                var bodyHeight = JE.getBodyHeight(),
                    itemHeight = this.itemHeight,
                    emptyHeight = this.emptyHeight;
                var padding = 20;
                var height = this.pageSize*itemHeight+padding;
                if(height+emptyHeight>bodyHeight){
                    height = bodyHeight-emptyHeight;
                }
                return {height:height+'px'};
            }
        },
        methods: {
            /**
             * 分页条
             */
            getPageBar:function(){
                return this.$refs.pagebar;
            },
            /**
             * 获得分页信息
             */
            getPageInfo:function(){
                return this.getPageBar().getPageInfo();
            },
            /**
             * 加载第一页数据
             */
            load:function(){
                this.getPageBar().movePage(1);
            },
            /**
             * 加载分页数据
             */
            loadPage:function(page){
                this.getPageBar().movePage(page);
            },
            /**
             * 刷新数据
             */
            refresh:function(){
                this.getPageBar().refresh();
            },
            /**
             * 构建数据
             */
            _buildData:function(pageInfo){
                this.$emit('buildData',pageInfo);
            }
        }
    };
</script>


