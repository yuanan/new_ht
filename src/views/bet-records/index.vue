<template>
  <div class="memberTrade">
    <el-form ref="form" :inline="true" :model="form" size="medium">
      <el-form-item label="起始日">
        <el-date-picker v-model="startDate" type="date" style="width:140px" />
        <el-time-picker v-model="startTime" arrow-control style="width:120px" />
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker v-model="endDate" type="date" style="width:140px" />
        <el-time-picker v-model="endTime" arrow-control style="width:120px" />
      </el-form-item>
      <el-form-item prop="ID">
        <el-input v-model="form.Id" placeholder="会员ID" clearable style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFind()" />
      </el-form-item>
      <el-form-item prop="account">
        <el-input v-model="form.account" placeholder="账号" clearable style="width:150px" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFind()" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="gameTypeValue" style="width:155px"> <!-- :change="doFind()"-->
          <el-option v-for="item in gameTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="cc">
        <el-input v-model="form.cc" placeholder="靴号" clearable style="width:150px" @keydown.enter.native="doFind()" />
      </el-form-item>
      <el-form-item prop="teskNum">
        <el-input v-model="form.teskNum" placeholder="台号" clearable style="width:150px" @keydown.enter.native="doFind()" />
      </el-form-item>
      <el-form-item prop="jc">
        <el-input v-model="form.jc" placeholder="场次" clearable style="width:150px" @keydonw.enter.native="doFind()" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFind()">查找</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="doRefresh()">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh-right" type="info" @click="doReset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-button size="small" type="warning" style="margin-bottom: 10px" @click="doSelectDate(1)">今日</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(2)">昨日</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(3)">本期</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(4)">上期</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(5)">本月</el-button>
      <el-button size="small" type="warning" @click="doSelectDate(6)">上月</el-button>
      <!-- <el-button size="small" icon="el-icon-document" style="margin-bottom: 10px" @click="excelExport()">导出</el-button> -->

      <el-checkbox v-model="showTable.memberId" class="filter-item" style="margin-left:15px; color: #FF5722" @change="tableKey=tableKey+1">
        会员ID
      </el-checkbox>
      <el-checkbox v-model="showTable.balanceMemo" class="filter-item" style="color: #FF5722" @change="tableKey=tableKey+1">
        余额备注
      </el-checkbox>
      <el-checkbox v-model="showTable.ip" class="filter-item" style="margin-left: -5px; color: #FF5722" @change="tableKey=tableKey+1">
        投注IP
      </el-checkbox>
      <el-pagination
        :current-page="1"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, prev, pager, next, sizes"
        :total="memberTrade.totalItemsNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />

      <el-dialog title="下注详情" :visible.sync="betMxDlgFrm.dialogTableVisible">
        <el-table
          v-show="mx_game === '大小'"
          :data="betMxDlgFrm.dxmx1"
          border
          style="font-size:16px"
          :header-cell-style="{ align:'center',color:'#000',padding:10,background:'#f6faff' }"
        >
          <el-table-column
            v-for="item in betMxDlgFrm.arrMx"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            width="63px"
          />
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
            :prop="item.label"
            :label="item.label"
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
          v-show="mx_game==='时时彩' || mx_game==='江苏快3' || mx_game==='北京赛车' "
          v-model="betMxDlgFrm.txtCb"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 15}"
        />
      </el-dialog>

      <el-table
        v-loading="loading"
        :data="memberTrade.tableData"
        :header-cell-style="this.$Global.tableHeaderColor"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column v-if="showTable.memberId" property="memberId" fixed label="会员ID" width="70" />
        <el-table-column property="memberAccount" fixed label="帐号" width="90">
          <template slot-scope="scope">
            <span v-show="scope.row.win < 0">
              <font color="red">{{ scope.row.memberAccount }}</font>
            </span>
            <span v-show="scope.row.win>=0">{{ scope.row.memberAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column property="game" label="游戏" align="left" width="70">
          <template slot-scope="{row}">
            <font v-if="row.game === '百家乐'" color="#2962FF">{{ row.game }}</font>
            <font v-if="row.game === '龙虎'" color="#00C853">{{ row.game }}</font>
            <font v-if="row.game === '牛牛'" color="#FF5722">{{ row.game }}</font>
            <font v-if="row.game === '炸金花'" color="#CDDC39">{{ row.game }}</font>
            <font v-if="row.game === '大小'" color="#212121">{{ row.game }}</font>
            <font v-if="row.game === '推筒子'" color="#795548">{{ row.game }}</font>
          </template>
        </el-table-column>
        <el-table-column property="teskNum" label="台号" align="left" />
        <el-table-column property="cc" label="场次" align="left" width="90" />
        <el-table-column property="sTime" label="时间" align="left" width="100" />
        <el-table-column property="result" label="结果" align="center" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.rType === 'nn'">
              <div v-if="scope.row.niuniuResult">
                <div style="color: #FF1744">庄:{{ scope.row.niuniuResult[0] || "" }}</div>
                <div style="color: #448AFF">闲一:{{ scope.row.niuniuResult[1] || "" }}</div>
                <div style="color: #1565C0">闲二:{{ scope.row.niuniuResult[2] || "" }}</div>
                <div style="color: #0D47A1">闲三:{{ scope.row.niuniuResult[3] || "" }}</div>
              </div>
              <div v-else>{{ scope.row.result }}</div>
            </div>
            <div v-else>{{ scope.row.result }}</div>
          </template>
        </el-table-column>
        <el-table-column property="betOrderInfo" label="注单详情" align="center" width="248">
          <template slot-scope="scope">
            <el-table
              v-show=" scope.row.rType!='dx' && scope.row.rType != 'ssc' && scope.row.rType != 'jsk3' && scope.row.rType != 'bjcs' && scope.row.memberId != '统计:' && scope.row.memberId != '所有统计:'&& scope.row.rType != 'nn' "
              :data="scope.row.betOrderInfo"
              style="margin:1px"
              border
              :header-row-style="{height:'15px'}"
              empty-text=" "
              :header-cell-style="{color:'#00f',padding:0}"
              :cell-style="{padding:'0px'}"
            >
              <el-table-column
                v-for="item in scope.row.tablePara"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                align="center"
                :width="item.width"
              />
            </el-table>
            <el-button
              v-show="scope.row.rType === 'dx' || scope.row.rType === 'ssc' || scope.row.rType === 'jsk3' || scope.row.rType === 'bjcs'"
              size="mini"
              type="success"
              class="el-button-opt"
              @click="showMxDlg(scope.row)"
            >交易明细</el-button>
            <div v-show="scope.row.rType === 'nn'" class="nn_info">
              <span v-if="scope.row.niuniuResult" style="position: absolute; left: 5px; top: 5px;">
                <el-popover
                  placement="top-start"
                  title="结果参照"
                  width="200"
                  trigger="hover"
                  :content="`第一门 = ${scope.row.result.split('|')[0]}; 第二门 = ${scope.row.result.split('|')[1]}; 第三门 = ${scope.row.result.split('|')[2]}`"
                >
                  <el-button slot="reference" icon="el-icon-question" circle size="mini" />
                </el-popover>
              </span>
              <div>
                <span v-for="(n, index) in scope.row.niuniu" :key="index" class="nn_info_container">
                  <p class="nn_info_title">{{ n }}
                    <!-- <span style="color: #000">：</span> -->
                  </p>
                </span>
              </div>
              <div>
                <span v-for="(n, i) in scope.row.niuniuBet" :key="i" class="nn_info_container">
                  <p class="nn_info_bet_show">{{ n }}</p>
                </span>
              </div>
              <div v-if="scope.row.niuniuResult" style="margin-left: 5px;">
                <span v-for="(n, i) in scope.row.nnWinLose" :key="i" class="nn_info_container">
                  <span v-if="n === '输'" class="nn_info_bet_show" style="color: #FF1744">{{ n }}</span>
                  <span v-else class="nn_info_bet_show" style="color: #00C853">{{ n }}</span>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="totalBet" label="总投注" align="left" />
        <el-table-column property="win" label="盈利" align="left">
          <template slot-scope="scope">
            <span v-show="scope.row.win < 0">
              <font color="red">{{ scope.row.win }}</font>
            </span>
            <span v-show="scope.row.win>=0">{{ scope.row.win }}</span>
          </template>
        </el-table-column>
        <el-table-column property="xml" label="洗码量(单/双)" align="left" />
        <el-table-column property="xmKind" label="洗码类型" align="left" width="80">
          <template slot-scope="{row}">
            <font v-if="row.xmKind === '双边'" color="#1E88E5">{{ row.xmKind }}</font>
            <font v-else color="#FB8C00">{{ row.xmKind }}</font>
          </template>
        </el-table-column>
        <el-table-column property="validBet" label="有效投注" align="left" />
        <el-table-column property="balance" label="余额" align="left" />
        <el-table-column v-if="showTable.balanceMemo" property="balanceMemo" label="余额备注" align="left" width="180" />
        <el-table-column v-if="showTable.ip" property="ip" label="投注IP" align="left" />
        <el-table-column property="terminal" label="终端" align="left" width="75" />
      </el-table>

      <el-pagination
        v-if="pageSize !== 10"
        :current-page="1"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, prev, pager, next, sizes"
        :total="memberTrade.totalItemsNum"
        style="margin-top: 10px"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- eslint-disable-next-line -->
    <!-- <ExportExcel ref="excel" :eData="eData" /> -->

    <!-- you can add element-ui's tooltip -->
    <el-tooltip placement="top" :content="$t('action.backToTop')">
      <back-to-top :custom-style="this.$Global.myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import share from '@/api/share'
import BackToTop from '@/components/BackToTop'
// import ExportExcel from '@/components/ExportExcel'
export default {
  components: {
    // ExportExcel,
    BackToTop
  },
  data() {
    return {
      pageSize: 10,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(2019, 9, 10, 12, 0, 0),
      endTime: new Date(2019, 9, 10, 12, 0, 0),
      gameTypeValue: '全部',
      mx_game: 'nn',
      tradeBetMx: '',
      loading: false,
      pointPic: ['static/ss/1_1.png', 'static/ss/1_2.png', 'static/ss/1_3.png'],

      gameTypeOptions: [
        { value: 'all', label: '全部' },
        { value: 'bjl', label: '百家乐' },
        { value: 'lh', label: '龙虎' },
        { value: 'nn', label: '牛牛' },
        { value: 'xjh', label: '炸金花' },
        { value: 'dx', label: '大小' },
        { value: 'tts', label: '推筒子' },
        { value: 'ssc', label: '时时彩' },
        { value: 'jsk3', label: '江苏快3' },
        { value: 'bjcs', label: '北京赛车' }
      ],
      tableKey: 0,
      showTable: {
        memberId: true,
        balanceMemo: false,
        ip: false
      },
      memberTradeFrm: {
        totalItemsNum: 0,
        tableData: [],
        state: 0,
        showGame: '',
        betOrderInfo: ''
      },
      betMxDlgFrm: {
        mx: [],
        arrMx: this.getArrMx(),
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
        account: '',
        Id: '',
        cc: '',
        jc: '',
        teskNum: ''
      }
      // eslint-disable-next-line
      // eData: {}
    }
  },
  computed: {
    ...mapState({ memberTrade: state => state.ht.memberTradeForm })
    // stateDemo() {
    //   // eslint-disable-next-line
    //   this.tradeBetMx = this.$store.state.ht.tradeBetMx
    //   this.memberTrade = this.$store.state.ht.memberTradeForm
    //   console.log('this.member', this.memberTrade)
    //   // eslint-disable-next-line
    //   this.memberTrade.state = this.$store.state.ht.memberTradeForm.state
    //   // console.log('memberTradeData : ', this.memberTradeFrm)
    //   // eslint-disable-next-line
    //   if (this.memberTrade.state === 1) this.loading = false
    //   return this.tradeBetMx
    // }
  },
  created() {
    this.doSelectDate(1)
    this.$store.commit('ht/setMemberTradeForm', { state: 0 })
    this.getParams()
  },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    // eslint-disable-next-line
    getTradeMx(index, row) {
      // console.log('index ', index)
      this.tradeBetMx = ''
      this.$store.commit('ht/setTradeBetMx', this.tradeBetMx) // 改变数据
      this.$store.commit('ht/setMemberTradeForm', { state: 0 })
      this.mx_game = row.game
      const sendStr = {
        router: 'GetTradeMx',
        JsonData: { bh: row.bh, date: row.sTime }
      }
      this.$pomelo.send(sendStr)
      // this.loading = true
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
      var splitMx = mx[0].split('$') // zike change (origin code => var splitMx = mx.split('$'))
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
      //  console.log('txtCb:',this.txtCb);
    },
    renderHeader(h, { column, $index }) {
      return h('div', [
        h('img', {
          style: {
            width: (function() {
              // let label = String(column.label)
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
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.form.account || '',
          findId: this.form.Id || '',
          // ip: this.form.IP,
          teskNum: this.form.teskNum || '',
          jc: this.form.jc || '',
          cc: this.form.cc || '',
          gameType: this.gameTypeValue === '全部' ? 'all' : this.gameTypeValue,
          startTime: r[0],
          endTime: r[1],
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      // console.log(sendStr)
      this.$store.commit('ht/setMemberTradeForm', { state: 0 })
      this.$pomelo.send(sendStr)
      // this.loading = true
    },
    doRefresh() {
      this.form.account = ''
      this.form.Id = ''
      this.form.jc = ''
      this.form.cc = ''
      this.form.teskNum = ''
      // this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          Id: this.$Global.optioner.Id,
          opt_name: this.$Global.optioner.UserName,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$store.commit('ht/setMemberTradeForm', { state: 0 })
      this.$pomelo.send(sendStr)
      // this.loading = true
      this.gameTypeValue = 'all'
    },
    doReset() {
      this.form.account = ''
      this.form.Id = ''
      this.form.jc = ''
      this.form.cc = ''
      this.form.teskNum = ''
      this.pageSize = 10
      this.doSelectDate(1)
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          Id: this.$Global.optioner.Id,
          opt_name: this.$Global.optioner.UserName,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$store.commit('ht/setMemberTradeForm', { state: 0 })
      this.$pomelo.send(sendStr)
      // this.loading = true
      this.gameTypeValue = 'all'
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.query
      if (routerParams.name !== undefined) {
        this.form.account = routerParams.name
        if (routerParams.startTime !== undefined) {
          this.startDate = new Date(routerParams.startTime)
          this.endDate = new Date(routerParams.endTime)
          this.startTime = new Date(routerParams.startTime)
          this.endTime = new Date(routerParams.endTime)
        }
        this.doFind()
      } else {
        console.log('hahahahahahah')
        var r = this.getSelectDate()
        const sendStr = {
          router: 'GetMemberTrade',
          JsonData: {
            Id: this.$Global.optioner.Id,
            opt_name: this.$Global.optioner.UserName,
            pageSize: this.pageSize,
            currentPage: 1,
            startTime: r[0],
            endTime: r[1]
          }
        }
        this.$store.commit('ht/setMemberTradeForm', { state: 0 })
        // this.loading = true
        this.$pomelo.send(sendStr)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    },
    // excelExport() {
    //   this.eData = {
    //     tHeader: ['记录ID', '账号', '用户名称', '级别', '类型', '交易金额', '总金额', '操作IP', '操作员', '操作时间', '备注'],
    //     filterVal: ['id', 'name', 'nickname', 'level', 'type', 'tradeMoney', 'money', 'optionIp', 'optioners', 'optionTime', 'memo'],
    //     list: this.accountRecord.tableData
    //   }
    //   this.$refs.excel.excleForm = true
    // },
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
          this.doFind()
          break
        case 2:
          this.yesterday()
          this.doFind()
          break
        case 3:
          this.theWeek()
          this.doFind()
          break
        case 4:
          this.lastWeek()
          this.doFind()
          break
        case 5:
          this.thisMonth()
          this.doFind()
          break
        case 6:
          this.lastMonth()
          this.doFind()
          break
        default:
          this.today()
          this.doFind()
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
    },
    handleCurrentChange(val) {
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          Id: this.$Global.optioner.Id,
          opt_name: this.$Global.optioner.UserName,
          name: this.form.account || '',
          findId: this.form.Id || '',
          teskNum: this.form.teskNum || '',
          jc: this.form.jc || '',
          cc: this.form.cc || '',
          gameType: this.gameTypeValue === '全部' ? 'all' : this.gameTypeValue,
          pageSize: this.pageSize,
          currentPage: val,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$store.commit('ht/setMemberTradeForm', { state: 0 })
      // this.loading = true
      this.$pomelo.send(sendStr)
    },
    handleSizeChange(val) {
      this.pageSize = val
      var r = this.getSelectDate()
      const sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          Id: this.$Global.optioner.Id,
          opt_name: this.$Global.optioner.UserName,
          name: this.form.account,
          findId: this.form.Id,
          teskNum: this.form.teskNum,
          jc: this.form.jc,
          cc: this.form.cc,
          gameType: this.gameTypeValue === '全部' ? 'all' : this.gameTypeValue,
          pageSize: this.pageSize,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$store.commit('ht/setMemberTradeForm', { state: 0 })
      // this.loading = true
      console.log('send ', sendStr)
      this.$pomelo.send(sendStr)
    }
  }
}
</script>

<style scoped>
.memberTrade {
  margin: 20px;
}
.el-pagination {
  float: right;
  min-width: 200px;
}
/* .memberTrade > .head > .el-col > .el-col {
  padding: 20px 0;
  border-right: solid 1px rgba(255, 220, 136, 0.15);
}
.memberTrade .head {
  text-align: center;
  color: #fff;
  font-size: 30px;
  margin-bottom: 50px;
}
.memberTrade .head span {
  font-size: 16px;
}
.inputBox .el-input__inner {
  height: 30px !important;
}
.el-button-opt {
  width: 60px;
  height: 25px;
  padding: 1px;
  margin: 1px;
}
.row-bg {
  padding: 1px;
  height: 40px;
}
#topCar3 {
  width: 100%;
  height: 50px;
} */

.nn_info{
  display: flex;
  justify-content: flex-start;
  padding-left: 25%;
  /* max-height: 110px;
  overflow-y: scroll;
  cursor: n-resize; */
}
.nn_info_container{
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}
.nn_info_title{
  width: auto;
  height: 20px;
  padding: 2px;
  color: blue;
  font-weight: 700;
  margin: 3px;
}
.nn_info_bet_show{
  width: auto; height: 20px; padding: 2px; margin: 3px;
}
</style>
