<template>
  <div class="memberList">
    <el-form ref="form" :inline="true" :model="form" label-width="90px" size="medium">
      <el-form-item prop="account">
        <el-input v-model="form.account" placeholder="会员账号" class="inputBox" @keyup.native="btKeyUp" @keydown.enter.native="doFindMember" />
      </el-form-item>
      <el-form-item prop="nikename">
        <el-input v-model="form.nikename" placeholder="昵称" class="inputBox" @keyup.native="btKeyUp" @keydown.enter.native="doFindMember" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-search" type="primary" @click="doFindMember()">查找</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="doRefreshMember()">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :span="19">
        <el-card>
          <el-button size="small" icon="el-icon-document" style="margin-bottom: 10px" @click="excelExport()">导出</el-button>
          <el-checkbox v-model="showTable.createDate" class="filter-item" style="margin-left:15px; color: #FF5722" @change="tableKey=tableKey+1">
            开户时间
          </el-checkbox>
          <el-checkbox v-model="showTable.lastLogin" class="filter-item" style="color: #FF5722" @change="tableKey=tableKey+1">
            最近登录时间
          </el-checkbox>
          <el-checkbox v-model="showTable.LastLoginIP" class="filter-item" style="color: #FF5722" @change="tableKey=tableKey+1">
            最近登录IP
          </el-checkbox>
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
            <el-table-column property="upperAgent" label="所属代理" align="left">
              <template slot-scope="scope">
                <font color="#9c27b0" style="cursor: pointer" @click="getMemberRelations(scope.row.upperAgent)">{{ scope.row.upperAgent }}</font>
              </template>
            </el-table-column>
            <el-table-column property="xmKind" label="洗码类型" align="left" min-width="90" />
            <el-table-column property="xmb" label="洗码比(单/双)%" align="left" min-width="80px" />
            <el-table-column v-if="showTable.createDate" property="createDate" label="开户日期" align="left" min-width="110px" />
            <el-table-column v-if="showTable.LastLoginIP" property="lastLoginIp" label="最近登录IP" align="left" min-width="110" />
            <el-table-column v-if="showTable.lastLogin" property="lastLoginTime" label="最近登录" align="left" min-width="110px" />
            <el-table-column property="onLine" label="在线" align="left" width="80">
              <template slot-scope="scope">
                <span v-show="scope.row.onLine==='在线'">
                  <font color="red">{{ scope.row.onLine }}</font>
                </span>
                <span v-show="scope.row.onLine==='离线'">{{ scope.row.onLine }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sEnable" label="状态" align="center" width="80px">
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
import { mapState, mapGetters } from 'vuex'
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
      showTable: {
        createDate: false,
        lastLogin: false,
        LastLoginIP: false
      },
      tableKey: 0,
      form: {
        account: '',
        nikename: ''
      },
      // tree relations
      searchRelations: '',
      treeData: [],
      expandedData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // eslint-disable-next-line
      eData: {},
      upDownData: {},
      setupData: {}
    }
  },
  computed: {
    ...mapState({
      memberListFrm: state => state.ht.memberListForm,
      wsData: state => state.ht.treeData,
      relation: state => state.ht.relations
    }),
    ...mapGetters(['SEARCH_MEMBER_OK'])
  },
  watch: {
    SEARCH_MEMBER_OK: function(n) {
      console.log(n, '....=============')
      if (n) {
        this.searchOK()
      }
    }
  },
  created() {
    var routerParams = this.$route.query
    if (routerParams.name !== undefined) {
      this.getRelations()
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          name: routerParams.name,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
      setTimeout(() => {
        this.testSearch(routerParams.name)
      }, 1500)
      // this.getMemberRelations(routerParams.name)
    } else {
      this.getRelations()
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          name: this.$Global.optioner.UserName,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
      this.getRelations()
      // this.getData()
      this.$store.commit('ht/setRelations', [this.$Global.optioner.UserName])
    }
    this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
  },
  methods: {
    searchOK() {
      console.log('search OKK ')
      this.$store.commit('ht/setSearchMemberState', false)
      if (this.memberListFrm.tableData[0]) {
        this.testSearch(this.memberListFrm.tableData[0].upperAgent || '')
      }
      if (this.relation.length <= 0) {
        console.log('nulllllllllllllllll')
        this.$store.commit('ht/setRelations', [this.$Global.optioner.UserName])
      }
    },
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
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
        console.log('this.setupdata ....... ', this.setupData)
        this.$refs.setup.dialogFormVisible = true
      }, 500)
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
      this.$store.commit('ht/setSearchMemberState', false)
    },
    doRefreshMember() {
      this.form.account = ''
      this.form.nikename = ''
      // this.$Global.selectInfo.selectAgent = this.$Global.optioner.UserName
      // this.$Global.selectInfo.xmb_s = this.$store.state.ht.myInfo.xmb_s
      // this.$Global.selectInfo.xmb_d = this.$store.state.ht.myInfo.xmb_d
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          name: this.$Global.optioner.UserName,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
      this.$store.commit('ht/setSearchMemberState', false)
    },
    handleCurrentChange(val) {
      this.curPage = val
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: {
          name: this.relation[this.relation.length - 1],
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
          name: this.relation[this.relation.length - 1],
          pageSize: this.pageSize,
          currentPage: this.curPage
        }
      }
      this.$pomelo.send(sendStr)
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
    getMemberRelations(uppername) {
      this.testSearch(uppername)
    },
    getRelations() {
      const sendStr = {
        router: 'GetAgentTree',
        JsonData: { Id: this.$Global.optioner.Id }
      }
      this.$pomelo.send(sendStr)
      setTimeout(() => {
        this.getData()
      }, 800)
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
      console.log('this.expandedData .... ', this.expandedData)
      this.testSearch(data.name)
      this.searchRelations = data.name
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: { name: data.name, Id: Id, pageSize: this.pageSize, currentPage: 1 }
      }
      this.$pomelo.send(sendStr)
    },
    // 点击复选框
    handleCheck(data) {
      if (data === '') return
      console.log(this.$refs.tree.store.nodesMap[data].id, this.$refs.tree.store.nodesMap, data, 'data ==============')
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
        tHeader: ['会员账号', '昵称', '洗码类型', '所属代理', '当前余额', '洗码比(单/双)%', '状态', '开户日期'],
        filterVal: ['memberAccount', 'name', 'xmType', 'upperAgent', 'mBalance', 'xmb', 'sEnable', 'createDate'],
        list: this.memberListFrm.tableData
      }
      if (this.memberListFrm.tableData === undefined) {
        return
      }
      this.$refs.excel.excleForm = true
    },
    testSearch(value) {
      if (value === '') return
      this.expandedData = []
      this.expandedData.push(value)
      console.log('testSearch ... ', value)
      const re = this.findPatentValue(this.treeData, value)
      console.log('iiiiiiiiii', re)
      if (re != null) {
        this.$store.commit('ht/setRelations', re)
      }
    },
    findPatentValue(array, value, valueName = 'name', childrenName = 'children') {
      console.log('valudee ', value)
      // if (!value || !Array.isArray(array)) return []
      let result = []
      let valid = false
      let seek = (array, value) => {
        let parentValue = ''
        let up = (array, value, lastValue) => {
          array.forEach(v => {
            let val = v[valueName]
            let child = v[childrenName]
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
          const relations = this.relation.splice(0, i + 1)
          console.log('relations =====', relations)
          this.$store.commit('ht/setRelations', relations)
        }
      })
      const sendStr = {
        router: 'GetMemberInfo',
        JsonData: { name: value, Id: '', pageSize: this.pageSize, currentPage: 1 }
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
.memberList {
  margin: 20px;
}
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
.relations{
  display: flex;
  margin-bottom: 10px;
}
</style>
