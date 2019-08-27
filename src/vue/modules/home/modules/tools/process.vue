<style rel="stylesheet/scss" lang="scss" >
.pro-gzq-home-process{
  background: #ffffff;
  &.loading{
    cursor: wait;
    .content-box .items .item{
      cursor: wait;
    }
  }
  .content-box{
        position: relative;
        padding-left:110px;
        .menu{
          position: absolute;
          top:0;
          left:0;
          width:110px;
          height:100%;
          background: #f5f7fe;
          padding-top:20px;
          .item{
            line-height: 30px;
            font-size: 14px;
            cursor: pointer;
            color:#333333;
            padding-left:30px;
            position: relative;
            &::before{
              content: "";
              border-radius: 100%;
              background: #333333;
              padding: 2px;
              position: absolute;
              left: 20px;
              top: 50%;
              margin-top: -2px;
            }
            &.active-tab{
              color:#2f6bcf;
            }
            &.active-tab::before{
              background: #2f6bcf;
            }
          }
        }
        .items{
          .item{
            cursor: pointer;
            display: inline-block;
            text-align: center;
            padding:10px 14px;
            margin:5px;
            .icon{
              width:48px;
              height:48px;
              background: #63abf6;
              border-radius: 12px;
              display: inline-block;
              position: relative;
              i{
                color: #63abf6;
                // padding: 6px 0;
                line-height: 30px;
                text-align: center;
                background: #ffffff;
                border-radius: 100%;
                font-size: 18px;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 30px;
                height: 30px;
                margin-left: -15px;
                margin-top: -15px;
              }
            }
            .text{
              font-size: 12px;
              line-height: 24px;
            }
          }
        }
  }
  
}
</style>
<template>
    <div class="pro-gzq-home-process">
        <div class="empty-box" v-show="!visible"  @click="setVisible(true)">
            <i class="jeicon jeicon-signing"></i> 
            提交流程...
        </div>
        <div class="content-box" v-show="visible">
            <div class="items">
                <div class="item" v-for="(item,index) in items" :key="item" @click="handleOpenWindow(item,index)">
                    <div class="icon">
                      <i :class="item.iconCls"></i>
                    </div>
                    <div class="text">{{item.text}}</div>
                </div>
            </div>
            <div class="menu">
                <div class="item" :class="{'active-tab':activeTab==index}" v-for="(item,index) in menus" :key="item" @click="handleProcess(item,index)">
                  {{item.text}}
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
      menus:[],
      items:[],
      activeTab:0
    };
  },
  mounted() {
    this.load()
  },
  methods: {
    setVisible(visible){
      this.$emit('setVisible',visible);
    },
    // 打开窗口
    handleOpenWindow(item, index) {
      var me = this;
      $(me.$el).addClass('loading');
      setTimeout(function(){
        JE.showFunc(item.nodeInfo, {
          type: 'form',
          callback:function(){
            $(me.$el).removeClass('loading');
          }
        })
      },100);
    },
    // 点击流程
    handleProcess(item, index) {
      var index = index || 0;
      this.activeTab = index;
      this.items = this.menus[index].children || [];
    },
    // 获取数据
    load() {
      this.menus = JE.ajax({url:'/je/menu/menu/loadWfModule'});
      this.handleProcess()
    }
  }
};
</script>

