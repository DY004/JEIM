<!--Created by Zhangzh on 2018/10/30 20:00-->
<style lang="scss">
.pro-gzq-home{
    width: 100%;
    height:100%;
    padding: 20px 0;
    overflow: auto;
    background: #f0f2f5;
    &::-webkit-scrollbar,
    *::-webkit-scrollbar {
        /*隐藏滚轮*/
        display: none;
    }
    .el-card{
        box-shadow: none;/*去掉阴影*/
    }

    .keyword{
        color:red;
    }
    .home-body{
        width: 1250px;
        margin: 0 auto;
        position: relative;
        &>.leftbox{
            position: absolute;
            top:0;
            width:220px;
            left:0;
        }
        &>.rightbox{
            position: absolute;
            top:0;
            width:310px;
            right:0;
        }
        &>.centerbox{
            padding:0 330px 0 240px;
        }
        &>div{
            &>div{
                margin-bottom:20px;
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }

        .el-tabs.el-tabs--top{
            .el-tabs__item{
                padding:0 20px;
                color: grey;
                &.is-active:after {
                    content: " ";
                    position: absolute;
                    bottom: 0;
                    height: 2px;
                    left: 50%;
                    margin-left: -33%;
                    width: 66%;
                    background-color: #3487e2;
                }
            }
            .el-tabs__active-bar{
                display: none;
            }
            .el-tabs__nav-wrap::after{
                height:1px;
            }
        }
    }
    [v-cloak] { display: none }
}
</style>
<template>
  <div
    v-cloak
    v-show="!loading"
    class="pro-gzq-home"
  >
    <div
      ref="content"
      class="home-body"
    >
      <div
        ref="leftbox"
        class="leftbox"
      >
        <!-- 菜单 -->
        <home-menu
          ref="menu"
          v-cloak
          v-loading="loading"
          :badge="badges"
          @openfunc="openFunc"
        />
      </div>
      <div
        ref="centerbox"
        class="centerbox"
      >
        <!-- 工具 -->
        <tools
          ref="tools"
          v-cloak
          v-loading="loading"
        />
        <!-- 工作流 -->
        <workflow
          ref="workflow"
          v-cloak
          @doact="doAct"
          v-if="rendered.indexOf('workflow') != -1"
        />
        <!-- 事务交办 -->
        <transaction
          ref="transaction"
          @doact="doAct"
          v-if="rendered.indexOf('transaction') != -1"
        />
        <!-- 冒泡通知 -->
        <bubble
          ref="bubble"
          @doact="doAct"
          v-if="rendered.indexOf('bubble') != -1"
        />
        <!-- 消息通知 -->
        <notice
          ref="notice"
          @doact="doAct"
          v-if="rendered.indexOf('notice') != -1"
        />
        <!-- 批注通知 -->
        <postil
          ref="postil"
          @doact="doAct"
          v-if="rendered.indexOf('postil') != -1"
        />
        <!-- 新闻 -->
        <news
          ref="news"
          v-loading="loading"
        />
        <!-- 公司信息 -->
        <company
          ref="company"
          v-loading="loading"
        />
      </div>
      <div
        ref="rightbox"
        class="rightbox"
      >
        <!-- 日历 -->
        <calendar
          ref="calendar"
          v-cloak
          v-loading="loading"
        />
        <!-- 冒泡 -->
        <bubble-list
          ref="bubbleList"
          v-cloak
          v-loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HomeMenu from './modules/menu/menu';
import Tools from './modules/tools/tools';
import News from './modules/news/news';
import Workflow from './modules/workflow/workflow';
import Transaction from './modules/transaction/transaction';
import BubbleList from './modules/bubble/bubble';
import Calendar from './modules/calendar/calendar_mini';
import Company from './modules/company/company';
import Bubble from './modules/message/bubble';
import Postil from './modules/message/postil';
import Notice from './modules/message/notice';

// vm对象
let homeVM;
// 更新用户头像
window._crm_home_changeUserPhoto = function (data) {
  homeVM.refreshPhoto(data);
};
// 刷新角标
window._crm_home_refreshBadge = function (data) {
  homeVM.refreshBadge(data);
};
// 打开工作流
window._crm_home_showworkflow = function (data) {
  const menubar = Ext.getCmp('app-header').getCmp('menubar').getCmp('menubar');
  // 打开首页
  menubar.getSelectionModel().select(menubar.store.getAt(0));
  // 打开工作流功能
  homeVM.openFunc('workflow', 'preapprov', true);
};

export default {
  components: {
    HomeMenu,
    News,
    Tools,
    Workflow,
    Transaction,
    BubbleList,
    Calendar,
    Company,
    Notice,
    Bubble,
    Postil,
  },
  data() {
    return {
      loading: true,
      badges: {},
      rendered: ['tools'],
      badgeKeys: {
        POSTIL: {
          numCount: 'postil',
        },
        WF: {
          approvedCount: 'wfapproved',
          delayCount: 'wfdelay',
          ownerCount: 'wfowner',
          preapprovCount: 'wfpreapprov',
        },
        BUBBLE: {
          numCount: 'bubble',
        },
        MSG: {
          msgCount: 'notice',
        },
        TRANSACTION: {
          historyCount: 'tphistory',
          ownerCount: 'tpowner',
          taskCount: 'tptask',
        },
      },
    };
  },
  created() {
    homeVM = this;
  },
  mounted() {
    const me = this;
    JE.ajax({
      url: '/je/portal/portal/getPortalNum',
      params: {
        pushTypes: 'WF,MSG,BUBBLE,POSTIL,TRANSACTION',
      },
      async: true,
      success(response) {
        const info = JE.getAjaxData(response);
        // 更新角标
        me.refreshBadge(info);
      },
    });
    me.$nextTick(() => {
      // 计算高度
      JE.defer(() => {
        me.computHeight();
      }, 100);
      setTimeout(() => {
        me.loading = false;
      }, 10);
    });
  },
  methods: {
    /**
     * 计算高度
     */
    computHeight() {
      const me = this;
      const basicHeight = 1070;
      const { menu } = me.$refs;
      const { company } = me.$refs;
      const bubble = me.$refs.bubbleList;
      const { content } = me.$refs;

      let centerHeight = me.$refs.centerbox.clientHeight;
      let rightHeight = me.$refs.rightbox.clientHeight;

      // 高度不同，重新计算
      if (centerHeight != rightHeight) {
        // 恢复默认高度
        company.changeHeight(company.minHeight);
        bubble.changeHeight(bubble.minHeight);

        // 重新取值
        centerHeight = me.$refs.centerbox.clientHeight;
        rightHeight = me.$refs.rightbox.clientHeight;

        if (rightHeight > centerHeight) {
          menu.changeHeight(rightHeight);
          content.style.height = `${rightHeight}px`;
          const companyHeight = (rightHeight - centerHeight) + company.minHeight;
          company.changeHeight(companyHeight);
        } else if (rightHeight < centerHeight) {
          menu.changeHeight(centerHeight);
          content.style.height = `${centerHeight}px`;
          const bubbleHeight = (centerHeight - rightHeight) + bubble.minHeight;
          bubble.changeHeight(bubbleHeight);
        }
      } else {
        menu.changeHeight(rightHeight);
        content.style.height = `${rightHeight}px`;
      }
    },
    doAct(type, params) {
      if (type == 'refreshBadge') {
        this.refreshBadge(params);
      } else if (type == 'clearSelect') {
        this.$refs.menu.clearSelect();
      }
    },
    /**
     * 刷新角标
     */
    refreshBadge(badges) {
      const me = this;
      Ext.each(badges, (badge) => {
        // 刷新功能
        if (badge.refresh) {
          let item;
          switch (badge.type) {
            case 'BUBBLEFUNC':// 冒泡列表
              item = me.$refs.bubbleList;
              break;
            case 'POSTIL':// 批注消息列表
              item = me.$refs.postil;
              break;
            case 'BUBBLE':// 冒泡消息列表
              item = me.$refs.bubble;
              // 有冒泡消息时，同时刷新冒泡列表
              // me.$refs.bubbleList && me.$refs.bubbleList.refresh();
              break;
            case 'MSG':// 提醒消息列表
              item = me.$refs.notice;
              break;
            case 'WF':// 工作流列表
              item = me.$refs.workflow;
              break;
            case 'TRANSACTION':// 事务交办列表
              item = me.$refs.transaction;
              break;
          }
          if (item) {
            item.refresh();
          } else if (badge.refreshNum) {
            // 请求角标
            const numInfo = JE.ajax({ url: '/je/portal/portal/getPortalNum', params: { pushTypes: badge.type } })[0];
            if (numInfo) {
              badge.num = true;
              badge.numObj = numInfo.numObj;
            }
          }
        }
        // 刷新数字
        if (badge.num) {
          const keys = me.badgeKeys[badge.type];
          if (keys) {
            for (const key in badge.numObj) {
              me.$set(me.badges, [keys[key]], badge.numObj[key] || '');
            }
          }
        }
      });
    },
    /**
     * 刷新用户头像
     */
    refreshPhoto(data) {
      this.$refs.menu.userPhoto = data;
    },
    /**
     * 打开功能
     */
    openFunc(func, type, visible) {
      const me = this;
      if (func == 'message') {
        func = type || 'notice';
      }
      if (me.rendered.indexOf(func) == -1) {
        me.rendered.push(func);
      }
      me.$el.scrollTop = 0;
      me.$nextTick(() => {
        const item = me.$refs[func];
        item.setVisible(visible, type);
        Ext.each(me.rendered, (_func) => {
          if (_func != func) {
            me.$refs[_func].setVisible(false);
          }
        });
      });
    },
  },
};
</script>
