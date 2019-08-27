import Util from './util.js';

export default {
    data() {
        return {
            rendered:false,
            currentDate:new Date(),//当前日期
            selectDate:new Date(),//选中日期
            collapseDays:true,//默认折叠
            tasks:{},//日程数据
            currentTasks:[],//选中日期日程
            weekHeader:['一', '二', '三', '四', '五', '六','日']
        }
    },
    computed: {
      currentMonth(){
        return Ext.Date.format(this.currentDate,'Y年m月');
      },
      days(){
          return this.getDays();
      },
      showList() {
        const currentDate = Ext.Date.format(this.currentDate, 'Y-m-d');
        const selectDate = Ext.Date.format(this.selectDate, 'Y-m-d');
        if (currentDate.split('-')[0] === selectDate.split('-')[0]
        && currentDate.split('-')[1] === selectDate.split('-')[1]) {
          return true;
        }
        return false;
      },
    },
    mounted(){
        var me = this;
        me.$nextTick(function(){
            var day = {sDate:Ext.Date.format(me.selectDate,'Y-m-d')};
            me.selectDay(day);
            me.rendered = true;
        });
    },
    methods:{
        _initCtr(){
            JE.initCtr("JE.sys.calendar.controller.CalendarController");
        },
        /**
         * 任务标记
         * @param {*} day 
         */
        isTask(day){
            return JE.isNotEmpty(this.tasks[day.sDate]);
        },
        /**
         * 选中标记
         * @param {*} day 
         */
        isSelect(day){
            return day.sDate == Ext.Date.format(this.selectDate,'Y-m-d');
        },
        /**
         * 选中周标记
         * @param {*} week 
         */
        isSelectWeek(week){
            var dayStr = Ext.Date.format(this.selectDate,'Y-m-d'),
                select = false;
            for(var i=0;i<week.length;i++){
                if(week[i].sDate == dayStr){
                    select = true;
                    break;
                }
            }
            return select;
        },
        /**
         * 选中日期
         * @param {*} day 
         */
        selectDay(day){
            this.selectDate = Ext.Date.parse(day.sDate,'Y-m-d');
            this.currentTasks = this.tasks[day.sDate] || [];
            if(day.prevMonth){
                this.prevMonth();
            }else if(day.nextMonth){
                this.nextMonth();
            }
        },
        /**
         * 今天
         */
        today(){
            this.currentDate = this.selectDate = new Date();
            this.collapseDays = false;
            var me = this;
            me.$nextTick(function () {
                //选中日期
                var day = {sDate:Ext.Date.format(me.selectDate,'Y-m-d')};
                me.selectDay(day);
            })
        },
        /**
         * 下月
         */
        nextMonth(){
            this.currentDate = Ext.Date.subtract(this.currentDate, Ext.Date.MONTH, -1);
            this.collapseDays = false;
        },
        /**
         * 上月
         */
        prevMonth(){
            this.currentDate = Ext.Date.subtract(this.currentDate, Ext.Date.MONTH, 1);
            this.collapseDays = false;
        },
        /**
         * 获得当前月的所有日期
         */
        getDays(){
            let year = this.currentDate.getFullYear(),
                month = this.currentDate.getMonth();
            var weeks = Util.calendarWeeks(year,month);
            this.initTasks(weeks);
            return weeks;
        },
        /**
         * 获得当前月的日程
         * @param {*} weeks 
         */
        initTasks(weeks){
            var me = this;
            var startDate = weeks[0][0].sDate;
            var endDate = weeks[weeks.length-1][6].sDate;
            let params = {
                tableCode: 'JE_SYS_CALENDAR',
                limit: -1,
                permSql: "AND (SY_CREATEUSER='" + JE.currentUser.userCode + "' OR CALENDAR_GROUPID IN (SELECT GROUPUSER_GROUP_ID FROM JE_SYS_GROUPUSER WHERE GROUPUSER_USERID='" + JE.currentUser.userId + "') OR CALENDAR_GROUPID IN (SELECT JE_SYS_CALENDARGROUP_ID FROM JE_SYS_CALENDARGROUP WHERE SY_CREATEUSER='" + JE.currentUser.userCode + "'))",
                whereSql: "AND ((CALENDAR_STARTTIME>='" + startDate + "' AND CALENDAR_STARTTIME<='" + endDate + "')  or (CALENDAR_ENDTIME>='" + startDate + "' AND CALENDAR_ENDTIME<='" + endDate + "'))"
            }
            JE.ajax({
                url:JE.getUrlMaps('je.core.calendar', 'load'),
                params:params,
                async : true,
                success: function(response){
                    var tasks = JE.getAjaxData(response).rows;
                    var taskObj = {};
                    Ext.each(tasks,function(task){
                        var startDate = Ext.Date.clearTime(Ext.Date.parse(task.CALENDAR_STARTTIME,'Y-m-d H:i:s'));
                        var endDate = Ext.Date.clearTime(Ext.Date.parse(task.CALENDAR_ENDTIME,'Y-m-d H:i:s'));
                        //计算任务周期
                        var days = JE.DATE.diffDays(startDate,endDate);

                        //为每一天增加任务新
                        for(var i=0;i<=days;i++){
                            var dateStr = Ext.Date.format(startDate,'Y-m-d');
                            taskObj[dateStr] = taskObj[dateStr] || [];
                            taskObj[dateStr].push(task);

                            startDate.setDate(startDate.getDate()+1);
                        }
                    });
                    me.tasks = taskObj;
                    if(me.selectDate){
                        me.currentTasks = me.tasks[Ext.Date.format(me.selectDate,'Y-m-d')];
                    }
                }
            }).rows;
        },
        /**
         * 打开日程
         */
        showCal(){
            var me = this;
            me._initCtr();
            var win = JE.win({
                title: "日程",
                autoShow: true,
                items: [{
                    xtype: "calendar.mainview",
                    
                }]
            })
            win.on('close',function(){
                me.initTasks(me.days)
            })
        },
        /**
         * 编辑日程
         * @param {*} task 
         * @param {*} index 
         */
        editCal(task){
            var me = this;
            var selectDate = Ext.Date.format(me.selectDate,'Y-m-d H:i:s');
            me._initCtr();
            var win=Ext.create('JE.sys.calendar.form.EventWindow', {selectDate:selectDate,
                callback: function (type, obj) {
                    me.initTasks(me.days)
                },
                autoShow: false
            }).show();
            if(task){
                var form=win.down('panel[xtype=form]');
                form.form.setValues(task);
            }
        }
    }
}