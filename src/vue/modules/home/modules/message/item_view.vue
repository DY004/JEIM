<!-- 公共集合 -->
<style lang="scss">
    .message-itemview{
        padding: 10px 20px;
        padding-top: 0;
        background: #ffffff;
        .itemview-header{
            position: relative;
            font-size: 14px;
            color: #808080;
            height:50px;
            line-height: 50px;
            // padding:10px 0;
            .message-status{
                .item{
                    display: inline-block;
                    border-radius: 4px;
                    line-height: 30px;
                    height: 30px;
                    padding: 0 20px;
                    cursor: pointer;
                    &.active{
                        background: #386ad0;
                        color: #fff;
                    }
                }
            }

            .read-all{
                color:#2f6bcf;
                font-size: 14px;
                cursor: pointer;
                position: absolute;
                right:40px;
                top:0
            }

            .close{
                position: absolute;
                right:10px;
                top:0;
                font-size: 12px;
                color: #cccccc;
                cursor: pointer;
                &:hover{
                    color:#2f6bcf;
                }
            }
        }
        .itemview-body{
            border: 1px solid #e4e7ed;
            position: relative;
            .itemview-searchbar{
                padding: 5px 20px;
                background: #f4f7fd;
                color: #333333;
                .search{
                    color:#2f6bcf;
                    cursor: pointer;
                    margin-left: 10px;
                }
                .keyword-input{
                    width:150px;
                }
                .date-input{
                    width:250px;
                }
            }
            .list-item:last-child:after{
                display: none;
            }
            .je-vue-listview{
                padding:0;
                .listview-body{
                    padding:10px 20px;
                }
                .je-vue-pagebar{
                    background: #f4f7fd;
                    height: 50px;
                    line-height: 50px;
                    padding: 0 20px;
                }
            }
        }
    }
</style>
<template>
    <div class="message-itemview">
        <!-- 标题 -->
        <div class="itemview-header">
            <div class="message-status">
                <div class="item" :class="{active:activeStatus==item.code}" @click="activeStatus=item.code;" v-for="item in status" :key="item">
                    {{item.text+title}}<span v-show="item.code=='WD'">({{unreadCount}})</span>
                </div>
            </div>
            <span class="read-all" @click="readAll" v-show="activeStatus=='WD'">全部设为已读</span>

            <i class="jeicon jeicon-error close" @click="close"></i>
        </div>
        <div class="itemview-body">
        <div class="itemview-searchbar">
            <div class="searchbox">
                <slot name="searchType"></slot>
                关键字：<el-input
                    class="keyword-input"
                    v-model="_keyword"
                    size="mini"
                    placeholder=""
                    @keyup.enter.native="load"
                    @clear="load"
                    clearable
                >
                </el-input>
                日期：<el-date-picker
                    class="date-input"
                    v-model="time"
                    size="mini"
                    type="daterange"
                    range-separator="——"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="load"
                    >
                </el-date-picker>
                <span class="search" @click="load">查询</span>
            </div>
        </div>
        <!-- 列表 -->
        <je-listview ref="list" v-loading="loading"
            :total-count="totalCount"
            :page-size="5"
            :empty-height="emptyHeight"
            :item-height="itemHeight"
            @buildData="_buildData"
            >
            <!-- 数据项 -->
            <slot name="listitem" slot="listitem" @setUnreadCount = "_buildData"></slot>
        </je-listview>
        </div>
    </div>
</template>
<script>
    import ListView from '../../../../components/listview/listview.vue';
    export default {
        name:'item-view',
        components:{'je-listview':ListView},
        props:{
            title:String,
            totalCount:Number,
            loading:Boolean,
            visible:Boolean,
            unreadCount:Number
        },
        data() {
            return {
                status:[
                    {text:'未读',code:'WD'},
                    {text:'已读',code:'YD'},
                    {text:'全部',code:'ALL'},
                ],
                activeStatus:'WD',
                unreadCount:0,
                time:[],//时间区间查询
                keyword:'',//关键字查询
                _keyword:'',//关键字查询
                visible:this.visible,
                title:this.title,//新闻类型
                totalCount:this.totalCount,//总条数，绑定分页条
                loading:this.loading,
                emptyHeight:180,//空数据的容器高
                itemHeight:70//数据项高
            };
        },
        watch:{
            activeStatus(nv){
                this.load();
            }
        },
        computed:{
            startTime:function(){
                return this.time && this.time[0]?Ext.Date.format(this.time[0],'Y-m-d'):'';
            },
            endTime:function(){
                return this.time && this.time[1]?Ext.Date.format(this.time[1],'Y-m-d'):'';
            }
        },
        methods: {
            close:function(visible){
                var parent = this.$parent;
                parent.setVisible(false);
                parent.$emit('doact','clearSelect');
            },
            /**
             * 获得分页信息
             */
            getList:function(){
                return this.$refs.list;
            },
            /**
             * 查询参数
             */
            getParams:function(){
                var pageInfo = this.getList().getPageInfo();
                return {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    keyword: this.keyword,
                    start: pageInfo.start,
                    limit: pageInfo.limit,
                    readStatus: this.activeStatus
                };
            },
            load:function(){
                this.keyword = this._keyword;
                this.getList().load();
            },
            /**
             * 加载数据
             */
            _buildData:function(){
                var me = this;
                this.$emit('buildData',function(data){
                    me.unreadCount = data.noReadCount;
                });
            },
            readAll:function(){
                this.$emit('readAll');
            }
        }
    };
</script>


