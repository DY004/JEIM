<!-- 首页mini日历 -->
<style lang="scss" >
    @import './calendar.scss';
</style>
<template>
    <div class="pro-crm-home-calendar">
        <el-card class="box-card" v-show="rendered">
            <div slot="header" class="clearfix">
                <div class="calendar-show" @click="showCal()">
                    日程 <i class="fa fa-calendar" style="color:#d0cdc7; "/>
                </div>
                <div class="calendar-add" @click="editCal()">
                    + 创建
                </div>
            </div>
            <div class="calendar-body">
                <!-- 年份 月份 -->
                <section class="calendar-month">
                    <span class="prevMonth" @click="prevMonth()">❮</span>
                    <div class="text">{{currentMonth}}</div>
                    <span class="nextMonth" @click="nextMonth()">❯</span>
                    <span class="today" @click="today()">今天</span>
                </section>
                <!-- 日期 -->
                <div class="calendar-days" :class="{collapse:collapseDays}">
                    <!-- 星期 -->
                    <ul class="week-header">
                        <li class="day" v-for="(text,i) of weekHeader" :key="i">{{text}}</li>
                    </ul>
                    <ul class="week" v-for="(week,i) of days" :key="i"
                        :class="{select:isSelectWeek(week)}"
                    >
                        <li class="day" 
                            v-for="(day,j) of week" :key="j" 
                            :class="{'other-month':day.prevMonth || day.nextMonth,'today':day.isToday,'select':isSelect(day),'task':isTask(day)}" 
                            @click="selectDay(day)"
                            >
                            <span>{{day.sDay}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <section v-show="collapseDays" class="collapse-btn" @click="collapseDays=false;">
            展开全月
            <span class="top-span">﹀</span>
            </section>
            <section v-show="!collapseDays" class="collapse-btn" @click="collapseDays = true;">
            收起
            <span class="bottom-span">︿</span>
            </section>
            <!-- 选中的日程 -->
            <section class="calendar-tasks" style="max-height:160px;overflow:auto;">
                <section v-for="item in currentTasks" class="task" :key="item" :title="item.CALENDAR_TITLE" v-show="showList">
                    <span class="type" :style="{background:item.CALENDAR_COLOR}">日程</span>
                    <span class="text" @click="editCal(item)"> {{item.CALENDAR_TITLE}}</span>
                </section>
            </section>
        </el-card>
    </div>
    
</template>
<script>
    import calendar from './calendar.js';
    export default calendar;
</script>


