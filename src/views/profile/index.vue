<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!-- <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane> -->
              <el-tab-pane label="密码设置" name="password">
                <password />
              </el-tab-pane>
              <el-tab-pane label="推广联系方式设置" name="social">
                <social />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
// import Activity from './components/Activity'
// import Timeline from './components/Timeline'
import Password from './components/Password'
import Social from './components/Social'

export default {
  name: 'Profile',
  components: { UserCard, Password, Social },
  data() {
    return {
      user: {},
      activeTab: 'password'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  // watch: {
  //   $route(to, from) {
  //     console.log(from.path) // 从哪来
  //     console.log(to.path) // 到哪去
  //     // if (to.path === '/about-me/profile') {
  //     //   this.getData()
  //     //   console.log('get ............ get ........ get ========')
  //     // }
  //   }
  // },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
    // getData() {
    //   const sendStr = {
    //     router: 'GetCenterInfo',
    //     JsonData: { name: this.$Global.optioner.UserName }
    //   }
    //   this.$pomelo.send(sendStr)
    // }
  }
}
</script>
