<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      interval: {}
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'roles'
  //   ])
  // },
  // created() {
  //   if (!this.roles.includes('admin')) {
  //     this.currentRole = 'editorDashboard'
  //   }
  // }
  created() {
    this.$store.state.ht.myCenterFrm &&
      Object.assign(this.myCenterFrm, this.$store.state.ht.myCenterFrm)
    this.getData()
    this.interval = setInterval(this.getData, 10000)
  },
  methods: {
    getData() {
      const sendStr = {
        router: 'GetCenterInfo',
        JsonData: { name: this.$Global.optioner.UserName }
      }
      this.$pomelo.send(sendStr)
    }
  }
}
</script>
