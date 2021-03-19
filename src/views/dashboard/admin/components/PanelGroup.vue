<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <el-card class="card-panel">
        <div slot="header" class="clearfix">
          <span class="title-fix">代理总数</span>
          <el-tag type="primary" class="tag-fix">代理</el-tag>
        </div>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Total Agents
          </div>
          <count-to :start-val="0" :end-val="myCenter.totalAgentNum" :duration="1000" class="card-panel-num" />
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <el-card class="card-panel">
        <div slot="header" class="clearfix">
          <span class="title-fix">今日新增代理</span>
          <el-tag type="primary" class="tag-fix">代理</el-tag>
        </div>
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="agents" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Today Increase
          </div>
          <count-to :start-val="0" :end-val="myCenter.agentAddNum" :duration="1000" class="card-panel-num" />
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <el-card class="card-panel">
        <div slot="header" class="clearfix">
          <span class="title-fix">玩家总数</span>
          <el-tag type="success" class="tag-fix">玩家</el-tag>
        </div>
        <div class="card-panel-icon-wrapper icon-players">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Total Players
          </div>
          <count-to :start-val="0" :end-val="myCenter.totalMemberNum" :duration="1000" class="card-panel-num" />
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <el-card class="card-panel">
        <div slot="header" class="clearfix">
          <span class="title-fix">今日新增玩家</span>
          <el-tag type="success" class="tag-fix">玩家</el-tag>
        </div>
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="players" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Today Increase
          </div>
          <count-to :start-val="0" :end-val="myCenter.memberAddNum" :duration="1000" class="card-panel-num" />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      myCenterFrm: {
        userValue: [
          {
            name: '111222',
            level: '1',
            zcb: '0.8',
            ye: '200',
            loginTime: '2018-05-20',
            loginIp: '127.0.0.1'
          }
        ],
        userState: [
          {
            memberOnLineNum: 10,
            ownMemberBalance: 100,
            otherMemberBalance: 100,
            memberBalance: 200,
            agentBalance: 100
          }
        ],
        totalAgentNum: 0,
        totalMemberNum: 0,
        memberAddNum: 0,
        agentAddNum: 0
      }
    }
  },
  computed: {
    ...mapState({ myCenter: state => state.ht.myCenterForm })
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 200px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    .icon-people {
      color: #36a3f7;
    }

    .tag-fix {
      float: right;
    }
    // .icon-message {
    //   color: #36a3f7;
    // }
    // .icon-money {
    //   color: #f4516c;
    // }
    .icon-players {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      // padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 0;
      // margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
        user-select: none;
      }

      .card-panel-num {
        font-size: 20px;
        user-select: none;
      }
    }
  }
}

@media (max-width:550px) {
  // .card-panel-icon {
  //   display: none;
  // }
  // .tag-fix {
  //   display: none;
  // }
  .card-panel {
    min-width: 230px;
  }
  // .card-panel-description {
  //   display: none;
  // }

  // .card-panel-icon-wrapper {
  //   float: none !important;
  //   width: 100%;
  //   height: 100%;
  //   margin: 0 !important;

  //   .svg-icon {
  //     display: block;
  //     margin: 14px auto !important;
  //     float: none !important;
  //   }
  // }
}
</style>
