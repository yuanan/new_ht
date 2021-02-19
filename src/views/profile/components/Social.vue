<template>
  <div>
    <el-form>
      <el-form-item label="QQ号">
        <el-input v-model="form.qq" autocomplete="off" />
      </el-form-item>
      <el-form-item label="微信号">
        <el-input v-model="form.wxh" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Update</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      form: {
        qq: '',
        wxh: ''
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
      this.$store.commit('ht/setEditPwState', false)
    },
    submit() {
      const sendStr = {
        router: 'editOwnQQ',
        JsonData: {
          QQ: this.form.qq || '',
          WXH: this.form.wxh || '',
          userId: this.$Global.optioner.Id
        }
      }
      // console.log(sendStr)
      this.$pomelo.send(sendStr)
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
