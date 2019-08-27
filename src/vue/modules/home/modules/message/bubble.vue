<!-- 冒泡通知 -->
<style lang="scss">
    .pro-crm-home-message-bubble{
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
                padding-left: 12px;
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
                    font-size:10px;
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
                padding: 0 50px 0 20px;
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
    }
</style>
<template>
    <div class="pro-crm-home-message-bubble"  v-show="visible" >
        <item-view
            ref="list"
            :total-count="totalCount" 
            :loading="loading"
            :visible="visible"
            title="冒泡"
            @buildData="buildData"
            @readAll="readAll"
            :unreadCount = "unreadCount"
            >
            <div slot="listitem"  
                class="list-item"
                v-for="(item,index) in data" :key="item"
                >
                <div class="title" :class="{'unread':item.USERMSG_YD != '1'}" @click="showInfo(item,index)">
                    <span v-html="formatKeyword('【'+item.USERMSG_MSGTYPE_NAME+'】'+item.USERMSG_BT)"></span>
                    <span class="date">{{item.SY_CREATEUSERNAME}} {{formatTime(item.USERMSG_JSSJ)}}</span>
                </div>
                <div class="content" v-html="formatKeyword(item.USERMSG_NR)"></div>
                <!-- <div class="actions">
                    <i class="remove jeicon jeicon-error" @click="removeItem(item,index)"></i>
                </div> -->
            </div>
        </item-view>
        <!-- 冒泡详情 -->
        <bubble-info ref="info" :item="activeInfo" :index="0"  @buildData = "buildData" ></bubble-info><!--@setUnreadCount ="setUnreadCount"-->
    </div>
</template>
<script>
    import ItemView from './item_view.vue';
    import BubbleInfo from '../bubble/bubble_info.vue';
    import Util from '../../util/util.js'

    export default {
        name:'message-bubble',
        components:{ItemView,BubbleInfo},
        data() {
            return {
                activeInfo:{},
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
        methods: {
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

                params.tableCode = 'CRM_USER_MESSAGE';
                params.orderSql = 'ORDER BY SY_CREATETIME DESC';
                params.whereSql = "AND USERMSG_JSR_ID='"+JE.USER.userId+"'";
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
                var list = me.$refs.list;
                
                JE.ajax({
                    url:'/je/portal/homePortal/loadBubble',
                    params:me.getParams(),
                    async:true,
                    success:function(response){
                        var data = JE.getAjaxData(response);
                        me.data = data.rows;
                        me.totalCount = data.totalCount;
                        if(callback){
                            callback(data)
                        }
                        me.$emit('doact','refreshBadge',{
                            type:'BUBBLE',
                            num:true,
                            numObj:{
                                numCount:data.noReadCount
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
                    url:'/je/portal/homePortal/readAllBubble',
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
            /**
             * 删除信息
             */
            removeItem:function(item,index){
                var me = this;
                JE.confirm('确认删除吗？',function(btn){
                    if(btn == 'ok'){
                        JE.ajax({
                            url:JE.getUrlMaps('je.core.remove'),
                            params:{ids:item.CRM_USER_MESSAGE_ID,tableCode: "JE_SYS_USERMSG"}
                        });
                        JE.msg('删除成功！');
                        me.data.splice(index,1);
                    }
                });
            },
            /**
             * 查看详情
             */
            showInfo(item,index){
                var me= this,id = item.USERMSG_YW_ID;
                var obj=JE.ajax({
                    url: JE.getUrlMaps("je.core.getInfoById"), //获得数据的地址
                    params : {
                        tableCode:'JE_CIRCLE_MPXX',
                        pkValue:id
                    }
                });
                if(obj.success != false){
                    me.activeInfo = obj;
                    me.$refs.info.show();
                }else{
                    JE.msg('没有找到冒泡信息！');
                }
                if(item.USERMSG_YD == '0'){
                    Util.doReadMark('bubble',item.CRM_USER_MESSAGE_ID);
                    item.USERMSG_YD = '1';
                    this.$set(this.data,index,item);
                }
            }
        }
    };
</script>


