<style rel="stylesheet/scss" lang="scss" >
    .pro-gzq-home-log-info{
        .el-dialog.is-fullscreen{
            background-color: #f0f2f5;
            .el-dialog__body{
                height: 100%;
                overflow: auto;
                width: 1250px;
                margin: 0 auto;
                padding: 20px;
                background: #ffffff;
                position: relative;
            }
            .el-dialog__header{
                display: none;
            }
            .el-dialog__close{
                position: absolute;
                right:20px;
                top:20px;
                font-size: 20px;
                cursor: pointer;
            }
            .el-dialog__close:hover{
                color: #2f6bcf;
            }
            .info-box{
                border: 0;
                position: relative;
                padding:10px 10px 60px;
                .info-header{
                    text-align: center;
                    .title{
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .sub-title{
                        font-size: 14px;
                        line-height: 24px;
                        color: #666666;
                    }

                }
                .content{
                    padding:10px 20px;
                    overflow: auto;
                    .label-top,
                    .text-num{
                        line-height: 30px;
                        color: #999999;
                    }
                    .text-num{
                        text-align: right;
                    }
                    .el-textarea{
                        textarea{
                            min-height:80px !important;
                        }
                    }
                    .change-user{
                        margin-left:20px;
                        cursor: pointer;
                        color:#396ad1;
                    }
                    .content-read{
                        min-height: 100px;
                        padding: 10px;
                        border-radius: 4px;
                    }
                    .content-item{
                        margin-bottom:20px;
                        .comments{
                            .comments-item{
                                padding: 10px 10px 10px 50px;
                                position: relative;
                                line-height: 24px;
                                .title{
                                    color:grey;
                                }
                                .remove{
                                    font-size: 12px;
                                    color: #ddd;
                                    margin-left: 10px;
                                    cursor: pointer;
                                    &:hover{
                                        color: #396ad1;
                                    }
                                }
                                .photo{
                                    position: absolute;
                                    left: 5px;
                                    top: 14px;
                                    .je-user-photo{
                                        cursor: auto;
                                    }
                                }
                            }
                        }
                        .comment-edit{
                            .text-num{
                                float: right;
                            }
                            .button{
                                margin:5px;
                            }
                        }
                    }
                }

                .buttonbar{
                    width:100%;
                    text-align: center;
                    padding: 10px 15px;
                    position: absolute;
                    bottom:0;
                    left:0;
                }
                
                .button{
                    width: 90px;
                    line-height: 28px;
                    text-align: center;
                    background: #f2f2f2;
                    color: #333333;
                    display: inline-block;
                    font-size: 14px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin: 0 5px;
                    &.button-blue{
                        background: #396ad1;
                        color: #ffffff;
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="pro-gzq-home-log-info">
        <el-dialog :visible.sync="visible" top="0" fullscreen>
            <el-card class="info-box" shadow="never">
                <div slot="header" class="clearfix info-header">
                    <div class="title">{{info.time}}的工作{{info.text}}报</div>
                    <div class="sub-title">{{data.SY_CREATEUSERNAME}} 于 {{data.SY_CREATETIME}} 发布</div>
                </div>
                <div ref="content" class="content" :style="contentStyle" v-loading="loading">
                    <div class="content-item">
                        <div class="label-top">
                            <span v-if=" info.type == 'RZ' ">今日工作总结：</span>
                            <span v-else>本{{info.text}}工作总结：</span>
                        </div>
                        <div class="content-edit" v-show="!readOnly && isCurrentUser">
                            <el-input
                                type="textarea"
                                resize="none"
                                maxlength="1000"
                                autosize
                                ref="work"
                                v-model="data.REPORT_GZZJ"
                            ></el-input>
                            <div class="text-num">{{(data.REPORT_GZZJ || '').length}}/1000</div>
                        </div>
                        <div class="content-read" v-show="readOnly || isDPUser" v-html="formatContent(data.REPORT_GZZJ,'暂无内容')"></div>
                    </div>
                    <div class="content-item">
                        <div class="label-top">
                            <span v-if=" info.type == 'RZ' ">明日工作计划：</span>
                            <span v-else>下{{info.text}}工作计划 :</span>
                        </div>
                        <div class="content-edit" v-show="!readOnly && isCurrentUser">
                            <el-input
                                type="textarea"
                                resize="none"
                                maxlength="1000"
                                autosize
                                ref="plan"
                                v-model="data.REPORT_GZJH"
                            ></el-input>
                            <div class="text-num">{{(data.REPORT_GZJH || '').length}}/1000</div>
                        </div>
                        <div class="content-read" v-show="readOnly || isDPUser" v-html="formatContent(data.REPORT_GZJH,'暂无内容')"></div>
                    </div>
                    <div class="content-item">
                        <div class="label-top">工作心得总结：</div>
                        <div class="content-edit" v-show="!readOnly && isCurrentUser">
                            <el-input
                                type="textarea"
                                resize="none"
                                maxlength="1000"
                                autosize
                                ref="summary"
                                v-model="data.REPORT_GZXD"
                            ></el-input>
                            <div class="text-num">{{(data.REPORT_GZXD || '').length}}/1000</div>
                        </div>
                        <div class="content-read" v-show="readOnly || isDPUser" v-html="formatContent(data.REPORT_GZXD,'暂无内容')"></div>
                    </div>
                    <div class="content-item">
                        <div class="label-top">点评信息：<span class="change-user" v-if="isCurrentUser && !readOnly" @click="selectUser">(点评人：{{data.REPORT_DPR_NAME || '暂无内容'}}) 更换点评人</span></div>
                        <div class="comments">
                            <div class="comments-item" v-for="(item,index) in comments" :key="item">
                                <div class="title">
                                    <!-- 姓名 -->
                                    <span class="name">{{ item.SY_CREATEUSERNAME }}</span>
                                    <!-- 详情时间 -->
                                    <span class="time" style="margin-left:20px;">{{ formatTime(item.SY_CREATETIME) }}</span>
                                    <!-- 删除 -->
                                    <i class="jeicon jeicon-error remove" v-if="enableRemoveComment(item)" @click="removeComment(item,index)"></i>
                                </div>
                                <div class="text" v-html="formatContent(item.REPORTDP_DPNR)"></div>
                                <!-- 头像 -->
                                <div class="photo" style="top:0;" v-html="formatPhoto(item)"></div>
                                
                            </div>
                        </div>
                        <div class="content-edit comment-edit" v-show="isDPUser">
                            <el-input
                                type="textarea"
                                resize="none"
                                maxlength="1000"
                                placeholder="请输入您的点评信息..."
                                autosize
                                v-model="commentText"
                            ></el-input>
                            <div class="button button-blue" @click="addComment">{{'发布点评'}}</div>
                            <div class="text-num">{{(commentText || '').length}}/1000</div>
                        </div>
                    </div>
                </div>
                <div class="buttonbar">
                    <div class="button button-blue" @click="doEdit('edit')" v-if="isCurrentUser">{{readOnly?'编辑':'保存'}}</div>
                    <div class="button" :class="{'button-blue':!isCurrentUser}" @click="doEdit('cancel')">{{readOnly?'关闭':'取消'}}</div>
                </div>
            </el-card>
            <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
        </el-dialog>
    </div>
</template>

<script>
import Util from '../../util/util.js';
export default {
    name: "loginfo",
    data() {
        return {
            visible:false,
            readOnly:true,
            loading:false,
            index:0,
            data:{},
            commentText:'',
            comments:[],
            isNoticeRefresh: false,
        };
    },
    computed:{
        /**
         * 是否当前用户
         */
        isCurrentUser(){
            return this.data.SY_CREATEUSERID == JE.USER.userId;
        },
        /**
         * 当前用户是否点评人
         */
        isDPUser:function(){
            return !this.isCurrentUser && JE.split(this.data.REPORT_DPR_ID,',').indexOf(JE.USER.userId) != -1;
        },
        /**
         * 计算高度
         */
        contentStyle:function(){
            var bodyHeight = JE.getBodyHeight(),
                height = bodyHeight-260;
            return {height:height+'px'};
        },
        /**
         * 格式化信息
         */
        info(){
            var me = this;
            var item = me.data;
            var start = item.REPORT_KSSJ,end = item.REPORT_JSSJ;
            var time = '',text = '',type='';
            switch(item.REPORT_BGLX_CODE){
                case 'RZ':
                    time = start;
                    text = '日';
                    type = 'RZ';
                    break;
                case 'ZB':
                    time = start+' 到 '+end;
                    text = '周';
                    type = 'ZB';
                    break;
                case 'YB':
                    time = start.substring(0,7);
                    text = '月';
                    type = 'YB';
                    break;
            }
            return {
                text:text,
                time:time,
                type:type
            }
        }
    },
    methods: {
        formatContent(content,defVal){
            content = content || defVal || '';
            return content.replace(/\n/g,'<br>');
        },
        enableRemoveComment:function(item){
            return item.SY_CREATEUSERID == JE.USER.userId;
        },
        /**
         * 格式化日期
         */
        formatTime:function(time){
            var d = moment(time).fromNow();
            if (d.indexOf("天") != -1) {
                return time.substr(0, 10);
            } else {
                return d;
            }
        },
        formatPhoto:function(item){
            return JE.getUserPhoto(item.SY_CREATEUSERID,true)
        },
        setVisible(visible){
            this.visible = visible;
            this.readOnly = true;
            if(this.$refs.content){this.$refs.content.scrollTop = 0;}
            this.comments = [];
            if(visible){
                this.loadComments();
                
                if(this.data.SY_FUNCEDIT != '0'){
                    Util.doReadMark('log',this.data.JE_CIRCLE_REPORT_ID);
                    this.data.SY_FUNCEDIT = '0';
                    this.$emit('refreshItem',this.data,this.index);
                }
            }
        },
        addComment:function(){
            var me = this;
            if(JE.isEmpty(me.commentText.trim())){
                JE.alert('请输入点评内容！');
                return;
            }else{
                
            }
            JE.ajax({
                url:'/je/portal/homePortal/saveTaskComment',
                params:{
                    tableCode:'JE_CIRCLE_REPORTDP',
                    REPORTDP_DPNR:me.commentText,
                    JE_CIRCLE_REPORT_ID:me.data.JE_CIRCLE_REPORT_ID
                },
                async:true,
                success:function(response){
                    var data = JE.getAjaxData(response);
                    if(data.success){
                        me.comments.unshift(data.obj);
                        me.commentText = '';
                        JE.msg('评论成功！');
                        //更新点评人id
                        var ids = JE.split(me.data.REPORT_YDPR_ID,',');
                        if(ids.indexOf(JE.USER.userId) == -1){
                            ids.push(JE.USER.userId);
                        }
                        me.data.REPORT_YDPR_ID = ids.join(',');
                        me.$emit('refreshItem',me.data,me.index);
                    }else{
                        JE.alert(data.obj);
                    }
                }
            });
        },
        removeComment:function(item,index){
            var me = this;
            JE.confirm('确定删除吗？',function(btn){
                if(btn == 'ok'){
                    JE.ajax({
                        url:JE.getUrlMaps('je.core.remove'),
                        params:{
                            tableCode:'JE_CIRCLE_REPORTDP',
                            ids:item.JE_CIRCLE_REPORTDP_ID
                        },
                        async:true,
                        success:function(response){
                            var data = JE.getAjaxData(response);
                            if(data.success){
                                me.comments.splice(index,1);
                                JE.msg('点评信息删除成功！');
                            }
                        }
                    });
                }
            });
        },
        loadComments:function(){
            var me = this;
            JE.ajax({
                url:JE.getUrlMaps('je.core.load'),
                params:{
                    tableCode:'JE_CIRCLE_REPORTDP',
                    whereSql:"AND JE_CIRCLE_REPORT_ID='"+me.data.JE_CIRCLE_REPORT_ID+"'",
                    orderSql:'order by SY_CREATETIME',
                    limit:-1
                },
                async:true,
                success:function(response){
                    var data = JE.getAjaxData(response);
                    me.comments = data.rows;
                }
            });
        },
        noticeRefresh() {
            this.isNoticeRefresh = true;
        },
        handleClose(done) {
            this.visible = false;
            this.readOnly = true;
            this.setVisible(false);
            if (this.isNoticeRefresh) {
                this.$parent.childRefresh();
            }
        },
        /**
         * 编辑
         */
        doEdit:function(type){
            var me = this;
            if(type == 'comment'){
                if(me.readOnly){
                    me.readOnly = false;
                    me.$refs.content.scrollTop = me.$refs.content.scrollHeight;
                }else{
                    me.updateInfo(type);
                }
                
            }else if(type == 'edit'){
                if(me.readOnly){
                    me.readOnly = false;
                }else{
                    me.updateInfo();
                }
                
            }else if(type == 'cancel'){
                if(me.readOnly){
                    me.setVisible(false);
                    if (this.isNoticeRefresh) {
                        this.$parent.childRefresh();
                    }
                }else{
                    me.readOnly = true;
                }
            }
        },
        /**
         * 选择点评人
         */
        selectUser:function(){
            var me= this;
            JE.vue.selectUser({
                title: '选择点评人',
                width: 300,
                height: 500,
                multiple:true,
                value:me.data.REPORT_DPR_ID,
                valueType:'id',
                callback: function(datas){
                    var ids = [],texts = [];
                    Ext.each(datas,function(data){
                        ids.push(data.id);
                        texts.push(data.text);
                    });
                    if(ids.length>0){
                        me.data.REPORT_DPR_ID = ids.join(',');//点评人
                        me.data.REPORT_DPR_NAME = texts.join(',');//点评人姓名
                    }
                }
            })
        },
        /**
         * 修改数据
         */
        updateInfo:function(type){
            var me = this,content = (me.data.REPORT_GZZJ || '').trim();
            if(type != 'comtent' && JE.isEmpty(content)){
                JE.alert('请填写工作总结！');
                me.$refs.summary.focus();
                return;
            }
            var data = Ext.apply({
                tableCode: 'JE_CIRCLE_REPORT'
            },me.data);
            me.loading = true;
            JE.ajax({
                url:JE.getUrlMaps('je.core.'+(JE.isEmpty(data.JE_CIRCLE_REPORT_ID)?'save':'update')),
                params:data,
                async:true,
                success:function(response){
                    var data = JE.getAjaxData(response);
                    if(data.success){
                        JE.msg(type == 'comment'?'点评成功！':'保存成功！');
                        me.$emit('refreshItem',me.data,me.index);
                        me.readOnly = true;
                    }else{
                        JE.alert(data.obj);
                    }
                    me.loading = false;
                }
            });

        }
    }
};
</script>

