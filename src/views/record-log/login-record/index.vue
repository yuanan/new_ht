<template>
  <div class="loginRecord">
    <el-form ref="form" :inline="true" :model="form" size="medium">
      <el-form-item label="起始日">
        <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width:140px" />
        <el-time-picker v-model="startTime" arrow-control placeholder="选择时间点" style="width:120px" />
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker v-model="endDate" type="date" placeholder="选择日期" style="width:140px" />
        <el-time-picker v-model="endTime" arrow-control placeholder="选择时间点" style="width:120px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="name" placeholder="用户账号" style="width:160px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindLoginLog()" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginIp" placeholder="登录IP" style="width:160px" @keydown.enter.native="doFindLoginLog()" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFindLoginLog()">查找</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="doRefreshLoginLog()">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh-right" type="info" @click="doReset()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-card id="box-card">
      <el-form :inline="true" size="mini" class="formBtn">
        <el-button size="small" type="warning" @click="doSelectDate(1)">今日</el-button>
        <el-button size="small" type="warning" @click="doSelectDate(2)">昨日</el-button>
        <el-button size="small" type="warning" @click="doSelectDate(3)">本期</el-button>
        <el-button size="small" type="warning" @click="doSelectDate(4)">上期</el-button>
        <el-button size="small" type="warning" @click="doSelectDate(5)">本月</el-button>
        <el-button size="small" type="warning" @click="doSelectDate(6)">上月</el-button>
        <el-button size="small" icon="el-icon-document" style="margin-bottom: 10px" @click="excelExport()">导出</el-button>
        <el-pagination
          :current-page="1"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          layout="total, prev, pager, next, sizes"
          :total="loginRecord.totalItemsNum"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-form>

      <el-table
        :data="loginRecord.tableData"
        style="width:100%;margin-top:10px"
        :header-cell-style="this.$Global.tableHeaderColor"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column property="name" label="帐号" align="center" />
        <el-table-column property="level" label="级别" align="center">
          <template slot-scope="{row}">
            <span>{{ (row.level === 2 || row.level === 1) ? '代理' : '会员' }}</span>
          </template>
        </el-table-column>
        <el-table-column property="loginAddr" label="登录位置" align="center" />
        <el-table-column property="loginIp" label="登录IP" align="center" />
        <el-table-column property="loginTime" label="登录时间" align="center" />
        <el-table-column property="memo" label="备注" align="center" />
      </el-table>

      <el-pagination
        v-if="pageSize !== 10"
        :current-page="1"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, prev, pager, next, sizes"
        :total="loginRecord.totalItemsNum"
        style="margin-top: 10px"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- eslint-disable-next-line -->
    <ExportExcel ref="excel" :eData="eData" />

    <!-- you can add element-ui's tooltip -->
    <el-tooltip placement="top" :content="$t('action.backToTop')">
      <back-to-top :custom-style="this.$Global.myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import share from '@/api/share'
