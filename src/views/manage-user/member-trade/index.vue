<template>
  <div class="memberTrade">
    <el-card id="topCar3" :body-style="{padding: '5px'}" style="height:130px">
      <el-form ref="form" :inline="true" :model="form" label-width="90px" size="mini">
        <el-row type="flex" class="row-bg">
          <el-col :span="7">
            <el-form-item label="开始时间">
              <el-date-picker v-model="startDate" type="date" style="width:130px" />
              <el-time-picker arrow-control v-model="startTime" style="width:120px" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="结束时间">
              <el-date-picker v-model="endDate" type="date" style="width:130px" />
              <el-time-picker arrow-control v-model="endTime" style="width:120px" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="游戏类型">
              <el-select v-model="gameTypeValue" style="width:155px">
                <el-option
                  v-for="item in gameTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="靴号" prop="cc">
              <el-input v-model="form.cc" class="inputBox" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="7">
            <el-form-item label="会员帐号" prop="account">
              <el-input v-model="form.account" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="用户Id" prop="用户Id">
              <el-input v-model="form.Id" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="台号" prop="teskNum">
              <el-input v-model="form.teskNum" class="inputBox" />
            </el-form-item>
            <el-form-item label="场次" prop="jc">
              <el-input v-model="form.jc" class="inputBox" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :inline="true" size="mini" class="formBtn">
        <el-row type="flex" class="row-bg">
          <el-col :span="15">
            <el-form-item>
              <el-button size="small" type="warning" @click="doSelectDate(1)">今日</el-button>
              <el-button size="small" type="warning" @click="doSelectDate(2)">昨日</el-button>
              <el-button size="small" type="warning" @click="doSelectDate(3)">本期</el-button>
              <el-button size="small" type="warning" @click="doSelectDate(4)">上期</el-button>
              <el-button size="small" type="warning" @click="doSelectDate(5)">本月</el-button>
              <el-button size="small" type="warning" @click="doSelectDate(6)">上月</el-button>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <el-button size="small" type="primary" @click="doFind()">查找</el-button>
              <el-button size="small" type="primary" @click="doRefresh()">刷新</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-dialog title="下注详情" :visible.sync="betMxDlgFrm.dialogTableVisible">
      <el-table
        :data="betMxDlgFrm.dxmx1"
        border
        v-show="this.mx_game=='大小'"
        style="font-size:16px"
        :header-cell-style="{ align:'center',color:'#000',padding:10,background:'#f6faff' }"
      >
        <el-table-column
          :label="item.label"
          :key="item.label"
          :prop="item.prop"
          v-for="item in betMxDlgFrm.arrMx"
          width="63px"
        ></el-table-column>
      </el-table>
      <el-table
        :data="betMxDlgFrm.dxmx2"
        border
        v-show="this.mx_game=='大小'"
        style="margin-top:20px;font-size:15px"
        :header-cell-style="{align:'center',color:'#000',background:'#ffffff'}"
      >
        <el-table-column property="da" label="大"></el-table-column>
        <el-table-column property="dan" label="单"></el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :label="item.label"
          :key="item.label"
          :prop="item.label"
          v-for="item in betMxDlgFrm.dxmx2_1"
        ></el-table-column>
        <el-table-column property="xiao" label="小"></el-table-column>
        <el-table-column property="shuang" label="双"></el-table-column>
      </el-table>
      <el-table
        :data="betMxDlgFrm.dxmx3"
        border
        v-show="this.mx_game=='大小'"
        style="margin-top:20px;font-size:15px"
        :header-cell-style="{color:'#000',padding:2,background:'#ffffff'}"
      >
        <el-table-column
          :render-header="renderHeader"
          :label="item.label"
          :key="item.label"
          :prop="item.label"
          v-for="item in betMxDlgFrm.dxmx3_1"
          width="69%"
        ></el-table-column>
      </el-table>
      <el-table
        :data="betMxDlgFrm.dxmx4"
        border
        v-show="this.mx_game=='大小'"
        style="margin-top:20px;font-size:15px"
        :header-cell-style="{color:'#000',padding:2,background:'#ffffff'}"
      >
        <el-table-column
          :render-header="renderHeader"
          :label="item.label"
          :key="item.label"
          :prop="item.label"
          v-for="item in betMxDlgFrm.dxmx4_1"
          width="59%"
        ></el-table-column>
      </el-table>
      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 15}"
        v-show="this.mx_game=='时时彩' || this.mx_game=='江苏快3'|| this.mx_game=='北京赛车' "
        v-model="betMxDlgFrm.txtCb"
      />
    </el-dialog>
    <br />
    <el-table
      :data="memberTradeFrm.tableData"
      style="width: 100%"
      :header-row-style="{height:'15px'}"
      :header-cell-style="{color:'#000',padding:0,background:'#f6faff'}"
      border
      stripe
      :cell-style="{padding:'0px'}"
      v-loading="loading"
    >
      <el-table-column property="memberId" label="会员ID" width="70px" />
      <el-table-column property="memberAccount" label="帐号" width="90px">
        <template slot-scope="scope">
          <span v-show="scope.row.win<0">
            <font color="red">{{ scope.row.memberAccount }}</font>
          </span>
          <span v-show="scope.row.win>=0">{{ scope.row.memberAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column property="game" label="游戏" align="left" width="80px" />
      <el-table-column property="teskNum" label="台号" align="left" width="80px" />
      <el-table-column property="cc" label="场次" align="left" width="90px" />
      <el-table-column property="sTime" label="时间" align="left" />
      <el-table-column property="result" label="结果" align="center" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.rType === 'nn'">
            <div v-if="scope.row.niuniuResult">
              <div style="background: #FF1744; color: white; border: 1px solid #fff; border-radius: 3px;">庄:{{ scope.row.niuniuResult[0] || "" }}</div>
              <div style="background: #448AFF; color: white; border: 1px solid #fff; border-radius: 3px;">闲一:{{ scope.row.niuniuResult[1] || "" }}</div>
              <div style="background: #1565C0; color: white; border: 1px solid #fff; border-radius: 3px;">闲二:{{ scope.row.niuniuResult[2] || "" }}</div>
              <div style="background: #0D47A1; color: white; border: 1px solid #fff; border-radius: 3px;">闲三:{{ scope.row.niuniuResult[3] || "" }}</div>
            </div>
            <div v-else>{{ scope.row.result }}</div>
          </div>
          <div v-else>{{ scope.row.result }}</div>
        </template>
      </el-table-column>
      <el-table-column property="betOrderInfo" label="注单详情" align="center" width="248px">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.betOrderInfo"
            v-show=" scope.row.rType!='dx' && scope.row.rType != 'ssc' && scope.row.rType != 'jsk3' && scope.row.rType != 'bjcs' && scope.row.memberId != '统计:' && scope.row.memberId != '所有统计:'&& scope.row.rType != 'nn' "
            style="margin:1px"
            border
            :header-row-style="{height:'15px'}"
            empty-text=" "
            :header-cell-style="{color:'#00f',padding:0}"
            :cell-style="{padding:'0px'}"
          >
            <el-table-column
              :label="item.label"
              align="center"
              :key="item.label"
              :prop="item.prop"
              v-for="item in scope.row.tablePara"
              :width="item.width"
            ></el-table-column>
          </el-table>
          <el-button
            size="mini"
            v-show="scope.row.rType == 'dx' || scope.row.rType == 'ssc' || scope.row.rType == 'jsk3' || scope.row.rType == 'bjcs'"
            type="success"
            class="el-button-opt"
            @click="showMxDlg(scope.row)"
          >交易明细</el-button>
          <div v-show="scope.row.rType == 'nn'" class="nn_info">
            <span v-if="scope.row.niuniuResult" style="position: absolute; left: 5px; top: 5px;">
              <el-popover
              placement="top-start"
              title="结果参照"
              width="200"
              trigger="hover"
              :content="`第一门 = ${scope.row.result.split('|')[0]}; 第二门=${scope.row.result.split('|')[1]}; 第三门 =                               
              ${scope.row.result.split('|')[2]}`">
              <el-button slot="reference" icon="el-icon-question" circle size="mini"></el-button>
            </el-popover>
            </span>
              <div>
                <span class="nn_info_container" v-for="(n, index) in scope.row.niuniu" :key="index">
                  <p class="nn_info_title">{{ n }}
                    <!-- <span style="color: #000">：</span> -->
                  </p>
                </span>
              </div>
              <div>
                <span class="nn_info_container" v-for="(n, i) in scope.row.niuniuBet" :key="i">
                  <p class="nn_info_bet_show">{{ n }}</p>
                </span>
              </div>
            <div v-if="scope.row.niuniuResult" style="margin-left: 5px;">
              <span class="nn_info_container" v-for="(n, i) in scope.row.nnWinLose" :key="i">
                <!-- <p class="nn_info_bet_show">{{ n }}</p> -->
                <el-tag v-if="n === '输'"  effect="plain" size="small" color="#FF1744" style="color: white; height: 22px; margin: 2px;"> {{ n }}</el-tag>
                <el-tag v-else  effect="plain" size="small" color="#00C853" style="color: white; height: 22px; margin: 2px;"> {{ n }}</el-tag>
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
      <el-table-column property="xml" label="洗码量(单/双)" align="left" width="110px" />
      <el-table-column property="xmKind" label="洗码类型" align="left" width="110px" />
      <el-table-column property="validBet" label="有效投注" align="left" />
      <el-table-column property="balance" label="余额" align="left" />
      <el-table-column property="balanceMemo" label="余额备注" align="left" width="180px" />
      <el-table-column property="ip" label="投注IP" align="left" width="130px" />
      <el-table-column property="terminal" label="终端" align="left" width="80px" />
    </el-table>

    <el-row type="flex" align="middle" justify="end" style="padding: 20px 0;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5,20,30]"
        layout="prev,pager,next"
        :total="memberTradeFrm.totalItemsNum"
      />
    </el-row>
  </div>
</template>
<script>
// import { mapState } from 'vuex'
import share from '@/api/share'
export default {
  name: 'memberTrade',
  data: function () {
    return {
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(2019, 9, 10, 12, 0, 0),
      endTime: new Date(2019, 9, 10, 12, 0, 0),
      gameTypeValue: '',
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
        dialogTableVisible: false,
      },
      form: {
        account: '',
        Id: '',
        cc: '',
        jc: '',
        teskNum: ''
      }
    }
  },
  computed: {
    stateDemo() {
      this.tradeBetMx = this.$store.state.tradeBetMx
      this.memberTradeFrm = this.$store.state.memberTradeForm
      // console.log('this.member', this.memberTradeFrm)
      this.memberTradeFrm.state = this.$store.state.memberTradeForm.state
      // console.log('memberTradeData : ', this.memberTradeFrm)
      if (this.memberTradeFrm.state == 1) this.loading = false
      return this.tradeBetMx
    }
  },
  watch: {
    stateDemo() {
      if (this.memberTradeFrm.state == 1) this.showMxDlg()
    },
    $route: 'getParams'
  },
  created: function () {
    if (this.$store.state.login == false) this.$router.push({ path: '/login' })
    if (
      this.$Global.optioner.UserName == '' ||
      this.$Global.optioner.UserName == undefined
    )
    this.$router.push({ path: '/login' })
    this.doSelectDate(1)
    this.$store.commit('setMemberTradeForm', { state: 0 })
    this.getParams()
  },
  methods: {
    //限制输入特殊字符
    btKeyUp(e) {
        e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    getTradeMx(index, row) {
      this.tradeBetMx = ''
      this.$store.commit('setTradeBetMx', this.tradeBetMx) // 改变数据
      this.$store.commit('setMemberTradeForm', { state: 0 })
      this.mx_game = row.game
      let sendStr = {
        router: 'GetTradeMx',
        JsonData: { bh: row.bh, date: row.sTime }
      }
      this.$pomelo.send(sendStr)
      this.loading = true
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
      var para = new Array(obj.length - 1)
      var arrMx = []
      for (var i in obj) {
        var obj2 = {};
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
        gt == 'nn'
          ? '牛牛'
          : gt == 'bjl'
          ? '百家乐'
          : gt == 'lh'
          ? '龙虎'
          : gt == 'dx'
          ? '大小'
          : gt == 'tts'
          ? '推筒子'
          : '炸金花'
      gt = this.mx_game
      frm.dialogTableVisible = true
      if (gt == '时时彩' || gt == '江苏快3' || gt == '北京赛车') {
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
      if (gt == '大小') {
        //下注明细只有一行
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

        for (let j in splitMx) {
          if (splitMx[j] != '') {
            var split2 = splitMx[j].split('^')
            var nn = split2[0]
            if (nn >= 1 && nn <= 14) {
              let r = 0 // 17-4
              for (let item in obj1) {
                if (split2[0] - 1 == r)
                  obj1[item] = split2[1] > 0 ? split2[1] : ''
                r++
              }
            }
            if (nn >= 15 && nn <= 24) {
              let r = 0 // 大所在行
              for (let item in obj2) {
                if (split2[0] - 15 == r)
                  obj2[item] = split2[1] > 0 ? split2[1] : ''
                r++
              }
            }
            if (nn >= 25 && nn <= 37) {
              let r = 0; // 三个点所在行
              for (let item in obj3) {
                if (split2[0] - 25 == r)
                  obj3[item] = split2[1] > 0 ? split2[1] : ''
                r++
              }
            }
            if (nn >= 38 && nn <= 52) {
              let r = 0; // 一二点所在行
              for (let item in obj4) {
                if (split2[0] - 38 == r)
                  obj4[item] = split2[1] > 0 ? split2[1] : ''
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
      this.strCatory2 = ''
      if (gt == '时时彩') {
        var split1 = ['总和大', '总和小', '总和单', '总和双', '龙', '虎', '和'] // 总和龙虎
        var split2 = ['大', '小', '单', '双'] // 第 几 球
        var split3 = [] // 1 - 5 球
        for (let i = 0; i <= 9; i++) split3.push(i)
        var split4 = ['豹子', '顺子', '对子', '半顺', '杂六'] // 前 中 后
      }
      if (gt == '江苏快3') {
        var split1 = ['1', '2', '3', '小', '4', '5', '6', '大'] // 三军
        var split2 = ['111', '222', '333', '444', '555', '666'] // 围骰
        var split3 = [] // 点数
        for (let i = 4; i <= 17; i++) split3.push(i + '点') // 点数
        var split4 = [] // 短牌
        for (let i = 12; i <= 56; i++) split4.push(i)
        var split5 = ['111', '22', '33', '44', '55', '66']
      }
      if (gt == '北京赛车') {
        let split1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] // 1-10
        let split2 = ['111', '222', '333', '444', '555', '666'] // 围骰
        let split3 = [] // 点数
        for (let i = 4; i <= 17; i++) split3.push(i + '点') // 点数
        let split4 = [] // 短牌
        for (let i = 12; i <= 56; i++) split4.push(i)
        let split5 = ['111', '22', '33', '44', '55', '66']
      }
      this.betMxDlgFrm.txtCb = ''
      var strCatory = ''
      var strCatory2 = ''
      for (let j in splitMx) {
        if (splitMx[j] != '') {
          // console.log('------------->',splitMx[j])
          var splitMx2 = splitMx[j].split('^')
          var nn = splitMx2[0]
          if (gt == '时时彩') {
            let arrX = ['前三', '中三', '后三']
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
          if (gt == '江苏快3') {
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
          if (gt == '北京赛车') {
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
            width: (function () {
              let label = String(column.label)
              return '40px';
            })()
          },
          attrs: {
            src: (function () {
              let label = String(column.label)
              label = label.slice(5)
              return 'static/ss/' + label + '.png'
            })()
          }
        })
      ])
    },
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          'sheetjs.xls'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },

    doFind() {
      var r = this.getSelectDate()
      var sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.form.account,
          findId: this.form.Id,
          // ip: this.form.IP,
          teskNum: this.form.teskNum,
          jc: this.form.jc,
          cc: this.form.cc,
          gameType: this.gameTypeValue,
          startTime: r[0],
          endTime: r[1],
          pageSize: 10,
          currentPage: 1
        }
      }
      // console.log(sendStr)
      this.$store.commit('setMemberTradeForm', { state: 0 })
      this.$pomelo.send(sendStr)
      this.loading = true
    },
    doRefresh() {
      this.form.account = ''
      this.form.Id = ''
      this.form.jc = ''
      this.form.cc = ''
      this.form.teskNum = ''
      this.doSelectDate(1)
      var r = this.getSelectDate()
      let sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          Id: this.$Global.optioner.Id,
          opt_name: this.$Global.optioner.UserName,
          pageSize: 10,
          currentPage: 1,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$store.commit('setMemberTradeForm', { state: 0 })
      this.$pomelo.send(sendStr)
      this.loading = true
      this.gameTypeValue = 'all'
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.query
      if (routerParams.name != undefined) {
        this.form.account = routerParams.name
        if (routerParams.startTime != undefined) {
          this.startDate = new Date(routerParams.startTime)
          this.endDate = new Date(routerParams.endTime)
          this.startTime = new Date(routerParams.startTime)
          this.endTime = new Date(routerParams.endTime)
        }
        this.doFind()
      } else {
        var r = this.getSelectDate()
        let sendStr = {
          router: 'GetMemberTrade',
          JsonData: {
            Id: this.$Global.optioner.Id,
            opt_name: this.$Global.optioner.UserName,
            pageSize: 10,
            currentPage: 1,
            startTime: r[0],
            endTime: r[1]
          }
        }
        this.$store.commit('setMemberTradeForm', { state: 0 })
        this.loading = true
        this.$pomelo.send(sendStr)
      }
    },
    getSelectDate() {
      var d = this.startDate
      var d1 = this.endDate
      var date1 = this.$moment(d).format('YYYY-MM-DD') + ' ' + this.$moment(this.startTime).format('HH:mm:ss')
      var date2 = this.$moment(d1).format('YYYY-MM-DD') + ' ' + this.$moment(this.endTime).format('HH:mm:ss')
      return [date1, date2]
    },
    // 选择日期按钮点击事件
    doSelectDate(n){
      switch (n){
        case 1:
          this.today()
          break
        case 2:
          this.yesterday()
          break
        case 3:
          this.theWeek()
          break
        case 4:
          this.lastWeek()
          break
        case 5:
          this.thisMonth()
          break
        case 6:
          this.lastMonth()
          break
        default:
          this.today()
      }
    },
    // 昨日按钮
    yesterday: function () {
      var dateArr = new Date()
      dateArr.setTime(dateArr.getTime() - 24 * 60 * 60 * 1000)
      var dateArr1 = share.getDateBetween(0, '12:00:00', '今天')
      var startTime = this.$moment(dateArr).format('YYYY-MM-DD HH:mm:ss')
      var endTime = dateArr1[0].split(' ')
      this.startDate = startTime.split(' ')[0]
      this.endDate = dateArr1[0]
    },
    // 今日
    today: function () {
      var dateArr = share.getDateBetween(0, '12:00:00', '今天')
      var startTime = dateArr[0]
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
    theWeek: function () {
      var dateArr = share.getWeekStartAndEnd(0, new Date())
      var dateArr1 = share.getWeekStartAndEnd(1, new Date())
      var startTime = dateArr[0]
      var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    // 上周
    lastWeek: function () {
      var dateArr = share.getDateBetween(3, '12:00:00', '上周')
      var dateArr1 = share.getWeekStartAndEnd(0, new Date())
      var startTime = dateArr[0]
      var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    // 本月
    thisMonth: function () {
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
    lastMonth: function () {
      var dateArr = share.getDateBetween(5, '12:00:00', '上月')
      var dateArr1 = share.getDateBetween(4, '12:00:00', '本月')
      var startTime = dateArr[0]
      var endTime = dateArr[1]
      this.startDate = dateArr[0]
      this.endDate = dateArr1[0]
    },
    handleCurrentChange(val) {
      var r = this.getSelectDate()
      let sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
          Id: this.$Global.optioner.Id,
          opt_name: this.$Global.optioner.UserName,
          name: this.form.account,
          findId: this.form.Id,
          teskNum: this.form.teskNum,
          jc: this.form.jc,
          cc: this.form.cc,
          gameType: this.gameTypeValue,
          pageSize: 10,
          currentPage: val,
          startTime: r[0],
          endTime: r[1]
        }
      }
      this.$store.commit('setMemberTradeForm', { state: 0 })
      this.loading = true
      this.$pomelo.send(sendStr)
    }
  }
}
</script>

<style scoped>
.memberTrade {
  margin: 20px;
}
.memberTrade > .head > .el-col > .el-col {
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
}

.nn_info{
  display: flex; 
  justify-content: flex-start;
  padding-left: 25%;
  /* max-height: 110px;
  overflow-y: scroll;
  cursor: n-resize; */
}
.nn_info_container{
  display: flex; flex-direction: column;
}
.nn_info_title{
  width: auto; height: 20px; padding: 3px; color: blue; font-weight: 700;
}
.nn_info_bet_show{
  width: auto; height: 20px; padding: 3px;
}
</style>
