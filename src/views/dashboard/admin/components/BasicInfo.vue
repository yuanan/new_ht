<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-info" /> 账户信息</span>
        <el-table :data="myCenter.userValue" border highlight-current-row style="width: 100%;">
          <el-table-column prop="name" label="帐号" />
          <el-table-column prop="level" label="级别">
            <template slot-scope="{row}">
              <font v-if="row.level === '3' || row.level === 3" color="#00BFA5">{{ '会员' }}</font>
              <font v-else color="#00B0FF">{{ '代理' }}</font>
            </template>
          </el-table-column>
          <el-table-column prop="zcb" label="占成比" />
          <el-table-column prop="xmb" label="洗码比" />
          <el-table-column prop="ye" label="帐户余额" />
          <el-table-column prop="loginTime" label="登录时间" min-width="120" />
          <el-table-column prop="loginIp" label="登录Ip" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-full-screen" /> 个人推广二维码</span>
        <div id="qrCode" ref="qrCodeDiv" />
        <div style="display: flex; margin: 10px 10px 0 0;">
          <div>个人推广网址：</div>
          <div style="cursor: text; color: #F44336;">{{ webSit }}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <br>
    <br>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-s-ticket" /> 客户状态</span>
        <el-table :data="myCenter.userState" highlight-current-row style="width: 100%" border>
          <el-table-column prop="memberOnLineNum" label="在线会员">
            <template slot-scope="{row}">
              <font v-if="row.memberOnLineNum == 0" color="#000">{{ row.memberOnLineNum }}</font>
              <font v-else color="green">{{ row.memberOnLineNum }}</font>
            </template>
          </el-table-column>
          <el-table-column prop="ownMemberBalance" label="直属会员余额" />
          <el-table-column prop="otherMemberBalance" label="其它会员余额" />
          <el-table-column prop="memberBalance" label="总会员余额" />
          <el-table-column prop="agentBalance" label="代理余额" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      webSit: !this.$Global.optioner.webSit ? '' : this.$Global.optioner.Id + '.' + this.$Global.optioner.webSit
    }
  },
  computed: {
    ...mapState({ myCenter: state => state.ht.myCenterForm })
  },
  mounted() {
    this.$nextTick(() => {
      this.bindQRCode()
    })
  },
  methods: {
    bindQRCode() {
      if (!this.webSit || this.webSit === '') {
        this.webSit = ''
        return
      }
      new QRCode(this.$refs.qrCodeDiv, {
        text: this.webSit,
        width: 190,
        height: 190,
        colorDark: '#333333', // 二维码颜色
        colorLight: '#ffffff', // 二维码背景色
        correctLevel: QRCode.CorrectLevel.H // 容错率，L/M/H
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
