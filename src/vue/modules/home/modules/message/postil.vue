<!-- 批注通知 -->
<style lang="scss">
    .pro-crm-home-message-postil{
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
    }
</style>
<template>
    <item-view
        ref="list"
        class="pro-crm-home-message-postil"
        :total-count="totalCount" 
        :loading="loading"
        :visible="visible"
        title="批注"
        @buildData="buildData"
        @readAll="readAll"
        :unreadCount = "unreadCount"
         v-show="visible"
        >
        <div slot="listitem"  
            class="list-item"
            v-for="(item,index) in data" :key="item"
            >
            <div class="title" :class="{'unread':item.funcEdit == '2'}" @click="showInfo(item,index)">
                <span v-html="formatTitle(item)"></span>
                <!-- <span class="date"><span v-html="formatKeyword(item.bean.SY_CREATEUSERNAME)"></span> {{formatTime(item.bean.SY_CREATETIME)}}</span> -->
            </div>
            <div class="content" v-html="formatContent(item)">
            </div>
            <!-- <div class="actions">
                <i class="remove jeicon jeicon-error"></i>
                <i class="edit jeicon jeicon-edit"></i>
            </div> -->
        </div>
    </item-view>
</template>
<script>
    import ItemView from './item_view.vue';
    import Util from '../../util/util.js'

    export default {
        name:'message-postil',
        components:{ItemView},
        data() {
            return {
                loading:true,
                visible:false,
                data:[],
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
            formatTitle:function(item){
                var title = JE.isNotEmpty(item.titleConfig)?JE.toXT(item.titleConfig,item):'';
                title = this.formatKeyword(title);
                return title;
            },
            formatContent:function(item){
                var lastPostil = item.lastPostil;
                var content = '最新批注人：'+lastPostil.SY_CREATEUSERNAME+'，'+lastPostil.POSTIL_PZ+'，'+lastPostil.SY_CREATETIME;
                // var content = '【'+item.funcName+'】'+JE.isNotEmpty(item.showConfig)?JE.toXT(item.showConfig,item):'';
                content = this.formatKeyword(content);
                return content;
            },
            formatKeyword:function(text){
                var keyword = this.getList().keyword;
                return Util.formatKeyword(text,keyword);
            },
            getList(){
                return this.$refs.list;
            },
            formatTime:function(time){
                return Ext.Date.format(Ext.Date.parse(time,'Y-m-d H:i:s'),'m/d H:i');
            },
            /**
             * 全部已读
             */
            readAll:function(){
                var me = this;
                JE.ajax({
                    url:'/je/postil/postil/readAllPostil',
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
            getParams:function(){
                var params = this.getList().getParams();
                params.type = params.readStatus;
                params.category = 'receive';
                return params;
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
                    url:'/je/postil/postil/loadPostil',
                    params:me.getParams(),
                    async:true,
                    success:function(response){
                        var data = JE.getAjaxData(response);
                        me.data = data.rows;
                        me.totalCount = data.totalCount;
                        callback(data);
                        me.$emit('doact','refreshBadge',{
                            type:'POSTIL',
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
            showInfo(item,index){
                JE.CoreUtil.showPostil({
                    funcCode: item.funcCode,
                    pkValue: item.pkValue,
                    openForm:true
                });
                if(item.funcEdit != '0'){
                    Util.doReadMark('postil',item.pkValue);
                    item.funcEdit = '0';
                    this.$set(this.data,index,item);
                }
            }
        }
    };
</script>


