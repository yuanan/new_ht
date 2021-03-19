<template>
  <div class="agentTotalList">
    <!-- <el-card class="search-section c-body"> -->
    <el-form ref="form" inline :model="form" size="medium">
      <el-form-item prop="account">
        <el-input v-model="form.account" placeholder="代理账号" clearable @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindagent()" />
      </el-form-item>
      <el-form-item prop="nikename">
        <el-input v-model="form.nikename" placeholder="昵称" clearable @keyup.native="btKeyUp" @keydown.native="btKeyUp" @keydown.enter.native="doFindagent()" />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" icon="el-icon-search" @click="doFindagent()">查找</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" icon="el-icon-refresh" @click="doRefreshagent()">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="info" icon="el-icon-refresh-right" @click="doReload()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- </el-card> -->

    <el-dialog title="修改代理密码>" :visible.sync="dialogFrm.dialogFormVisible" width="30%">
      <el-form ref="dialogFrm" :model="dialogFrm" :inline="true" label-width="100px">
        <el-form-item label="密码" prop="pass">
          <el-input v-model="dialogFrm.pass" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="chkPass">
          <el-input v-model="dialogFrm.chkPass" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dialogFrm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('dialogFrm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogFrm.dialogResultVisible" width="30%">
      <span icon="info">确认要结算删除操作吗</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFrm.dialogResultVisible=false">取 消</el-button>
        <el-button type="primary" @click="dialogFrm.dialogResultVisible=false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- :header-row-style="{ height:'15px' }"
      :cell-style="{ padding:'0px' }" -->
    <el-card>
      <el-button size="small" icon="el-icon-document" style="margin-bottom: 10px" @click="excelExport()">导出</el-button>
      <el-pagination
        :current-page="1"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="agentTotalList.totalItemsNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <el-table
        :header-cell-style="this.$Global.tableHeaderColor"
        :data="agentTotalList.tableData"
        :default-sort="{prop: 'mBalance', order: 'descending'}"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column property="agentAccount" label="代理帐号" fixed>
          <template slot-scope="scope">
            <span v-show="scope.row.onLineState=='在线'">
              <font color="red">{{ scope.row.agentAccount }}</font>
            </span>
            <span v-show="scope.row.onLineState=='离线'">{{ scope.row.agentAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column property="name" label="姓名" align="left" />
        <el-table-column property="upperAgent" label="所属代理" align="left">
          <template slot-scope="scope">
            <font color="#9c27b0">{{ scope.row.upperAgent }}</font>
          </template>
        </el-table-column>
        <el-table-column property="mBalance" sortable label="当前余额" align="right" width="120px" />
        <el-table-column property="xmb" label="洗码比(单/双)%" align="center" width="140px" />
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
        <el-table-column property="lastLoginIp" label="最近登录IP" align="left" min-width="90" />
        <el-table-column property="terminal" label="终端" align="left" />
        <el-table-column property="onLineState" label="在线状态" align="left" width="100">
          <template slot-scope="scope">
            <span v-show="scope.row.onLineState=='在线'">
              <font color="red">{{ scope.row.onLineState }}</font>
            </span>
            <span v-show="scope.row.onLineState=='离线'" style="color: grey">{{ scope.row.onLineState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="400px" padding="0px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              class="el-button-opt"
              @click="findAccountLog(scope.$index, scope.row)"
            >转帐记录</el-button>
            <el-button
              size="mini"
              type="primary"
              class="el-button-opt1"
              @click="findAccountLogDo(scope.$index, scope.row)"
            >操作转帐记录</el-button>
            <el-button
              size="mini"
              type="danger"
              class="el-button-opt"
              @click="findOptLog(scope.$index, scope.row)"
            >账户变更记录</el-button>
            <el-button
              size="mini"
              type="primary"
              class="el-button-opt1"
              @click="findOptLogDo(scope.$index, scope.row)"
            >操作账户变更记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pageSize !== 10"
        :current-page="1"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="agentTotalList.totalItemsNum"
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
import ExportExcel from '@/components/ExportExcel'
import BackToTop from '@/components/BackToTop'
export default {
  components: {
    ExportExcel,
    BackToTop
  },
  data() {
    return {
      pageSize: 10,
      level: this.$Global.optioner.level,
      dialogFrm: {
        pass: '',
        chkPass: '',
        dialogFormVisible: false,
        dialogResultVisible: false
      },
      agentTotalListFrm: {
        totalItemsNum: 1,
        tableData: [
          {
            agentAccount: '888888',
            name: 'test',
            upperAgent: '959595',
            mBalance: '0.00',
            xmb: '0.0',
            createDate: '2016-05-02',
            lastLoginIp: '127.0.0.1',
            terminal: 'pc',
            onLineState: '离线',
            sEnable: '启用'
          }
        ]
      },
      form: {
        account: '',
        nikename: ''
      },
      // eslint-disable-next-line
      eData: {}
    }
  },
  computed: {
    ...mapState({ agentTotalList: state => state.ht.agentTotalListForm })
  },
  created() {
    const sendStr = {
      router: 'GetTotalAgent',
      JsonData: {
        Id: this.$Global.optioner.Id,
        name: this.$Global.optioner.UserName,
        pageSize: this.pageSize,
        currentPage: 1
      }
    }
    // console.log('sendStr ', sendStr)
    this.$pomelo.send(sendStr)
  },
  methods: {
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    findAccountLog(index, row) {
      this.goPage('/recordsPage/access-records', { name: row.agentAccount })
    },
    findAccountLogDo(index, row) {
      this.goPage('/recordsPage/access-records', { opt_name: row.agentAccount })
    },
    findOptLog(index, row) {
      this.goPage('/recordsPage/account-change-records', { name: row.agentAccount })
    },
    findOptLogDo(index, row) {
      this.goPage('/recordsPage/account-change-records', { opt_name: row.agentAccount })
    },
    goPage(router, query) {
      this.$router.push({
        path: `${router}`,
        query: query
      })
    },
    doFindagent() {
      if (this.form.account.trim() === '' && this.form.nikename.trim() === '') {
        // this.$message.warning('请输入代理帐号或者昵称')
        return
      }
      const sendStr = {
        router: 'GetTotalAgent',
        JsonData: {
          opt_name: this.$Global.optioner.UserName,
          Id: this.$Global.optioner.Id,
          name: this.$Global.optioner.UserName,
          findname: this.form.account || '',
          nikename: this.form.nikename || '',
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    doRefreshagent() {
      this.form.account = ''
      this.form.nikename = ''
      const sendStr = {
        router: 'GetTotalAgent',
        JsonData: {
          Id: this.$Global.optioner.Id,
          name: this.$Global.optioner.UserName,
          pageSize: this.pageSize,
          currentPage: 1
        }
      } // 刷新
      this.$pomelo.send(sendStr)
    },
    doReload() {
      this.form.account = ''
      this.form.nikename = ''
      this.pageSize = 10
      const sendStr = {
        router: 'GetTotalAgent',
        JsonData: {
          Id: this.$Global.optioner.Id,
          name: this.$Global.optioner.UserName,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleCurrentChange(val) {
      var name = this.form.account
      var nikename = this.form.nikename
      if (nikename === '' && name === '') {
        name = this.$Global.optioner.UserName
      }
      const sendStr = {
        router: 'GetTotalAgent',
        JsonData: {
          Id: this.$Global.optioner.Id,
          name: name,
          nikename: nikename,
          pageSize: this.pageSize,
          currentPage: val
        }
      }
      this.$pomelo.send(sendStr)
    },
    handleSizeChange(val) {
      this.pageSize = val
      var name = this.form.account
      var nikename = this.form.nikename
      if (nikename === '' && name === '') {
        name = this.$Global.optioner.UserName
      }
      const sendStr = {
        router: 'GetTotalAgent',
        JsonData: {
          Id: this.$Global.optioner.Id,
          name: name,
          nikename: nikename,
          pageSize: this.pageSize,
          currentPage: 1
        }
      }
      this.$pomelo.send(sendStr)
    },
    doCloseXm() {
      const sendStr = {
        router: 'closeXm',
        JsonData: {
          Id: this.$Global.optioner.Id,
          name: this.$Global.optioner.UserName
        }
      } // 刷新
      this.$pomelo.send(sendStr)
    },
    handleDelete() {
      this.dialogFrm.dialogResultVisible = true
    },
    changeSwitch(data) {
      if (data.sEnable === '禁用') this.$message('设为禁用成功')
      if (data.sEnable === '启用') this.$message('设为启用成功')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'color-row'
      }
      return ''
    },
    excelExport() {
      this.eData = {
        tHeader: ['代理账号', '姓名', '所属代理', '当前余额', '洗码比(单/双)%', '状态', '最近登录IP', '在线状态'],
        filterVal: ['agentAccount', 'name', 'upperAgent', 'mBalance', 'xmb', 'sEnable', 'lastLoginIp', 'onLineState'],
        list: this.agentTotalList.tableData
      }
      if (this.agentTotalList.tableData === undefined) {
        return
      }
      this.$refs.excel.excleForm = true
    }
  }
}
</script>
<style scoped>
.agentTotalList {
  margin: 10px;
  min-width: 1080px;
}
.el-button-opt {
  width: 80px;
  height: 25px;
  padding: 1px;
  margin: 1px;
}
.el-button-opt1 {
  width: 105px;
  height: 25px;
  padding: 1px;
  margin: 1px;
}
.el-pagination {
  float: right;
  min-width: 200px;
}
.c-body {
  height: 80px;
}
</style>
