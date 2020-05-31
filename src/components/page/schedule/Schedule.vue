<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 任务管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>日程查看</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="calendar-header clear">
                <div class="calendar-box">
                    <div class="calendar-content" style="text-align: center">
                        <span class="calendar-prev" @click="handlePrevMonth"></span>
                        <span class="calendar-headDate"> {{this.headOptions.date}} </span>
                        <span class="calendar-next" @click="handleNextMonth"></span>
                    </div>
                    <span class="calendar-today" @click="handleToday()"> 今天 </span>
                </div>
            </div>
            <ul class="calendar-week clear">
                <li v-for="(item, index) in weekTitle" :key="index" class="week-item">{{item}}</li>
            </ul>

            <!--42天日历-->
            <ul class="calendar-view clear">
                <li v-for="(item, index) in visibleCalendar"
                    :key="index"
                    class="date-view"
                    :class="[
                              {'month-class': !isCurrentMonth(item.date)},
                              {todayBg: isCurrentDay(item.date)},
                              {handleDay: item.clickDay}
                            ]"
                    @click="handleClickDay(item)">

                    <span class="date-day"
                          :style="dayStyle"
                          :class="[{'opacity-class': !isCurrentMonth(item.date)}]">
                      {{item.day}}
                    </span>
                </li>
            </ul>
            <!--与42天日历对应42天任务-->
            <div class="tablebox2">
                <div class="row" v-for="(row,index) in scheduleDom" :index="index" >
                    <table class="scheduletable">
                        <tr v-for="(line,index) in row" :index="index" >
                            <td v-for="(td,index) in line" v-bind:colspan="td.colspan" :index="index" >
                                <div v-if="td.taskName"
                                     v-bind:class="['s',td.taskType,{'noleftradius':td.noleftradius,'norightradius':td.norightradius}]">
                                   {{td.taskName}}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import schedule from '../../../api/schedule';
    import * as utils from '../../../utils/utils';

    export default {
        name: 'Schedule',
        data() {
            //获取当前日期
            let {year, month, day} = utils.getNewDate(new Date());
            return {
                headOptions: {
                    style: {
                        todayBtn: 'right',
                        combination: 'center',
                        checkBtn: 'right',
                    },
                    date: '',
                },
                weekTitle: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                time: {year, month, day},
                calendarList: [],
                schedules:{},
                scheduleDom: {}
            }
        },
        computed : {
            dayStyle : function () {
                return {
                    textAlign: 'right',
                }
            },
            visibleCalendar () {
                let calendatArr = [];

                let {year, month, day} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));

                let currentFirstDay = utils.getDate(year, month, 1);

                // 获取当前月第一天星期几
                let weekDay = currentFirstDay.getDay();
                console.log(weekDay)
                //表格的起始时间
                let startTime = currentFirstDay - (weekDay - 1) * 24 * 60 * 60 * 1000;

                // 为了布局一直均取42天为一个单元月
                let monthDayNum = 42;
                // if (weekDay == 5 || weekDay == 6){
                //     monthDayNum = 42
                // }else {
                //     debugger;
                //     monthDayNum = 35
                // };

                for (let i = 0; i < monthDayNum; i++) {
                    let date = new Date(startTime + i * 24 * 60 * 60 * 1000);
                    calendatArr.push({
                        date: date,
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        day: date.getDate(),
                        clickDay: false,
                        taskContainer:[]
                    })
                };

                this.headOptions.date = `${utils.englishMonth(month)} ${year}`;
                console.log(calendatArr);
                return calendatArr
            }
        },
        created() {
            this.calendarList = this.visibleCalendar;
            //计算出本页起始日期,和最终日期，进行日程查询
            this.getData();
            //this.calendarType = this.options.calendarType;
        },
        methods: {
            // 是否是当前月
            isCurrentMonth (date) {
                let {year: currentYear, month: currentMonth} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));
                let {year, month} = utils.getNewDate(date);
                return currentYear == year && currentMonth == month
            },
            // 是否是今天
            isCurrentDay (date) {
                let {year: currentYear, month: currentMonth, day: currentDay} = utils.getNewDate(new Date());
                let {year, month, day} = utils.getNewDate(date);
                return currentYear == year && currentMonth == month && currentDay == day;
            },
            // 上一个月
            handlePrevMonth () {
                let prevMonth = utils.getDate(this.time.year,this.time.month,1);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                this.time = utils.getNewDate(prevMonth);
                this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`;
            },
            // 下一个月
            handleNextMonth () {
                let nextMonth = utils.getDate(this.time.year,this.time.month,1);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                this.time = utils.getNewDate(nextMonth);
                this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`;
            },
            // 点击回到今天
            handleToday () {
                this.time = utils.getNewDate(new Date());
            },
            // 点击某一天
            handleClickDay (item) {
                this.$forceUpdate();
                this.calendarList.map( x => {
                    x.clickDay = false;
                });
                this.$set(item, 'clickDay', true);
            },

            getData() {
                schedule.fetchData(this.query).then(res => {
                    console.log(res);
                    if (res.flag) {
                        this.schedules = res.data.items;
                        this.calculateSchedule();
                    } else {
                        this.$message.error(res.message)
                    }

                });
            },
            calculateSchedule: function () {
                let schedules = this.schedules
                let dayarr = this.calendarList

                let domdata = [
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                    [[], [], []]
                ]
                // 遍历 6 个星期
                for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
                    let weekarr = dayarr.slice(rowIndex * 7, (rowIndex + 1) * 7) //取底i个星期数据
                    // 遍历这一周的事情
                    weekarr.forEach(function (theday, colIndex) {//遍历第i个星期每天任务

                        // 今天的任务
                        let thedayTasks = []
                        // 将所有今天发生事情推入今天数组
                        schedules.forEach(function (task, taskIndex) {
                            let startYear = new Date(task.startDate).getFullYear();
                            let startMonth = new Date(task.startDate).getMonth();
                            let startDate = new Date(task.startDate).getDate();

                            let endYear = new Date(task.endDate).getFullYear();
                            let endMonth = new Date(task.endDate).getMonth();
                            let endDate = new Date(task.endDate).getDate();
                            // let {startYear, startMonth, startDate} = utils.getNewDate(new Date(task.startDate));
                            // let {endYear, endMonth, endDate} = utils.getNewDate(new Date(task.endDate));

                            //任务持续天数
                            task.colspan = (new Date(task.endDate) - new Date(task.startDate)) / (1000 * 60 * 60 * 24) + 1

                            if (startYear === theday.year && startMonth === theday.month && startDate === theday.day) {
                                thedayTasks.push(task)
                            }
                            //如果是本月第一天需要做跨月处理
                            if(rowIndex===0 && colIndex ===0){
                                console.log("这个是本页左上角")
                            }
                        })

                        // 至此我们找到今天所有发生的事情--页面每日最多处理3个任务
                        for (let line = 0; line < 3; line++) {

                            if (theday.taskContainer.indexOf(line) === -1) {
                                let schedule = thedayTasks.shift()
                                if (schedule === undefined) {
                                    domdata[rowIndex][line].push({})
                                } else {
                                    // 将这一天和后colspan天的occupation加入自己的行号
                                    // if(schedule.colspan&&schedule.colspan!=1){
                                    let end = colIndex + schedule.colspan

                                    var _end = end >= 7 ? 7 : end
                                    for (var _i = colIndex + 1; _i < _end; _i++) {
                                        weekarr[_i].taskContainer.push(line)
                                    };

                                    domdata[rowIndex][line].push({
                                        'taskName': schedule.taskName,
                                        'colspan': (_end - colIndex),
                                        'taskType': schedule.taskType,
                                        'noleftradius': false,
                                        'norightradius': end > 7
                                    })

                                    let rest = end - 7
                                    let next = 1
                                    // 处理下一周事情
                                    while (rest > 0) {
                                        let _rest = rest > 7 ? 7 : rest
                                        var nextweek = dayarr.slice((rowIndex + next) * 7, (rowIndex + next + 1) * 7)
                                        if (nextweek === undefined || nextweek.length === 0) {
                                            console.log('任务跨月')
                                            rest = -1
                                            continue
                                        }

                                        for (let _i = 0; _i < _rest; _i++) {
                                            if (nextweek[_i] === undefined) {
                                                debugger
                                            }
                                            nextweek[_i].taskContainer.push(line)
                                        }
                                        domdata[rowIndex + next][line].push({
                                            'taskName': schedule.taskName,
                                            'colspan': _rest,
                                            'taskType': schedule.taskType,
                                            'noleftradius': true,
                                            'norightradius': rest > 7
                                        })

                                        rest = rest - 7
                                        next++
                                    }
                                    // }else{
                                    //    //当只有一列情况
                                    //    domdata[rowIndex][line].push({"title":schedule.title,"colspan":schedule.colspan,"type":schedule.type,"noleftradius":false,"norightradius":false});
                                    // }
                                }
                            }
                        }
                        while (thedayTasks.length > 0) {
                            console.log(theday.year + '年' + theday.month + '月' + theday.date + '日:还有未处理的任务:' + thedayTasks.shift().title)
                        }
                    })
                }
                this.scheduleDom = domdata
                console.log(this.scheduleDom);

            }
        }
    }
