<style rel="stylesheet/scss" lang="scss" >
    .pro-gzq-home-log-listview{
        .searchbar{
            padding: 10px 20px;
            color: #6a7794;
            background: #f5f7fe;
            font-size: 14px;
            .input-box{
                display: inline-block;
                margin-left: 10px;
                .el-range-editor,
                .el-input{
                    width:300px;
                    margin-right:10px;
                    input{
                        cursor: auto;
                    }
                }
                .jeicon-user-cfg{
                    font-size: 14px;
                    line-height: 28px;
                }
                .spliter{
                    font-size: 12px;
                    color:#dcdfe6;
                }
                .search{
                    color:#386bd0;
                    cursor: pointer;
                }
            }
            .el-dropdown{
                color: #ffffff;
                background: #386bd0;
                border-radius: 15px;
                cursor: pointer;
                padding: 0 10px;
                line-height: 24px;
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
            .list-item{
                padding: 10px 20px;
                position: relative;
                color:#333333;
                &::after{
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 1px;
                    width: 100%;
                    background: #f3f3f3;
                }
                &:last-child:after{
                    display: none;
                }
                .item-content{
                    line-height: 24px;
                    cursor: pointer;
                    &:hover{
                        color: #386bd0;
                    }
                }
                .item-date{
                    color: #386bd0;
                    line-height: 24px;
                    span{
                        margin-right:20px;
                    }
                    .keyword{
                        margin:0;
                    }
                    .user{
                        font-weight: bold;
                        font-size: 18px;
                    }
                }
                .item-remove{
                    cursor: pointer;
                    font-size: 12px;
                    color: #386bd0;
                    visibility: hidden;
                }
                &:hover .item-remove{
                    visibility: visible;
                }
            }
        }

        &.other-log{
            .list-item{
                color: #808080;
                &::before{
                    content: "";
                    width:6px;
                    height:6px;
                    border-radius: 100%;
                    background: #e4e4e4;
                    position: absolute;
                    left:5px;
                    top:18px;
                }
                &.unread{
                    color:#333333;
                }
                &.unread::before{
                    background: #D24D57;
                }
                .comment-flag{
                    margin-left: 20px;
                    color: #d24d57;
                    font-size: 12px;
                }
            }
        }
    }
</style>
<template>
    <div class="pro-gzq-home-log-listview">
        <div class="searchbar">
            <!-- 日志类型 -->
            <el-dropdown @command="changeType" trigger="click" placement="bottom">
                <span class="el-dropdown-link">
                    {{activeType.text}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item) in types" :key="item" :command="item.code">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="input-box">
                日期:
                <el-date-picker
                    ref="date"
                    v-model="date"
                    :editable="false"
                    type="daterange"
                    range-separator="——"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="mini"
                    @change="load"
                    >
                </el-date-picker>
                关键字:
                <el-input
                ref="user"
                placeholder="标题/人名"
                size="mini"
                @keyup.enter.native="load"
                @clear="load"
                clearable
                v-model="_keyword">
                </el-input>
                <span class="search" @click="load">查询</span>
            </div>
        </div>
        <!-- 列表 -->
        <je-listview ref="list" v-loading="loading"
            :total-count="totalCount"
            :page-size="30"
            :empty-height="180"
            :item-height="70"
            @buildData="_buildData"
            >
            <!-- 数据项 -->
            <div slot="listitem" class="list-item" v-for="(item,index) in data" :key="index"
                :class="{'unread':item.SY_FUNCEDIT != '0'}"
            >
                <div class="item-content" @click="showInfo(item,index)">
                    工作总结: <span v-html="formatKeyword(item.REPORT_GZZJ)"></span>
                </div>
                <div class="item-date">
                    <span v-if="type =='other'" class="user" v-html="formatKeyword(item.SY_CREATEUSERNAME)"></span>
                    <span>日志日期：{{getTime(item)}}</span>
                    <span>发布日期：{{item.SY_CREATETIME}}</span>
                    <span class="comment-flag" v-if="type=='other'" v-html="commentFlag(item)"></span>
                    <i class="jeicon jeicon-error item-remove" v-if="type=='owner'" @click="doRemove(item,index)"></i>
                </div>
            </div>
        </je-listview>
    </div>
</template>

<script>
import ListView from '../../../../components/listview/listview.vue';
import Util from '../../util/util.js';

export default {
    name: "listview",
    components: {'je-listview':ListView},
    props:{
        visible:{
            type:Boolean,
            default:true
        },
        type:{
            type:String,
            default:'owner'
        }
    },
    data() {
        return {
            type:this.type,//日志类型：owner自己，other他人
            visible:this.visible,
            loading:true,
            types:[
                {code:'ALL',text:'全部'},
                {code:'RZ',text:'日志'},
                {code:'ZB',text:'周报'},
                {code:'YB',text:'月报'}
            ],
            activeType:{},
            date:'',
            keyword:'',
            _keyword:'',
            totalCount:0,
            data:[]
        };
    },
    mounted(){
        var me = this;
        me.activeType = me.types[0];
        me.load();
    },
    watch:{
        visible(){
            var me = this;
            if(me.visible){
                me.load()
            }
        }
    },
    methods: {
        /**
         * 评论过的标记
         */
        commentFlag:function(item,type){
            //允许点评
            var comment = item.SY_CREATEUSERID != JE.USER.userId && JE.split(item.REPORT_DPR_ID,',').indexOf(JE.USER.userId) != -1;
            //是否点评过
            var commented = JE.split(item.REPORT_YDPR_ID,',').indexOf(JE.USER.userId) != -1;
            if(commented){
                return '<span style="color:green;">已点评</span>';
            }else if(comment){
                return '<span style="color:red;">待点评</span>';
            }

        },
        /**
         * 当前用户是否点评人
         */
        isDPUser:function(){
            return
        },
        showInfo:function(item,index){
            this.$emit('showInfo',item,index);
        },
        formatKeyword:function(text){
            var keyword = Util.formatKeyword(text,this.keyword);
            keyword = keyword.replace(/\n/g,'<br>');
            return keyword;
        },
        setVisible(visible){
            this.$emit('setVisible',visible);
        },
        /**
         * 格式化时间
         */
        getTime(item){
            var start = item.REPORT_KSSJ,end = item.REPORT_JSSJ;
            switch(item.REPORT_BGLX_CODE){
                case 'RZ':
                    return start;
                case 'ZB':
                    return start+' 到 '+end;
                case 'YB':
                    return start.substring(0,7);
            }
        },
        getList(){
            return this.$refs.list;
        },
        /**
         * 切换类型
         */
        changeType(code){
            var me = this;
            Ext.each(this.types,function(type){
                if(type.code == code){
                    me.activeType = type;
                    return false;
                }
            });
            me.load();
        },
        /**
         * 加载数据
         */
        load:function(){
            var me = this;
            this.keyword = this._keyword || '';
            me.getList().loadPage(1);
        },
        /**
         * 查询参数
         */
        getParams:function(){
            var me = this,pageInfo = me.getList().getPageInfo();
            var params = {
                tableCode:'JE_CIRCLE_REPORT',
                funcCode:'JE_CIRCLE_REPORT',
                start: pageInfo.start,
                limit: pageInfo.limit,
                funcEdit:true,
                whereSql:'',
                orderSql:'order by SY_CREATETIME desc'
            };
            if(me.type == 'owner'){
                params.whereSql += "AND SY_CREATEUSERID='"+JE.USER.userId+"'";
            }else{
                var ids = [].concat(JE.USER.branchInfo.jgUserIds).concat(JE.USER.branchInfo.zgUserIds).concat(JE.USER.branchInfo.zsUserIds);
                //params.whereSql += "AND SY_CREATEUSERID!='"+JE.USER.userId+"' AND (REPORT_DPR_ID like '%"+JE.USER.userId+"%' or SY_CREATEUSERID IN('"+ids.join("','")+"'))";
                params.whereSql += "AND (REPORT_DPR_ID like '%"+JE.USER.userId+"%' or (SY_CREATEUSERID!='"+JE.USER.userId+"' AND SY_CREATEUSERID IN('"+ids.join("','")+"')))";

            }
            if(me.activeType.code != 'ALL'){
                params.whereSql += " AND REPORT_BGLX_CODE = '"+me.activeType.code+"'"
            }
            //关键字
            if(JE.isNotEmpty(me.keyword.trim())){
                //or REPORT_DPR_NAME like '%"+me.keyword+"%'
                params.whereSql += " AND (SY_CREATEUSERNAME like '%"+me.keyword+"%' or REPORT_GZZJ like '%"+me.keyword+"%' or REPORT_GZJH like '%"+me.keyword+"%' or REPORT_GZXD like '%"+me.keyword+"%' or REPORT_DPXX like '%"+me.keyword+"%')"
            }
            //日期
            if(JE.isNotEmpty(me.date)){
                var start = Ext.Date.format(me.date[0],'Y-m-d'),
                    end =  Ext.Date.format(me.date[1],'Y-m-d');
                params.whereSql += " AND REPORT_KSSJ>='"+start+"' AND REPORT_KSSJ<='"+end+"'";
            }
            return params;
        },
        /**
         * 加载数据底层
         */
        _buildData:function(){
            var me = this;
            me.loading = true;
            JE.ajax({
                url:JE.getUrlMaps('je.core.load'),
                params:me.getParams(),
                async:true,
                success:function(response){
                    var data = JE.getAjaxData(response);
                    me.data = data.rows;
                    me.totalCount = data.totalCount;
                    me.loading = false;
                }
            })
        },
        doRemove:function(item,index){
            var me = this;
            JE.confirm('确定删除吗？',function(btn){
                if(btn == 'ok'){
                    var obj = JE.ajax({
                        url:JE.getUrlMaps('je.core.remove'),
                        params:{
                            tableCode:'JE_CIRCLE_REPORT',
                            ids:item.JE_CIRCLE_REPORT_ID
                        },
                    });
                    if(obj.success){
                        me.load();
                    }
                }
            });
        }
    }
};
</script>

