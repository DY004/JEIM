<!-- 通知 -->
<style lang="scss">
    .pro-crm-home-message-notice{
        .list-item{
            padding:10px 0;
            position: relative;
            &::after{
                content: "";
                position: absolute;
                bottom:0;
                left:2%;
                height:1px;
                width:98%;
                background: #f3f3f3;
            }
            .title{
                font-size: 14px;
                font-weight: 400;
                color: #808080;
                cursor: pointer;
                line-height: 24px;
                padding-left: 20px;
                position: relative;
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
                &:hover{
                    color:#2f6bcf;
                }
                .date{
                    position: absolute;
                    right: 0;
                    color: #868686;
                    font-size: 12px;
                }
            }
            .content{
                font-size: 12px;
                line-height: 26px;
                color: #868686;
                padding: 0 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .actions{
                position: absolute;
                right: 5px;
                bottom: 10px;
                i{
                    color: #cccccc;
                    cursor: pointer;
                    margin:0 5px;
                    font-size: 12px;
                    &.edit{
                        font-size: 14px;
                    }
                    &:hover{
                        color:#2f6bcf;
                    }
                }
            }
        }
        .itemview-searchbar{
            .searchbox{
                .el-dropdown{
                    cursor: pointer;
                    color: #386ad0;
                    margin-right: 10px;
                }
                .keyword-input{
                    width:130px;
                }
                .date-input{
                    width:230px;
                }
            }
        }
    }
</style>
<template>
    <div>
        <item-view
            ref="list"
            class="pro-crm-home-message-notice"
            :total-count="totalCount" 
            :loading="loading"
            :visible="visible"
            title="通知"
            @buildData="buildData"
            @readAll="readAll"
            :unreadCount = "unreadCount"
            v-show="visible"
            >
            <el-dropdown slot="searchType" @command="changeMsgType" trigger="click" placement="bottom">
                <span class="el-dropdown-link">
                    {{activeMsgText}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item) in msgTypes" :key="item" :command="item.code">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div slot="listitem"  
                class="list-item"
                v-for="(item,index) in data" :key="item"
                >
                <div class="title" :class="{'unread':item.USERMSG_YD != '1'}" @click="showInfo(item,index)">
                    <span v-html="formatKeyword(item.USERMSG_BT)"></span>
                    <span class="date"><span v-html="formatKeyword(item.SY_CREATEUSERNAME)"></span> {{formatTime(item.SY_CREATETIME)}}</span>
                </div>
                <div class="content" v-html="item.USERMSG_NR" @click="showInfo(item,index,true)"></div>
                <!-- <div class="actions">
                    <i class="remove jeicon jeicon-error"></i>
                    <i class="edit jeicon jeicon-edit"></i>
                </div> -->
            </div>
        </item-view>
        <log-info ref="loginfo"></log-info>
    </div>
</template>
<script>
    import ItemView from './item_view.vue';
    import Util from '../../util/util.js'
    import LogInfo from "./../log/log_info.vue"
    export default {
        name:'message-notice',
        components:{ItemView,LogInfo},
        data() {
            return {
                activeMsgType:'all',
                loading:true,
                visible:false,
                data:[],
                unreadCount:0,
                totalCount:0//总条数，绑定分页条
            };
        },
        mounted(){
            var me = this;
            me.$nextTick(function(){
                me.getList().load();
            });
        },
        computed:{
            msgTypes(){
                var items = JE.getDicItems('JE_CORE_MSGTYPE');
                var _items = [{code:'all',text:'全部'}],excloud=['PZ','BUBBLE','WF','TRANSACTION'];
                Ext.each(items,function(item){
                    if(excloud.indexOf(item.code) == -1){
                        _items.push(item);
                    }
                });
                return _items;
            },
            activeMsgText(){
                var text = '',activeType = this.activeMsgType;
                Ext.each(this.msgTypes,function(type){
                    if(activeType == type.code){
                        text = type.text;
                        return false;
                    }
                });
                return text;
            }
            
        },
        methods: {
            changeMsgType:function(code){
                this.activeMsgType = code;
                this.getList().load();
            },
            setVisible:function(visible){
                this.visible = visible;
            },
            getList(){
                return this.$refs.list;
            },
            formatTime:function(time){
                return Ext.Date.format(Ext.Date.parse(time,'Y-m-d H:i:s'),'m/d H:i');
            },
            getParams:function(){
                var params = this.getList().getParams();
                params.tableCode = 'JE_SYS_USERMSG';
                params.orderSql = 'ORDER BY SY_CREATETIME DESC';
                params.whereSql = "AND USERMSG_JSR_ID='"+JE.USER.userId+"'";

                //消息类型
                var types = [];
                if(this.activeMsgType == 'all'){
                    Ext.each(this.msgTypes,function(type){
                        type.code != 'all' && types.push(type.code);
                    });
                }else{
                    types.push(this.activeMsgType);
                }
                if(JE.isNotEmpty(types)){
                    params.whereSql += " AND USERMSG_MSGTYPE_CODE IN ('"+types.join("','")+"')";
                }
                //读取状态
                if(JE.isNotEmpty(params.readStatus) && params.readStatus != 'ALL'){
                    params.whereSql += " AND USERMSG_YD = '"+(params.readStatus=='YD'?'1':'0')+"'"
                }
                //关键字
                if(JE.isNotEmpty(params.keyword)){
                    params.whereSql += " AND (USERMSG_BT like '%"+params.keyword+"%'  OR SY_CREATEUSERNAME like '%"+params.keyword+"%'  OR USERMSG_NR like '%"+params.keyword+"%')";
                }
                //时间
                if(JE.isNotEmpty(params.startTime)){
                    params.whereSql += " AND (USERMSG_JSSJ>'"+params.startTime+"' AND USERMSG_JSSJ<'"+params.endTime+"')";
                }
                return params;
            },
            formatKeyword:function(text){
                var keyword = this.getList().keyword;
                return Util.formatKeyword(text,keyword);
            },
            refresh:function(){
                this.getList().load();
            },
            /**
             * 加载数据
             */
            buildData:function(callback){
                var me = this;
                me.loading = true;
                JE.ajax({
                    url:'/je/portal/homePortal/loadUserMsg',
                    params:me.getParams(),
                    async:true,
                    success:function(response){
                        var data = JE.getAjaxData(response);
                        me.data = data.rows;
                        me.totalCount = data.totalCount;
                        callback(data);
                        me.$emit('doact','refreshBadge',{
                            type:'MSG',
                            num:true,
                            numObj:{
                                msgCount:data.noReadCount
                            }
                        });
                        me.unreadCount = data.noReadCount;
                        me.loading = false;
                    }
                });
            },
            /**
             * 全部已读
             */
            readAll:function(){
                var me = this;
                JE.ajax({
                    url:'/je/portal/homePortal/readAllUserMsg',
                    async:true,
                    success:function(response){
                        var data = JE.getAjaxData(response);
                        if(data.success){
                            me.getList().load();
                            JE.msg('设置成功！');
                        }
                    }
                });
            },
            childRefresh() {
                this.$refs.list._buildData();
            },
            /**
             * 查看详情
             */
            showInfo(item,index,flag){
                var me= this;
                //查看日志
                if(item.USERMSG_MSGTYPE_CODE == 'RZ'){
                    var info = me.$refs.loginfo;
                    var obj=JE.ajax({
                        url: JE.getUrlMaps("je.core.getInfoById"), //获得数据的地址
                        params : {
                            tableCode: 'JE_CIRCLE_REPORT',
                            pkValue: item.USERMSG_YW_ID 
                        }
                    });
                    if(obj.success != false){
                        info.data = obj;
                        info.setVisible(true);
                        info.noticeRefresh();
                    }else{
                        JE.msg('日志不存在！');
                        me.childRefresh();
                    }
                }else{
                    if(!flag){
                        const win = JE.win({
                            title:'消息查看',
                            width : 750,
                            height :450,
                            autoShow:true,
                            buttons:[{text:'关闭',cls:'JEPLUS_B_L10',handler:function(btn){btn.up('window').close();}}],
                            buttonAlign:'center',
                            html:'<div style="line-height: 2;font-size: 16px;padding: 10px 20px;text-indent: 24px;">'+item.USERMSG_NR+'</div>'
                        });
                        win.on('close',function(){
                            me.childRefresh();
                        });
                    }
                }
                if(item.USERMSG_YD == '0'){
                    Util.doReadMark('notice',item.JE_SYS_USERMSG_ID);
                    item.USERMSG_YD = '1';
                    this.$set(this.data,index,item);
                }
                
            }
        }
    };
</script>


