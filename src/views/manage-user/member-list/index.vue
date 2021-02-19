<template>
  <div class="memberList">
    <el-form ref="form" :inline="true" :model="form" label-width="90px" size="medium">
      <el-form-item prop="account">
        <el-input v-model="form.account" placeholder="会员账号" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
      </el-form-item>
      <el-form-item prop="nikename">
        <el-input v-model="form.nikename" placeholder="昵称" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFindMember()">查找</el-button>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="doRefreshMember()">刷新</el-button>
        <!-- <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddMember()"
        >新增会员</el-button> -->
      </el-form-item>
    </el-form>

    <!-- <el-dialog title="新增会员" :visible.sync="addMemberDigFrm.addMemberDigFrmVisible" width="460px">
      为
      <font color="red">{{ this.$Global.optioner.UserName }}</font>新增会员
      <hr>
      <br>
      <el-form
        ref="addMemberDigFrm"
        label-width="100px"
        :model="addMemberDigFrm"
        :inline="true"
        size="mini"
        :rules="rules"
      >
        <el-form-item label="会员帐号" prop="memberName">
          <el-input
            v-model="addMemberDigFrm.memberName"
            autocomplete="off"
            class="inputBox"
            placeholder="最少3位数字或字母"
            @keyup.native="btKeyUp"
            @keydown.native="btKeyUp"
          />
        </el-form-item>
        <el-form-item label="会员名称" prop="memberNikeName">
          <el-input v-model="addMemberDigFrm.memberNikeName" autocomplete="off" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
        </el-form-item>
        <el-form-item label="占成比例" prop="zcb">
          <el-input v-model="addMemberDigFrm.zcb" autocomplete="off" class="inputBox" type="number" />
        </el-form-item>
        最多:{{ addMemberDigFrm.upper_zcb }}
        <el-form-item v-if="checkSD === '单边' || arrJxb[18] === '1'" label="洗码率单(%)" prop="xmb_s">
          <el-input v-model="addMemberDigFrm.xmb_s" autocomplete="off" class="inputBox" type="number" />
        </el-form-item>
        <span v-if="checkSD === '单边' || arrJxb[18] === '1'">最多:{{ addMemberDigFrm.upper_xmb_s }}</span>
        <el-form-item v-if="checkSD === '双边' || arrJxb[18] === '1'" label="洗码率双(%)" prop="xmb_d">
          <el-input v-model="addMemberDigFrm.xmb_d" autocomplete="off" class="inputBox" type="number" />
        </el-form-item>
        <span v-if="checkSD === '双边' || arrJxb[18] === '1'">最多:{{ addMemberDigFrm.upper_xmb_d }}</span>
        <el-form-item label="洗码类型" prop="xmKind">
          <el-select v-if="this.$Global.gxLength === 2 || this.$Global.optioner.arrJxb[18] === '1'" v-model="addMemberDigFrm.xmKind" placeholder="请选择洗码类型" style="width:155px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-else
            v-model="addMemberDigFrm.xmKind"
            autocomplete="off"
            class="inputBox"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="存入金额" prop="depositMoney">
          <el-input
            v-model="addMemberDigFrm.depositMoney"
            type="number"
            autocomplete="off"
            class="inputBox"
          />
        </el-form-item>
        /&nbsp;&nbsp;{{ optionerScore }}
        <el-form-item label="帐号密码" prop="pw">
          <el-input
            v-model="addMemberDigFrm.pw"
            autocomplete="off"
            class="inputBox"
            placeholder="最少6位数字或字母"
          />
        </el-form-item>
        <el-form-item label="取款密码" prop="drawMoneyPw">
          <el-input v-model="addMemberDigFrm.drawMoneyPw" autocomplete="off" class="inputBox" />
        </el-form-item>
      </el-form>
      <hr>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMemberDigFrmCancel()">取 消</el-button>
        <el-button type="primary" @click="addMemberDigFrmOk()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogFrm.dialogResultVisible" width="30%">
      <span icon="info">确认要结算删除操作吗</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFrm.dialogResultVisible=false">取 消</el-button>
        <el-button type="primary" @click="dialogFrm.dialogResultVisible=false">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- <el-dialog
      title="设定会员"
      :visible.sync="memberSetupDigFrm.MemberSetupDigFrmVisible"
      width="450px"
    >
      会员帐号：{{ optName }}
      <hr>
      <br>
      <el-form
        ref="memberSetupDigFrm"
        :model="memberSetupDigFrm"
        :inline="true"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="会员名称" prop="memberName">
          <el-input v-model="memberSetupDigFrm.memberName" autocomplete="off" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
        </el-form-item>
        <el-form-item v-if="checkSD === '单边' || arrJxb[18] === '1'" label="洗码率单(%)" prop="xmb_s">
          <el-input v-model="memberSetupDigFrm.xmb_s" autocomplete="off" class="inputBox" type="number" />
        </el-form-item>
        <span v-if="checkSD === '单边' || arrJxb[18] === '1'">最多:{{ this.$Global.selectInfo.xmb_s === "" ? this.$store.state.ht.myInfo.xmb_s : this.$Global.selectInfo.xmb_s }}</span>
        <el-form-item v-if="checkSD === '双边' || arrJxb[18] === '1'" label="洗码率双(%)" prop="xmb_d">
          <el-input v-model="memberSetupDigFrm.xmb_d" autocomplete="off" class="inputBox" type="number" />
        </el-form-item>
        <span v-if="checkSD === '双边' || arrJxb[18] === '1'">最多:{{ this.$Global.selectInfo.xmb_d === "" ? this.$store.state.ht.myInfo.xmb_d : this.$Global.selectInfo.xmb_d }}</span>
        <el-form-item label="洗码类型" prop="xmKind">
          <el-select v-if="this.$Global.gxLength === 2 || this.$Global.optioner.arrJxb[18] === '1'" v-model="memberSetupDigFrm.xmKind" placeholder="请选择洗码类型" style="width:155px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-else
            v-model="addMemberDigFrm.xmKind"
            autocomplete="off"
            class="inputBox"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="帐号密码" prop="accountPw">
          <el-input
            v-model="memberSetupDigFrm.accountPw"
            autocomplete="off"
            class="inputBox"
            placeholder="不修改密码请留空"
          />
        </el-form-item>
        <el-form-item label="取款密码" prop="drawMoneyPw">
          <el-input
            v-model="memberSetupDigFrm.drawMoneyPw"
            autocomplete="off"
            class="inputBox"
            placeholder="不修改密码请留空"
          />
        </el-form-item>
      </el-form>
      <hr>
      <div slot="footer" class="dialog-footer">
        <el-button @click="memberSetupCancel()">取 消</el-button>
        <el-button type="primary" @click="memberSetupOk()">确 定</el-button>
      </div>
    </el-dialog> -->
    <el-card>
      <el-button size="small" icon="el-icon-document" style="margin-bottom: 10px" @click="excelExport()">导出</el-button>
      <el-pagination
        :current-page="1"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="memberListFrm.totalItemsNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <el-table
        :header-cell-style="this.$Global.tableHeaderColor"
        :data="memberListFrm.tableData"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column property="memberAccount" fixed label="会员帐号">
          <template slot-scope="scope">
            <span v-show="scope.row.onLine==='在线'">
              <font color="red">{{ scope.row.memberAccount }}</font>
            </span>
            <span v-show="scope.row.onLine==='离线'">{{ scope.row.memberAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column property="name" fixed label="昵称" align="left" />
        <el-table-column property="mBalance" fixed label="当前余额" align="left" />
        <el-table-column property="upperAgent" fixed label="所属代理" align="left">
          <template slot-scope="scope">
            <font color="#9c27b0">{{ scope.row.upperAgent }}</font>
          </template>
        </el-table-column>
        <el-table-column property="xmKind" label="洗码类型" align="left" />
        <el-table-column property="xmb" label="洗码比(单/双)%" align="left" width="130px" />
        <el-table-column property="createDate" label="开户日期" align="left" width="120px" />
        <el-table-column property="lastLoginIp" label="最近登录IP" align="left" />
        <el-table-column property="lastLoginTime" label="最近登录" align="left" width="120px" />
        <el-table-column property="onLine" label="在线" align="left">
          <template slot-scope="scope">
            <span v-show="scope.row.onLine==='在线'">
              <font color="red">{{ scope.row.onLine }}</font>
            </span>
            <span v-show="scope.row.onLine==='离线'">{{ scope.row.onLine }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sEnable" label="状态" align="left" width="80px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.sEnable"
              active-color="#00A854"
              inactive-color="#F04134"
              active-value="启用"
              inactive-value="禁用"
              @change="changeSwitch(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="230px" padding="0px">
          <template slot-scope="scope">
            <el-button
              v-if="arrJxb[7]==='1'"
              size="mini"
              type="success"
              class="el-button-opt"
              @click="handleOptScore(scope.$index, scope.row,1)"
            >加/减分</el-button>
            <!-- <el-button
              v-if="arrJxb[7]==='1'"
              size="mini"
              type="danger"
              class="el-button-opt"
              icon="el-icon-remove-outline"
              @click="handleOptScore(scope.$index, scope.row,2)"
            >减分</el-button> -->
            <el-button
              v-if="arrJxb[3]==='1'"
              size="mini"
              type="primary"
              class="el-button-opt"
              icon="el-icon-edit"
              @click="handleMemberSetup(scope.$index, scope.row)"
            >设定</el-button>
            <el-button
              v-if="arrJxb[3]==='1'"
              size="mini"
              type="danger"
              class="el-button-opt"
              @click="handleMemberKick(scope.$index, scope.row)"
            >踢出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pageSize !== 10"
        :current-page="1"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="memberListFrm.totalItemsNum"
        style="margin-top: 10px"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- eslint-disable-next-line -->
    <ExportExcel ref="excel" :eData="eData" />
    <!-- eslint-disable-next-line -->
    <UpDown ref="updown" :upDownData="upDownData" />
    <!-- eslint-disable-next-line -->
    <SetUp ref="setup" :setupData="setupData" />

    <!-- you can add element-ui's tooltip -->
    <el-tooltip placement="top" :content="$t('action.backToTop')">
      <back-to-top :custom-style="this.$Global.myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
// import { mapState } from "vuex"
import ExportExcel from '@/components/ExportExcel'
import UpDown from './member-action/up-down'
import SetUp from './member-action/set-up'
import BackToTop from '@/components/BackToTop'
export default {
  components: {
    ExportExcel,
    UpDown,
    SetUp,
    BackToTop
  },
  data() {
    return {
      arrJxb: this.$Global.optioner.arrJxb,
      checkSD: this.$Global.optioner.xmType,
      optName: '', // 所有对话框的操作名称
      pageSize: 10, // 页面数据条数只需改这里和上面的page-size
      curPage: 1,
      loading: true,
      optionerScore: '',
      options: [
        {
          value: '单边',
          label: '单边'
        },
        {
          value: '双边',
          label: '双边'
        }
      ],
      dialogFrm: {
        pass: '',
        chkPass: '',
        dialogFormVisible: false,
        dialogResultVisible: false
      },
      memberListFrm: {
        totalItemsNum: 0,
        tableData: [
          {
            memberAccount: '11112222',
            name: '11',
            upperAgent: '123(111222)',
            xmKind: '双边',
            mBalance: '0.00',
            xmb_s: '0.0',
            xmb_d: '0.0',
            xmb: '0.8/1.6',
            createDate: '2016-05-02',
            lastLoginIp: '127.0.0.1',
            lastLoginTime: '2019-12-1',
            drawMoneyPw: '',
            onLine: '离线',
            sEnable: '启用'
          }
        ]
      },
      form: {
        account: '',
        nikename: ''
      },
      addMemberDigFrm: {
        opt: '',
        memberName: '',
        memberNikeName: '',
        zcb: 0,
        xmb_s: '0.0', // 洗码比
        xmb_d: '0.0',
        upper_xmb_s: '0.0', // 上级洗码比单
        upper_xmb_d: '0.0', // 上级洗码比双
        upper_zcb: 0,
        xmKind: '双边', // 洗码类型
        depositMoney: '0', // 存入金额
        memo: '', // 特别的备注
        pw: '', // 帐号密码
        drawMoneyPw: '', // 存款
        addMemberDigFrmVisible: false
      },
      memberSetupDigFrm: {
        memberName: '',
        zcb: '',
        xmb_s: '',
        xmb_d: '',
        upper_xmb_s: '', // 上级洗码比单
        upper_xmb_d: '', // 上级洗码比双
        xmKind: '',
        accountPw: '', // 账号密码,不修改留空
        drawMoneyPw: '', // 取款密码,不修改留空
        webAddr: '', // 一键结算密码,不修改留空
        MemberSetupDigFrmVisible: false
      },
      rules: {
        // form fules
        memberName: {
          type: 'string',
          required: true,
          message: '必填字段',
          trigger: 'blur'
        },
        pw: {
          type: 'string',
          required: true,
          message: '必填字段',
          trigger: 'blur'
        }
      },
      // eslint-disable-next-line
      eData: {},
      upDownData: {},
      setupData: {}
    }
  },
  computed: {
    // eslint-disable-next-line
    stateDemo() {
      this.memberListFrm = this.$store.state.ht.memberListForm
      console.log('this.memberListFrom ', this.memberListFrm)
      // this.addscoreDigFrm2 = this.$store.state.ht.addscoreDigFrm2
      this.loading = false
      this.optionerScore = this.$store.state.ht.optionerScore
      if (this.$store.state.ht.edit_member_ok) {
        this.addMemberDigFrm.addMemberDigFrmVisible = false
        this.$store.commit('ht/setAddMemberState', false)
        const sendStr = {
          router: 'GetMemberInfo',
          JsonData: {
            name: this.$Global.selectInfo.selectAgent,
            pageSize: this.pageSize,
            currentPage: this.curPage
          }
        }
        this.$pomelo.send(sendStr)
      }
    }
  },
  watch: {
    stateDemo() {}
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
      })()
    }
  },
  created() {
    const sendStr = {
      router: 'GetMemberInfo',
      JsonData: {
        name: this.$Global.optioner.UserName,
        pageSize: this.pageSize,
        currentPage: 1
      }
    }
    this.$pomelo.send(sendStr)
  },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    handleAddMember() {
      if (this.$Global.optioner.arrJxb[5] === '0') return this.$message.warning('您没有该权限！请联系上级')
      const sendStr = {
        router: 'GetOptionerInfo',
        JsonData: { name: this.$Global.optioner.UserName }
      } // 取登录操作员分数
      this.$pomelo.send(sendStr)
      const frm = this.addMemberDigFrm
      frm.addMemberDigFrmVisible = true
      this.optName = this.$Global.optioner.UserName
      frm.upper_xmb_s = this.$Global.optioner.xmb_s
      frm.upper_xmb_d = this.$Global.optioner.xmb_d
      frm.upper_zcb = this.$Global.optioner.zcb
      frm.xmKind = this.$Global.optioner.xmType
      frm.memberName = ''
      frm.memberNikeName = ''
      frm.depositMoney = '0'
      frm.pw = ''
      frm.drawMoneyPw = ''
      frm.zcb = '0'
      frm.xmb_s = '0.00'
      frm.xmb_d = '0.00'
    },
    handleOptScore(index, row, n) {
      if (this.$Global.optioner.arrJxb[7] === '0') return this.$message.warning('您没有该权限！请联系上级')
      this.$pomelo.send({
        router: 'getOptScoreRecord',
        JsonData: { name: row.memberAccount, Id: this.$Global.optioner.Id }
      })
      this.upDownData = row
      this.$refs.updown.dialogFormVisible = true
    },
    handleMemberSetup(index, row) {
      // if (this.$Global.optioner.arrJxb[3] === '0') return this.$message.warning('您没有该权限！请联系上级')
      // // const frm = this.memberSetupDigFrm
      // // frm.MemberSetupDigFrmVisible = true
      const sendStr = {
        router: 'getReferenceInfo',
        JsonData: { name: row.reference_name }
      }
      this.$pomelo.send(sendStr)
      setTimeout(() => {
        this.setupData = row
        this.$refs.setup.dialogFormVisible = true
      }, 500)
      // this.optName = row.memberAccount
      // frm.memberName = row.name
      // frm.zcb = row.zcb
      // frm.xmb_s = row.xmb_s
      // frm.xmb_d = row.xmb_d
      // frm.xmKind = row.xmKind
      // frm.accountPw = ''
      // frm.drawMoneyPw = ''
    },
    handleMemberKick(index, row) {
      const name = row.memberAccount
      const Id = row.userId
      this.$confirm('您确定要踢出 ' + name + ' 吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          var sendStr = {
            router: 'kickMember',
            JsonData: { Id: Id, name: name }
          }
          this.$pomelo.send(sendStr)
          // console.log('kickMember: ', sendStr)
        })
        .catch(() => {})
    },
    doEditPw(index, row) {
      this.dialogFrm.dialogFormVisible = true
      // this.$router.push('/accountAdmin/memberPwEdit')
    },
    changeSwitchM(data) {
      if (this.$Global.optioner.arrJxb[4] === '0') return this.$message.warning('您没有该权限！请联系上级')
      var n = data.sEnable === '禁用' ? 0 : 1
      const sendStr = {
        router: 'setUserState',
        JsonData: { name: data.agentAccount, state: n }
      }
      this.$pomelo.send(sendStr)
    },
    doFindMember() {
      if (this.form.account.trim() === '' && this.form.nikename.trim() === '') {
        this.$message.warning('请输入会员帐号或者昵称')
        return
      }
      var sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id, // 查找时不归selectAgent
          findname: this.form.account,
          nikename: this.form.nikename,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    doRefreshMember() {
      this.form.account = ''
      this.form.nikename = ''
      this.$Global.selectInfo.selectAgent = this.$Global.optioner.UserName
      this.$Global.selectInfo.xmb_s = this.$store.state.ht.myInfo.xmb_s
      this.$Global.selectInfo.xmb_d = this.$store.state.ht.myInfo.xmb_d
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          name: this.$Global.optioner.UserName,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleCurrentChange(val) {
      this.curPage = val
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          name: this.$Global.selectInfo.selectAgent,
          pageSize: this.pageSize,
          currentPage: val
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleSizeChange(val) {
      this.pageSize = val
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          name: this.$Global.selectInfo.selectAgent,
          pageSize: this.pageSize,
          currentPage: this.curPage
        }
      }
      this.$pomelo.send(sendStr)
    },
    addMemberDigFrmOk() {
      var frm = this.addMemberDigFrm
      if (frm.memberName === '' || frm.memberName.indexOf(' ') !== -1) {
        this.$message.warning('会员帐号至少3位！')
        return
      }
      if (frm.memberName.length < 3) {
        this.$message.warning('会员帐号不能小于3位')
        return
      }
      // let reg = /^[0-9a-zA-Z]+$/
      // if(!reg.test(frm.HgName)){this.$message.warning('只能输入数字或字母');return;}
      if (frm.pw.length < 6 || frm.pw.indexOf(' ') !== -1) {
        this.$message.warning('会员密码不能小于6位')
        return
      }
      if (frm.xmb_s === '' || frm.xmb_d === '') {
        this.$message.warning('洗码率不能为空')
        return
      }
      if (frm.xmb_s > frm.upper_xmb_s || frm.xmb_d > frm.upper_xmb_d) {
        this.$message.warning('洗码比例不能超过上级')
        return
      }
      if (frm.zcb > frm.upper_zcb) {
        this.$message.warning('占成比例不能超过上级')
        return
      }
      if (frm.pw !== '') {
        if (!/\d/.test(frm.pw) || !/[a-zA-Z]/.test(frm.pw)) return this.$message.warning('密码必须包含数字和英文字母')
      }
      const sendStr = {
        router: 'addMember',
        JsonData: {
          name: frm.memberName,
          nikename: frm.memberNikeName,
          xmb_s: frm.xmb_s,
          xmb_d: frm.xmb_d,
          xmKind: frm.xmKind === '双边' ? 0 : 1,
          depositMoney: frm.depositMoney,
          memo: frm.memo,
          zc: frm.zcb,
          optLevel: 2, // 1 添加代理,2 添加会员
          pw: this.$md5(frm.pw),
          opt_name: this.$Global.optioner.UserName,
          opt_Id: this.$Global.optioner.Id,
          upper_name: this.optName,
          ip: this.$store.state.ip
        }
      }
      this.$pomelo.send(sendStr)
      frm.addMemberDigFrmVisible = false
    },
    addMemberDigFrmCancel() {
      this.addMemberDigFrm.addMemberDigFrmVisible = false
    },
    memberSetupOk() {
      const frm = this.memberSetupDigFrm
      if (this.$Global.selectInfo.xmb_s === '') {
        if (this.memberSetupDigFrm.xmb_s > this.$store.state.ht.myInfo.xmb_s) {
          return this.$message.warning({ message: '洗码比不能超过上线' })
        }
      }
      if (this.$Global.selectInfo.xmb_s !== '') {
        if (this.memberSetupDigFrm.xmb_s > this.$Global.selectInfo.xmb_s) {
          return this.$message.warning({ message: '洗码比不能超过上线' })
        }
      }
      if (this.$Global.selectInfo.xmb_d === '') {
        if (this.memberSetupDigFrm.xmb_d > this.$store.state.ht.myInfo.xmb_d) {
          return this.$message.warning({ message: '洗码比不能超过上线' })
        }
      }
      if (this.$Global.selectInfo.xmb_d !== '') {
        if (this.memberSetupDigFrm.xmb_d > this.$Global.selectInfo.xmb_d) {
          return this.$message.warning({ message: '洗码比不能超过上线' })
        }
      }
      if (this.memberSetupDigFrm.accountPw.length >= 1 && this.memberSetupDigFrm.accountPw.length < 6) {
        this.$message.warning('会员密码不能小于6位')
        return
      }
      if (this.memberSetupDigFrm.accountPw !== '') {
        if (!/\d/.test(frm.accountPw) || !/[a-zA-Z]/.test(frm.accountPw)) return this.$message.warning('密码必须包含数字和英文字母')
      }
      const sendStr = {
        router: 'editMemberInfo',
        JsonData: {
          name: this.optName,
          nikename: this.memberSetupDigFrm.memberName,
          zcb: null, // 会员没有占成
          xmb_s: this.memberSetupDigFrm.xmb_s,
          xmb_d: this.memberSetupDigFrm.xmb_d,
          xmKind: this.memberSetupDigFrm.xmKind === '双边' ? 0 : 1,
          pw: frm.accountPw !== '' ? this.$md5(frm.accountPw) : '',
          drawMoneyPw: frm.drawMoneyPw !== '' ? this.$md5(frm.drawMoneyPw) : '',
          webAddr: this.memberSetupDigFrm.webAddr,
          level: 3,
          ip: this.$store.state.ip,
          optName: this.$Global.optioner.UserName
        }
      }
      this.$pomelo.send(sendStr)
      this.memberSetupDigFrm.MemberSetupDigFrmVisible = false
    },
    memberSetupCancel() {
      this.memberSetupDigFrm.MemberSetupDigFrmVisible = false
    },
    handleDelete() {
      this.dialogFrm.dialogResultVisible = true
    },
    changeSwitch(data) {
      if (this.$Global.optioner.arrJxb[4] === '0') return this.$message.warning('您没有该权限！请联系上级')
      var n = data.sEnable === '禁用' ? 0 : 1
      const sendStr = {
        router: 'setUserState',
        JsonData: { name: data.memberAccount, state: n }
      }
      this.$pomelo.send(sendStr)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message.success('修改成功')
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    },
    excelExport() {
      this.eData = {
        tHeader: ['会员账号', '昵称', '洗码类型', '所属代理', '当前余额', '洗码比(单/双)%', '状态', '开户日期'],
        filterVal: ['memberAccount', 'name', 'xmType', 'upperAgent', 'mBalance', 'xmb', 'sEnable', 'createDate'],
        list: this.memberListFrm.tableData
      }
      if (this.memberListFrm.tableData === undefined) {
        return
      }
      this.$refs.excel.excleForm = true
    }
  }
}
</script>

<style scoped>
.memberList {
  margin: 20px;
}
/* .memberList > .head > .el-col > .el-col {
  padding: 20px 0;
  border-right: solid 1px rgba(255, 220, 136, 0.15);
}
.memberList .head {
  text-align: center;
  color: #fff;
  font-size: 30px;
  margin-bottom: 50px;
}
.memberList .head span {
  font-size: 16px;
}
.inputBox .el-input__inner {
  height: 30px !important;
} */
.el-button-opt {
  width: 60px;
  height: 25px;
  padding: 1px;
  margin: 1px;
}
.el-pagination {
  float: right;
  min-width: 200px;
}
/*
#topCar3 {
  width: 100%;
  height: 50px;
} */
</style>
