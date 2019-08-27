<!-- 菜单集合 -->
<style lang="scss">
.pro-crm-home-tree {
  background: #ffffff;
  .header-box {
    height: 110px;
    position: relative;
    padding-left: 80px;
    padding-top: 45px;
    .photo {
      position: absolute;
      top: 46px;
      left: 25px;
    }
    .name {
      font-weight: bold;
      line-height: 22px;
      font-size: 14px;
    }
    .dept {
      padding-left: 20px;
      color:#a1a1a1;
      padding-right: 10px;
      &::before {
        content: " ";
        padding: 5px;
        background: #2f6bcf;
        border-radius: 100%;
        position: absolute;
        left: 81px;
        bottom: 30px;
      }
    }
  }
  .el-menu {
    border:0;
    .el-menu-item,
    .el-submenu__title {
      height: 45px;
      line-height: 45px;
      color: #797979;
    }
    .el-submenu__title {
      background: #f5f7fe;
      color: #2f6bcf;
      .color-blue{
        color: #2f6bcf;
      }
    }
    .el-menu-item-group__title,
    .el-submenu__icon-arrow
    {
      display: none;
    }
    .el-menu-item{
      position: relative;
      .helpicon{
        color: #c0c0c0;
        position: absolute;
        left:20px;
        top:0;
        visibility: hidden;
        font-size: 12px;
        &:hover{
          color: #386bd0;
        }
      }
      &.is-active{
        outline: 0;
        background-color: #ecf5ff;
        .helpicon{
          visibility: visible;
        }
      }
    }
    .el-menu-item.is-active {
    }
  }
}
</style>
<template>
  <div class="pro-crm-home-tree" :style="{height:minHeight+'px'}">
    <div class="header-box">
      <div class="name">{{userName}}</div>
      <div class="dept">{{userDept}}</div>
      <div class="photo" v-html="userPhoto" @click="changePhoto"></div>
    </div>
      <el-menu
        ref="menu"
        :default-openeds="['workflow','message','transaction']"
        @open="open"
        @close="close"
        @select="select"
      >
        <el-submenu :index="menu.code" v-for="menu in menuData" :key="menu">
          <template slot="title">
            <i class="jeicon jeicon-sitemap-o color-blue"/>
            <span class="color-blue">{{menu.text}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="item.code" v-for="item in menu.children" :key="item">
                <i class="jeicon jeicon-question-circle helpicon" v-if="helpMsg[item.code]" @click="showHelp(item.code)"></i>
              {{item.text}} {{badge[item.badge]}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
  </div>
</template>
<script>
export default {
  name: "home-menu",
  props: {
    badge:Object
  },
  mounted(){
    this.userPhoto = JE.getUserPhoto(true);
  },
  data() {
    return {
      badge:this.badge,
      userPhoto:'',
      minHeight:1050,
      selectMenu:''
    };
  },
  computed: {
    userName() {
      return JE.USER.username;
    },
    userDept() {
      return JE.USER.deptName;
    },
    helpMsg:function(){
        return {
            preapprov:{title:'待我审批',msg:'需要我审批的工作流程。流程工作台用于企业内部规范工作流程。'},
            postil:{title:'批注',msg:'在系统中部分业务功能提供了批注功能，为业务单据添加批语和注释信息'},
            notice:{title:'通知',msg:'系统业务功能提示给您的通知消息，第一时间获得各个业务的进展情况。'},
            bubble:{title:'冒泡',msg:'用户企业内部同事之间发布动态、表情、图片，增强同事间的互动。'},
            task:{title:'待我处理',msg:'用于企业内部上级给下级发布工作事务，并可查看工作进展情况。'}
        };
    },
    menuData:function(){
        return [{
            text:'流程工作台',
            code:'workflow',
            children:[
                {text:'待我审批',code:'preapprov',badge:'wfpreapprov'},
                {text:'已办理',code:'approved',badge:'wfapproved'},
                {text:'我的流程',code:'owner',badge:'wfowner'},
                {text:'已延时',code:'delay',badge:'wfdelay'}
            ]
        },{
            text:'我的消息',
            code:'message',
            children:[
                {text:'批注',code:'postil',badge:'postil'},
                {text:'通知',code:'notice',badge:'notice'},
                {text:'冒泡',code:'bubble',badge:'bubble'}
            ]
        },{
            text:'交办事项',
            code:'transaction',
            children:[
                {text:'待我处理',code:'task',badge:'tptask'},
                {text:'我的安排',code:'send',badge:'tpowner'},
                {text:'历史事务',code:'history',badge:'tphistory'}
            ]
        }]
    }
  },
  methods: {
    showHelp(code){
      var info = this.helpMsg[code];
      JE.win({
        title:info.title,
        html:info.msg,
        autoShow:true,
        width:600,
        height:400,
        bodyStyle:'line-height: 2;font-size: 16px;padding: 10px 20px;',
        buttonAlign:'center',
        buttons:[{
          text:'关闭',
          cls:'JEPLUS_B_L10',
          handler:function(btn){
            btn.up('window').close();
          }
        }]
      });
    },
    clearSelect:function(){
      $(this.$el).find('.is-active').removeClass('is-active');
      this.$refs.menu.activeIndex = '';
    },
    changeHeight:function(height){
      var me = this;
      me.$el.style.height = (height>me.minHeight?height:me.minHeight)+'px';
    },
    changePhoto:function(){
      var me = this;
      JE.CoreUtil.updateUserPhoto();
    },
    open:function(key,keyPath){
      this.$emit('openfunc',keyPath[0],keyPath[1],true);
    },
    close:function(key,keyPath){
      this.$emit('openfunc',keyPath[0],keyPath[1],false);
    },
    select: function(key,keyPath) {
      var me = this;
      me.$emit('openfunc',keyPath[0],keyPath[1],true);
    }
  }
};
</script>


