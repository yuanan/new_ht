<template>
  <div>
    <el-dialog v-el-drag-dialog :title="`为 ${$Global.optioner.UserName} 添加代理/玩家`" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="myFrm" :model="myFrm" :inline="true" label-width="100px" size="medium">

        <el-row>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="操作类型">
                <el-radio-group v-model="myFrm.type">
                  <el-radio label="添加代理" />
                  <el-radio label="添加玩家" />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="账号" prop="memberName" required>
                <el-input v-model="myFrm.memberName" autocomplete="off" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
              </el-form-item>
              <el-form-item label="密码" prop="pw" required>
                <el-input v-model="myFrm.pw" autocomplete="off" />
              </el-form-item>
              <el-form-item label="特别备注" prop="memo">
                <el-input v-model="myFrm.memo" autocomplete="off" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="上级">
                <font color="#9c27b0">{{ $Global.optioner.UserName }}</font>
              </el-form-item>
              <el-form-item label="昵称" prop="memberNikeName">
                <el-input v-model="myFrm.memberNikeName" autocomplete="off" @keyup.native="btKeyUp" @keydown.native="btKeyUp" />
              </el-form-item>
              <el-form-item label="取款密码" prop="drawMoneyPw">
                <el-input v-model="myFrm.drawMoneyPw" autocomplete="off" />
              </el-form-item>
              <el-form-item label="洗码类型" prop="xmType">
                <el-select v-if="this.$Global.gxLength === 2 || this.$Global.optioner.arrJxb[18] === '1'" v-model="myFrm.xmType" placeholder="请选择洗码类型" style="width: 155px">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-input v-else v-model="myFrm.xmType" autocomplete="off" :disabled="true" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-form-item label="存入金额" prop="depositMoney">
          <el-input v-model="myFrm.depositMoney" type="number" autocomplete="off" />
        </el-form-item>
        <span class="max-set">我的余额: {{ optionerScore }}</span>

        <el-form-item label="占成比例" prop="zcb">
          <el-input-number v-model="myFrm.zcb" :step="10" :min="0" :max="this.$Global.optioner.zcb" @change="handleChangeZ" />
        </el-form-item>
        <span class="max-set">最多可设: {{ this.$Global.optioner.zcb }}</span>

        <el-form-item v-if="checkSD === '单边' || arrJxb[18] === '1'" label="洗码率单(%)" prop="xmb_s">
          <el-input-number v-model="myFrm.xmb_s" :step="0.1" :min="0" :max="this.$Global.optioner.xmb_s" @change="handleChangeS" />
        </el-form-item>
        <span v-if="checkSD === '单边' || arrJxb[18] === '1'" class="max-set">最多可设: {{ this.$Global.optioner.xmb_s }}</span>

        <el-form-item v-if="checkSD === '双边' || arrJxb[18] === '1'" label="洗码率双(%)" prop="xmb_d">
          <el-input-number v-model="myFrm.xmb_d" :step="0.1" :min="0" :max="this.$Global.optioner.xmb_d" @change="handleChangeD" />
        </el-form-item>
        <span v-if="checkSD === '双边' || arrJxb[18] === '1'" class="max-set">最多可设: {{ this.$Global.optioner.xmb_d }}</span>

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
  data() {
    return {
      arrJxb: this.$Global.optioner.arrJxb,
      checkSD: this.$Global.optioner.xmType,
      dialogFormVisible: false,
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
      myFrm: {
        opt: '',
        memberName: '',
        memberNikeName: '',
        zcb: 0,
        xmb_s: '0.0', // 洗码比
        xmb_d: '0.0',
        xmType: this.$Global.optioner.xmType, // 洗码类型
        depositMoney: '0', // 存入金额
        memo: '', // 特别的备注
        pw: '', // 帐号密码
        type: '添加代理',
        drawMoneyPw: '' // 存款
      },
      propData: {}
    }
  },
  computed: {
    ...mapState({ optionerScore: state => state.ht.optionerScore }),
    ...mapGetters(['EDIT_MY_MEMBER_OK'])
  },
  watch: {
    EDIT_MY_MEMBER_OK: function(val) {
      if (val) {
        this.close()
      }
    }
  },
  methods: {
    close() {
      this.myFrm = {}
      this.dialogFormVisible = false
      this.myFrm.xmType = this.$Global.optioner.xmType
      this.myFrm.zcb = 0
      this.myFrm.xmb_s = 0
      this.myFrm.xmb_d = 0
      this.myFrm.type = '添加代理'
      this.$store.commit('ht/setAddMyMemberState', false)
    },
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    handleChangeZ(value) {
      if (this.$Global.optioner.zcb < value) {
        this.myFrm.zcb = 0
      }
    },
    handleChangeD(value) {
      if (this.$Global.optioner.xmb_d < value) {
        this.myFrm.xmb_d = 0
      }
    },
    handleChangeS(value, e) {
      if (value > this.$Global.optioner.xmb_s) {
        this.myFrm.xmb_s = 0
      }
    },
    Ok() {
      const frm = this.myFrm
      if (frm.memberName === '') {
        this.$message.warning('代理帐号不能为空')
        return
      }
      // if (frm.xmb_s === '' || frm.xmb_d === '') {
      //   this.$message.warning('洗码比不能为空')
      //   return
      // }
      if (frm.pw.length < 6) {
        this.$message.warning('帐号密码不能小于6位')
        return
      }
      if (frm.xmb_s > this.$Global.optioner.xmb_s || frm.xmb_d > this.$Global.optioner.xmb_d) {
        this.$message.warning('洗码比例不能超过上级')
        return
      }
      if (frm.zcb > this.$Global.optioner.zcb) {
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
          nikename: frm.memberNikeName || '',
          xmb_s: frm.xmb_s || 0,
          xmb_d: frm.xmb_d || 0,
          xmKind: frm.xmKind === '双边' ? 0 : 1,
          depositMoney: frm.depositMoney,
          memo: frm.memo || '',
          zc: frm.zcb || 0,
          optLevel: this.myFrm.type === '添加代理' ? 1 : 2, // 1 添加代理,2 添加会员
          pw: this.$md5(frm.pw),
          opt_name: this.$Global.optioner.UserName,
          opt_Id: this.$Global.optioner.Id,
          upper_name: this.$Global.optioner.UserName,
          ip: this.$store.state.ip || ''
        }
      }
      this.$store.commit('ht/setAddMyMemberState', false)
      this.$pomelo.send(sendStr)
      // console.log('sendStr ', sendStr)
      // this.dialogFormVisible = false
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
