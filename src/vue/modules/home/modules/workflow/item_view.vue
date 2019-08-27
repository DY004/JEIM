<!-- 公共集合 -->
<style lang="scss">
    .workflow-itemview{
        margin-bottom:10px;
        border:1px solid #e4e7ed;
        background: #ffffff;
        padding-left:150px;
        position: relative;
        .list-item{
            padding:10px 0;
            padding-left:50px;
            position: relative;
            &::after{
                content: "";
                position: absolute;
                bottom:0;
                left:0;
                height:1px;
                width:100%;
                background: #f3f3f3;
            }
            &:last-child:after{
                display: none;
            }
            .title{
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                cursor: pointer;
                line-height: 24px;
                position: relative;
                &:hover{
                    color:#2f6bcf;
                }
                .time{
                    color: #868686;
                }
            }
            .content{
                font-size: 12px;
                line-height: 26px;
                color: #868686;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding-right:100px;
                .once{
                    color:#f19b2c;
                }
                .repeat{
                    color:#128c4e;
                }
            }
            .photo{
                position: absolute;
                top: 15px;
                left: 0;
            }

            .actions{
                position: absolute;
                right: 0;
                top: 32px;
                font-size: 14px;
                line-height: 30px;
                color:#868686;
                *{
                    margin-left:10px;
                }
                i{
                    font-size:14px !important;
                    cursor: pointer;
                }
            }
            .time-text{
                    position: absolute;
                    right: 0;
                    top:14px;
                    color: #868686;
                }
                .time-text.red-box::before{
                    content: "";
                    width:6px;
                    height:6px;
                    border-radius: 100%;
                    background: #D24D57;
                    position: absolute;
                    left: -16px;
                    top: 5px;
                }
        }
        .color-gold{
            color:#f7ba2a;
        }
        .itemview-search{
            padding: 5px 20px;
            background: #f4f7fd;
            color: #333333;
            .search{
                color:#2f6bcf;
                cursor: pointer;
                margin-left: 10px;
            }
            .el-input{
                width:200px;
            }
            .createTask{
                font-size: 14px;
                cursor: pointer;
                color: #2f6bcf;
                margin-right:10px;
            }
            .radio-group{
                padding : 10px 0 10px;
                font-size: 12px;
                vertical-align: inherit;
                label{
                    font-weight: normal;
                    .el-radio__label{
                        font-size: 12px;
                    }
                }
            }
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
        .itemview-tree{

        }
    }
</style>
<template>
    <div class="workflow-itemview">
        <item-tree ref="tree" @itemClick="load" :data="menuData"></item-tree>
        <div class="itemview-body">
            <!-- 查询 -->
            <div class="itemview-search">
                {{keywordLabel || '关键字'}}：
                <el-input
                    v-model="_keyword"
                    size="mini"
                    style="width:116px;"
                    placeholder=""
                    @keyup.enter.native="load"
                    @clear="load"
                    clearable
                >
                </el-input>
                日期：<el-date-picker
                    v-model="time"
                    size="mini"
                    type="daterange"
                    style="width:200px;"
                    range-separator="——"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="load"
                    >
                </el-date-picker>
                <span class="search" @click="load">查询</span>
                <el-radio-group v-model="isNandY" @change="load" class="radio-group" v-if="['APPROVED','OWNER'].indexOf(type) != -1">
                    筛选：
                    <el-radio label="0">未完结流程</el-radio>
                    <el-radio label="1">已完结流程</el-radio>
                </el-radio-group>
            </div>
            <!-- 列表 -->
            <je-listview ref="list" v-loading="loading"
                :total-count="totalCount"
                :page-size="pageSize"
                :empty-height="emptyHeight"
                :item-height="itemHeight"
                @buildData="buildData"
                >
                <!-- 数据项 -->
                <div slot="listitem" class="list-item" v-for="(item,index) in data" :key="index">
                    <!-- 标题 -->
                    <div class="title" @click="itemClick(item,index)" v-html="getTitle(item)"></div>
                    <!-- 日期 -->
                    <div class="time-text" :class="{'red-box':item.priority == '1'}">{{validateTime(item)}}</div>
                    <!-- 内容 -->
                    <div class="content" v-html="getContent(item)"></div>
                    <!-- 头像 -->
                    <div class="photo" v-html="getPhoto(item)"></div>
                    <div class="actions">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="type == 'DELAY' ? '取消延迟' : '加入延迟'"
                                placement="bottom-start"
                            >
                                <i
                                    :class="type == 'DELAY' ? 'color-gold' : ''"
                                    class="jeicon jeicon-time-o"
                                    @click="doDelay(item)"
                                />
                                </el-tooltip>
                                <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.priority == '1'?'取消标记':'加入标记'"
                                placement="bottom-start"
                                >
                                <i
                                    class="jeicon"
                                    :class="[item.priority == '1'?'jeicon-stars color-gold':'jeicon-stars-o']"
                                    @click="doStar(item)"
                                />
                                </el-tooltip>
                    </div>
                </div>
                <slot name="listitem" slot="listitem"></slot>
            </je-listview>
        </div>
    </div>
</template>
<script>
    import ListView from '../../../../components/listview/listview';
    import ItemTree from './item_tree.vue';
    import Action from './action.js';
    import Util from '../../util/util.js'

    export default {
        name:'item-view',
        mixins:[Action],
        components:{'je-listview':ListView,ItemTree},
        props:{
            type:String,
            pageSize:Number,
            menuData:Array,
            keywordLabel:String
        },
        data() {
            return {
                time:[],//时间区间查询
                keyword:'',//关键字查询
                _keyword:'',
                isNandY:'0',//流程是否完结
                type:this.type,//类型
                totalCount:0,//总条数，绑定分页条
                pageSize:this.pageSize,
                data:[],
                menuData:this.menuData,//菜单数据
                loading:true,
                emptyHeight:180,//空数据的容器高
                itemHeight:70//数据项高
            };
        },
        computed:{
            startDate:function(){
                return this.time && this.time[0]?Ext.Date.format(this.time[0],'Y-m-d'):'';
            },
            endDate:function(){
                return this.time && this.time[1]?Ext.Date.format(this.time[1],'Y-m-d'):'';
            }
        },
        mounted(){
            this.load();
        },
        methods: {
            getSelectNode:function(){
                return this.$refs.tree.selectNode;
            },
            /**
             * 获得分页信息
             */
            getList:function(){
                return this.$refs.list;
            },
            getTitle:function(item){
                var time = Ext.Date.format(Ext.Date.parse(item.createTime,'Y-m-d H:i:s'),'m月d日');
                return Util.formatKeyword(JE.Action.getFlowUserInfo(item,this.type),this.keyword)+'，'+item.funcName+' <span class="time">'+time+'</span>';
            },
            getPhoto:function(item){
                return JE.getUserPhoto(item.bean.SY_LASTFLOWUSERID,true);
            },
            validateTime(item) {
                return JE.getDate4Msg(Ext.Date.parse(item.createTime,'Y-m-d H:i:s'));
            },
            /**
             * 任务内容
             */
            getContent:function(item){
                return JE.Action.getFlowCommentInfo(item);
            },
            formatTime:function(time){
                return Ext.Date.format(Ext.Date.parse(time,'Y-m-d H:i:s'),'m/d H:i');
            },
            load:function(){
                this.keyword = this._keyword;
                this.getList().load();
            }
        }
    };
</script>


