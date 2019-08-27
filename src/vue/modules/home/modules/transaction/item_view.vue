<!-- 公共集合 -->
<style lang="scss">
    .transaction-itemview{
        margin-bottom:10px;
        border: 1px solid #e4e7ed;
        background: #ffffff;
        .list-item{
            padding:10px 0;
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
                .date{
                    position: absolute;
                    right: 0;
                    color: #868686;
                    font-size: 12px;
                    .timeout{
                        color:#D24D57;
                        font-weight: bold;
                    }
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

            .task-status {
                & > div {
                    display: inline-block;
                    margin: 5px 5px 0px 0px;
                    width: 20px;
                    height: 5px;
                    border: 1px solid #ddd;
                }
                .wc {
                    background-color: #f19b2c;
                    border-color: #f19b2c;
                }
                .lq {
                    background-color: #128c4e;
                    border-color: #128c4e;
                }
            }
            .actions{
                position: absolute;
                right: 0;
                top: 40px;
                i{
                    font-size:14px;
                    color:#868686;
                    margin-left:5px;
                    cursor: pointer;
                }
                .task-star.do{
                    color:#f7ba2a;
                }
                .task-get{
                    color:#efad6b;
                }
                .task-done{
                    color:#5fbb4f;
                }
            }
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
            .el-dropdown{
                cursor: pointer;
                color: #386ad0;
                margin-right: 10px;
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
    }
</style>
<template>
    <div class="transaction-itemview">
        <!-- 查询 -->
        <div class="itemview-search">
            <!-- 日期类型 -->
            <el-dropdown @command="changeDayType" v-if="type=='task'" trigger="click" placement="bottom">
                <span class="el-dropdown-link">
                    {{activeDayType.text}}<span v-show="activeDayType.badge>0">({{activeDayType.badge}})</span><i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item) in dayType" :key="item" :command="item.code">{{item.text}}<span v-show="item.badge>0">({{item.badge}})</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            关键字：
            <el-input
                v-model="_keyword"
                size="mini"
                placeholder=""
                suffix-icon="el-icon-search"
                @keyup.enter.native="load"
                @clear="load"
                clearable
            >
            </el-input>
            <span class="search" @click="load">查询</span>
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
                <div class="title" @click="itemClick(item,index)">
                    <span v-html="formatTitle(item.TASK_BT)"></span>
                    <span class="date">
                        <span v-if="isTimeout(item)&&type!='history'" style="margin-right:10px;color:red;font-weight: bold;">已延期</span>
                        <span>{{formatTime(item.TASK_RWKSSJ)}}</span>
                    </span>
                </div>
                <div class="content">
                    <i :class="[item.TASK_TASKFS_CODE==='once'?'once fa fa-italic':'repeat fa fa-refresh']"></i>
                    <span v-if="type != 'send'">发布人：{{item.JOB_RWFQR}}，</span>{{item.TASK_TASKFS_NAME}}：<span v-html="getContent(item)"></span>
                </div>

                <!-- 状态 -->
                <div
                class="task-status"
                v-if="type==='send'"
                v-html="getTaskStatus(item)"
                ></div>
                <div class="actions">
                    <!-- 领取任务 -->
                    <template v-if="item.JOBMX_SFLQRW !== '1' && type!=='send'">
                    <el-tooltip content="领取任务" class="item" effect="dark" placement="bottom-start">
                        <i
                        class="task-get jeicon jeicon-check-square-o"
                        @click="handleReceiveTask(item)"
                        ></i>
                    </el-tooltip>
                    </template>
                    <!-- 完成任务 -->
                    <template v-else-if="item.JOBMX_SFWCRW !== '1' && type!=='send'">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="完成任务"
                        placement="bottom-start"
                    >
                        <i
                        class="task-done jeicon jeicon-check-circle-o"
                        @click="handleCompleteTask(item)"
                        ></i>
                    </el-tooltip>
                    </template>
                    <!-- 标记历史 -->
                    <!-- <template v-if="type == 'task'">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="标记历史"
                            placement="bottom-start"
                        >
                            <i
                            class="task-history jeicon jeicon-history-o"
                            @click="handleSignHistory(item)"
                            ></i>
                        </el-tooltip>
                    </template> -->
                    <!-- 批注 -->
                    <template v-if="type==='send' && item.TASK_TASKFS_CODE == 'once' || type != 'send'">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="批注"
                        placement="bottom-start"
                    >
                        <i
                        class="task-postil jeicon jeicon-signing"
                        @click="handleAnnotation(item)"
                        ></i>
                    </el-tooltip>
                    </template>
                    <template v-if="type==='send' && item.TASK_TASKFS_CODE !== 'once'">
                        <!-- 启用 -->
                        <template v-if="item.TASK_QY_CODE=='0'">
                            <el-tooltip
                            class="item"
                            effect="dark"
                            content="启动"
                            placement="bottom-start"
                            >
                            <i
                                class="task-enable jeicon jeicon-play-circle-o"
                                @click="handleStart(item)"
                            ></i>
                            </el-tooltip>
                        </template>
                        <!-- 停用 -->
                        <template v-else>
                            <el-tooltip
                            class="item"
                            effect="dark"
                            content="暂停"
                            placement="bottom-start"
                            >
                            <i
                                class="task-disable jeicon jeicon-pause-circle-o"
                                @click="handleStop(item)"
                            ></i>
                            </el-tooltip>
                        </template>
                    </template>
                    <!-- 加星 -->
                    <template v-if="type!=='send'">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.JOBMX_JX==='1'?'取消加星':'加星'"
                        placement="bottom-start"
                    >
                        <i
                        class="task-star jeicon"
                        :class="[item.JOBMX_JX==='1'?'jeicon-stars do':'jeicon-stars-o']"
                        @click="handleCollection(item)"
                        ></i>
                    </el-tooltip>
                    </template>
                    <!-- 编辑 -->
                    <template v-if="type==='send'">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="编辑"
                        placement="bottom-start"
                    >
                        <i
                        class="task-edit jeicon jeicon-edit"
                        @click="handleEdit(item)"
                        ></i>
                    </el-tooltip>
                    </template>
                    <!-- 删除 -->
                    <template v-if="type==='send'">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除"
                        placement="bottom-start"
                        ref="tooltip-remove"
                    >
                        <i
                        class="task-remove jeicon jeicon-trash-o"
                        @click="handleDeleteTask(item,index)"
                        ></i>
                    </el-tooltip>
                    </template>
                </div>
            </div>
            <slot name="listitem" slot="listitem"></slot>
        </je-listview>
    </div>
</template>
<script>
    import ListView from '../../../../components/listview/listview.vue';
    import TaskAction from './action.js';
    import Util from '../../util/util.js';

    export default {
        name:'item-view',
        mixins:[TaskAction],
        components:{'je-listview':ListView},
        props:{
            type:String,
            pageSize:Number
        },
        data() {
            return {
                tipVisible:false,
                keyword:'',//关键字查询
                _keyword:'',//关键字查询
                type:this.type,//类型
                totalCount:0,//总条数，绑定分页条
                pageSize:this.pageSize,
                data:[],
                loading:true,
                emptyHeight:180,//空数据的容器高
                itemHeight:70,//数据项高
                activeDayType:{},
                dayType:[
                    {code:'all',text:'全部'},
                    {code:'today',text:'今天',badge:0},
                    {code:'tomorrow',text:'明天',badge:0},
                    {code:'week',text:'本周',badge:0},
                    {code:'month',text:'本月',badge:0},
                    {code:'delay',text:'已延期',badge:0}

                ]
            };
        },
        mounted(){
            this.activeDayType = this.dayType[0];
            this.load();
        },
        methods: {
            changeDayType:function(code){
                var me = this;
                Ext.each(me.dayType,function(type){
                    if(type.code == code){
                        me.activeDayType = type;
                        return false;
                    }
                });
                this.load();
            },
            /**
             * 获得分页信息
             */
            getList:function(){
                return this.$refs.list;
            },
            /**
             * 发布任务状态
             */
            getTaskStatus(item) {
                var users = item.TASK_ZPRID.split(","),
                    divs = [];
                if (item.TASK_TASKFS_CODE === "once") {
                    //JOB_WLQRWS	未领取
                    //JOB_YLQRWS	领取
                    //JOB_YWCRS	完成
                    var count = users.length,
                    wcCount = item.JOB_YWCRS, //完成
                    lqCount = item.JOB_YLQRWS; //领取

                    for (var i = 0; i < count; i++) {
                    var cls = "";
                    if (i < wcCount) {
                        cls = "wc";
                    } else if (i < lqCount) {
                        cls = "lq";
                    }
                    divs.push('<div class="' + cls + '"></div>');
                    }
                    return divs.join("");
                }
                return "";
            },
            /**
             * 延期
             */
            isTimeout:function(item){
                if(this.type != 'send' && JE.isNotEmpty(item.TASK_YQWCSJ)){
                    var date = new Date();
                    var end = Ext.Date.parse(item.TASK_YQWCSJ, "Y-m-d H:i:s");
                    return JE.isNotEmpty(end) && date.getTime()>end.getTime();
                }
            },
            /**
             * 任务内容
             */
            getContent:function(item){
                var tpls = {
                    once:'从 {[values.TASK_RWKSSJ.substring(0,13)]}点 开始<tpl if="TASK_YQWCSJ">，到 {[values.TASK_YQWCSJ.substring(0,13)]}点 截止</tpl>',
                    repeat:'从 {[values.TASK_RWKSSJ.substring(0,10)]} 开始，{TASK_CFFS_NAME} {info} 天执行一次，执行时间为当天 {time} ，限期 {TASK_YQJTHWC} 天内完成，到 {TASK_XHSXRQ} 截止'
                }
                var tpl = '';
                if(this.type == 'send'){
                    if(item.TASK_TASKFS_CODE == 'once'){
                        tpl = tpls.once;
                    }else{
                        tpl = tpls.repeat;
                        var type = item.TASK_CFFS_CODE;
                        if(type == 'day'){
                            item.info = item.TASK_JGTS;
                        }else if(type == 'week'){
                            item.info = item.TASK_WEEK_NAME;
                        }else if(type == 'month'){
                            item.info = item.TASK_RY_NAME;
                        }else if(type == 'year'){
                            item.info = item.TASK_Y_NAME+item.TASK_RY_NAME;
                        }
                        item.time = item.TASK_SF.split(':')[0]+' 点';
                    }
                }else{
                    tpl = tpls.once;
                }
                return JE.toXT(tpl,item);
            },
            formatTime:function(time){
                return JE.getDate4Msg(Ext.Date.parse(time,'Y-m-d H:i:s'));
                // return Ext.Date.format(Ext.Date.parse(time,'Y-m-d H:i:s'),'m/d H:i');
            },
            formatTitle(title){
                return Util.formatKeyword(title,this.keyword);
            },
            /**
             * 查询参数
             */
            getParams:function(){
                var me = this,type = this.type,pageInfo = this.getList().getPageInfo();
                var params = {
                    start: pageInfo.start,
                    limit: pageInfo.limit,
                    page: pageInfo.page
                };
                if(type == 'send'){
                    params = Ext.apply(params,{
                        tableCode:'JE_SYS_TASK',
                        whereSql:" AND SY_CREATEUSERID='"+JE.USER.userId+"'",
                        orderSql:' order by SY_CREATETIME desc'
                    });
                }else{
                    params = Ext.apply(params,{
                        tableCode:'JE_SYS_JOB_V',
                        whereSql:" AND SY_CREATEUSERID='"+JE.USER.userId+"' AND JOBMX_SFBJLS "+(type == 'history'? "='1'":"!='1'"),
                        orderSql:' order by JOBMX_JX desc,SY_CREATETIME desc'
                    });
                    //日期
                    var dayType = me.activeDayType.code;
                    if(type == 'task' && dayType != 'all'){
                        params.type = dayType
                    }
                }
                if(JE.isNotEmpty(this.keyword)){
                    params.whereSql += " AND TASK_BT LIKE '%"+this.keyword+"%'"
                }

                return params;
            },
            load:function(){
                this.keyword = this._keyword;
                this.getList().load();
            },
            /**
             * 加载数据
             */
            buildData:function(){
                var me = this;
                me.loading = true;
                JE.ajax({
                    url:'/je/job/job/load',
                    params:me.getParams(),
                    async : true,
                    success: function(response){
                        var data = JE.getAjaxData(response);
                        me.data = data.rows;
                        me.totalCount = data.totalCount;
                        //更新数字
                        Ext.each(me.dayType,function(type,index){
                            type.badge=data[type.code+'Count'];
                            me.$set(me.dayType,index,type);
                        });
                        me.loading = false;
                        me.$emit('refreshBadge',data);
                    }
                });
            },
            refresh:function(){
                this.getList().refresh();
            }
        }
    };
</script>


