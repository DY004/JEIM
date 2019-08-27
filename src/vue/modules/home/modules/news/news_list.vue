<!-- 首页新闻 -->
<style lang="scss">
    .news-list{
        padding: 10px;
        .listview-body{
            .list-item{
                position: relative;
                height:28px;
                line-height: 28px;
                padding-left: 20px;
                cursor: pointer;
                font-size: 14px;
                color: #808080;
                white-space:nowrap;
                text-overflow:ellipsis;
                -o-text-overflow:ellipsis;
                overflow:hidden;
                padding-right: 40px;
                &:hover{
                    color:#2f6bcf;
                }

                &::before{
                    content: "";
                    width:6px;
                    height:6px;
                    border-radius: 100%;
                    background: #e4e4e4;
                    position: absolute;
                    left:5px;
                    top:10px;
                }
                &.unread{
                    color:#333333;
                }
                &.unread::before{
                    background: #D24D57;
                }
                .date{
                    position: absolute;
                    right: 0;
                }
            }
        }
    }
</style>
<template>
    <div class="news-list">
        <!-- 列表 -->
        <je-listview ref="list" v-loading="loading"
            :total-count="totalCount"
            :page-size="10"
            :empty-height="emptyHeight"
            :item-height="itemHeight"
            @buildData="buildData"
            >
            <!-- 数据项 -->
                <div slot="listitem"
                    class="list-item"
                    v-for="(item, index) of data" :key="index"
                    :class="{'unread':item.SY_FUNCEDIT != '0'}"
                    @click="preview(item,index)"
                >
                    {{ item.NOTICE_TITLE }}
                    <span class="date">{{ formatDate(item.SY_CREATETIME) }}</span>
                </div>
        </je-listview>
            <!-- 详情页 -->
        <news-info ref="info" @refreshitem="refreshItem"></news-info>
    </div>


</template>
<script>
    import ListView from '../../../../components/listview/listview.vue';
    import NewsInfo from './news_info.vue';
    import Util from '../../util/util.js'

    export default {
        name:'news-list',
        components:{'je-listview':ListView,NewsInfo},
        props:{
            type:String,
            autoload:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                type:this.type,//新闻类型
                autoload:this.autoload,//自动加载
                loading:true,//加载中
                data:[],//数据
                totalCount:0,//总条数，绑定分页条,
                emptyHeight:120,//空数据的容器高
                itemHeight:28//数据项高
            };
        },
        mounted(){
            //初始化加载数据
            this.autoload && this.load();
        },
        methods: {
            /**
             * 格式化日期
             */
            formatDate:function(date){
                return Ext.Date.format(Ext.Date.parse(date,'Y-m-d H:i:s'),'m/d');
            },
            /**
             * 列表
             */
            getList:function(){
                return this.$refs.list;
            },
            load:function(){
                this.getList().load();
            },
            /**
             * 加载数据
             */
            buildData:function(pageInfo){
                var me = this;
                    me.loading = true;
                let params = {
                    tableCode: "JE_SYS_NOTICE",
                    whereSql: " AND NOTICE_QY='1' AND NOTICE_NOTICETYPE_CODE = '" + this.type + "'",
                    orderSql: "ORDER BY SY_CREATETIME DESC",
                    funcCode: "JE_SYS_NOTICE",
                    funcEdit: true,
                    page: pageInfo.page,
                    limit: pageInfo.limit,
                    start: pageInfo.start
                };
                JE.ajax({
                    url:JE.getUrlMaps("je.core.load"),
                    params:params,
                    async : true,
                    success: function(response){
                        var data = JE.getAjaxData(response);
                        me.data = data.rows;
                        me.totalCount = data.totalCount;
                        me.loading = false;
                    }
                });
            },
            /**
             * 预览
             */
            preview:function(item,index){
                var me= this;
                if(item.SY_FUNCEDIT != '0'){
                    Util.doReadMark('news',item.JE_SYS_NOTICE_ID);
                    item.SY_FUNCEDIT = '0';
                    JE.CoreUtil.doNotice("read",item,function(obj){
                        item.NOTICE_YDL = obj.NOTICE_YDL;
                    });
                    this.$set(this.data,index,item);
                }
                me.$refs.info.show(item,index);
            },
            /**
             * 刷新数据项
             */
            refreshItem:function(oldItem,newItem,index){
                oldItem = Ext.apply(oldItem,newItem);
                this.$set(this.data,index,oldItem);
            }
        }
    };
</script>


