<style rel="stylesheet/scss" lang="scss" >
    .pro-gzq-home-log-list{
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
             .pro-gzq-home-log-listview{
                border: 1px solid #e4e7ed;
                border-top: 0;
             }
            .el-tabs{
                .el-tabs__nav{
                    border:0;
                    .el-tabs__item{
                        border:0;
                        font-weight: bold;
                        color: #333333;
                        &.is-active{
                            border: 1px solid #e4e7ed;
                            border-bottom: 0;
                            border-radius: 4px 4px 0 0;
                            height: 41px;
                            background: #ffffff;
                            &::after{
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="pro-gzq-home-log-list">
        <el-dialog :visible.sync="visible" top="0" fullscreen>
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="我的日志" name="owner" lazy>
                    <list-view type="owner" ref="owner" @showInfo="showInfo" :visible="visible"></list-view>
                </el-tab-pane>
                <el-tab-pane label="他人日志" name="other" lazy>
                    <list-view type="other" ref="other" class="other-log" @showInfo="showInfo"></list-view>
                </el-tab-pane>
            </el-tabs>
            <i class="el-dialog__close el-icon el-icon-close" @click="visible=false"></i>
        </el-dialog>
        <log-info ref="info" @refreshItem="refreshItem"></log-info>
    </div>
</template>

<script>
import ListView from "./list.vue"
import LogInfo from "./log_info.vue"
import Util from '../../util/util.js'
export default {
    name: "loglist",
    components: {ListView,LogInfo},
    data() {
        return {
            visible:false,
            activeTab:'owner'
        };
    },
    methods: {
        setVisible(visible){
            this.visible = visible;
        },
        getLogInfo(){
            return this.$refs.info;
        },
        showInfo:function(item,index){
            var info = this.getLogInfo();
            info.data = item;
            info.index = index;
            info.setVisible(true);
        },
        refreshItem:function(item,index){
            var list = this.$refs[this.activeTab];
            list.$set(list.data,index,item); 
        }
    }
};
</script>

