<template>
  <div>
    <el-dialog v-el-drag-dialog title="上/下分" :visible.sync="dialogFormVisible" width="500px">
      <font size="3">
        给
        <font color="#2196F3">{{ addscoreDigFrm.memberAccount }}</font>
        上下分
      </font>
      <br>
      <br>
      <font size="2">帐号等级: <span style="color:#2196F3">玩家</span></font>
      <span style="margin: 0 20px;" />
      <font size="2">账户余额: <span style="color:#2196F3">{{ addscoreDigFrm.mBalance }}</span></font>
      <br>
      <br>
      <font>我的帐户余额: <span style="color: #F44336">{{ previousForm.optionerScore }}</span></font>
      <br>
      <br>
      <el-form
        ref="addscoreDigFrm"
        :model="addscoreDigFrm"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="操作类型">
          <el-radio-group v-model="addscoreDigFrm.type">
            <el-radio label="上分" />
            <el-radio label="下分" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分数/点数" prop="deposit">
          <el-input
            v-model="addscoreDigFrm.deposit"
            type="number"
            autocomplete="off"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="余额备注" prop="memo">
          <el-input
            v-model="addscoreDigFrm.memo"
            type="textarea"
            autocomplete="off"
            placeholder="备注..."
            style="width: 280px;"
            @keyup.native="btKeyUp"
            @keydown.native="btKeyUp"
          />
        </el-form-item>
      </el-form>
      <font color="#2196F3">该用户上次操作记录(请仔细核对)</font>
      <br>
      <br>
      <div class="p-rec">
        <div class="p-tit">类型：</div>
        <div class="p-val">{{ previousForm.kind }}</div>
      </div>
      <br>
      <div class="p-rec">
        <div class="p-tit">交易金额：</div>
        <div class="p-val">{{ previousForm.turnover }}</div>
      </div>
      <br>
      <div class="p-rec">
        <div class="p-tit">操作员：</div>
        <div class="p-val">{{ previousForm.optioner }}</div>
      </div>
      <br>
      <div class="p-rec">
        <div class="p-tit">备注：</div>
        <div class="p-val" style="word-wrap: break-word; width: 300px;">{{ previousForm.memo2 }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Cancel()">取 消</el-button>
        <el-button type="primary" @click="Ok(addscoreDigFrm.opt)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  directives: { elDragDialog },
  props: {
    upDownData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      addscoreDigFrm: {
        deposit: '', // 存入
        memo: '', // 备注
        upper_name: '', // 上级代理
        mBalance: 0, // 现在额度
        type: ''
      }
    }
  },
  computed: {
    ...mapState({ previousForm: state => state.ht.addscoreDigFrm2 }),
    ...mapGetters(['UPDOWN_OK'])
  },
  watch: {
    upDownData: {
      handler(newValue, oldValue) {
        this.addscoreDigFrm = newValue
      }
    },
    UPDOWN_OK: function(val) {
      if (val) {
        this.close()
      }
    }
  },
  methods: {
    close() {
      this.addscoreDigFrm.deposit = ''
      this.addscoreDigFrm.memo = ''
      this.dialogFormVisible = false
      this.setUpDownState(false)
    },
    // 限制输入特殊字符
    btKeyUp(e) {
      e.target.value = e.target.value.replace(/[`~!#$%^&*()\-+=<>?:'{}|,.\/;'\\[\]·~！#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    },
    ...mapMutations({
      setUpDownState(commit, value) {
        commit('ht/setUpDownState', value)
      }
    }),
    Ok() {
      this.setUpDownState(false)
      if (this.addscoreDigFrm.type === undefined) {
        return this.$message.warning('请选择操作类型')
      }
      var score = this.addscoreDigFrm.deposit
      if (score === '' || score === null || score === undefined || score === 0) {
        this.$message.warning('存入分数不能为空')
        return
      }
      var opt = this.addscoreDigFrm.type === '上分' ? 'addScore' : 'desScore'
      const sendStr = {
        router: 'ChangeDlScore',
        JsonData: {
          // 代理和会员用同一函数 ChangeDlScore
          optName: this.addscoreDigFrm.memberAccount,
          deposit: Math.abs(this.addscoreDigFrm.deposit),
          upper_name: this.addscoreDigFrm.reference_name,
          memo: this.addscoreDigFrm.memo || '',
          optioner_Id: this.$Global.optioner.Id, // 操作员id
          optioner_name: this.$Global.optioner.UserName,
          level: 3, // 因为代理和会员共用,所以要分开级别
          opt: opt,
          loginIp: this.$store.state.ht.ip || ''
        }
      }
      // console.log('send ', sendStr)
      this.$pomelo.send(sendStr)
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
</style>
