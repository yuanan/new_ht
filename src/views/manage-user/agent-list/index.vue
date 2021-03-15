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
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" icon="el-icon-refresh" @click="doRefreshAgent()">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" icon="el-icon-plus" @click="handleAddMyMember()">添加代理/玩家</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :span="19">
        <el-card>
          <el-button size="small" icon="el-icon-document" style="margin-bottom: 10px; margin-right: 10px;" @click="excelExport()">导出</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              添加显示<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-checkbox v-model="showTable.LastLogin" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
                  最近登录时间
                </el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox v-model="showTable.LastLoginIP" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
                  最近登录IP
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
            :key="tableKey"
            :header-cell-style="this.$Global.tableHeaderColor"
            :data="agentAdminFrm.tableData"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
          >
            <el-table-column property="Id" fixed label="ID" />
            <el-table-column property="agentAccount" fixed label="代理帐号" width="120">
              <template slot-scope="scope">
                <span @click="cellClick(scope.row.agentAccount, scope.row.Id)">
                  <font color="blue" style="cursor: pointer">{{ scope.row.agentAccount }}</font>
                </span>
              </template>
            </el-table-column>
            <el-table-column property="name" label="昵称">
              <template slot-scope="scope">
                <span v-show="scope.row.onLine === '在线'">
                  <font color="red">{{ scope.row.name }}</font>
                </span>
                <span v-show="scope.row.onLine === '离线'">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column property="aBalance" label="当前余额" />
            <el-table-column property="reference_name" label="上级代理" />
            <el-table-column property="zcb" label="占成比(%)" width="90px" />
            <el-table-column property="xmb" label="洗码比(单/双)%" width="80px" />
            <el-table-column property="xmType" label="洗码类型" width="100" />
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
            <el-table-column v-if="showTable.LastLogin" property="lastLoginTime" label="最近登录" min-width="110px" />
            <el-table-column v-if="showTable.LastLoginIP" property="loginIp" label="登录IP" />
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
      </el-col>
      <el-col :span="5">
        <el-row>
          <el-card>
            <font color="grey" size="2">关系 : </font>
            <el-button v-for="i in relation" :key="i" type="text" size="medium" @click="handleRelationsBtn(i)">{{ i }} > </el-button>
          </el-card>
        </el-row>
        <br>
        <el-row>
          <el-card>
            <div class="relations">
              <el-input v-model="searchRelations" placeholder="账号关系" @keydown.enter.native="handleCheck(searchRelations)" @keyup.enter.native="testSearch(searchRelations)" />

              <el-button type="primary" plain @click="testSearch(searchRelations)">搜索下级</el-button>
            </div>
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              class="tree"
              node-key="name"
              :indent="0"
              :default-expanded-keys="expandedData"
              :expand-on-click-node="false"
              @check="handleCheck"
              @node-click="handleNodeClick"
            />
          </el-card>
        </el-row>
      </el-col>
    </el-row>

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
      searchRelations: '',
      arrJxb: this.$Global.optioner.arrJxb,
      checkSD: this.$Global.optioner.xmType,
      optName: '',
      pageSize: 10,
      curPage: 1,
      tableKey: 0,
      showTable: {
        LastLogin: false,
        LastLoginIP: false
      },
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
      amData: {},
      // tree relations
      treeData: [],
      expandedData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    }
  },
  computed: {
    ...mapState({ 
      agentAdminFrm: state => state.ht.agentAdminForm,
      wsData: state => state.ht.treeData,
      relation: state => state.ht.relations
    })
  },
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
    this.getRelations()
    // this.getData()
    this.$store.commit('ht/setRelations', [this.$Global.optioner.UserName])
    this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
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
      this.findPatentValue(this.treeData, this.form.account)
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
      this.testSearch(this.form.account)
    },
    doRefreshAgent() {
      this.form.nikename = ''
      this.form.account = ''
      this.$store.commit('ht/setRelations', [this.$Global.optioner.UserName])
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
      this.testSearch(name)
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
    getRelations() {
      const sendStr = {
          router: "GetAgentTree",
          JsonData: { Id: this.$Global.optioner.Id }
        }
      this.$pomelo.send(sendStr)
      setTimeout(() => {
        this.getData()
      }, 1000)
      
    },
    getData() {
      // console.log('get Data ... ', this.wsData)
      // if (!this.wsData.tableData || this.wsData.tableData.length <= 1) return
      var content = this.wsData.tableData
      for (var i = 0; i < content.length; i++) {
        var d = content[i].gx.split("^")
        var dd = d[d.length - 2]
        content[i].pid = dd // 上家的id
        content[i].children = []
      }
      // console.log("expandedData:",this.expandedData)
      let dataArray = []
      var self = this
      content.forEach(function (data) {
        let pid = data.pid
        if (data.Id == self.$Global.optioner.Id) {
          let objTemp = {
            Id: data.Id,
            name: data.name,
            gx: data.gx,
            pid: pid,
            xmb_s: data.xmb_s,
            xmb_d: data.xmb_d
          }
          dataArray.push(objTemp)
        }
      })
      this.deepSort(content, dataArray)
    },
    deepSort(datas, dataArray) {
      for (let j = 0; j < dataArray.length; j++) {
        let dataArrayIndex = dataArray[j]
        let childrenArray = []
        let Id = dataArrayIndex.Id
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i]
          let pid = data.pid
          if (pid == Id) {
            // 判断是否为儿子节点
            let objTemp = {
              Id: data.Id,
              name: data.name,
              gx: data.gx,
              pid: pid,
              xmb_s: data.xmb_s,
              xmb_d: data.xmb_d
            }
            childrenArray.push(objTemp)
          }
        }
        dataArrayIndex.children = childrenArray
        if (childrenArray.length > 0) {
          // 有子节点则递归
          this.deepSort(datas, childrenArray)
        }
      }
      this.treeData = dataArray // treeData
      // console.log('this.treeData .... ', this.treeData)
      return dataArray
    },
    handleNodeClick(data) {
      var Id = data.Id
      this.expandedData = []
      this.expandedData.push(data.name)
      console.log("this.expandedData .... ", this.expandedData)
      this.testSearch(data.name)
      this.searchRelations = data.name
      // var selectItem = this.$Global.selectInfo.selectItem;
      // this.$Global.selectInfo.selectAgent = data.name;
      // this.$Global.selectInfo.xmb_d = data.xmb_d;
      // this.$Global.selectInfo.xmb_s = data.xmb_s;
      // if (selectItem == "会员管理") {
      //   var sendStr = {
      //     router: "GetMemberInfo",
      //     JsonData: { name: data.name, Id: Id, pageSize: 12, currentPage: 1 },
      //   };
      // }
      // if (selectItem == "代理管理") {
      const sendStr = {
        router: "GetAgentInfo",
        JsonData: { name: data.name, Id: Id, pageSize: this.pageSize, currentPage: 1 }
      }
      // }
      // if (selectItem == "会员管理" || selectItem == "代理管理")
      this.$pomelo.send(sendStr);
      //this.$refs.tree.store.nodesMap[data.id].expanded = true;
    },
    // 点击复选框
    handleCheck(data){
      console.log(this.$refs.tree.store.nodesMap[data].id, this.$refs.tree.store.nodesMap)
      this.relation.forEach(v => {
        this.$refs.tree.store.nodesMap[v].expanded = true
      })
      // this.$refs.tree.store.nodesMap[this.$Global.optioner.UserName].expanded = true
      // this.$refs.tree.store.nodesMap[data].expanded = true
      // data.unfold = true
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
    },
    testSearch(value) {
      this.expandedData = []
      this.expandedData.push(value)
      console.log(value)
      let re = this.findPatentValue(this.treeData, value)
      console.log('iiiiiiiiii', re)
      if (re != null) {
        this.$store.commit('ht/setRelations', re)
      }
    },
    findPatentValue (array, value, valueName = 'name', childrenName = 'children') {
      if (!value || !Array.isArray(array)) return []
        const result = []
        let valid = false
        const seek = (array, value) => {
        let parentValue = ''
        const up = (array, value, lastValue) => {
          array.forEach(v => {
            const val = v[valueName]
            const child = v[childrenName]
            if (val === value) {
              valid = true
              parentValue = lastValue
              console.log('last Value .. ', lastValue)
              return
            }
            if (child && child.length) up(child, value, val)
          })
        }
        up(array, value)
        if (parentValue) {
            result.unshift(parentValue)
            console.log('reuslt ... ', result, parentValue)
            seek(array, parentValue)
        }
      }
      seek(array, value)
      return valid ? [...result, value] : []
    },
    handleRelationsBtn(value) {
      this.relation.forEach((val, i) => {
        if (val === value) {
          let relations = this.relation.splice(0, i + 1)
          console.log('relations =====', relations)
          this.$store.commit('ht/setRelations', relations)
        }
      })
      const sendStr = {
        router: 'GetAgentInfo',
        JsonData: {
          name: value,
          Id: '',
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
      this.relation.forEach(v => {
        this.$refs.tree.store.nodesMap[v].expanded = true
      })
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
.relations{
  display: flex;
  margin-bottom: 10px;
}
</style>

<style>
.el-tree-node__expand-icon.is-leaf::before {
  display: none;
}
.el-tree-node__content>.el-tree-node__expand-icon{
  color: red !important;
}
.tree /deep/ .el-tree-node {
  position: relative;
  padding-left: 15px;
}
.el-tree {
  
  height: 60vh;
  width: 100%;
  overflow-x: scroll;
}

.el-tree>.el-tree-node {
  display: inline-block;
  min-width: 100%;
}

.tree /deep/ .el-tree-node__children {
  padding: 0 10px;
  overflow-x: scroll;
}

.tree /deep/ .el-tree-node :last-child:before {
  height: 38px;
}

.tree /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree /deep/ .el-tree-node:before {
  content: "";
  left: -5px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree /deep/ .el-tree-node:after {
  content: "";
  left: -5px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree /deep/ .el-tree-node:before {
  border-left: 1px double #ee0a24;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.tree /deep/ .el-tree-node:after {
  border-top: 1px dashed #ee0a24;
  height: 20px;
  top: 12px;
  width: 24px;
}

/* .el-tree-node.is-current > .el-tree-node__content {
    background-color: #1989fa4d !important;
    color: red;
} */
</style>