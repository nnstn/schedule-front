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
export default {
  name: 'Calender.vue',
  data () {
    return {
      query: {
        tasker: '',
        month:''
      },
      year: 2018,
      month: 5,
      date: 1,

      // 中文汉字星期名称
      daynamearr: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      // 本月日期构成，先用二维数组
      dayarr: [],
      day: {},
      schedules: [
        {'title': '吃饭1', 'start': '20180502', 'end': '20180502', 'type': 'life'},
        {'title': '吃饭2', 'start': '20180502', 'end': '20180502', 'type': 'life'},
        {'title': '吃饭3', 'start': '20180502', 'end': '20180502', 'type': 'life'},
        {'title': '吃饭4', 'start': '20180501', 'end': '20180502', 'type': 'life'},
        {'title': '游泳', 'start': '20180503', 'end': '20180503', 'type': 'life'},
        {'title': '游泳1', 'start': '20180523', 'end': '20180527', 'type': 'work '},
        {'title': '游泳2', 'start': '20180523', 'end': '20180530', 'type': 'important'},
        {'title': '游泳3', 'start': '20180523', 'end': '20180527', 'type': 'work '},
        {'title': '打豆豆', 'start': '20180511', 'end': '20180612', 'type': 'life'}
      ],
      domdata: []
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      console.log("任务数据")
    },
    handleSearch(){

    }
  },
  computed: {
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 100px;
    display: inline-block;
  }
  .calender{
    position:relative;
    width: 1000px;
    height: 660px;
    border: 1px solid #333;
    margin: 0 auto;
  }
  .calender .currnent{
    position: absolute;
    width:300px;
    height:30px;
    /* left:-200px; */
  }
  /*日历底座部分样式*/
  .tablebox1{
    position:absolute;
    top:30px;
    width:100%;
    height:600px;
  }
  table{
    width: 100%;
    border-collapse: collapse;
  }
  table.bgtable thead tr th{
    height:30px;
  }
  table.bgtable tbody tr td{
    height:100px;
    box-sizing: border-box;/*高度中含有边框高度*/
    border:1px solid #ccc;
    text-align: right;
    vertical-align: top;
    padding:4px;
  }
  table.bgtable tbody tr td.gray{
    background: #eee;
  }
  table.bgtable tbody tr td.today{
    background: #fcf8e3;
  }

  /*日程部分样式*/
  .tablebox2{
    position:absolute;
    top:60px;
    width:100%;
    height:600px;
  }
  .tablebox2 .row{
    padding-top:30px;
    height:100px;
    box-sizing: border-box;
  }
  .tablebox2 .row .scheduletable{
    width:100%;
    height:70px;
  }
  .tablebox2 .row .scheduletable tr{
    height:20px;
    width:100%;
  }
  .tablebox2 .row .scheduletable tr td{
    width:14.2857%;
    padding:0 2px;
    box-sizing: border-box;
  }
  .tablebox2 .row .scheduletable tr td .s{
    border-radius: 15px;
    font-size: 12px;
    height:20px;
    line-height: 20px;
    padding-left:10px;
  }
  .tablebox2 .row .scheduletable tr td .s.norightradius{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .tablebox2 .row .scheduletable tr td .s.noleftradius{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .tablebox2 .row .scheduletable tr td .s.life{
    background: -webkit-linear-gradient(top,#8BC34A,#C5E1A5);
  }
  .tablebox2 .row .scheduletable tr td .s.work{
    background: -webkit-linear-gradient(top,#1976D2,#03A9F4);
  }
  .tablebox2 .row .scheduletable tr td .s.important{
    background: -webkit-linear-gradient(top,#F44336,#EF9A9A);
  }
</style>
