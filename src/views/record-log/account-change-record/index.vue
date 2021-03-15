<template>
  <div class="accountChangeRecord">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="medium">
      <el-form-item label="起始日">
        <el-date-picker v-model="startDate" type="date" placeholder="选择日期" style="width:140px" />
        <el-time-picker v-model="startTime" arrow-control placeholder="选择时间点" style="width:120px" />
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker v-model="endDate" type="date" placeholder="选择日期" style="width:140px" />
        <el-time-picker v-model="endTime" arrow-control placeholder="选择时间点" style="width:120px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="name" placeholder="用户账号" class="inputBox" style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindAccountChangeLog()" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="optioner" placeholder="操作员账号" class="inputBox" style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindAccountChangeLog()" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="memo" placeholder="备注" class="inputBox" style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindAccountChangeLog()" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFindAccountChangeLog()">查找</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh" type="info" @click="doRefresh()">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="doReset()">重置</el-button>
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
          :total="accountChangeRecord.totalItemsNum"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-form>

      <el-table
        :data="accountChangeRecord.tableData"
        style="width:100%;margin-top:10px"
        :header-cell-style="this.$Global.tableHeaderColor"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column property="name" label="账号" align="center" width="150" />
        <el-table-column property="nikename" label="用户名称" align="center" width="140" />
        <el-table-column property="level" label="级别" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ (row.level === 2 || row.level === 1) ? '代理' : '会员' }}</span>
          </template>
        </el-table-column>
        <el-table-column property="optionIp" label="操作IP" align="center" width="150px" />
        <el-table-column property="optioner" label="操作员" align="center" width="120px" />
        <el-table-column property="optionTime" label="操作时间" align="center" width="170px" />
        <el-table-column property="memo" label="备注" align="center" min-width="400" />
      </el-table>

      <el-pagination
        v-if="pageSize !== 10"
        :current-page="1"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, prev, pager, next, sizes"
        :total="accountChangeRecord.totalItemsNum"
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
      totalItemsNum: 1,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(2019, 9, 10, 12, 0, 0),
      endTime: new Date(2019, 9, 10, 12, 0, 0),
      memo: '',
      name: '',
      optioner: '',
      pageSize: 10,
      accountChangeRecordFrm: {
        tableData: [
          {
            name: '11112222', // 账号
            nikename: '', // 用户名称
            level: '1', // 级别
            optionIp: '127.0.0.1', // 登录IP
            optioner: '', // 操作员
            optionTime: '', // 操作时间
            memo: '' // 备注
          }
        ]
      },
      form: {
        name: ''
      },
      rules: {
        // account: {type: 'string', required: true, message: '必填字段', trigger: 'change'},
        // nickname: {type: 'string', required: true, message: '必填字段', trigger: 'change'},
      },
      // eslint-disable-next-line
      eData: {}
    }
  },
  computed: {
    ...mapState({ accountChangeRecord: state => state.ht.accountChangeRecordForm })
  },
  created() {
    this.doSelectDate(1)
    this.getParams()
  },
  // watch: {
  //   stateDemo() {
  //     //暂时用监听方式,切忌滥用
  //     // console.log('vuex变化啦')
  //   }
  // },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    doFindAccountChangeLog() {
      // var type = this.optType
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountChangeLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.name,
          optioner: this.optioner,
          startTime: r[0],
          endTime: r[1],
          memo: this.memo,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.loading = true
      this.$pomelo.send(sendStr)
    },
    handleCurrentChange(val) {
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountChangeLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName, // 后面加的
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: val,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.loading = true
      this.$pomelo.send(sendStr)
    },
    handleSizeChange(val) {
      this.pageSize = val
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountChangeLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName, // 后面加的
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.loading = true
      this.$pomelo.send(sendStr)
    },
    doRefresh() {
      this.name = ''
      this.optioner = ''
      this.memo = ''
      // this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountChangeLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName, // 后面加的
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$pomelo.send(sendStr)
    },
    doReset() {
      this.name = ''
      this.optioner = ''
      this.memo = ''
      this.pageSize = 10
      this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountChangeLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName, // 后面加的
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$pomelo.send(sendStr)
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.query
      if (routerParams.name !== undefined) {
        this.name = routerParams.name
        this.doFindAccountChangeLog()
      } else if (routerParams.opt_name !== undefined) {
        this.optioner = routerParams.opt_name
        this.doFindAccountChangeLog()
      } else {
        var r = this.getSelectDate()
        const sendStr = {
          router: 'GetAccountChangeLog',
          JsonData: {
            opt_name: this.$Global.optioner.UserName, // 后面加的
            Id: this.$Global.optioner.Id,
            pageSize: this.pageSize,
            currentPage: 1,
            startTime: r[0],
            endTime: r[1]
          }
        }
        this.$pomelo.send(sendStr)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    },
    excelExport() {
      this.eData = {
        tHeader: ['账号', '用户名称', '级别', '操作IP', '操作员', '操作时间', '备注'],
        filterVal: ['name', 'nikename', 'level', 'optionIp', 'optioner', 'optionTime', 'memo'],
        list: this.accountChangeRecord.tableData
      }
      if (this.accountChangeRecord.tableData === undefined) {
        return
      }
      this.$refs.excel.excleForm = true
    },
    getSelectDate() {
      var d = this.startDate
      var d1 = this.endDate
      var date1 = this.$moment(d).format('YYYY-MM-DD') + ' ' + this.$moment(this.startTime).format('HH:mm:ss')
      var date2 = this.$moment(d1).format('YYYY-MM-DD') + ' ' + this.$moment(this.endTime).format('HH:mm:ss')
      return [date1, date2]
    },
    // 选择日期按钮点击事件
    doSelectDate(n) {
      switch (n) {
        case 1:
          this.today()
          this.doFindAccountChangeLog()
          break
        case 2:
          this.yesterday()
          this.doFindAccountChangeLog()
          break
        case 3:
          this.theWeek()
          this.doFindAccountChangeLog()
          break
        case 4:
          this.lastWeek()
          this.doFindAccountChangeLog()
          break
        case 5:
          this.thisMonth()
          this.doFindAccountChangeLog()
          break
        case 6:
          this.lastMonth()
          this.doFindAccountChangeLog()
          break
        default:
          this.today()
          this.doFindAccountChangeLog()
      }
    },
    // 昨日按钮
    yesterday() {
      // var dateArr = share.getDateBetween(1, '12:00:00', '昨天')
      // var dateArr1 = share.getDateBetween(0, '12:00:00', '今天')
      // var startTime = dateArr[0]
      // var endTime = dateArr1[0].split(' ')
      // this.startDate = dateArr[0]
      // this.endDate = dateArr1[0].split(' ')[0]
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
.accountChangeRecord {
  margin: 20px;
}
.el-pagination {
  float: right;
  min-width: 200px;
}
</style>
