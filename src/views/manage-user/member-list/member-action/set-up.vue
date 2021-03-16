<template>
  <div>
    <el-dialog v-el-drag-dialog :title="`设定玩家${memberSetupDigFrm.memberAccount}`" :visible.sync="dialogFormVisible" width="450px">
      <el-form ref="memberSetupDigFrm" :model="memberSetupDigFrm" inline label-width="100px" size="medium">
        <el-form-item label="账号">
          <el-input v-model="memberSetupDigFrm.memberAccount" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="p.name" autocomplete="off" @keyup.native="btKeyUp" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="p.accountPw" autocomplete="off" placeholder="不修改密码请留空" />
        </el-form-item>
        <el-form-item label="洗码类型">
          <el-select v-if="this.$Global.gxLength === 2 || this.$Global.optioner.arrJxb[18] === '1'" v-model="p.xmKind" placeholder="请选择洗码类型" style="width:155px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-else v-model="memberSetupDigFrm.xmKind" autocomplete="off" :disabled="true" />
        </el-form-item>

        <el-form-item v-if="checkSD === '单边' || arrJxb[18] === '1'" label="洗码率单(%)">
          <el-input-number v-model="p.xmb_s" :step="0.1" :min="0" :max="upper.xmb_s" @change="handleChangeS" />
        </el-form-item>
        <span v-if="checkSD === '单边' || arrJxb[18] === '1'" class="max-set">最多:{{ upper.xmb_s }}</span>

        <el-form-item v-if="checkSD === '双边' || arrJxb[18] === '1'" label="洗码率双(%)">
          <el-input-number v-model="p.xmb_d" :step="0.1" :min="0" :max="upper.xmb_d" @change="handleChangeD" />
        </el-form-item>
        <span v-if="checkSD === '双边' || arrJxb[18] === '1'" class="max-set">最多:{{ upper.xmb_d }}</span>

        <el-form-item label="取款密码">
          <el-input v-model="p.drawMoneyPw" autocomplete="off" placeholder="不修改密码请留空" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Cancel()">取 消</el-button>
        <el-button type="primary" @click="Ok()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  directives: { elDragDialog },
  props: {
    setupData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
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
      dialogFormVisible: false,
      arrJxb: this.$Global.optioner.arrJxb,
      checkSD: this.$Global.optioner.xmType,
      memberSetupDigFrm: {
        memberName: '',
        zcb: '',
        // xmb_s: '',
        // xmb_d: '',
        upper_xmb_s: '0.0', // 上级洗码比单
        upper_xmb_d: '0.0', // 上级洗码比双
        xmKind: '',
        accountPw: '', // 账号密码,不修改留空
        drawMoneyPw: '', // 取款密码,不修改留空
        webAddr: '' // 一键结算密码,不修改留空
      },
      p: {
        name: '',
        accountPw: '',
        xmb_s: '',
        xmb_d: '',
        drawMoneyPw: ''
      }
    }
  },
  computed: {
    ...mapState({ upper: state => state.ht.referenceInfo }),
    ...mapGetters(['MODIFY__OK'])
  },
  watch: {
    setupData: {
      handler(newValue, oldValue) {
        this.memberSetupDigFrm = newValue
        console.log('watch wwwwwwwwwwwwww', this.memberSetupDigFrm)
        this.p.name = this.memberSetupDigFrm.name
        this.p.xmb_s = Number(this.memberSetupDigFrm.xmb.split('/')[0])
        this.p.xmb_d = Number(this.memberSetupDigFrm.xmb.split('/')[1])
        this.p.xmKind = this.memberSetupDigFrm.xmKind

        // this.memberSetupDigFrm.accountPw = ''
        // this.memberSetupDigFrm.xmb_s = newValue.xmb_s
        // this.memberSetupDigFrm.xmb_d = newValue.xmb_d
        // this.memberSetupDigFrm.xmKind = newValue.xmKind
        // this.memberSetupDigFrm.drawMoneyPw = ''
      }
    },
    MODIFY__OK: function(val) {
      if (val) {
        this.close()
      }
    }
  },
  methods: {
    close() {
      this.p.accountPw = ''
      // this.p.name = ''
      // this.p.xmb_s = ''
      // this.p.xmb_d = ''
      this.p.drawMoneyPw = ''
      // this.memberSetupDigFrm = {}
      this.dialogFormVisible = false
      this.$store.commit('ht/setModifiyState', false)
    },
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    handleChangeD(value) {
      if (this.upper.xmb_d < value) {
        this.memberSetupDigFrm.xmb_d = 0
      }
    },
    handleChangeS(value, e) {
      if (value > this.upper.xmb_s) {
        this.memberSetupDigFrm.xmb_s = 0
      }
    },
    Ok() {
      var frm = this.p
      if (frm.xmb_s > this.upper.xmb_s || frm.xmb_d > this.upper.xmb_d) {
        return this.$message.warning('洗码比不能超过上线')
      }
      if (frm.accountPw.length >= 1 && frm.accountPw.length < 6) {
        this.$message.warning('密码不能小于6位')
        return
      }
      if (frm.accountPw !== '') {
        if (!/\d/.test(frm.accountPw) || !/[a-zA-Z]/.test(frm.accountPw)) return this.$message.warning('密码必须包含数字和英文字母')
      }
      const sendStr = {
        router: 'editMemberInfo',
        JsonData: {
          name: this.memberSetupDigFrm.memberAccount,
          nikename: this.p.name,
          zcb: null, // 会员没有占成
          xmb_s: this.p.xmb_s || 0,
          xmb_d: this.p.xmb_d || 0,
          xmKind: this.p.xmKind === '双边' ? 0 : 1,
          // eslint-disable-next-line
          pw: this.p.accountPw != '' ? this.$md5(this.p.accountPw) : '',
          // eslint-disable-next-line
          drawMoneyPw: this.p.drawMoneyPw != '' ? this.$md5(this.p.drawMoneyPw) : '',
          webAddr: this.p.webAddr || '',
          level: 3,
          ip: this.$store.state.ip || '',
          optName: this.$Global.optioner.UserName
        }
      }
      this.$store.commit('ht/setModifiyState', false)
      this.$pomelo.send(sendStr)
      // console.log('send ', sendStr)
    },
    Cancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.max-set {
  line-height: 38px;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
}
</style>
