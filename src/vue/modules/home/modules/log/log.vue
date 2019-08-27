<style rel="stylesheet/scss" lang="scss" >
.pro-gzq-home-log {
  .searchbar {
    padding: 10px 20px;
    color: #6a7794;
    background: #f5f7fe;
    font-size: 14px;
    .inputbox {
      display: inline-block;
      margin-left: 10px;
      // border: 1px solid #ddd;
      // background: #ffffff;
      // border-radius: 4px;
      .el-date-picker,
      .el-input {
        width: 200px;
        input {
          cursor: pointer;
        }
      }
      .jeicon-user-cfg {
        font-size: 14px;
        line-height: 28px;
      }
      .spliter {
        font-size: 12px;
        color: #dcdfe6;
      }
    }
    .el-dropdown {
      color: #ffffff;
      background: #386bd0;
      border-radius: 15px;
      cursor: pointer;
      padding: 0 10px;
      line-height: 24px;
    }
  }
  .log-content {
    padding: 10px 20px;
    height: 430px;
    overflow: auto;
    .label-top,
    .text-num {
      line-height: 24px;
      color: #999999;
    }
    .text-num {
      text-align: right;
    }
    .el-textarea {
      textarea {
        min-height: 88px !important;
      }
    }
  }
  .buttonbar {
    text-align: right;
    padding: 10px 15px;
    .button {
      width: 90px;
      line-height: 28px;
      text-align: center;
      background: #396ad1;
      color: #ffffff;
      display: inline-block;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      margin: 0 5px;
      &.button-link {
        color: #396ad1;
        background: transparent;
      }
    }
  }
}

