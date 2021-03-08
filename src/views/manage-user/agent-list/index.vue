<template>
  <div class="agentList">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="medium">
      <el-form-item>
        <el-input v-model="form.account" placeholder="代理账号" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindAgent()" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.nikename" placeholder="昵称" class="inputBox" @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindAgent()" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" icon="el-icon-search" @click="doFindAgent()">搜索</el-button>
        <el-button size="medium" type="primary" icon="el-icon-refresh" @click="doRefreshAgent()">刷新</el-button>
        <el-button size="medium" type="primary" icon="el-icon-plus" @click="handleAddMyMember()">添加代理/玩家</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-button size="small" icon="el-icon-document" style="margin-bottom: 10px" @click="excelExport()">导出</el-button>
      <el-pagination
        :current-page="1"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="agentAdminFrm.totalItemsNum"
        style="float: right"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <el-table
        :header-cell-style="this.$Global.tableHeaderColor"
        :data="agentAdminFrm.tableData"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column property="agentAccount" fixed label="代理帐号" width="120">
          <template slot-scope="scope">
            <span @click="cellClick(scope.row.agentAccount, scope.row.Id)">
              <font color="blue" style="cursor: pointer">{{ scope.row.agentAccount }}</font>
            </span>
          </template>
        </el-table-column>
        <el-table-column property="name" fixed label="昵称">
          <template slot-scope="scope">
            <span v-show="scope.row.onLine === '在线'">
              <font color="red">{{ scope.row.name }}</font>
            </span>
            <span v-show="scope.row.onLine === '离线'">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column property="aBalance" fixed label="当前余额" />
        <el-table-column property="zcb" label="占成比(%)" width="90px" />
        <el-table-column property="xmb" label="洗码比(单/双)%" width="80px" />
        <el-table-column property="xmType" label="洗码类型" width="100"/>
        <el-table-column prop="sEnable" label="状态" width="80px" align="center">
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
        <el-table-column property="createDate" label="开户时间" min-width="110px" />
        <el-table-column property="lastLoginTime" label="最近登录" min-width="110px" />
        <el-table-column property="loginIp" label="登录IP" />
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button v-if="arrJxb[7] === '1'" type="success" class="el-button-opt" @click="handleOptScore(scope.$index, scope.row, 1)">上/下分</el-button>
            <el-button v-if="arrJxb[3] === '1'" icon="el-icon-edit" type="primary" class="el-button-opt" @click="handleAgentSetup(scope.$index, scope.row)">设定</el-button>
            <el-button v-if="arrJxb[13] === '1'" type="warning" class="el-button-opt" @click="handleLimitSetup(scope.$index, scope.row)">权限</el-button>
            <el-button v-if="arrJxb[6] === '1'" icon="el-icon-plus" type="danger" class="el-button-opt2" @click="handleAddMember(scope.$index, scope.row, 1)">添加代理/玩家</el-button>
            <!-- <el-button v-if="arrJxb[6] === '1'" type="success" class="el-button-opt" @click="handleAddMember(scope.$index, scope.row, 2)">添加会员</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pageSize !== 10"
        :current-page="1"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="agentAdminFrm.totalItemsNum"
        style="float: right; margin-top: 10px;"
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
    <!-- eslint-disable-next-line -->
    <AuthPermission ref="auths" :authData="authData" />
    <!-- eslint-disable-next-line -->
    <AddAM ref="addam" :amData="amData" />
    <!-- eslint-disable-next-line -->
    <AddAMMe ref="addamme" />

    <!-- you can add element-ui's tooltip -->
    <el-tooltip placement="top" :content="$t('action.backToTop')">
      <back-to-top :custom-style="this.$Global.myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex'
