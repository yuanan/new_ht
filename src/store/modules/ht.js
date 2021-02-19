import Vue from 'vue'
import Vuex from 'vuex'
import AES from '@/api/aes'
import $Global from '@/api/global'
Vue.use(Vuex)

/* 测试数据 */
const myCenterForm = {
  // 个人首页参数
  userValue: [
    {
      name: '',
      level: '2',
      zcb: '0',
      xmb: '0',
      ye: '0',
      loginTime: '2016-06-02',
      loginIp: '127.0.0.1'
    }
  ],
  userState: [
    {
      memberOnLineNum: 0,
      ownMemberBalance: 0,
      otherMemberBalance: 0,
      memberBalance: 0,
      agentBalance: 0
    }
  ],
  totalAgentNum: 0,
  totalMemberNum: 0,
  memberAddNum: 0,
  agentAddNum: 0
}
const agentAdminForm = { tableData: [] } // 代理列表
const addscoreDigFrm2 = { optionerScore: 0, name: '', turnover: 0 } // 代理加减分数框数据
const memberListForm = { tableData: [] }
const chatmemberListData = { chatmemberListData: [], totalItemsNum: 0 }
const memberTotalListForm = { tableData: [] } // 会员汇总表
const agentTotalListForm = { tableData: [] } // 会员汇总表
const memberTradeForm = { tableData: [], state: 0 }
const hgListForm = { tableData: [] }
const treeData = { tableData: [] }
const betOrderInquireForm = { tableData: [] }
const reportForm = {
  tableData1: [],
  tableData2: [],
  tableData3: [],
  tableData4: [],
  tableData5: [],
  agents: [],
  state: 0
}
const accountRecordForm = { tableData: [] }
const loginRecordForm = { tableData: [] }
const accountChangeRecordForm = { tableData: [] }
const bannleImgForm = { tableData: [] }
const referenceInfo = { ye: 0, zcb: 0, xmb_s: 0, xmb_d: 0 }

const state = {
  WS_MSG: null,
  login: false, // 是否登录
  myInfo: {},
  myCenterForm: myCenterForm,
  agentAdminForm: agentAdminForm,
  addscoreDigFrm2: addscoreDigFrm2,
  memberListForm: memberListForm,
  chatmemberListData: chatmemberListData,
  memberTotalListForm: memberTotalListForm,
  agentTotalListForm: agentTotalListForm,
  memberTradeForm: memberTradeForm,
  hgListForm: hgListForm,
  reportForm: reportForm,
  betOrderInquireForm: betOrderInquireForm,
  accountRecordForm: accountRecordForm,
  loginRecordForm: loginRecordForm,
  accountChangeRecordForm: accountChangeRecordForm,
  bulletinListData: [],
  tradeBetMx: '',
  xm_ok: false,
  xm_pw_ok: false,
  edit_pw_ok: false,
  updown_ok: false,
  modify_ok: false,
  edit_member_ok: false,
  edit_my_member_ok: false,
  edit_hg_ok: false,
  agentLimit: '', // 荷官
  optionerScore: '',
  treeData: treeData,
  bannleImgForm: bannleImgForm,
  referenceInfo: referenceInfo,
  ip: '',
  gk_info: '',
  options: [],
  activeIndex: '/user'
}

const mutations = {
  setMyInfo(state, payload) {
    state.myInfo = payload
  },
  setEditHgState(state, payload) {
    state.edit_hg_ok = payload
  },
  setAddMemberState(state, payload) {
    state.edit_member_ok = payload
  },
  setAddMYMemberState(state, payload) {
    state.edit_my_member_ok = payload
  },
  setEditPwState(state, payload) {
    state.edit_pw_ok = payload
  },
  setUpDownState(state, payload) {
    state.updown_ok = payload
  },
  setModifiyState(state, payload) {
    state.modify_ok = payload
  },
  setXmPwOk(state, payload) {
    state.xm_pw_ok = payload
  },
  setXmState(state, payload) {
    state.xm_ok = payload
  },
  setAuth(state, payload) {
    state.login = payload
  },
  setBannleImgForm(state, payload) {
    state.bannleImgForm = payload
  },
  setReferenceInfo(state, payload) {
    state.referenceInfo = payload
  },
  setIp(state, payload) {
    state.ip = payload
  },
  setOptionScore(state, payload) {
    state.optionerScore = payload
  },
  setAgentLimit(state, payload) {
    state.agentLimit = payload
  },
  setTreeData(state, payload) {
    state.treeData = payload
  },
  setTradeBetMx(state, payload) {
    state.tradeBetMx = payload
    state.memberTradeForm.state = 1
  },
  setAddscoreDigFrm(state, payload) {
    Object.assign(state.addscoreDigFrm2, payload)
  },
  setMyCenterForm(state, payload) {
    Object.assign(state.myCenterForm, payload)
    const strInfo = JSON.stringify({
      login_id: payload.userValue[0].loginId,
      login_token: payload.userValue[0].token
    })
    if (payload.userValue[0].token) {
      const en = $Global.en
      localStorage.setItem('login_info', AES.encrypt(strInfo, en))
      state.login = true
    }
  },
  setAgentAdminForm(state, payload) {
    Object.assign(state.agentAdminForm, payload)
  },
  setMemberListForm(state, payload) {
    Object.assign(state.memberListForm, payload)
  },
  setChatMemberListData(state, payload) {
    state.chatmemberListData = payload
  },
  setMemberTotalListForm(state, payload) {
    Object.assign(state.memberTotalListForm, payload)
  },
  setAgentTotalListForm(state, payload) {
    Object.assign(state.agentTotalListForm, payload)
  },
  setMemberTradeForm(state, payload) {
    Object.assign(state.memberTradeForm, payload)
  },
  setHgListForm(state, payload) {
    Object.assign(state.hgListForm, payload)
  },
  setReportForm(state, payload) {
    Object.assign(state.reportForm, payload)
  },
  setBetOrderInquireForm(state, payload) {
    Object.assign(state.betOrderInquireForm, payload)
  },
  setAccountRecordForm(state, payload) {
    Object.assign(state.accountRecordForm, payload)
  },
  setLoginRecordForm(state, payload) {
    Object.assign(state.loginRecordForm, payload)
  },
  setAccountChangeRecordForm(state, payload) {
    Object.assign(state.accountChangeRecordForm, payload)
  },
  recSckMsg(state, payload) {
    state.socketMessage = payload
  },
  sendMsg(state, payload) {
    const sendStr = JSON.stringify(payload)
    state.WS.send(sendStr)
  },

  // 公告
  setBulletinListData(state, payload) {
    state.bulletinListData = payload
  },
  // 添加tabs
  add_tabs(state, data) {
    state.options.push(data)
  },
  // 删除tabs
  delete_tabs(state, route) {
    let index = 0
    for (const option of state.options) {
      if (option.route === route) {
        break
      }
      index++
    }
    state.options.splice(index, 1)
  },
  // 设置当前激活的tab
  set_active_index(state, index) {
    state.activeIndex = index
  }
}

// const getters = {
//   EDIT_MEMBER_OK: state => state.edit_member_ok
// }

export default {
  namespaced: true,
  state,
  mutations
}
