<template>
  <div class="betOrderInquire">
    <el-form :inline="true" :model="form" size="medium">
      <el-form-item label="用户名">
        <el-input
          v-model="form.account"
          placeholder="会员用户名,逗号隔开"
          style="width:280px;"
          @keyup.native="btKeyUp"
          @keydown.native="btKeyUp"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFind()">查找</el-button>
        <el-button size="medium" icon="el-icon-refresh-right" type="info" @click="doReset()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-card id="box-card">
      <el-table
        :data="betOrderInquire.tableData"
        style="width:100%; margin-top:10px"
        :header-cell-style="this.$Global.tableHeaderColor"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column property="orderId" label="序号" align="center" width="60px" />
        <el-table-column property="gameType" label="游戏" align="center" width="100px" />
        <el-table-column property="betTime" label="时间" align="center" width="100px" />
        <el-table-column property="tableNum" label="台号" align="center" width="70px" />
        <el-table-column property="cc" label="场次" align="center" />
        <el-table-column property="memberName" label="账号" align="center">
          <template slot-scope="{row}">
            <font color="blue">{{ row.memberName }}</font>
          </template>
        </el-table-column>
        <el-table-column property="betOrderInfo" label="注单详情" align="center" width="480px">
          <template slot-scope="scope">
            <el-table
              v-show="scope.row.rType!='dx' && scope.row.rType!='ssc' && scope.row.rType!='jsk3' && scope.row.rType!='bjcs'"
              style="margin:1px"
              :data="scope.row.betOrderInfo"
              border
              :header-row-style="{height:'15px'}"
              :header-cell-style="{color:'#00f',padding:0}"
              :cell-style="{padding:'0px'}"
            >
              <el-table-column v-for="item in scope.row.tablePara" :key="item.label" :label="item.label" align="center" :prop="item.prop" width="65px" />
            </el-table>
            <el-button
              v-show="scope.row.rType==='dx' || scope.row.rType==='ssc' || scope.row.rType==='jsk3' || scope.row.rType==='bjcs'"
              type="success"
              size="mini"
              class="el-button-opt"
              @click="showMxDlg(scope.row)"
            >交易明细</el-button>
          </template>
        </el-table-column>
        <el-table-column property="betMoney" label="总押" align="center" />
        <el-table-column property="aBalance" label="余额" align="center" />
        <el-table-column property="ip" label="IP" align="center" />
        <el-table-column property="terminate" label="终端" align="center" />
      </el-table>

      <el-row type="flex" align="middle" justify="end" style="padding: 20px 0;">
        <el-pagination
          :current-page="1"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="betOrderInquire.totalItemsNum"
          @current-change="handleCurrentChange"
        />
      </el-row>

      <el-dialog title="下注详情" :visible.sync="betMxDlgFrm.dialogTableVisible">
        <el-table
          v-show="mx_game!='大小' && mx_game!='时时彩' && mx_game!='江苏快3' && mx_game!='北京赛车'"
          :data="betMxDlgFrm.mx"
          border
        >
          <el-table-column v-for="item in betMxDlgFrm.arrMx" :key="item.label" :label="item.label" :prop="item.prop" />
        </el-table>
        <el-table
          v-show="mx_game==='大小'"
          :data="betMxDlgFrm.dxmx1"
          border
          style="font-size:16px"
          :header-cell-style="{align:'center',color:'#000',padding:10,background:'#f6faff'}"
        >
          <el-table-column v-for="item in betMxDlgFrm.arrMx" :key="item.label" :label="item.label" :prop="item.prop" width="63px" />
        </el-table>
        <el-table
          v-show="mx_game==='大小'"
          :data="betMxDlgFrm.dxmx2"
          border
          style="margin-top:20px;font-size:15px"
          :header-cell-style="{align:'center',color:'#000',background:'#ffffff'}"
        >
          <el-table-column property="da" label="大" />
          <el-table-column property="dan" label="单" />
          <el-table-column
            v-for="item in betMxDlgFrm.dxmx2_1"
            :key="item.label"
            :render-header="renderHeader"
            :label="item.label"
            :prop="item.label"
          />
          <el-table-column property="xiao" label="小" />
          <el-table-column property="shuang" label="双" />
        </el-table>
        <el-table
          v-show="mx_game==='大小'"
          :data="betMxDlgFrm.dxmx3"
          border
          style="margin-top:20px;font-size:15px"
          :header-cell-style="{color:'#000',padding:2,background:'#ffffff'}"
        >
          <el-table-column
            v-for="item in betMxDlgFrm.dxmx3_1"
            :key="item.label"
            :render-header="renderHeader"
            :label="item.label"
            :prop="item.label"
            width="69%"
          />
        </el-table>
        <el-table
          v-show="mx_game==='大小'"
          :data="betMxDlgFrm.dxmx4"
          border
          style="margin-top:20px;font-size:15px"
          :header-cell-style="{color:'#000',padding:2,background:'#ffffff'}"
        >
          <el-table-column
            v-for="item in betMxDlgFrm.dxmx4_1"
            :key="item.label"
            :render-header="renderHeader"
            :label="item.label"
            :prop="item.label"
            width="59%"
          />
        </el-table>
        <el-input
          v-show="mx_game==='时时彩' || mx_game==='江苏快3'|| mx_game==='北京赛车' "
          v-model="betMxDlgFrm.txtCb"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 15}"
        />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      tableNum: '',
      options: this.getTableSelectDate(),
      interval: '',
      mx_game: 'nn',
      pageSize: 10,
      findPage: 1,
      betOrderInquireFrm: {
        totalItemsNum: 1,
        tableData: [
          {
            orderId: '', // 注单号
            gameType: '',
            betTime: '2017-01-02', // 下注时间
            tableNum: '', // 台号
            cc: '22', // 铺号（场数）
            memberName: '111', // 会员名称【帐号】
            betOrderInfo: '', // 注单详情
            betMoney: 0, // 下注金额
            aBalance: 0.0, // 余额
            ip: '127.0.0.1', // ip
            terminal: 0.0 // 终端
          }
        ]
      },
      betMxDlgFrm: {
        mx: [],
        arrMx: this.getArrMx(''),
        dxmx1: [],
        dxmx2: [],
        dxmx3: [],
        dxmx4: [],
        dxmx2_1: [
          { label: 'point1' },
          { label: 'point2' },
          { label: 'point3' },
          { label: 'point4' },
          { label: 'point5' },
          { label: 'point6' }
        ],
        dxmx3_1: [
          { label: 'point2_1' },
          { label: 'point2_2' },
          { label: 'point2_3' },
          { label: 'point2_4' },
          { label: 'point2_5' },
          { label: 'point2_6' },
          { label: 'point2_7' },
          { label: 'point2_8' },
          { label: 'point2_9' },
          { label: 'point2_10' },
          { label: 'point2_11' },
          { label: 'point2_12' },
          { label: 'point2_13' }
        ],
        dxmx4_1: [
          { label: 'point2_14' },
          { label: 'point2_15' },
          { label: 'point2_16' },
          { label: 'point2_17' },
          { label: 'point2_18' },
          { label: 'point2_19' },
          { label: 'point2_20' },
          { label: 'point2_21' },
          { label: 'point2_22' },
          { label: 'point2_23' },
          { label: 'point2_24' },
          { label: 'point2_25' },
          { label: 'point2_26' },
          { label: 'point2_27' },
          { label: 'point2_28' }
        ],
        dxmx2_2: {
          da: '',
          dan: '',
          xiao: '',
          shuang: '',
          point1: '',
          point2: '',
          point3: '',
          point4: '',
          point5: '',
          point6: ''
        },
        txtCb: '',
        dialogTableVisible: false
      },
      form: {
        account: ''
      },
      rules: {
        account: {
          type: 'string',
          required: true,
          message: '必填字段',
          trigger: 'change'
        }
      }
    }
  },
  computed: {
    ...mapState({ betOrderInquire: state => state.ht.betOrderInquireForm })
    // stateDemo() {
    //   // console.log('--------->>>Frm:', this.betOrderInquireFrm);
    //   return (this.betOrderInquireFrm = this.$store.state.betOrderInquireForm);
    // }
  },
  created() {
    this.getOnTime()
    this.interval = setInterval(this.getOnTime, 10000)
  },
  // watch: {
  //   stateDemo() {
  //     //暂时用监听方式,切忌滥用
  //     // console.log('vuex变化啦')
  //   },
  // },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.interval)
    // console.log('清除定时器')
  },
  destroyed() {
    // 清除定时器
    // console.log('清除定时器')
  },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|.\/;'\\[\]·~！@#￥%……&*（）\-+={}|《》？：“”【】、；‘’。、]/g, '')
    },
    getArrMx(rType) {
      if (!rType) return []
      var obj = [
        '17',
        '16',
        '15',
        '14',
        '13',
        '12',
        '11',
        '10',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4'
      ] // 大小只有4-17用这个方法
      // var para = new Array(obj.length - 1)
      var arrMx = []
      for (var i in obj) {
        var obj2 = {}
        obj2.label = obj[i]
        obj2.prop = 'para' + i
        arrMx.push(obj2)
      }
      // console.log('---->>>arrMx:',rType,arrMx)
      return arrMx
    },
    showMxDlg(row) {
      // 显示明细详情对话框
      this.mx_game = row.rType
      var mx = row.betOrderInfo
      var frm = this.betMxDlgFrm
      var gt = this.mx_game
      this.mx_game =
        gt === 'nn'
          ? '牛牛'
          : gt === 'bjl'
            ? '百家乐'
            : gt === 'lh'
              ? '龙虎'
              : gt === 'dx'
                ? '大小'
                : gt === 'tts'
                  ? '推筒子'
                  : '炸金花'
      gt = this.mx_game
      frm.dialogTableVisible = true
      if (gt === '时时彩' || gt === '江苏快3' || gt === '北京赛车') {
        frm.dialogTableVisible = true
        this.showCbMx(gt, mx)
        return
      }
      frm.arrMx = this.getArrMx(gt) // 表头
      frm.mx = []
      frm.dxmx1 = []
      frm.dxmx2 = []
      frm.dxmx3 = []
      frm.dxmx4 = []
      var splitMx = mx[0].split('$')
      if (gt === '大小') {
        // 下注明细只有一行
        var obj1 = {
          para0: '',
          para1: '',
          para2: '',
          para3: '',
          para4: '',
          para5: '',
          para6: '',
          para7: '',
          para8: '',
          para9: '',
          para10: '',
          para11: '',
          para12: '',
          para13: '',
          para14: ''
        }
        var obj2 = {
          da: '',
          dan: '',
          point1: '',
          point2: '',
          point3: '',
          point4: '',
          point5: '',
          point6: '',
          xiao: '',
          shuang: ''
        }
        var obj3 = {
          point2_1: '',
          point2_2: '',
          point2_3: '',
          point2_4: '',
          point2_5: '',
          point2_6: '',
          point2_7: '',
          point2_8: '',
          point2_9: '',
          point2_10: '',
          point2_11: '',
          point2_12: '',
          point2_13: ''
        }
        var obj4 = {
          point2_14: '',
          point2_15: '',
          point2_16: '',
          point2_17: '',
          point2_18: '',
          point2_19: '',
          point2_20: '',
          point2_21: '',
          point2_22: '',
          point2_23: '',
          point2_24: '',
          point2_25: '',
          point2_26: '',
          point2_27: '',
          point2_28: ''
        }

        for (const j in splitMx) {
          if (splitMx[j] !== '') {
            var split2 = splitMx[j].split('^')
            var nn = split2[0]
            if (nn >= 1 && nn <= 14) {
              let r = 0 // 17-4
              for (const item in obj1) {
                if (split2[0] - 1 === r) {
                  obj1[item] = split2[1] > 0 ? split2[1] : ''
                }
                r++
              }
            }
            if (nn >= 15 && nn <= 24) {
              let r = 0 // 大所在行
              for (const item in obj2) {
                if (split2[0] - 15 === r) {
                  obj2[item] = split2[1] > 0 ? split2[1] : ''
                }
                r++
              }
            }
            if (nn >= 25 && nn <= 37) {
              let r = 0 // 三个点所在行
              for (const item in obj3) {
                if (split2[0] - 25 === r) {
                  obj3[item] = split2[1] > 0 ? split2[1] : ''
                }
                r++
              }
            }
            if (nn >= 38 && nn <= 52) {
              let r = 0 // 一二点所在行
              for (const item in obj4) {
                if (split2[0] - 38 === r) {
                  obj4[item] = split2[1] > 0 ? split2[1] : ''
                }
                r++
              }
            }
          }
        }
        frm.dxmx1.push(obj1)
        frm.dxmx2.push(obj2)
        frm.dxmx3.push(obj3)
        frm.dxmx4.push(obj4)
      }
    },
    showCbMx(gt, mx) {
      // console.log('gx,mx:',gt,mx)
      var splitMx = mx.split('$')
      var split1 = []
      var split2 = []
      var split3 = []
      var split4 = []
      // eslint-disable-next-line
      var split5 = []
      this.strCatory2 = ''
      if (gt === '时时彩') {
        split1 = ['总和大', '总和小', '总和单', '总和双', '龙', '虎', '和'] // 总和龙虎
        split2 = ['大', '小', '单', '双'] // 第 几 球
        split3 = [] // 1 - 5 球
        for (let i = 0; i <= 9; i++) split3.push(i)
        split4 = ['豹子', '顺子', '对子', '半顺', '杂六'] // 前 中 后
      }
      if (gt === '江苏快3') {
        split1 = ['1', '2', '3', '小', '4', '5', '6', '大'] // 三军
        split2 = ['111', '222', '333', '444', '555', '666'] // 围骰
        split3 = [] // 点数
        for (let i = 4; i <= 17; i++) split3.push(i + '点') // 点数
        split4 = [] // 短牌
        for (let i = 12; i <= 56; i++) split4.push(i)
        split5 = ['111', '22', '33', '44', '55', '66']
      }
      if (gt === '北京赛车') {
        split1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] // 1-10
        split2 = ['111', '222', '333', '444', '555', '666'] // 围骰
        split3 = [] // 点数
        for (let i = 4; i <= 17; i++) split3.push(i + '点') // 点数
        split4 = [] // 短牌
        for (let i = 12; i <= 56; i++) split4.push(i)
        split5 = ['111', '22', '33', '44', '55', '66']
      }
      this.betMxDlgFrm.txtCb = ''
      var strCatory = ''
      var strCatory2 = ''
      for (const j in splitMx) {
        if (splitMx[j] !== '') {
          // console.log('------------->',splitMx[j])
          var splitMx2 = splitMx[j].split('^')
          var nn = splitMx2[0]
          if (gt === '时时彩') {
            const arrX = ['前三', '中三', '后三']
            strCatory =
              nn <= 7
                ? '两面(总和龙虎)'
                : nn <= 27
                  ? '第' + (Math.floor(nn / 4) - 1) + '球'
                  : nn <= 77
                    ? '1-5球(第' + ((nn - 28) % 10) + 1 + '球)'
                    : '前中后(' + arrX[Math.floor((nn - 78) / 5)] + ')'
            strCatory2 =
              nn <= 7
                ? split1[nn - 1]
                : nn <= 27
                  ? split2[nn % 4]
                  : nn <= 77
                    ? split3[(nn + 2) % 10]
                    : split4[(nn - 78) % 5]
          }
          if (gt === '江苏快3') {
            strCatory =
              nn <= 8
                ? '三军'
                : nn <= 14
                  ? '围骰'
                  : nn <= 28
                    ? '点数'
                    : nn <= 43
                      ? '长牌'
                      : '短牌'
            strCatory2 =
              nn <= 8
                ? split1[nn - 1]
                : nn <= 14
                  ? split2[nn - 9]
                  : nn <= 28
                    ? split3[nn - 15]
                    : nn <= 43
                      ? split4[nn - 29]
                      : split4[nn - 44]
          }
          if (gt === '北京赛车') {
            strCatory = nn <= 100 ? '1-10名' : nn <= 150 ? '两面' : '冠亚军'
            strCatory2 =
              nn <= 8
                ? split1[nn - 1]
                : nn <= 14
                  ? split2[nn - 9]
                  : nn <= 28
                    ? split3[nn - 15]
                    : nn <= 43
                      ? split4[nn - 29]
                      : split4[nn - 44]
          }
          this.betMxDlgFrm.txtCb +=
            gt +
            '->' +
            strCatory +
            '-> ' +
            strCatory2 +
            '->下注:' +
            splitMx2[1] +
            '\n'
        }
      }
    },
    getTableSelectDate() {
      const data = '18,21,23,29,69,26,70,71,28,33,35,72,73,63,75,66,68,88,30' // 百家乐桌号
      const data1 = '31,32,56,57,58,59,60,61,62,65' // 龙虎桌号
      const split1 = data.split(',')
      const arr1 = []
      arr1.push({ value: '0', label: '全部' }) // 全部
      for (var i = 0; i < split1.length; i++) {
        const obj = {}
        obj.value = split1[i]
        obj.label = 'VIP' + split1[i] + '(百家乐)'
        arr1.push(obj)
      }
      const split2 = data1.split(',')
      for (let i = 0; i < split2.length; i++) {
        const obj = {}
        obj.value = split2[i]
        obj.label = 'VIP' + split2[i] + '(龙虎)'
        arr1.push(obj)
      }
      return arr1
    },
    renderHeader(h, { column, $index }) {
      return h('div', [
        h('img', {
          style: {
            width: (() => {
              // eslint-disable-next-line
              let label = String(column.label)
              return '40px'
            })()
          },
          attrs: {
            src: (function() {
              let label = String(column.label)
              label = label.slice(5)
              return 'dxd/' + label + '.png'
            })()
          }
        })
      ])
    },
    doFind() {
      this.findPage = 1
      this.getOnTime()
    },
    doReset() {
      this.form.account = ''
    },
    getOnTime() {
      const findName = this.form.account.trim()
      const sendStr = {
        router: 'getOnTimeBet',
        JsonData: {
          Id: this.$Global.optioner.Id,
          findname: findName,
          pageSize: this.pageSize,
          currentPage: this.findPage
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleCurrentChange(val) {
      this.findPage = val
      this.getOnTime()
    },
    getData(xz, rType) {
      return [{ para1: 1, para2: 2, para3: 3, para4: 4, para5: 3 }]
    },
    getTableHead(rType) {
      // console.log('getTableHead')
      if (rType === 'bjl') {
        return ['庄', '闲', '和', '庄对', '闲对']
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    }
  }
}
</script>

<style>
.betOrderInquire {
  margin: 10px;
}
/* .betOrderInquire > .head > .el-col > .el-col {
  padding: 10px 5px;
  border-right: solid 1px rgba(255, 220, 136, 0.15);
}
.betOrderInquire .head {
  text-align: center;
  color: #fff;
  font-size: 30px;
  margin-bottom: 10px;
}
.betOrderInquire .head span {
  font-size: 16px;
}

.inputBox .el-input__inner {
  height: 30px !important;
  width: 155px;
  padding: 5px;
}
.row-bg {
  padding: 1px;
  height: 15px;
}
.formBtn {
  margin-top: 0px;
}
#topCar9 {
  margin-top: 25px;
  margin-left: 1.5%;
  width: 94vw;
  height: 60px;
  padding: 10px;
}
#box-card {
  margin-top: 5px;
  padding: 0px;
} */
</style>