import ExportExcel from '@/components/ExportExcel'
import UpDown from './agent-action/up-down'
import SetUp from './agent-action/setup'
import AuthPermission from './agent-action/auth-permission'
import AddAM from './agent-action/add-agent-member'
import AddAMMe from './agent-action/add-my-agent-member'
import BackToTop from '@/components/BackToTop'
export default {
  components: {
    ExportExcel,
    UpDown,
    SetUp,
    AuthPermission,
    AddAM,
    AddAMMe,
    BackToTop
  },
  data() {
    return {
      arrJxb: this.$Global.optioner.arrJxb,
      checkSD: this.$Global.optioner.xmType,
      optName: '',
      pageSize: 10,
      curPage: 1,
      active: '',
      optionerScore: '',
      varlue: '双边',
      form: {
        account: '',
        nikename: ''
      },
      rules: {
        deposit: {
          type: 'string',
          required: true,
          message: '必填字段',
          trigger: 'change'
        }
      },
      // eslint-disable-next-line
      eData: {},
      upDownData: {},
      setupData: {},
      authData: {},
      amData: {}
    }
  },
  computed: {
    ...mapState({ agentAdminFrm: state => state.ht.agentAdminForm })
    // statememo() {
    //   if (this.$store.state.ht.edit_member_ok === true) {
    //     console.log('edit_member_ok')
    //     const agentName =
    //       this.$Global.selectInfo.selectAgent === ''
    //         ? this.$Global.optioner.UserName
    //         : this.$Global.selectInfo.selectAgent
    //     const sendStr = {
    //       router: 'GetAgentInfo',
    //       JsonData: {
    //         name: agentName,
    //         Id: this.$Global.optioner.Id,
    //         pageSize: this.pageSize,
    //         currentPage: this.curPage
    //       }
    //     }
    //     this.$pomelo.send(sendStr)
    //     // const sendStrs = {
    //     //   router: 'GetAgentTree',
    //     //   JsonData: { Id: this.$Global.optioner.Id }
    //     // }
    //     // this.$pomelo.send(sendStrs)
    //     this.$store.commit('ht/setAddMemberState', false)
    //   } else {
    //     console.log('edit_member_notnotntotok')
    //   }
    // }
  },
  // watch: {
  //   statememo() {}
  // },
  created() {
    const sendStr = {
      router: 'GetAgentInfo',
      JsonData: {
        name: this.$Global.optioner.UserName,
        Id: this.$Global.optioner.Id,
        pageSize: this.pageSize,
        currentPage: 1
      }
    }
    this.$pomelo.send(sendStr)
  },
  methods: {
    // 只能输入汉字、英文、数字
    // btKeyDown(e) {
    //   e.target.value = e.target.value.replace(/[^\a-\z\A-\Z0-9]/g,'')
    // },
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    handleOptScore(index, row, n) {
      if (this.$Global.optioner.arrJxb[7] === '0') return this.$message.warning('您没有该权限！请联系上级')
      const sendStr = {
        router: 'getOptScoreRecord',
        JsonData: { name: row.agentAccount, Id: this.$Global.optioner.Id }
      }
      this.$pomelo.send(sendStr)
      this.upDownData = row
      this.$refs.updown.dialogFormVisible = true
    },
    handleAgentSetup(index, row) {
      if (this.$Global.optioner.arrJxb[3] === '0') return this.$message.warning('您没有该权限！请联系上级')
      
      const sendStr = {
        router: 'getReferenceInfo',
        JsonData: { name: row.reference_name }
      }
      this.$pomelo.send(sendStr)
      setTimeout(() => {
        this.setupData = row
        this.$refs.setup.dialogFormVisible = true
      }, 500)
    },
    handleLimitSetup(index, row) {
      this.$pomelo.send({
        router: 'GetJxb',
        JsonData: {
          reference_name: row.reference_name,
          name: row.agentAccount
        }
      }) // 取上级权限
      setTimeout(()=>{
        this.authData = row
        this.$refs.auths.dialogFormVisible = true
      }, 800)
    },
    handleAddMyMember() {
      // console.log('查看洗码类型 ', index, row, n, m)
      // this.checkSD = this.$Global.optioner.xmType
      // if (m === undefined || m === '' || m === null) {
      //   this.checkSD = row.xmType
      //   if (this.$Global.optioner.arrJxb[6] === '0') {
      //     this.$message.warning('您没有该权限！请联系上级')
      //     return
      //   }
      // }
      // if (m === 1) {
      //   if (this.$Global.optioner.arrJxb[5] === '0') return this.$message.warning('您没有该权限！请联系上级')
      // }
      const sendStr = {
        router: 'GetOptionerInfo',
        JsonData: { name: this.$Global.optioner.UserName }
      }
      this.$pomelo.send(sendStr)
      this.$refs.addamme.dialogFormVisible = true
    },
    handleAddMember(index, row, n, m) {
      // console.log('查看洗码类型 ', index, row, n, m)
      this.checkSD = this.$Global.optioner.xmType
      if (m === undefined || m === '' || m === null) {
        this.checkSD = row.xmType
        if (this.$Global.optioner.arrJxb[6] === '0') {
          this.$message.warning('您没有该权限！请联系上级')
          return
        }
      }
      if (m === 1) {
        if (this.$Global.optioner.arrJxb[5] === '0') return this.$message.warning('您没有该权限！请联系上级')
      }
      const sendStr = {
        router: 'GetOptionerInfo',
        JsonData: { name: this.$Global.optioner.UserName }
      }
      this.$pomelo.send(sendStr)
      this.amData = row
      this.$refs.addam.dialogFormVisible = true
    },
    changeSwitch(data) {
      if (this.$Global.optioner.arrJxb[4] === '0') return this.$message.warning('您没有该权限！请联系上级')
      var n = data.sEnable === '禁用' ? 0 : 1
      var sendStr = {
        router: 'setUserState',
        JsonData: { name: data.agentAccount, state: n }
      }
      this.$pomelo.send(sendStr)
    },
    doFindAgent() {
      // if (this.form.account.trim() === '' && this.form.nikename.trim() === '') {
      //   // this.$message('请输入代理帐号或者昵称')
      //   return
      // }
      const sendStr = {
        router: 'GetAgentInfo',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          findname: this.form.account,
          nikename: this.form.nikename,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    doRefreshAgent() {
      this.form.nikename = ''
      this.form.account = ''
      const sendStr = {
        router: 'GetAgentInfo',
        JsonData: {
          name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleCurrentChange(val) {
      this.curPage = val
      const sendStr = {
        router: 'GetAgentInfo',
        JsonData: {
          name: this.$Global.selectInfo.selectAgent,
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: val
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleSizeChange(val) {
      this.pageSize = val
      const sendStr = {
        router: 'GetAgentInfo',
        JsonData: {
          name: this.$Global.selectInfo.selectAgent,
          Id: this.$Global.optioner.Id,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    cellClick(name, Id) {
      const sendStr = {
        router: 'GetAgentInfo',
        JsonData: {
          name: name,
          Id: Id,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    },
    excelExport() {
      this.eData = {
        tHeader: ['代理账号', '昵称', '当前余额', '占成比%', '洗码比(单/双)%', '洗码类型', '状态', '开户时间', '最近登录', '登录IP'],
        filterVal: ['agentAccount', 'name', 'aBalance', 'zcb', 'xmb', 'xmType', 'sEnable', 'createDate', 'lastLoginTime', 'loginIp'],
        list: this.agentAdminFrm.tableData
      }
      if (this.agentAdminFrm.tableData === undefined) {
        return
      }
      this.$refs.excel.excleForm = true
    }
  }
}
</script>

<style scoped>
.agentList {
  margin: 20px;
}
.el-button-opt {
  width: 80px;
  height: 25px;
  padding: 1px;
  margin: 1px;
}
.el-button-opt2 {
  width: 130px;
  height: 25px;
  padding: 1px;
  margin: 1px;
}
/* .edit-button {
  border: none;
  background: none;
  padding: 1px 5px;
  margin: 1px;
} */
</style>
