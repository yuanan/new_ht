<template>
  <div>
    <el-form>
      <el-form-item label="原始密码">
        <el-input v-model="editPwDialogFrm.oldPw" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="editPwDialogFrm.newPw" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="editPwDialogFrm.pw_ok" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="this.$Global.optioner.level == 1" label="一键洗码密码:">
        <el-input v-model="editPwDialogFrm.onekey_pw" autocomplete="off" placeholder="不填请留空" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Update</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <fieldset class="notice_password_hint">
      <legend style="margin: 0 5px; padding: 0 5px; color: #3F51B5">
        公司信息安全部提醒您
      </legend>
      <font color="#424242">为了保护您的账号和资金安全, 请不要设置过于简单的密码<br>例如：888888/111111/12345678/和用户名相同等..<br></font>
      <font color="#3F51B5">请使用 英文字母大小写+数字+特殊字符串(8位数以上)<br>建议您至少一个月更换一次密码</font>
    </fieldset>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHtInfo, setHtInfo } from '@/utils/auth'
import AES from '@/api/aes'
export default {
  data() {
    return {
      oldPw: '',
      newPw: '',
      pw_ok: '',
      alertMsg: '',
      onekey_pw: '',
      editPwDialogFrm: {
        oldPw: '',
        newPw: '',
        pw_ok: '',
        onekey_pw: ''
      }
    }
  },
  computed: {
    ...mapGetters(['EDIT_PASSWORD_OK'])
  },
  watch: {
    EDIT_PASSWORD_OK: function(val) {
      if (val) {
        this.close()
      }
    }
  },
  methods: {
    close() {
      this.$Global.Pass = this.$Global.newPass
      this.editPwDialogFrm.oldPw = ''
      this.editPwDialogFrm.newPw = ''
      this.editPwDialogFrm.pw_ok = ''
      this.editPwDialogFrm.onekey_pw = ''
      this.$message.success('修改密码成功')
      let info = getHtInfo()
      info = JSON.parse(info)
      const ht_info = { account: info.account, password: this.$Global.Pass }
      setHtInfo(AES.encrypt(JSON.stringify(ht_info), this.$Global.en))
      this.$store.commit('ht/setEditPwState', false)
    },
    submit() {
      this.$store.commit('ht/setEditPwState', false)
      if (this.editPwDialogFrm.oldPw === '') return this.$message.warning('请输入原始密码')
      if (this.editPwDialogFrm.newPw !== this.editPwDialogFrm.pw_ok) {
        this.$message.warning('两次输入密码不一致')
        return
      }
      if (
        this.editPwDialogFrm.newPw === '' ||
        this.editPwDialogFrm.pw_ok === ''
      ) {
        this.$message.warning('密码或确认密码不能为空')
        return
      }
      if (this.editPwDialogFrm.oldPw !== this.$Global.Pass) return this.$message.warning('原始密码不正确')
      if (this.editPwDialogFrm.oldPw === this.editPwDialogFrm.newPw) return this.$message.warning('请更换与原密码不同的密码')
      if (this.editPwDialogFrm.newPw.length < 6) return this.$message.warning('新密码长度不能少于6位')
      if (/\d/.test(this.editPwDialogFrm.newPw) && /[a-zA-Z]/.test(this.editPwDialogFrm.newPw)) {
        const sendStr = {
          router: 'editOwnPw',
          JsonData: {
            userId: this.$Global.optioner.Id,
            pw: this.$md5(this.editPwDialogFrm.newPw),
            onekey_pw: this.$md5(
              this.editPwDialogFrm.onekey_pw + this.$Global.addPwStr
            )
          }
        }
        this.$Global.newPass = this.editPwDialogFrm.newPw
        this.$pomelo.send(sendStr)
      } else {
        return this.$message.warning('新密码必须包含数字和英文字母')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notice_password_hint {
  color: #1989fa;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  font-family: "Microsoft YaHei";
  border: 1px solid #aaaaaa;
  line-height: 25px;
  margin: 15px 0;
  padding: 10px;
}
</style>
