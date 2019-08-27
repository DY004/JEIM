<!-- 事务交办 -->
<style lang="scss">
    .pro-crm-home-transaction{
        .transaction-body{
            background: #ffffff;
            padding: 0 20px;
            position: relative;
            .el-tabs__header{
                margin: 0;
                padding: 10px 0;
                .el-tabs__nav-wrap::after{
                    display: none;
                }
                .el-tabs__item.is-top{
                    line-height: 30px;
                    height:30px;
                    color:#386ad0;
                    &.is-active{
                        background: #386ad0;
                        color: #fff;
                        border-radius: 4px;
                        line-height: 30px;
                        height: 30px;
                    }
                    &.is-active:after{
                        display: none;
                    }
                } 
            }
            .close,.resize{
                position: absolute;
                right: 30px;
                top: 20px;
                font-size: 12px;
                color: #cccccc;
                cursor: pointer;
                &:hover{
                    color:#2f6bcf;
                }
            }
            .resize{
                right: 60px;
            }
            .createTask{
                position: absolute;
                right: 100px;
                top: 15px;
                font-size: 14px;
                cursor: pointer;
                color: #2f6bcf;
            }
        }
        
        
        &.full-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
            animation: unset;
            background: #f0f2f5;
            .transaction-body{
                background: #ffffff;
                position: relative;
                width: 1250px;
                margin: 0 auto;
                height: 100%;
            }
        }
    }
</style>
<template>
    <div class="pro-crm-home-transaction" v-show="visible" :class="[fullScreen?'full-screen':'']">
        <div class="transaction-body">
            <el-tabs v-model="activeTab" >
                <!-- 循环新闻模块 -->
                <el-tab-pane
                    v-for="(item,index) in items" :key="index"
                    :label="item.text+'('+item.badge+')'"
                    :name="item.code"
                    lazy>
                    <item-view :page-size="pageSize" :type="item.code" :ref="item.code" @refreshBadge="refreshBadge"></item-view>
                </el-tab-pane>
            </el-tabs>
            <i class="jeicon jeicon-error close"></i>
            <i
                @click="changeFullScreen(!fullScreen)"
                :class=" fullScreen ? 'jeicon-minus':'jeicon-max' "
                class="jeicon resize"
                ></i>
            <i class="jeicon jeicon-error close"
                @click="close"
            ></i>
            <span class="createTask" @click="createdTask">+ 创建事务</span>
        </div>
  </div>
</template>
<script>
    import ItemView from './item_view'
    export default {
      name:'home-transaction',
      components:{ItemView},
      data() {
          return {
              fullScreen:false,
              visible:true,
              activeTab:'task',
              pageSize:5,
              items:[
                {text:'待处理的事务',code:'task',badge:0},
                {text:'我安排的事务',code:'send',badge:0},
                {text:'历史事务',code:'history',badge:0}
              ]
          };
      },
      computed:{
      },
      methods: {
          refresh:function(code){
              var code = code || this.items[0].code;
              this.$refs[code] && this.$refs[code][0].refresh();
          },
          setVisible(visible,type){
              this.visible = visible;
              this.changeFullScreen(false);
              if(type){
                  this.activeTab = type;
              }
          },
          close:function(){
              var me = this;
              me.setVisible(false);
              me.$emit('doact','clearSelect');
          },
          /**
           * 全屏
           */
          changeFullScreen(fullScreen){
              this.fullScreen = fullScreen;
              this.pageSize = this.fullScreen?10:5;
          },
          /**
           * 更新数据
           */
          refreshBadge:function(data){
              var me = this;
              var badges = [data.taskCount,data.ownerCount,data.historyCount];
              for(var i=0;i<badges.length;i++){
                  var item = me.items[i],
                      badge = badges[i];
                  item.badge = badge;
                  me.$set(me.items,i,item);
              }

              me.$emit('doact','refreshBadge',{
                  type:'TRANSACTION',
                  num:true,
                  numObj:{
                    taskCount:data.taskCount,
                    ownerCount:data.ownerCount,
                    historyCount:data.historyCount
                  }
              });
          },
            /**
             * 创建事务
             */
            createdTask(){
                var me = this;
                JE.sendTransaction({
                    winCfg:{height:JE.getBodyHeight()-50},
                    callback:function(){
                        me.refresh('send');
                    },
                    showFn:function(win){
                        var form=win.getCmp(0).form;
                        form.findField('TASK_YWSJNAMEJH').hide();
                        form.findField('TASK_FSFS_CODE').hide();
                    }});
            }
      }
    };
</script>


