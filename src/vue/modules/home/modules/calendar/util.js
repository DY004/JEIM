

//日历配置信息
const config = {
	solarMonth : new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
	weakStr:new Array('日','一', '二', '三', '四', '五', '六')
};

export default {
    calendar: function(y, m) {
        var me = this,calendarObj = {};
    
        var sDObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2, lM2,lY2,lD2,tmp3,dayglus,bsg,xs,xs1,fs,fs1,cs,cs1
        var cY, cM, cD; //年柱,月柱,日柱
        var lDPOS = new Array(3);
        var n = 0;
        var firstLM = 0;
    
        sDObj = new Date(y, m, 1, 0, 0, 0, 0);    //当月一日日期
    
        calendarObj.length = me.solarDays(y, m);    //公历当月天数
        calendarObj.firstWeek = sDObj.getDay();    //公历当月1日星期几
    
    
    
        for (var i = 0; i < calendarObj.length; i++) {

            var week = (i + calendarObj.firstWeek) % 7;
            calendarObj[i] = me.calElement(y, m + 1, i + 1, week,
                    lY, lM, lD++, lL,
                    cY, cM, cD);
        }
    
        var Today = new Date();
        var tY = Today.getFullYear();
        var tM = Today.getMonth();
        var tD = Today.getDate();
        
        //今日
        if (y == tY && m == tM) calendarObj[tD - 1].isToday = true;
        return calendarObj;
    },
    calElement:function (sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay) {
		var me = this,obj = {};
	    obj.isToday = false;
	    //阳历
	    obj.sYear = sYear;   //公元年4位数字
	    obj.sMonth = sMonth;  //公元月数字
	    obj.sDay = sDay;    //公元日数字
	    obj.week = config.weakStr[week];    //星期, 1个中文
	    obj.weekNum = week;
	    obj.sDate = sYear+'-'+(sMonth>9?sMonth:'0'+sMonth)+'-'+(sDay>9?sDay:'0'+sDay);
	
	    return obj;
	},
	//==============================返回公历 y年某m+1月的天数
	solarDays:function (y, m) {
		var me = this;
	    if (m == 1)
	        return(((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
	    else
	        return(config.solarMonth[m]);
    },
	calendarWeeks:function(year,month){
		var me = this;
	    var obj = me.calendar(year, month);
	    var dayNum = obj.length;//天数
	    var date = new Date(year, month, 1, 0, 0, 0, 0);    //当月日期
	    var firstDay = 0,lastDay = dayNum-1;
        //补全之前的天数
        var firstWeek = obj['0'].weekNum;
        firstWeek = firstWeek == 0?7:firstWeek;

	    if(firstWeek > 1){
	    	var _year = month == 0?year-1:year;
	    	var _month = month == 0?11:month-1;
	    	var _obj = me.calendar(_year, _month);
	    	for(var i = 0;i < firstWeek-1;i++){
	    		firstDay = -i-1;
	    		obj[firstDay] = _obj[_obj.length+firstDay];
	    		obj[firstDay].prevMonth = true;
	    	}
	    }
        //补全之后的天数
        var lastWeek = obj[dayNum-1].weekNum;
        lastWeek = lastWeek == 0?7:lastWeek;
	    if(lastWeek<7){
	    	var _year = month == 11?year+1:year;
	    	var _month = month == 11?0:month+1;
	    	var _obj = me.calendar(_year, _month);
	    	for(var i = 0;i < 7-lastWeek;i++){
	    		lastDay = dayNum+i; 
	    		obj[lastDay] = _obj[i];
	    		obj[lastDay].nextMonth = true;
	    	}
	    }
	    
	    var weekNum = (lastDay+1)/7,weeks = [];
	    for(var i=0;i<weekNum;i++){
	    	var week = [];
		    for(var j=0;j<7;j++){
		    	var day = obj[i*7+j +firstDay];
		    	if(day.isToday && JE.isEmpty(me.activeDay)){
		    		me.activeDay = day.sDay;
		    	}
		    	week.push(day);
		    }
		    weeks.push(week);
	    }
	    return weeks;
	}
}