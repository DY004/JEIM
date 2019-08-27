<!-- 新闻详情 -->
<template>
    <div class="news-info">
        <el-dialog :visible.sync="visible" top="0" fullscreen>
            <div class="news-info-body">
                <!-- 标题 -->
                <div class="title">{{item.NOTICE_TITLE}}</div>
                <!-- 副标题 -->
                <div class="subtitle">
                    <span class="user">{{item.SY_CREATEUSERNAME}} 于 {{item.SY_CREATETIME}} 发布在{{item.NOTICE_NOTICETYPE_NAME}}</span>
                    <span class="action">
                        <span calss="see">
                            <i class="fa fa-eye"></i> {{item.NOTICE_YDL}}
                        </span> 
                        <span class="zan" :class="{'zaned':zaned}" @click="doZan">
                            <i class="jeicon"
                                :class="{
                                    'jeicon-thumbs-up-o':!zaned,
                                    'jeicon-thumbs-up':zaned
                                }"
                            /> {{item.NOTICE_DZL}}
                        </span> 
                    </span>
                </div>
                <!-- 内容 -->
                <div class="content" v-html="content"></div>
                <button type="button"  class="el-button--primary el-button--medium el-button el-button-style" @click="visible=false"><span>关  闭</span></button>
            </div>
            <i class="el-dialog__close el-icon el-icon-close" @click="visible=false"></i>
        </el-dialog>
    </div>
</template>
<script>

export default {
    name:'news-info',
    data(){
        return {
            visible:false,
            index:0,
            item:{}
        }
    },
    computed:{
        zaned(){//是否点赞过
            var ids = JE.split(this.item.NOTICE_DZUSERIDS,',');
            return ids.indexOf(JE.USER.userId) != -1;
        },
        content(){//内容
            return Ext.htmlDecode(this.item.NOTICE_CONTEXT);
        }
    },
    methods:{
        /**
         * 显示详情
         */
        show(item,index){
            var me = this;
            me.visible = true;
            me.item = item;
            me.index = index;
        },
        /**
         * 点赞
         */
        doZan:function(){
            var me = this;
            if(!me.zaned){
                JE.CoreUtil.doNotice("praise",me.item,function(obj){ 
                    me.$emit('refreshitem',me.item,obj,me.index);
                }) 
            }
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
    .el-button-style{
        background: #2f6bcf;
        bottom: 20px;
        left:50%;
        border:none;
        position: fixed;
        transform: translate(-50%, 0);
    }
    .news-info{
        .news-info-body{
            width: 1250px;
            height:100%;
            overflow: auto;
            background: #ffffff;
            position: absolute;
            top:0;
            left:50%;
            margin-left:-625px;
            .title{
                font-size: 24px;
                text-align: center;
                padding: 10px;
                font-weight: bold;
                margin-top: 30px;
            }
            .subtitle{
                text-align: center;
                position: relative;
                .action{
                    position: absolute;
                    left:50%;
                    margin-left: 200px;
                    .zan,.see{
                        margin: 0 5px;
                        i{
                            font-size: 14px;
                        }
                    }
                    .zan{
                        cursor: pointer;
                        &.zaned{
                            cursor:auto;
                            i{
                                color: #f7ba2a;
                            }
                        }
                    }
                }
            }
            .content{
                padding:40px;
            }

        }
        .el-dialog.is-fullscreen{
            background-color: #f0f2f5;
            .el-dialog__header{
                display: none;
            }
            .el-dialog__body{
                height: 100%;
                padding: 0 20px;
            }
            .el-dialog__close{
                position: fixed;
                right:20px;
                top:20px;
                font-size: 20px;
                cursor: pointer;
            }
            .el-dialog__close:hover{
                color: #2f6bcf;
            }
        }
    }
</style>

