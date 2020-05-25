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
                <div class="calendar-box" v-if="this.headOptions.type == 'combination'">
                    <div class="calendar-content" :style="{'text-align': this.headStyle.combination}">
                        <span class="calendar-prev" @click="handlePrevMonth"></span>
                        <span class="calendar-headDate"> {{this.headOptions.date}} </span>
                        <span class="calendar-next" @click="handleNextMonth"></span>
                    </div>
                    <span class="calendar-today" @click="handleToday()"> 今天 </span>
                </div>
                <div class="calendar-box" v-else>
                    <span class="calendar-headDate"> {{this.headOptions.date}} </span>
                    <span class="calendar-today dispersion-today" :style="{float: this.headStyle.todayBtn}" @click="handleToday()"> 今天 </span>
                    <div class="calendar-content dispersion" :style="{float: this.headStyle.checkBtn}">
                        <span class="calendar-prev" @click="handlePrevMonth"></span>
                        <span class="calendar-next" @click="handleNextMonth"></span>
                    </div>

                </div>
            </div>


            <div class="cc-calendar">
                <calendarHeader
                        :headOptions="headOptions"
                        @handlePrevMonth = 'handlePrevMonth'
                        @handleNextMonth = 'handleNextMonth'
                        @handleToday = 'handleToday'
                />
                <ul class="calendar-week clear">
                    <li v-for="(item, index) in calendarTitleArr" :key="index" class="week-item">{{item}}</li>
                </ul>
                <ul class="calendar-view clear">
                    <li v-for="(item, index) in visibleCalendar"
                        :key="index"
                        class="date-view"
                        :class="[
          {'month-class': !isCurrentMonth(item.date)},
          {todayBg: isCurrentDay(item.date)},
          {handleDay: item.clickDay}
        ]"
                        @click="handleClickDay(item)"
                    >
        <span class="date-day"
              :style="dayStyle"
              :class="[{'opacity-class': !isCurrentMonth(item.date)}]"
        >
          {{item.day}}
        </span>
                        <span class="calendar-num">
          {{item.calendarNum}}
        </span>
                    </li>
                </ul>
            </div>

            <div class="handle-box">
                <el-input v-model="query.key2" placeholder="任务归属" class="handle-input mr10"></el-input>
                <el-date-picker
                        v-model="query.month"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import schedule from '../../../api/schedule';

    export default {
        name: 'Schedule',
        data() {
            return {
                headStyle: '',
                headOptions: Object,
                query: {
                    tasker: '',
                    month: ''
                },
                year: 2018,
                month: 5,
                date: 1,
                schedule: {},
                // 中文汉字星期名称
                weekTitle: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                // 本月日期构成，先用二维数组
                dateArr: [],
                day: {},
                domdata: []
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                schedule.fetchData(this.query).then(res => {
                    console.log(res);
                    if (res.flag) {
                        this.schedule = res.data.items;
                    } else {
                        this.$message.error(res.message)
                    }

                });

            },
            // 上一个月
            handlePrevMonth () {
                //this.$emit('handlePrevMonth');
            },
            // 下一个月
            handleNextMonth () {
                //this.$emit('handleNextMonth');
            },
            // 回到今天
            handleToday () {
                //this.$emit('handleToday');
            },
            handleSearch () {

            }
        },
        computed: {}
    }
</script>

<style scoped>
    .calendar-header {
        margin-bottom: 23px;
        width: 100%;
    .calendar-box {
        position: relative;
        height: 32px;
        line-height: 32px;
    .calendar-content {
        width: 100%;
    .calendar-prev,
    .calendar-next {
        display: inline-block;
        vertical-align: middle;
        width: 8px;
        height: 11px;
        background: url('../../../assets/img/left.png') no-repeat;
        background-size: contain;
        cursor: pointer;
    }
    .calendar-next {
        background: url('../../../assets/img/right.png') no-repeat;
        background-size: contain;
    }
    }
    .dispersion{
        width: initial;
        display: inline;
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
    .calendar-today {
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
    .dispersion-today{
        position: inherit;
    }
    .calendar-center {
        margin: 0 auto;
    }
    .calendar-left {
        float: left;
    }
    .calendar-right {
        float: right;
    }
    }
    }
</style>
