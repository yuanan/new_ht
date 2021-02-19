<template>
  <div>
    <el-dialog v-el-drag-dialog :title="`设定代理: ${agentSetupDigFrm.agentAccount}`" :visible.sync="dialogFormVisible" width="500px">
      <!-- 代理帐号：{{ agentSetupDigFrm.agentAccount }} -->
      <!-- <hr>
      <br> -->
      <el-form ref="agentSetupDigFrm" :model="agentSetupDigFrm" :inline="true" label-width="100px" size="medium">
        <el-form-item label="代理名称" prop="name">
          <el-input v-model="agentSetupDigFrm.name" autocomplete="off" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
        </el-form-item>
        <el-form-item label="登录密码" prop="accountPw">
          <el-input v-model="agentSetupDigFrm.accountPw" autocomplete="off" placeholder="不修改密码请留空" />
        </el-form-item>
        <el-form-item label="推广网址" prop="webAddr">
          <el-input v-model="agentSetupDigFrm.webAddr" autocomplete="off" placeholder="例：example.com" />
        </el-form-item>
        <el-form-item label="占成比例" prop="zcb">
          <!-- <el-input v-model="agentSetupDigFrm.zcb" autocomplete="off" type="number" /> -->
          <el-input-number v-model="agentSetupDigFrm.zcb" :step="10" :min="0" :max="upper.zcb" @change="handleChangeZ" />
        </el-form-item>
        <span class="max-set">最多可设: {{ upper.zcb }}</span>

        <el-form-item v-if="checkSD === '单边' || arrJxb[18] === '1'" label="洗码率单(%)" prop="xmb_s">
          <!-- <el-input v-model="agentSetupDigFrm.xmb_s" autocomplete="off" type="number" /> -->
          <el-input-number v-model="agentSetupDigFrm.xmb_s" :step="0.1" :min="0" :max="upper.xmb_s" @change="handleChangeS" />
        </el-form-item>
        <span v-if="checkSD === '单边' || arrJxb[18] === '1'" ref="" class="max-set">最多可设: {{ upper.xmb_s }}</span>

        <el-form-item v-if="checkSD === '双边' || arrJxb[18] === '1'" label="洗码率双(%)" prop="xmb_d">
          <!-- <el-input v-model="agentSetupDigFrm.xmb_d" autocomplete="off" type="number" /> -->
          <el-input-number v-model="agentSetupDigFrm.xmb_d" :step="0.1" :min="0" :max="upper.xmb_d" @change="handleChangeD" />
        </el-form-item>
        <span v-if="checkSD === '双边' || arrJxb[18] === '1'" class="max-set">最多可设:{{ upper.xmb_d }}</span>

        <el-form-item label="洗码类型" prop="xmKind">
          <el-select v-if="this.$Global.gxLength === 2 || this.$Global.optioner.arrJxb[18] === '1'" v-model="agentSetupDigFrm.xmKind" placeholder="请选择洗码类型" style="width: 155px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-else v-model="agentSetupDigFrm.xmKind" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="取款密码" prop="drawMoneyPw">
          <el-input v-model="agentSetupDigFrm.drawMoneyPw" autocomplete="off" placeholder="不修改密码请留空" />
        </el-form-item>
        <el-form-item label="一键结算密码" prop="oneKeyPw">
          <el-input v-model="agentSetupDigFrm.oneKeyPw" autocomplete="off" placeholder="不修改密码请留空" />
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
import elDragDialog from '@/directive/el-drag-dialog'
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
      arrJxb: this.$Global.optioner.arrJxb,
      checkSD: this.$Global.optioner.xmType,
      dialogFormVisible: false,
      agentSetupDigFrm: {
        name: '',
        agentAccount: '',
        zcb: '',
        xmb_s: '',
        xmb_d: '',
        xmKind: '',
        accountPw: '', // 账号密码,不修改留空
        drawMoneyPw: '', // 取款密码,不修改留空
        oneKeyPw: '',
        webAddr: '', // 一键结算密码,不修改留空
        company: ''
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
        this.agentSetupDigFrm.name = newValue.name
        this.agentSetupDigFrm.agentAccount = newValue.agentAccount
        this.agentSetupDigFrm.zcb = newValue.zcb
        this.agentSetupDigFrm.xmb_s = newValue.xmb_s
        this.agentSetupDigFrm.xmb_d = newValue.xmb_d
        this.agentSetupDigFrm.xmKind = newValue.xmType
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
      this.agentSetupDigFrm.accountPw = ''
      this.agentSetupDigFrm.webAddr = ''
      this.agentSetupDigFrm.drawMoneyPw = ''
      this.agentSetupDigFrm.oneKeyPw = ''
      this.dialogFormVisible = false
      this.$store.commit('ht/setModifiyState', false)
    },
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    handleChangeZ(value) {
      if (this.upper.zcb < value) {
        this.agentSetupDigFrm.zcb = 0
      }
    },
    handleChangeD(value) {
      if (this.upper.xmb_d < value) {
        this.agentSetupDigFrm.xmb_d = 0
      }
    },
    handleChangeS(value, e) {
      if (value > this.upper.xmb_s) {
        this.agentSetupDigFrm.xmb_s = 0
      }
    },
    Ok() {
      var frm = this.agentSetupDigFrm
      if (frm.zcb > this.upper.zcb) {
        return this.$message.warning('占成不能超过上线')
      }
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
        router: 'editAgentInfo',
        JsonData: {
          name: frm.agentAccount,
          nikename: frm.name || '',
          zcb: frm.zcb,
          xmb_s: frm.xmb_s,
          xmb_d: frm.xmb_d,
          pw: frm.accountPw !== '' ? this.$md5(frm.accountPw) : '', // + this.$Global.addPwStr
          level: 2,
          xmKind: frm.xmKind === '双边' ? 0 : 1,
          drawMoneyPw:
            frm.drawMoneyPw !== ''
              ? this.$md5(frm.drawMoneyPw + this.$Global.addPwStr)
              : '', // 密码都要加盐
          oneKeyPw:
            frm.oneKeyPw !== ''
              ? this.$md5(frm.oneKeyPw + this.$Global.addPwStr)
              : '', // 密码都要加盐
          webAddr: frm.webAddr || '',
          ip: this.$store.state.ip || '',
          optName: this.$Global.optioner.UserName
        }
      }
      this.$store.commit('ht/setModifiyState', false)
      this.$pomelo.send(sendStr)
      // console.log('send ', sendStr)
      // this.dialogFormVisible = false
    },
    Cancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.p-rec {
  display: flex;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  .p-tit {
    width: 100px;
    text-align: right;
  }
  .p-val {
    color: #F44336;
  }
}
.max-set {
  line-height: 38px;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
}
</style>
