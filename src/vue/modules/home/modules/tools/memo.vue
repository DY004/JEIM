<style rel="stylesheet/scss" lang="scss" >
.pro-gzq-home-memo{
  background: #ffffff;
  .content-box{
        position: relative;
        padding-left:160px;

        .list{
          position: absolute;
          top:0;
          left:0;
          width:160px;
          height:100%;
          background: #f5f7fe;
          padding:80px 0 60px 0;
          .list-body{
              overflow:auto;
              height:100%;
          }

          .item{
            line-height: 30px;
            font-size: 14px;
            cursor: pointer;
            color:#333333;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 14px;

            &.selected{
              color:#2f6bcf;
            }
            &.hide{
                display: none;
            }
          }
          .searchbox{
              position: absolute;
              left:0;
              top:0;
              height:70px;
              width:100%;
              padding:10px;
              .title{
                text-align: center;
                line-height: 28px;
                color: #ababab;
                font-size: 14px;
              }
              .el-input input{
                  border-radius: 14px;
              }
          }
          .buttonbox{
              position: absolute;
              left:0;
              bottom:0;
              height:60px;
              width:100%;
              text-align: center;
              padding:15px;
              background: #f5f7fe;
              .button-add{
                line-height: 28px;
                background: #396ad1;
                color: #ffffff;
                display: inline-block;
                font-size: 14px;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
              }
          }
        }
        .context{
            padding:50px 10px;
            background: #F0EFFF;
            position: relative;
            height: 100%;
            overflow: auto;
            .titlebox{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                color: #333333;
                height: 50px;
                padding: 20px 180px 10px 40px;
                font-size: 14px;
                .title{
                    font-weight: bold;
                    width:100%;
                    border: 0;
                    background: transparent;
                }
                .date{
                    position: absolute;
                    right: 32px;
                    top: 20px;
                }
            }
            .buttonbox{
                position: absolute;
                bottom:0;
                right:0;
                width:100%;
                height:50px;
                padding-top:4px;
                text-align: center;
                .button{
                    width: 90px;
                    line-height: 28px;
                    background: #396ad1;
                    color: #ffffff;
                    display: inline-block;
                    font-size: 14px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin: 0 10px;
                    &.disable{
                        color: #c0c4cc;
                        cursor: not-allowed;
                        background-image: none;
                        background-color: #fff;
                        border-color: #ebeef5;
                    }
                }
                .button-remove{
                    background: #ffffff;
                    color: #808080;
                    border: 1px solid #e4e4e4;
                }
                .number{
                    color: #666666;
                    position: absolute;
                    bottom: 24px;
                    right: 20px;
                    font-size: 14px;
                }
            }

            .el-textarea{
                height: 100%;
                background: url(../../assets/images/je-text.png);
                textarea{
                    height:100%;
                    line-height: 30px;
                    font-size: 14px;
                    resize: none;
                    color: #666666;
                    border: 0;
                    background: transparent;
                }
            }
        }
  }

}
</style>
<template>
    <div class="pro-gzq-home-memo">
        <div class="empty-box" v-show="!visible"  @click="setVisible(true)">
            <i class="jeicon jeicon-signing"></i>
            提交备忘录...
        </div>
        <div class="content-box" v-show="visible">
            <div class="context">
                <!-- 标题 -->
                <div class="titlebox">
                    <input v-model="info.REMINDER_TITLE" :readonly="readOnly" type="text" class="title" maxLength='50'/>
                    <span class="date">{{info.SY_CREATETIME | formatDate}}</span>
                </div>
                <!-- 内容 -->
                <el-input
                ref="context"
                :readonly="readOnly"
                type="textarea"
                v-model="info.REMINDER_CONTENT" maxLength='3000'>
                </el-input>
                <!-- 操作按钮 -->
                <div class="buttonbox">
                    <div class="button button-save" @click="saveMemo" v-show="!readOnly">保 存</div>
                    <div class="button button-remove" :class="{disable:disableRemove}" @click="removeMemo" v-show="!readOnly">删 除</div>
                    <span class="number">{{(info.REMINDER_CONTENT||'').length}} / 3000</span>
                </div>
            </div>
            <div class="list">
                <div class="list-body">
                    <div class="item" :title="item.text" :class="{'selected':info.JE_SYS_REMINDER_ID==item.id,'hide':filters.length>0 && filters.indexOf(item.id)==-1}" v-for="(item,index) in data" :key="item" @click="itemClick(index)">
                    {{item.text}}
                    </div>
                </div>
                <div class="searchbox">
                    <div class="title">笔记({{data.length}})</div>
                    <el-input
                        v-model="keyword"
                        placeholder="查询..."
                        prefix-icon="el-icon-search"
                        size="mini"
                        clearable>
                    </el-input>
                </div>
                <div class="buttonbox">
                    <div class="button-add" @click="addMemo">+ 添加笔记</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "process",
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            visible:this.visible,
            readOnly:true,
            data:[],
            info:{},
            keyword:'',
            filters:[]//过滤的ids
        };
    },
    computed:{
        disableRemove:function(){
            return JE.isEmpty(this.info.JE_SYS_REMINDER_ID);
        }
    },
    watch:{
        keyword(nv,ov){
            var ids = [];
            JE.isNotEmpty(nv) && Ext.each(this.data,function(item){
                if(item.bean.REMINDER_TITLE.indexOf(nv)!=-1){
                    ids.push(item.id);
                }
            });
            this.filters = ids;
        }
    },
    mounted() {
        this.load()
    },
    filters:{
        formatDate(time){
            return Ext.Date.format(Ext.Date.parse(time,'Y-m-d H:i:s'),'Y年m月d日 H:i');
        }
    },
    methods: {
        setVisible(visible){
            this.$emit('setVisible',visible);
        },
        itemClick(index){
            var me = this,index = index || 0;
            if(me.data[index]){
                me.info = me.data[index].bean;
                me.readOnly = false;
            }else{
                me.info = {};
                me.readOnly = true;
            }
        },
        /**
         * 添加笔记
         */
        addMemo:function(){
            this.info = {
                REMINDER_TITLE:'新笔记',
                SY_CREATETIME:Ext.Date.format(new Date(),'Y-m-d H:i:s')
            };
            this.readOnly = false;
            this.$refs.context.focus();
        },
        getIndexById:function(id){
            var me = this,index = -1;
            Ext.each(me.data,function(item,i){
                if(item.id == id){
                    index = i;
                    return false;
                }
            });
            return index;
        },
        /**
         * 删除笔记
         */
        removeMemo:function(){
            var me = this;
            if(me.disableRemove){return;}
            JE.confirm('确定删除吗？',function(btn){
                if(btn == 'ok'){
                    var id = me.info.JE_SYS_REMINDER_ID;
                    var index = me.getIndexById(id);
                    JE.ajax({
                        url:JE.getUrlMaps('je.core.remove'),
                        params:{
                            tableCode:'JE_SYS_REMINDER',
                            ids:id
                        }
                    });
                    me.data.splice(index,1);
                    JE.msg('删除成功！');
                    me.itemClick(0);
                }
            });
        },
        /**
         * 保存笔记
         */
        saveMemo:function(){
            var me = this,act = 'update'
            var params = {
                tableCode:'JE_SYS_REMINDER',
                REMINDER_TITLE: me.info.REMINDER_TITLE,
                REMINDER_CONTENT: me.info.REMINDER_CONTENT,
                JE_SYS_REMINDER_ID: me.info.JE_SYS_REMINDER_ID
            }
            if(JE.isEmpty(params.REMINDER_TITLE)){
                JE.msg('请填写标题！');
                return;
            }

            if(JE.isEmpty(params.REMINDER_CONTENT)){
                JE.msg('请填写内容！');
                return;
            }
            if(JE.isEmpty(params.JE_SYS_REMINDER_ID)){
                act = 'save';
                Ext.apply(params,{
                    SY_PARENT: 'ROOT',
                    SY_PATH: '/ROOT',
                    SY_PARENTPATH: '/ROOT',
                    SY_TREEORDERINDEX: '000001',
                    SY_NODETYPE: 'LEAF'
                });
            }
            var obj = JE.ajax({
                url:JE.getUrlMaps('je.core.'+act),
                params:params
            });
            if(obj.success){
                JE.msg('保存成功！');
                for(var key in obj.obj){
                    me.$set(me.info,key,obj.obj[key]);
                }
                var item = {id:me.info.JE_SYS_REMINDER_ID,text:me.info.REMINDER_TITLE,bean:me.info};
                var index = 0;
                if(act == 'save'){
                    me.data.unshift(item);
                }else{
                    index = me.getIndexById(me.info.JE_SYS_REMINDER_ID);
                    me.$set(me.data,index,item);
                }
                me.itemClick(index);
            }
        },
        // 获取数据
        load() {
            let params = {
                moreRoot: false,
                tableCode: 'JE_SYS_REMINDER',
                excludes: 'checked',
                node: 'ROOT',
                onlyItem: false,
                orderSql:" ORDER BY SY_CREATETIME DESC",
                whereSql: "and SY_PARENT != '' AND SY_CREATEUSERID='"+JE.currentUser.userId+"'"
            }
            this.data = JE.ajax({url:'/je/getTree',params:params}).children;
            this.itemClick(0);
        }
    }
};
</script>

