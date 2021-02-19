<template>
  <div class="accountRecord">
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
        <el-input v-model="name" placeholder="用户账号" style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindAccountLog()" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="optioner" placeholder="操作员账号" style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindAccountLog()" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="optType" placeholder="全部" style="width:155px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="memo" placeholder="备注" style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFindAccountLog()">查找</el-button>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="doRefreshAccountLog()">刷新</el-button>
        <el-button size="medium" icon="el-icon-refresh-right" type="info" @click="doReload()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-card id="box-card">
      <el-form :inline="true" size="mini">
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
          :total="accountRecord.totalItemsNum"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-form>

      <el-table
        id="record"
        v-loading="loading"
        :data="accountRecord.tableData"
        :header-cell-style="this.$Global.tableHeaderColor"
        style="width:100%;margin-top:10px"
        border
        :row-class-name="tableRowClassName"
        :summary-method="getSummaries1"
        show-summary
      >
        <el-table-column property="id" fixed label="记录ID" align="center" />
        <el-table-column property="name" fixed label="账号" align="center" />
        <el-table-column property="nikename" label="用户名称" align="center" />
        <el-table-column property="level" label="级别" align="center" width="50px">
          <template slot-scope="{row}">
            <span>{{ (row.level === 2 || row.level === 1) ? '代理' : '会员' }}</span>
          </template>
        </el-table-column>
        <el-table-column property="type" label="类型" align="center" width="100px">
          <template slot-scope="scope">
            <span v-show="scope.row.type==='取出下线' || scope.row.type === '线上取款' ">
              <font color="red">{{ scope.row.type }}</font>
            </span>
            <span v-show="scope.row.type==='存入下线'|| scope.row.type==='洗码存入' || scope.row.type === '线上充值' ">{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column property="tradeMoney" label="交易金额" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.type==='取出下线' || scope.row.type === '线上取款' ">
              <font color="red">{{ scope.row.tradeMoney }}</font>
            </span>
            <span v-show="scope.row.type==='存入下线' || scope.row.type==='洗码存入' || scope.row.type === '线上充值'">{{ scope.row.tradeMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column property="money" label="总金额" align="center" />
        <el-table-column property="optionIp" label="操作IP" align="center" width="140px" />
        <el-table-column property="optioners" label="操作员" align="center" />
        <el-table-column property="optionTime" label="操作时间" align="center" width="185px" />
        <el-table-column property="memo" label="备注" align="center" width="600px" />
      </el-table>
      <el-pagination
        v-if="pageSize !== 10"
        :current-page="1"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, prev, pager, next, sizes"
        :total="accountRecord.totalItemsNum"
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
      optioner: '',
      optType: '全部',
      pageSize: 10,
      loading: false,
      options: [
        {
          value: '1',
          label: '全部'
        },
        {
          value: '2',
          label: '存入下线'
        },
        {
          value: '3',
          label: '取出下线'
        },
        {
          value: '4',
          label: '线上充值'
        },
        {
          value: '5',
          label: '线上取款'
        }
      ],
      accountRecordFrm: {
        totalItemsNum: 1,
        tradeMoney: 0,
        totalMoney: 0,
        tableData: [
          {
            id: '11', // 记录ID
            name: '11112222', // 账号
            nikename: '0.00', // 用户名称
            level: '0.00', // 级别
            type: '', // 类型
            tradeMoney: 0, // 交易金额
            money: '', // 总金额
            optionIp: '127.0.0.1', // 操作IP
            optioners: '', // 操作员
            optionTime: '', // 操作时间
            memo: '' // 备注
          }
        ]
      },
      form: {
        account: '',
        nickname: ''
      },
      rules: {
        // account: {type: 'string', required: true, message: '必填字段', trigger: 'change'},
        // nickname: {type: 'string', required: true, message: '必填字段', trigger: 'change'}
      },
      // eslint-disable-next-line
      eData: {}
    }
  },
  computed: {
    ...mapState({ accountRecord: state => state.ht.accountRecordForm })
  },
  // watch: {
  //   stateDemo() {
  //     //暂时用监听方式,切忌滥用
  //     // console.log('vuex变化啦')
  //   }
  // },
  created() {
    this.doSelectDate(1)
    this.getParams()
  },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    doFindAccountLog() {
      var type = this.optType
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.name,
          memo: this.memo,
          type: type === 2 ? '存入下线' : type === 3 ? '取出下线' : type === 4 ? '线上充值' : type === 5 ? '线上取款' : '', // 线上充值 、 线上取款
          optioner: this.optioner,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      // console.log(sendStr)
      this.loading = true
      this.$pomelo.send(sendStr)
    },
    doRefreshAccountLog() {
      this.loading = true
      this.memo = ''
      this.name = ''
      this.optioner = ''
      // this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountLog',
        JsonData: {
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$pomelo.send(sendStr)
      this.optType = '全部'
    },
    doReload() {
      this.loading = true
      this.memo = ''
      this.name = ''
      this.optioner = ''
      this.pageSize = 10
      this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountLog',
        JsonData: {
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$pomelo.send(sendStr)
      this.optType = '全部'
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.query
      if (routerParams.name !== undefined) {
        this.name = routerParams.name
        this.doFindAccountLog()
      } else if (routerParams.opt_name !== undefined) {
        this.optioner = routerParams.opt_name
        this.doFindAccountLog()
      } else {
        this.loading = true
        var r = this.getSelectDate()
        const sendStr = {
          router: 'GetAccountLog',
          JsonData: {
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
    getSummaries1(param) {
      // 直属代理统计
      const sums = []
      // eslint-disable-next-line
      const { columns, data } = param
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '所有统计:'
          return
        }
        this.loading = false
        // console.log('column.property:',column.property,this.accountRecordFrm.tradeMoney,this.accountRecordFrm.totalMoney,index);
        switch (column.property) {
          case 'tradeMoney':
            sums[index] = this.accountRecord.tradeMoney
            break
          case 'money':
            sums[index] = this.accountRecord.totalMoney
            break
        }
      })
      return sums
    },
    handleCurrentChange(val) {
      var type = this.optType
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.name,
          memo: this.memo,
          type: type === 2 ? '存入下线' : type === 3 ? '取出下线' : '',
          optioner: this.optioner,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage: val
        }
      }
      this.loading = true
      this.$pomelo.send(sendStr)
    },
    handleSizeChange(val) {
      var type = this.optType
      this.pageSize = val
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetAccountLog',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.name,
          memo: this.memo,
          type: type === 2 ? '存入下线' : type === 3 ? '取出下线' : '',
          optioner: this.optioner,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.loading = true
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
        tHeader: ['记录ID', '账号', '用户名称', '级别', '类型', '交易金额', '总金额', '操作IP', '操作员', '操作时间', '备注'],
        filterVal: ['id', 'name', 'nickname', 'level', 'type', 'tradeMoney', 'money', 'optionIp', 'optioners', 'optionTime', 'memo'],
        list: this.accountRecord.tableData
      }
      if (this.accountRecord.tableData === undefined) {
        return
      }
      this.$refs.excel.excleForm = true
    },
    // 选择日期按钮点击事件
    doSelectDate(n) {
      switch (n) {
        case 1:
          this.today()
          this.doFindAccountLog()
          break
        case 2:
          this.yesterday()
          this.doFindAccountLog()
          break
        case 3:
          this.theWeek()
          this.doFindAccountLog()
          break
        case 4:
          this.lastWeek()
          this.doFindAccountLog()
          break
        case 5:
          this.thisMonth()
          this.doFindAccountLog()
          break
        case 6:
          this.lastMonth()
          this.doFindAccountLog()
          break
        default:
          this.today()
          this.doFindAccountLog()
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
.accountRecord {
  margin: 20px;
}
.el-pagination {
  float: right;
  min-width: 200px;
}
/* .accountRecord > .head > .el-col > .el-col {
  padding: 20px 5px;
  border-right: solid 1px rgba(255, 220, 136, 0.15);
}
.accountRecord .head {
  text-align: center;
  color: #fff;
  font-size: 30px;
  margin-bottom: 50px;
}
.accountRecord .head span {
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