.el-date-table .available .haveLog:after {
  position: absolute;
  content: " ";
  padding: 2px;
  border-radius: 100%;
  bottom: -4px;
  left: 50%;
  margin-left: -2px;
  background: #2f6bcf;
}
.el-date-table .available .noLog:after {
  position: absolute;
  content: " ";
  padding: 0;
  border-radius: 100%;
  bottom: -4px;
  left: 50%;
  margin-left: -2px;
  background: #2f6bcf;
}
</style>
<template>
  <div class="pro-gzq-home-log">
    <div class="empty-box"
         v-show="!visible"
         @click="setVisible(true)">
      <i class="jeicon jeicon-signing"></i>
      提交日志...
    </div>
    <div class="content-box"
         v-show="visible">
      <div class="searchbar">
        <!-- 日志类型 -->
        <el-dropdown @command="changeType"
                     placement="bottom">
          <span class="el-dropdown-link">
            {{activeType.text}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item) in types"
                              :key="item"
                              :command="item.code">{{item.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="inputbox">
          日期:
          <el-date-picker ref="date"
                          v-model="date"
                          @focus="clickDate"
                          :type="activeType.inputType"
                          :format="activeType.format"
                          size="mini"
                          :editable="false"
                          placeholder="选择日期">
          </el-date-picker>
          点评人:
          <el-input ref="user"
                    placeholder="请选择点评人"
                    size="mini"
                    @focus="selectUser"
                    @clear="clearUser"
                    clearable
                    v-model="data.REPORT_DPR_NAME">
            <i slot="prefix"
               class="jeicon jeicon-user-cfg"></i>
          </el-input>
        </div>
      </div>
      <div class="log-content"
           v-loading="loading">
        <div class="item">
          <div class="label-top">{{activeType.workText}}工作总结：</div>
          <el-input type="textarea"
                    resize="none"
                    maxlength="1000"
                    autosize
                    ref="work"
                    v-model="data.REPORT_GZZJ"
                    @change="changeContent"></el-input>
          <div class="text-num">{{(data.REPORT_GZZJ || '').length}}/1000</div>
        </div>
        <div class="item">
          <div class="label-top">{{activeType.planText}}工作计划：</div>
          <el-input type="textarea"
                    resize="none"
                    maxlength="1000"
                    autosize
                    ref="plan"
                    v-model="data.REPORT_GZJH"
                    @change="changeContent"></el-input>
          <div class="text-num">{{(data.REPORT_GZJH || '').length}}/1000</div>
        </div>
        <div class="item">
          <div class="label-top">工作心得总结：</div>
          <el-input type="textarea"
                    resize="none"
                    maxlength="1000"
                    autosize
                    ref="summary"
                    v-model="data.REPORT_GZXD"
                    @change="changeContent"></el-input>
          <div class="text-num">{{(data.REPORT_GZXD || '').length}}/1000</div>
        </div>
      </div>
      <div class="buttonbar">
        <div class="button button-link"
             @click="showList">查看历史</div>
        <div class="button"
             @click="updateInfo">发布</div>
      </div>
    </div>
    <log-list ref="list"></log-list>
  </div>
</template>

<script>
import LogList from "./log_list.vue"
export default {
  name: "log",
  components: { LogList },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.visible,
      loading: true,
      types: [
        { code: 'RZ', text: '日志', inputType: 'date', format: 'yyyy-MM-dd', workText: '今日', planText: '明日' },
        { code: 'ZB', text: '周报', inputType: 'week', format: 'yyyy 第 WW 周', workText: '本周', planText: '下周' },
        { code: 'YB', text: '月报', inputType: 'month', format: 'yyyy-MM', workText: '本月', planText: '下月' }
      ],
      activeType: {},
      date: new Date(),
      data: {},
      edited: false,
      logDates: [],
      dataBtnList: [],
      newActiveType: '',
    };
  },
  mounted () {
    var me = this;
    me.loadInfo(me.types[0]);
    this.newActiveType = this.types[0];
  },
  watch: {
    date (nv, ov) {
      if (JE.isEmpty(nv)) {
        this.date = new Date();
      }
      this.loadInfo();
    }
  },
  methods: {
    setVisible (visible) {
      this.$emit('setVisible', visible);
      this.$refs.list.setVisible(false);
    },
    showList (index, item) {
      //此处需要处理页面数据重新加载
      var list = this.$refs.list;
      list.setVisible(true);
    },
    /**
     * 修改标记
     */
    changeContent (content) {
      var me = this;
      me.edited = true;
    },
    /**
     * 切换类型
     */
    changeType (code) {
      var me = this, activeType;
      this.dataBtnList = [];
      Ext.each(this.types, function (type) {
        if (type.code == code) {
          activeType = type;
          me.newActiveType = type;
          return false;
        }
      });
      //根据改动标记判断
      if (me.edited) {
        JE.confirm('内容有改动，需要保存吗？', function (btn) {
          if (btn == 'ok') {
            me.updateInfo(function () {
              me.loadInfo(activeType);
            });
          } else {
            me.loadInfo(activeType);
          }
        }, '提醒', '保存');
      } else {
        me.loadInfo(activeType);
      }
    },
    clearDate: function () {
      var me = this;
      me.date = new Date();
    },
    clearUser: function () {
      var me = this;
      me.data.REPORT_DPR_NAME = '',
        me.data.REPORT_DPR_ID = '';
      me.clearing = true;
      setTimeout(function () {
        me.$refs.user.blur();
        me.clearing = false;
      }, 100);
    },
    /**
     * 选择点评人
     */
    selectUser: function () {
      var me = this;
      if (me.clearing) { return; }
      me.$refs.user.blur();

      JE.vue.selectUser({
        title: '选择点评人',
        width: 300,
        height: 500,
        multiple: true,
        value: me.data.REPORT_DPR_ID,
        valueType: 'id',
        callback: function (datas) {
          var ids = [], texts = [];
          Ext.each(datas, function (data) {
            ids.push(data.id);
            texts.push(data.text);
          });
          if (ids.length > 0) {
            me.data.REPORT_DPR_ID = ids.join(',');//点评人
            me.data.REPORT_DPR_NAME = texts.join(',');//点评人姓名
          }
        }
      })
    },
    // 点击日期选择input框  有日志的日期添加下面的小圆点标记
    clickDate (d) {
      if (d instanceof Date) {
        this.loadInfo(this.newActiveType, d);
      } else {
        this.loadInfo(this.newActiveType);
      }
      setTimeout(() => {
        this.btnClick();
        var dateTags = document.getElementsByClassName('available');
        for (var i = 0; i < dateTags.length; i++) {
          var div = dateTags[i].children[0];
          if (div.localName === 'div') {
            div.className = 'noLog';
            if (this.logDates.length > 0) {
              this.logDates.forEach((item, index) => {
                var day = parseInt(item.substring(item.length - 2));
                if (day == div.innerText) {
                  div.className = 'haveLog';
                }
              });
            }
          }
        }
      }, 500)
    },
    btnClick() {
      const that = this;
      if (this.dataBtnList.length > 0) return;
      this.dataBtnList = document.querySelectorAll('.el-picker-panel__icon-btn');
      this.dataBtnList.forEach((item) => {
        item.addEventListener('click', function (e) {
          that.$nextTick(() => {
            const y = document.querySelectorAll('.el-date-picker__header-label')[0].innerText.split(' ')[0];
            const m = document.querySelectorAll('.el-date-picker__header-label')[1].innerText.split(' ')[0];
            const nd = `${y}/${m}/01`;
            that.clickDate(new Date(nd));
          })
        });
      })
    },
    /**
     * 加载数据
     */
    loadInfo: function (activeType, d) {
      var me = this, date = d || me.date;
      me.edited = false;
      me.activeType = activeType || me.activeType;
      var type = me.activeType.code;
      var dateVal = Ext.Date.format(me.getTimes(date).start, type == 'YB' ? 'Y-m' : 'Y-m-d');
      me.loading = true;
      JE.ajax({
        url: '/je/portal/homePortal/loadWorkTask',
        params: {
          type: type,
          dateVal: dateVal
        },
        async: true,
        success: function (response) {
          var data = JE.getAjaxData(response);
          me.logDates = data.haveDates;

          if (data.success) {
            me.data = data.obj;
          } else {
            me.data = {
              REPORT_DPR_ID: JE.currentUser.zsldId,//点评人
              REPORT_DPR_NAME: JE.currentUser.zsldName,//点评人姓名
            };
          }
          me.$refs.work.focus();
          me.loading = false;
        }
      })
    },
    /**
     * 修改数据
     */
    updateInfo: function (callback) {
      var me = this, content = (me.data.REPORT_GZZJ || '').trim();
      if (JE.isEmpty(me.date)) {
        JE.alert('请选择日期！');
        return;
      }
      if (JE.isEmpty(content)) {
        JE.alert('请填写工作总结！');
        me.$refs.summary.focus();
        return;
      }
      var times = me.getTimes();
      var data = {
        tableCode: 'JE_CIRCLE_REPORT',
        JE_CIRCLE_REPORT_ID: me.data.JE_CIRCLE_REPORT_ID || '',
        REPORT_BGLX_CODE: me.activeType.code,//类型
        REPORT_GZZJ: me.data.REPORT_GZZJ, // 工作总结 
        REPORT_GZJH: me.data.REPORT_GZJH || '', // 工作计划
        REPORT_GZXD: me.data.REPORT_GZXD || '', //  心得总结
        REPORT_DPXX: me.data.REPORT_DPXX || '',//点评内容
        REPORT_DPR_ID: me.data.REPORT_DPR_ID || '',//点评人
        REPORT_DPR_NAME: me.data.REPORT_DPR_NAME || '',//点评人姓名
        REPORT_KSSJ: times.startStr,//开始时间
        REPORT_JSSJ: times.endStr,//结束时间
        REPORT_YEAR: times.start.getFullYear(),//年
        REPORT_MONTH: times.start.getMonth() + 1,//月
        REPORT_WEEK: Ext.Date.getWeekOfYear(times.start),//年第几周
        REPORT_DAY: times.start.getDate()//日
      };
      me.loading = true;
      JE.ajax({
        url: '/je/portal/homePortal/saveTask',
        params: data,
        async: true,
        success: function (response) {
          var data = JE.getAjaxData(response);
          if (data.success) {
            me.data = data.obj;
            JE.msg('保存成功！');
            me.edited = false;
          } else {
            JE.alert(data.obj);
          }
          if (callback && typeof callback == 'function') {
            callback();
          } else {
            me.loading = false;
          }
        }
      });

    },
    /**
     * 时间
     */
    getTimes (d) {
      var me = this, date = d || me.date, type = me.activeType.code;
      var start = '', startStr = '', end = '', endStr = '';
      if (type == 'RZ') {
        start = end = date;
        startStr = endStr = Ext.Date.format(date, 'Y-m-d');
      } else if (type == 'ZB') {
        var week = date.getDay() || 7;
        start = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (1 - week));
        end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - week));
        startStr = Ext.Date.format(start, 'Y-m-d');
        endStr = Ext.Date.format(end, 'Y-m-d');
      } else if (type == 'YB') {
        start = Ext.Date.getFirstDateOfMonth(date);
        end = Ext.Date.getLastDateOfMonth(date);
        startStr = Ext.Date.format(start, 'Y-m-d');
        endStr = Ext.Date.format(end, 'Y-m-d');
      }
      return { start: start, end: end, startStr: startStr, endStr: endStr };
    }
  }
};
</script>

