<!-- 公共集合 -->
<style lang="scss">
    .workflow-itemtree{
        width:150px;
        height:100%;
        position: absolute;
        top:0;
        left:0;
        background: #f4f7fd;
        border-right: 1px solid #e4e7ed;
        padding: 70px 0 10px 0;
        .header-box{
            position: absolute;
            height:70px;
            width:100%;
            left:0;
            top:0;
            .title{
                line-height: 30px;
                text-align: center;
                font-size: 14px;
                color: #797979;
                margin-top: 5px;
            }
            .itemview-search{
                padding: 4px !important;
                .el-input{
                    width:100% !important;
                }
            }
        }
        .el-tree{
            background: transparent;
            height:100%;
            overflow:auto;
            .el-tree-node.is-current{
                color:#2f6bcf;
            }
            .el-tree-node__expand-icon.is-leaf {
                padding: 6px 3px;
            }
        }
        
    }
</style>
<template>
    <div class="workflow-itemtree">
        <div class="header-box">
            <div class="title">流程分类</div>
            <!-- 查询 -->
            <div class="itemview-search">
                <el-input
                    v-model="keyword"
                    size="mini"
                    placeholder="查询"
                    suffix-icon="el-icon-search"
                    clearable
                ></el-input>
            </div>
        </div>
        <el-tree
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree"
        ></el-tree>
    </div>
</template>
<script>
    export default {
        name:'item-tree',
        props:{
            data:Array
        },
        data() {
            return {
                data:this.data,
                selectNode:'',
                keyword:'',
                defaultProps: {
                    children: "children",
                    label: "text"
                }
            };
        },
        watch:{
            keyword:function(nv){
                this.$refs.tree.filter(nv);
            }
        },
        methods: {
            //模糊查询树节点
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            handleNodeClick:function(data){
                var tree = this.$refs.tree;
                if(this.selectNode && data.id == this.selectNode.id){
                    this.selectNode = null;
                    tree.setCurrentKey(null);
                    data = null;
                }else{
                    this.selectNode = data;
                }

                this.$emit('itemClick',data);
            }
        }
    };
</script>


