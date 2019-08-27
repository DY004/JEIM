<!-- 工作流 -->
<style lang="scss">
    .pro-crm-home-workflow{
        .workflow-body{
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
            .workflow-body{
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
    <div class="pro-crm-home-workflow" v-show="visible" :class="[fullScreen?'full-screen':'']">
        <div class="workflow-body">
            <el-tabs v-model="activeTab" >
                <!-- 循环模块 -->
                <el-tab-pane
                    v-for="(item,index) in items" :key="index"
                    :label="item.text+'('+item.badge+')'"
                    :name="item.code"
                    lazy>
                    <item-view :ref="item.code" :keyword-label="item.keywordLabel" :menu-data="menuData" :page-size="pageSize" :type="item.code" @refreshBadge="refreshBadge" @refreshItem="refresh"></item-view>
                </el-tab-pane>
            </el-tabs>
            <i
                @click="changeFullScreen(!fullScreen)"
                :class=" fullScreen ? 'jeicon-minus':'jeicon-max' "
                class="jeicon resize"
                ></i>
            <i class="jeicon jeicon-error close"
                @click="close"
            ></i>
        </div>
  </div>
</template>
<script>
    import ItemView from './item_view'
    export default {
      name:'home-workflow',
      components:{ItemView},
      data() {
          return {
              fullScreen:false,
              visible:true,
              activeTab:'PREAPPROV',
              pageSize:5,
              menuData:[],
              items:[
                {text:'待我审批',code:'PREAPPROV',badge:0,keywordLabel:'送交人'},
                {text:'已办理',code:'APPROVED',badge:0,keywordLabel:'处理人'},
                {text:'我的流程',code:'OWNER',badge:0,keywordLabel:'处理人'},
                {text:'已延时',code:'DELAY',badge:0,keywordLabel:'送交人'}
              ]
          };
      },
      mounted(){
          this.initMenuData();
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
                  this.activeTab = type.toLocaleUpperCase();
                  this.refresh(this.activeTab);
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
          refreshBadge:function(data,type){
              var me = this;
              var badges = [data.preapprovCount,data.approvedCount,data.ownerCount,data.delayCount];
              for(var i=0;i<badges.length;i++){
                  var item = me.items[i],
                      badge = badges[i];
                  item.badge = badge;
                  me.$set(me.items,i,item);
              }
              me.$emit('doact','refreshBadge',{
                  type:'WF',
                  num:true,
                  numObj:{
                    preapprovCount:data.preapprovCount,
                    approvedCount:data.approvedCount,
                    ownerCount:data.ownerCount,
                    delayCount:data.delayCount
                  }
              });
          },
          initMenuData:function(){
                var userId = JE.USER.userId;
                var data = JE.ajax({
                    url:'/je/jbpm/processInfo/getProcessTree',
                    params:{
                        tableCode: "JE_CORE_PROCESSINFO",
                        excludes: "checked",
                        sort: '[{"property":"SY_ORDERINDEX","direction":"ASC"}]',
                        node: "ROOT"
                    }
                });
                this.menuData = data.children;
          }
      }
    };
</script>


