<!-- 
    分页工具条 
    @event  load 加载事件 
    @param  pageSize 每页条数
    @param  totalCount  总条数
-->
<style rel="stylesheet/scss" lang="scss" >
.je-vue-pagebar{
    height: 40px;
    line-height: 40px;
    color: #808080;
    .dispaly-text{
        float:right;
    }
    .refresh{
        font-size: 14px;
        cursor: pointer;
    }
    .el-button{
        padding: 6px 15px;
        font-size: 12px !important;
    }
    .movepage{
        margin: 0 10px;
        .el-input-number{
            margin: 0 5px;
            width:40px;
            input{
                height: 26px;
                line-height: 26px;
                font-size: 12px;
                text-align: center;
                padding:0;
            }
        }
    }
}
</style>
<template>
    <div class="je-vue-pagebar">
        <el-button class="prev" size="mini" :disabled="page==1" @click="prevPage">上一页</el-button>
        <el-button class="next" size="mini" :disabled="totalPage<=page" @click="nextPage">下一页</el-button>
        <span class="movepage">前往
            <el-input-number v-model="page" :controls="false" :min="1" :max="totalPage"></el-input-number>
            / {{totalPage}} 页</span>
        <i class="jeicon jeicon-refresh refresh" @click="refresh"></i>
        <span class="dispaly-text">{{displayText}}</span>
    </div>
</template>
<script>
export default {
    name:'je-pagebar',
    props:{
        pageSize:{
            type:Number,
            default:10
        },
        totalCount:{
            type:Number,
            default:0
        }
    },
    data(){
        return {
            page:1,//页码
            pageSize:this.pageSize,//每页条数
            totalCount:this.totalCount//总条数
        }
    },
    computed:{
        start(){//每页开始条数
            return (this.page-1)*this.pageSize;
        },
        end(){//每页结束条数
            var end = this.start+this.pageSize;
            return (end>this.totalCount?this.totalCount:end)-1;
        },
        totalPage(){//总页数
            return parseInt(this.totalCount/this.pageSize) + (this.totalCount%this.pageSize>0?1:0);
        },
        displayText(){//显示信息
            if(this.totalCount == 0){
                return '没有数据';
            }else{
                return '本页 '+(this.start+1)+'-'+(this.end+1)+' 条,共 '+this.totalCount+' 条';
            }
        }
    },
    watch:{
        /**
         * 页码改变，触发load事件
         */
        page(nv,ov){
            if(nv < 1){
                this.page = 1;
            }else if(nv>this.totalPage){
                this.page = this.totalPage;
            }else if(JE.isNotEmpty(nv)){
                this.movePage(nv);
            }
        }
    },
    methods:{
        /**
         * 分页信息
         */
        getPageInfo(){
            return {
                start:this.start,
                end:this.end,
                limit:this.pageSize,
                page:this.page,
                totalPage:this.totalPage,
                totalCount:this.totalCount
            };
        },
        /**
         * 加载数据
         */
        movePage(page){
            var me = this;
            if(JE.isEmpty(page)){
                me.page = 1;
                me.totalCount = 0;
            }else{
                me.page = page<1?1:(page>me.totalPage&&me.totalPage>0?me.totalPage:page);
            }
            me.$emit('load',me.getPageInfo());
        },
        /**
         * 上页
         */
        prevPage(){
            this.page--;
        },
        /**
         * 下页
         */
        nextPage(){
            this.page++;
        },
        /**
         * 首页
         */
        firstPage(){
            this.page = 1;
        },
        /**
         * 末页
         */
        lastPage(){
            this.page = this.totalPage;
        },
        /**
         * 刷新
         */
        refresh(){
            this.movePage(this.page);
        }
    }
}
</script>