import ExportExcel from '@/components/ExportExcel'
import BackToTop from '@/components/BackToTop'
export default {
  components: {
    ExportExcel,
    BackToTop
  },
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(2019, 9, 10, 12, 0, 0),
      endTime: new Date(2019, 9, 10, 12, 0, 0),
      memo: '',
      name: '',
      loginIp: '',
      pageSize: 10,
      loginRecordFrm: {
        totalItemsNum: 1,
        tableData: [
          {
            name: '888888', // 账号
            level: '1', // 级别
            loginAddr: '会员登录', // 登录位置
            loginIp: '8.8.8.8', // 登录IP
            loginTime: '', // 操作时间
            memo: '' // 备注
          }
        ]
      },
      form: {
        name: ''
      },
      // eslint-disable-next-line
      eData: {}
    }
  },
  computed: {
    ...mapState({ loginRecord: state => state.ht.loginRecordForm })
  },
  created() {
    this.doSelectDate(1)
    this.getLoginLog()
  },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    getLoginLog() {
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetLoginLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName, // 后面加上的
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      // console.log('sendStr1 ', sendStr)
      this.$pomelo.send(sendStr)
    },
    doFindLoginLog() {
      var r = this.getSelectDate()
      // var type = this.optType
      const sendStr = {
        router: 'GetLoginLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.name,
          memo: this.memo,
          optioner: this.optioner,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      // console.log('sendStr2 ', sendStr)
      this.$pomelo.send(sendStr)
    },
    doRefreshLoginLog() {
      this.name = ''
      this.loginIp = ''
      // this.pageSize = 10
      // this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetLoginLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName, // 后面加上的
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      // console.log('sendStr3 ', sendStr)
      this.$pomelo.send(sendStr)
    },
    doReset() {
      this.name = ''
      this.loginIp = ''
      this.pageSize = 10
      this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetLoginLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName, // 后面加上的
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      // console.log('sendStr3 ', sendStr)
      this.$pomelo.send(sendStr)
    },
    handleCurrentChange(val) {
      var r = this.getSelectDate()
      // var type = this.optType
      const sendStr = {
        router: 'GetLoginLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.name,
          memo: this.memo,
          optioner: this.optioner,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage: val
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleSizeChange(val) {
      var r = this.getSelectDate()
      this.pageSize = val
      // var type = this.optType
      const sendStr = {
        router: 'GetLoginLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.name,
          memo: this.memo,
          optioner: this.optioner,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    getSelectDate() {
      var d = this.startDate
      var d1 = this.endDate
      var date1 = this.$moment(d).format('YYYY-MM-DD') + ' ' + this.$moment(this.startTime).format('HH:mm:ss')
      var date2 = this.$moment(d1).format('YYYY-MM-DD') + ' ' + this.$moment(this.endTime).format('HH:mm:ss')
      return [date1, date2]
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    },
    excelExport() {
      this.eData = {
        tHeader: ['账号', '级别', '登录位置', '登录IP', '登录时间', '备注'],
        filterVal: ['name', 'level', 'loginAddr', 'loginIp', 'loginTime', 'memo'],
        list: this.loginRecord.tableData
      }
      if (this.loginRecord.tableData === undefined) {
        return
      }
      this.$refs.excel.excleForm = true
    },
    // 选择日期按钮点击事件
    doSelectDate(n) {
      switch (n) {
        case 1:
          this.today()
          this.getLoginLog()
          break
        case 2:
          this.yesterday()
          this.getLoginLog()
          break
        case 3:
          this.theWeek()
          this.getLoginLog()
          break
        case 4:
          this.lastWeek()
          this.getLoginLog()
          break
        case 5:
          this.thisMonth()
          this.getLoginLog()
          break
        case 6:
          this.lastMonth()
          this.getLoginLog()
          break
        default:
          this.today()
          this.getLoginLog()
      }
    },
    // 昨日按钮
    yesterday() {
      var dateArr = new Date()
      dateArr.setTime(dateArr.getTime() - 24 * 60 * 60 * 1000)
      var dateArr1 = share.getDateBetween(0, '12:00:00', '今天')
      var startTime = this.$moment(dateArr).format('YYYY-MM-DD HH:mm:ss')
      // var endTime = dateArr1[0].split(' ')
      this.startDate = startTime.split(' ')[0]
      this.endDate = dateArr1[0]
    },
    // 今日
    today() {
      var dateArr = share.getDateBetween(0, '12:00:00', '今天')
      // var startTime = dateArr[0]
      var dateArr1 = new Date()
      dateArr1.setTime(dateArr1.getTime() + 24 * 60 * 60 * 1000)
      var Months = dateArr1.getMonth() + 1
      var Days = dateArr1.getDate()
      if (Months < 10) {
        Months = '0' + Months
      }
      if (Days < 10) {
        Days = '0' + Days
      }
      var endTime =
        dateArr1.getFullYear() + '-' + Months + '-' + Days
      this.startDate = dateArr[0]
      this.endDate = endTime.split(' ')[0]
    },
    // 本周
    theWeek() {
      var dateArr = share.getWeekStartAndEnd(0, new Date())
      var dateArr1 = share.getWeekStartAndEnd(1, new Date())
      // var startTime = dateArr[0]
      // var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    // 上周
    lastWeek() {
      var dateArr = share.getDateBetween(3, '12:00:00', '上周')
      var dateArr1 = share.getWeekStartAndEnd(0, new Date())
      // var startTime = dateArr[0]
      // var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    // 本月
    thisMonth() {
      var dateArr = share.getDateBetween(4, '12:00:00', '本月')
      // var startTime = dateArr[0]
      var date = new Date()
      var currentMonth = date.getMonth()
      var nextMonth = ++currentMonth
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      // var oneDay = 1000 * 60 * 60 * 24
      var endTime =
        this.$moment(new Date(nextMonthFirstDay)).format(
          'YYYY-MM-DD'
        )
      this.startDate = dateArr[0]
      this.endDate = endTime.split(' ')[0]
    },
    // 上月
    lastMonth() {
      var dateArr = share.getDateBetween(5, '12:00:00', '上月')
      var dateArr1 = share.getDateBetween(4, '12:00:00', '本月')
      // var startTime = dateArr[0]
      // var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    }
  }
}
</script>

<style scoped>
.loginRecord {
  margin: 20px;
}
.el-pagination {
  float: right;
  min-width: 200px;
}
/* .loginRecord > .head > .el-col > .el-col {
  padding: 20px 5px;
  border-right: solid 1px rgba(255, 220, 136, 0.15);
}
.loginRecord .head {
  text-align: center;
  color: #fff;
  font-size: 30px;
  margin-bottom: 50px;
} */
/* .loginRecord .head span {
  font-size: 16px;
}

.inputBox .el-input__inner {
  height: 30px !important;
}
.row-bg {
  padding-top: 0px;
  padding-left: 10px;
  height: 35px;
}
.formBtn {
  margin-top: 0px;
}
#topCar6 {
  margin-top: 25px;
  width: 100%;
  height: 80px;
  padding: 0px;
}
#box-card {
  margin-top: 5px;
  padding: 0px;
} */
</style>