</script>

<style scoped>
    body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, button, input, textarea, th, td, span {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    ul, ol {
        list-style: none
    }
    .clear:after {
        display: block;
        height: 0;
        content: "";
        clear: both
    }
    .calendar-header {
        margin-bottom: 13px;
        width: 100%;
    }
    .calendar-box {
        position: relative;
        height: 32px;
        line-height: 32px;
    }
    .calendar-content {
        width: 100%;
    }
    .calendar-prev {
        display: inline-block;
        vertical-align: middle;
        width: 8px;
        height: 11px;
        background: url('../../../assets/img/left.png') no-repeat;
        background-size: contain;
        cursor: pointer;
    }
    .calendar-next {
        display: inline-block;
        vertical-align: middle;
        width: 8px;
        height: 11px;
        background: url('../../../assets/img/right.png') no-repeat;
        background-size: contain;
        cursor: pointer;
    }

    .calendar-headDate {
        vertical-align: middle;
        margin: 0 12px;
        font-size: 18px;
        color: #424953;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .calendar-header .calendar-box .calendar-today {
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 30px;
        text-align: center;
        border: 1px solid #2061FF;
        border-radius: 4px;
        font-size: 14px;
        color: #2061FF;
        cursor: pointer;
    }

    .calendar-week {
        width: 100%;
        height: 46px;
        line-height: 46px;
        border: 1px solid #E4E7EA;
        border-right: none;
    }
    .week-item {
        float: left;
        width: 14.285%;
        text-align: center;
        font-size: 14px;
        color: #424953;
        border-right: 1px solid #E4E7EA;
        font-weight: 600;
    }
    .calendar-view {
        width: 100%;
        border-left: 1px solid #E4E7EA;
    }
    .date-view {
        float: left;
        width: 14.285%;
        height: 120px;
        border-right: 1px solid #E4E7EA;
        border-bottom: 1px solid #E4E7EA;
        cursor: pointer;
    }
    .date-day {
        padding: 8px 8px 0;
        display: block;
        width: 100%;
        font-size: 14px;
        color: black !important;
    }
    .calendar-num {
        margin-top: 6px;
        display: block;
        width: 100%;
        text-align: center;
        font-size: 30px;
        color: #424953;
    }
    .opacity-class {
        opacity: .5;
    }
    .month-class {
        background-image: linear-gradient(45deg,rgba(000, 000, 000, .03) 25%,transparent 25%,transparent 50%,rgba(000, 000, 000, .03) 50%,rgba(000, 000, 000, .03) 75%,transparent 75%,transparent);
        background-size: 20px 20px;
    }
    .todayBg {
        background: #FCF8E3;
    }
    /*点击日期样式*/
    .handleDay {
        background: #2061FF !important;
    }
    .calendar-num {
        color: #fff !important;
    }
    .tablebox2 {
        border: black;
    }
</style>
