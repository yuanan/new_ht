<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :title="`修改 ${agentAuth.agentAccount} 权限`"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      主要设定：
      <el-checkbox-group v-model="limitSetupDigFrm.checkLimitList1">
        <el-checkbox v-for="(item, index) in limitSetupDigFrm.limits1" :key="item" :label="index">
          {{ item }}
        </el-checkbox>
      </el-checkbox-group>
      <br>报表设定：
      <el-checkbox-group v-model="limitSetupDigFrm.checkLimitList2">
        <el-checkbox v-for="(item, index) in limitSetupDigFrm.limits2" :key="item" :label="index">{{ item }}</el-checkbox>
      </el-checkbox-group>
      <br>其它设定：
      <el-checkbox-group v-model="limitSetupDigFrm.checkLimitList3">
        <el-checkbox v-for="(item, index) in limitSetupDigFrm.limits3" :key="item" :label="index">{{ item }}</el-checkbox>
      </el-checkbox-group>
      <br>
      <br>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Cancel()">取 消</el-button>
        <el-button type="primary" @click="Ok()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  directives: { elDragDialog },
  // eslint-disable-next-line
  props: ['authData'],
  data() {
    return {
      dialogFormVisible: false,
      agentAuth: {},
      limitSetupDigFrm: {
        limit: '',
        checkLimitList1: [],
        checkLimitList2: [],
        checkLimitList3: [],
        limits1: [],
        limits2: [],
        limits3: [],
        limit_para1: [
          '代理管理',
          '会员管理',
          '会员总表',
          '修改会员/代理',
          '启用/停用会员、代理',
          '添加会员/代理',
          '给下级添加会员/代理',
          '加分减分'
        ],
        limit_para2: ['输赢报表', '会员交易', '在线投注'],
        limit_para3: [
          '添加子帐号',
          '修改子帐号',
          '设置权限',
          '一键结算洗码',
          '结算洗码',
          '在线客服',
          '代理公告',
          '编辑洗码类型'
        ],
        jxb: ''
      }
    }
  },
  computed: {
    ...mapState({ limitSetup: state => state.ht.agentLimit })
  },
  watch: {
    authData: {
      handler(newValue, oldValue) {
        this.agentAuth = newValue
        // console.log(this.agentAuth, this.limitSetup.jxb1, this.$Global.optioner.arrJxb)
        // this.auth = this.agentAuth.jxb.split(',')
        this.limitSetupDigFrm.limit = this.limitSetup
        var LimitSetupFrm = this.limitSetupDigFrm
        var upperLimit = LimitSetupFrm.limit.jxb1 // 上级权限表(jxb1)
        if (upperLimit === '') return
        LimitSetupFrm.limits1 = []
        LimitSetupFrm.limits2 = []
        LimitSetupFrm.limits3 = []
        var arrUpperLimit = upperLimit.split(',')
        var arrLimit = LimitSetupFrm.limit.jxb2.split(',') // 本帐户权限表(jxb2)
        var str1 = ''
        var str2 = ''
        var str3 = ''
        var p = { p1: 0, p2: 0, p3: 0 }
        for (var i = 0; i < arrUpperLimit.length; i++) {
          if (i < 8 && arrUpperLimit[i] === '1') {
            LimitSetupFrm.limits1.push(LimitSetupFrm.limit_para1[i]) // 上级有效则显示项加入
            if (arrLimit[i] === '1') str1 += p.p1 + ',' // 标志选中
            p.p1++
          }
          if (i >= 8 && i <= 10 && arrUpperLimit[i] === '1') {
            LimitSetupFrm.limits2.push(LimitSetupFrm.limit_para2[i - 8])
            if (arrLimit[i] === '1') str2 += p.p2 + ','
            p.p2++
          }
          if (i >= 11 && i <= 18 && arrUpperLimit[i] === '1') {
            // 加权限要改
            LimitSetupFrm.limits3.push(LimitSetupFrm.limit_para3[i - 11])
            if (arrLimit[i] === '1') {
              str3 += p.p3 + ','
            }
            p.p3++
          }
        }
        if (str1 !== '') {
          str1 = str1.substr(0, str1.length - 1)
          const arr1 = str1.split(',')
          this.limitSetupDigFrm.checkLimitList1 = arr1.map(Number)
        }
        if (str2 !== '') {
          str2 = str2.substr(0, str2.length - 1)
          var arr2 = str2.split(',')
          this.limitSetupDigFrm.checkLimitList2 = arr2.map(Number)
        }
        if (str3 !== '') {
          str3 = str3.substr(0, str3.length - 1)
          var arr3 = str3.split(',')
          this.limitSetupDigFrm.checkLimitList3 = arr3.map(Number)
        }
      }
    }
  },
  methods: {
    Ok() {
      var frm = this.limitSetupDigFrm
      var str1 = ''
      var str2 = ''
      // str3 = ''
      for (let i = 0; i < frm.limits1.length; i++) {
        if (frm.checkLimitList1.indexOf(i) >= 0) str1 += frm.limits1[i] + ','
      }
      for (let i = 0; i < frm.limits2.length; i++) {
        if (frm.checkLimitList2.indexOf(i) >= 0) str1 += frm.limits2[i] + ','
      }
      for (let i = 0; i < frm.limits3.length; i++) {
        if (frm.checkLimitList3.indexOf(i) >= 0) str1 += frm.limits3[i] + ','
      }
      str2 = ''
      for (let i = 0; i <= 7; i++) {
        str2 += (str1.indexOf(frm.limit_para1[i]) >= 0 ? '1' : '0') + ','
      }
      for (let i = 0; i <= 2; i++) {
        str2 += (str1.indexOf(frm.limit_para2[i]) >= 0 ? '1' : '0') + ','
      }
      for (let i = 0; i <= 7; i++) {
        str2 += (str1.indexOf(frm.limit_para3[i]) >= 0 ? '1' : '0') + ',' // 加权限要改
      }
      str2 = str2.substr(0, str2.length - 1)
      // console.log(frm.limit.jxb2, str2)
      // if (frm.limit.jxb2 === str2) {
      //   this.$message.warning('权限表未做任何修改!!')
      //   return
      // }
      const sendStr = {
        router: 'limitSetup',
        JsonData: { name: this.agentAuth.agentAccount, jxb: str2 }
      } // 权限表设定值
      console.log(sendStr)
      // this.$pomelo.send(sendStr)
      this.dialogFormVisible = false
    },
    Cancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
