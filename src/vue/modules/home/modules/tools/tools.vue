<!-- 首页工具 -->
<style lang="scss">
    .pro-crm-home-tools{
        background: #ffffff;
        padding: 0 20px;
        position: relative;
        padding-bottom: 10px;
        .el-tabs__header{
            margin:0;
        }
        .close-tab{
            position: absolute;
            top:45px;
            right:26px;
            font-size: 12px;
            color:#6a7794;
            cursor: pointer;
            &:hover{
                color:#2f6bcf;
            }
        }
        .empty-box{
            padding: 30px 15px;
            font-size: 18px;
            background: #ffffff;
            color: #999999;
            cursor: pointer;
        }
        .content-box{
            height:530px;
            border-top: 0;
            border: 1px solid #e4e7ed;
        }
    }
</style>
<template>
    <div class="pro-crm-home-tools">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane label="日志" name="log" lazy>
                <log ref="log" :visible="visible" @setVisible="setVisible"></log>    
            </el-tab-pane>
            <el-tab-pane label="备忘录" name="memo" lazy>
                <memo ref="memo" :visible="visible" @setVisible="setVisible"></memo>    
            </el-tab-pane>
            <el-tab-pane label="流程" name="process" lazy>
                <process ref="process" :visible="visible" @setVisible="setVisible"></process>    
            </el-tab-pane>
            <el-tab-pane label="通讯录" name="contact" lazy>
                <contact ref="contact" :visible="visible" @setVisible="setVisible"></contact>    
            </el-tab-pane>
        </el-tabs>
        <i class="jeicon jeicon-error close-tab" v-show="visible" @click="setVisible(false)"></i>
  </div>
</template>
<script>
    import Memo from './memo.vue';
    import Process from './process.vue';
    import Contact from './contact.vue';
    import Log from '../log/log.vue';

    export default {
      name:'home-tools',
      components:{Memo,Process,Contact,Log},
      data() {
          return {
              activeTab:'log',
              visible:false
          };
      },
      methods: {
        handleClick(tab) {
            var me = this;
            me.visible = true;
        },
        setVisible(visible){
            this.visible = visible;
        }
      }
    };
</script>


