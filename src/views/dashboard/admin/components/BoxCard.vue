<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img src="@/assets/images/world.jpg">
    </div>
    <div style="position:relative;">
      <pan-thumb :image="avatar" class="panThumb" />
      <mallki class-name="mallki-text" :text="name" />
      <div style="padding-top:35px;" class="progress-item">
        <span>推广网址 | </span>
        <!-- <el-progress :percentage="70" /> -->
        <span>http://{{ webSit }}</span>
      </div>
      <div class="progress-item">
        <span>游戏网址 | </span>
        <span>http://{{ webSite.h5 }}</span>
      </div>
      <div class="progress-item">
        <span>客服网址 | </span>
        <span style="word-wrap:break-word;">http://{{ webSite.service }}</span>
      </div>
      <div class="progress-item">
        <span>新版代理网址 | </span>
        <span>http://{{ agent.old1 }}</span>
      </div>
      <div class="progress-item">
        <span>老版代理网址 | </span>
        <span>http://{{ agent.old2 }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import clip from '@/utils/clipboard' // use clipboard directly
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'
import siteData from './site'
export default {
  components: { PanThumb, Mallki },

  data() {
    return {
      webSit: !this.$Global.optioner.webSit ? '' : this.$Global.optioner.Id + '.' + this.$Global.optioner.webSit,
      webSite: {
        service: '',
        h5: ''
      },
      agent: {
        old1: 'hn2201.com',
        old2: 'hn2210.com',
        new: 'dl8808.com'
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.setWebSites()
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    setWebSites() {
      const gx = this.$Global.optioner.gx.split('^')[2]
      switch (gx) {
        case '24129': // kb
          // window.open('http://kbkf.hn885.com/', '_blank')
          this.webSite.h5 = siteData.kb.h5
          this.webSite.service = siteData.kb.service
          break
        case '21974': // ws1
          // window.open('http://wskf.hn885.com/', '_blank')
          this.webSite.h5 = siteData.ws.h5
          this.webSite.service = siteData.ws.service
          break
        case '21898': // ws2
          // window.open('http://wskf.hn885.com/', '_blank')
          this.webSite.h5 = siteData.ws.h5
          this.webSite.service = siteData.ws.service
          break
        case '21970': // hngs
          // window.open('http://hngskf.hn885.com/', '_blank')
          this.webSite.h5 = siteData.hngs.h5
          this.webSite.service = siteData.hngs.service
          break
        case '20338': // wl
          // window.open('http://hngskf.hn885.com/', '_blank')
          this.webSite.h5 = siteData.wl.h5
          this.webSite.service = siteData.wl.service
          break
        default: // hn
          // window.open('http://hnkf.hn885.com/', '_blank')
          this.webSite.h5 = siteData.hn.h5
          this.webSite.service = siteData.hn.service
          break
      }
    }
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 20px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
