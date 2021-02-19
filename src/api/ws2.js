/* eslint-disable */
import { Message } from 'element-ui'
import store from '@/store'
import AES from '@/api/aes'
import global from '@/api/global'
import moment from 'moment'
function doData (rData) {
  const en = global.en
  rData = JSON.parse(AES.decrypt(rData, en))
  switch (rData.router) {
    case 'Login':
      SetMyCenterForm(rData)
      break
    case 'GetCenterInfo': // 进入后重新取
      SetMyCenterForm(rData)
      break
    case 'GetAgentInfo':
      setAgentAdminForm(rData)
      break
    case 'ChangeDlScore':
      ChangeDlScore(rData)
      break
    case 'getOptScoreRecord':
      getOptScoreRecord(rData)
      break
    case 'editUserInfo':
      editUserInfo(rData)
      break
    case 'limitSetup':
      showMsg(rData);
      break;
    case 'addMember':
      // showMsg(rData)
      addMember(rData)
      break
    case 'addHg':
      editHgInfo(rData)
      break
    case 'setUserState':
      showMsg(rData)
      break
    case 'GetMemberInfo':
      setMemberAdminForm(rData)
      break
    case 'GetTotalMember':
      getAllMemberInfo(rData)
      break
    case 'GetTotalAgent':
      getAllAgentInfo(rData)
      break
    case 'getMemberTrade':
      getMemberTrade(rData)
      break
    case 'GetTradeMx':
      GetTradeMx(rData)
      break
    case 'getOnTimeBet':
      getOnTimeBet(rData)
      break
    case 'getAccoutLog':
      getAccoutLog(rData)
      break
    case 'getLoginLog':
      getLoginLog(rData);
      break;
    case 'GetAgentTree':
      GetAgentTree(rData)
      break
    case 'GetJxb':
      GetJxb(rData)
      break
    case 'GetReport':
      GetReport(rData)
      break
    case 'GetOptionerInfo':
      GetOptionerInfo(rData)
      break
    case 'Ip':
      setIp(rData)
      break
    case 'GetReferenceInfo':
      GetReferenceInfo(rData)
      break
    case 'GetAccountChangeLog':
      GetAccountChangeLog(rData)
      break
    case 'GetBannleImg':
      GetBannleImg(rData)
      break
    case 'setGk':
      setGk(rData)
      break
    case 'valid_auth':
      validAuth(rData)
      break
    case 'GetHgInfo':
      getHgInfo(rData)
      break
    case 'editHgInfo':
      editHgInfo(rData)
      break
    case 'doXm':
      doXm(rData)
      break
    case 'chkXmPw':
      chkXmPw(rData)
      break
    case 'editOwnPw':
      editOwnPw(rData)
      break
    case 'kickMember':
      showMsg(rData)
      break
    case 'getBulletin':
      getBulletin(rData)
      break
    case 'setBulletin':
      setBulletin(rData)
      break
    case 'editBulletin':
      editBulletin(rData)
      break
    case 'deleteBulletin':
      delBulletin(rData)
      break
    case "editOwnQQ":
      editOwnQQ(rData)
      break
  }
}
function addMember (rData) {
  let data = rData.JsonData;
  if (data.result == 'ok') {
    Message.success(data.msg)
    store.commit('ht/setAddMemberState', true)
    store.commit('ht/setAddMYMemberState', true)
  } else {
    Message.info(data.msg)
  }
}
function editOwnPw (rData) {
  let data = rData.JsonData
  if (data.result == 'false') alert(data.msg)
  if (data.result == 'ok') store.commit('ht/setEditPwState', true)
}
function chkXmPw (rData) {
  var data = rData.JsonData
  if (data.result == false) alert('安全码不正确!!')
  if (data.result == true) store.commit('ht/setXmPwOk', true)
}
function doXm (rData) {
  var data = rData.JsonData
  if (data.result == 'false') alert(data.msg)
  if (data.result == 'ok') store.commit('ht/setXmState', true)
}
function setGk (rData) {
  store.gk_info = rData.JsonData.result
}
function validAuth (rData) {
  store.commit('ht/setAuth', false)
}
function GetBannleImg (rData) {
  var data = rData.JsonData
  var bannleImgForm = { tableData: [], totalItemsNum: 0 }
  var tableData = bannleImgForm.tableData
  for (let i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].Id = data[i].Id
    tableData[i].name = data[i].name
    tableData[i].sort = data[i].sort
    tableData[i].url = data[i].url
    tableData[i].title = data[i].title
  }
  bannleImgForm.totalItemsNum = rData.totalItem
  store.commit('ht/setBannleImgForm', bannleImgForm)
}
function GetAccountChangeLog (rData) {
  var data = rData.JsonData
  var accountChangeRecordForm = { tableData: [], totalItemsNum: 0 }
  var tableData = accountChangeRecordForm.tableData
  for (let i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].id = data[i].id
    tableData[i].name = data[i].name
    tableData[i].nikename = data[i].nikename
    tableData[i].level = data[i].level
    tableData[i].optionIp = data[i].optionIp
    tableData[i].optioner = data[i].optioners
    tableData[i].optionTime = data[i].optionTime // 权限表
    tableData[i].memo = data[i].memo
  }
  accountChangeRecordForm.totalItemsNum = rData.totalItem
  store.commit('ht/setAccountChangeRecordForm', accountChangeRecordForm)
}
function GetReferenceInfo (rData) {
  // console.log(rData)
  var data = rData.JsonData
  var obj = {}
  obj.ye = data[0].ye
  obj.zcb = data[0].zcb
  obj.xmb_s = data[0].xmb_s
  obj.xmb_d = data[0].xmb_d
  store.commit('ht/setReferenceInfo', obj)
}

function GetOptionerInfo (rData) {
  // console.log('get optioner info ', rData)
  var data = rData.JsonData
  store.commit('ht/setOptionScore', data[0].ye)
}

function setIp (rData) {
  var data = rData.JsonData
  store.commit('ht/setIp', data.ip)
}

function GetReport (rData) {
  // console.log('report ', rData)
  var data = rData.JsonData
  var table = {
    tableData1: [],
    tableData2: [],
    tableData3: [],
    tableData4: [],
    tableData5: [],
    agents: [],
    state: 1,
    totalItemsNum1: 0,
    totalItemsNum2: 0
  }
  table.tableData1 = getReportTable(data.table1)
  table.tableData2 = getReportTable(data.table2)
  table.tableData3 = getReportTable(data.table3)
  table.tableData4 = data.table4
  table.tableData5 = data.table5
  table.tableData2 = summeryReportTable(table.tableData2, data.table4)
  table.tableData3 = summeryReportTable(table.tableData3, data.table5)
  table.totalItemsNum1 = data.table4.length > 0 ? data.table4[0].count : 0
  table.totalItemsNum2 = data.table5.length > 0 ? data.table5[0].count : 0
  table.agents = data.agents
  store.commit('ht/setReportForm', table)
}
function summeryReportTable (table1, table2) {
  // 加上合计行
  var obj = {};
  if (table2.length == 0) return
  table2 = table2[0]
  obj.name = '所有统计'
  obj.level = ''
  obj.nikename = ''
  obj.betNum = ''
  obj.totalWin = table2.yl.toFixed(2)
  obj.bjlWin = table2.bjl_yl.toFixed(2)
  obj.lhWin = table2.lh_yl.toFixed(2)
  obj.nnWin = table2.nn_yl.toFixed(2)
  obj.dxWin = table2.dx_yl.toFixed(2)
  obj.ttsWin = table2.tts_yl.toFixed(2)
  obj.xjhWin = table2.xjh_yl.toFixed(2)
  obj.sscWin = table2.ssc_yl.toFixed(2)
  obj.jsk3Win = table2.jsk3_yl.toFixed(2)
  obj.bjcsWin = table2.bjcs_yl.toFixed(2)
  obj.zc = ''
  obj.xml_s = table2.xml_s
  obj.xml_d = table2.xml_d
  obj.xml = obj.xml_s + '/' + obj.xml_d
  obj.xmb = ''
  obj.xmyj = table2.xmyj
  obj.xmStype = ''
  obj.totalMoney = table2.totalMoney
  obj.thisLevelMoney = table2.thisMoney
  obj.companyMoney = table2.companyMoney
  table1.push(obj)
  return table1
}

function getReportTable (tableData) {
  var table = []
  for (var i = 0; i < tableData.length; i++) {
    var obj = {}
    obj.Id = tableData[i].Id
    obj.userId = tableData[i].userId
    obj.name = tableData[i].name
    obj.xm_close = tableData[i].xm_close
    obj.level =
      tableData[i].level == 1
        ? '管理员'
        : tableData[i].level == '2'
        ? '代理'
        : '会员'
    obj.nikename = tableData[i].nicheng
    obj.betNum = tableData[i].tzcs
    obj.totalWin = tableData[i].yl
    obj.bjlWin = tableData[i].bjl_yl
    obj.lhWin = tableData[i].lh_yl
    obj.nnWin = tableData[i].nn_yl
    obj.dxWin = tableData[i].dx_yl
    obj.ttsWin = tableData[i].tts_yl
    obj.xjhWin = tableData[i].xjh_yl
    obj.sscWin = tableData[i].ssc_yl
    obj.jsk3Win = tableData[i].jsk3_yl
    obj.bjcsWin = tableData[i].bjcs_yl
    obj.zc = tableData[i].zc
    if (tableData[i].xml_s == null) tableData[i].xml_s = 0
    if (tableData[i].xml_d == null) tableData[i].xml_d = 0
    obj.xml = tableData[i].xml_s + '/' + tableData[i].xml_d
    obj.xmb = tableData[i].xmb_s + '/' + tableData[i].xmb_d
    obj.xmyj = (
      (tableData[i].xml_s * tableData[i].xmb_s) / 100 +
      (tableData[i].xml_d * tableData[i].xmb_d) / 100
    ).toFixed(2)
    obj.xmStype = tableData[i].xmType == 0 ? '双边' : '单边'
    obj.totalMoney = (Number(tableData[i].yl) + Number(obj.xmyj)).toFixed(2)
    obj.thisLevelMoney = ((obj.totalMoney * obj.zc) / 100).toFixed(2)
    obj.companyMoney = (obj.totalMoney - obj.thisLevelMoney).toFixed(2)
    table.push(obj)
  }
  return table
}

function GetJxb (rData) {
  // console.log(rData)
  var data = rData.JsonData
  var jxb = { jxb1: data[0].jxb, jxb2: data[0].jxb2 }
  store.commit('ht/setAgentLimit', jxb)
}

function GetAgentTree (rData) {
  var data = rData.JsonData
  var treeData = {}
  treeData.tableData = data
  store.commit('ht/setTreeData', treeData)
}

function getLoginLog (rData) {
  var data = rData.JsonData
  var loginRecordForm = { tableData: [], totalItemsNum: 0 }
  var tableData = loginRecordForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].name = data[i].name
    tableData[i].level = data[i].level
    tableData[i].loginAddr = data[i].loginAddr
    tableData[i].loginIp = data[i].ip
    tableData[i].loginTime = data[i].stime
    tableData[i].memo = data[i].memo
  }
  loginRecordForm.totalItemsNum = rData.totalItem
  store.commit('ht/setLoginRecordForm', loginRecordForm)
}

function getAccoutLog (rData) {
  // console.log('上下分 ', rData)
  var data = rData.JsonData
  var accountRecordForm = { tableData: [], totalItemsNum: 0 }
  var tableData = accountRecordForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].id = data[i].id
    tableData[i].name = data[i].name
    tableData[i].nikename = data[i].nikename
    tableData[i].level = data[i].level
    tableData[i].type = data[i].type
    tableData[i].tradeMoney = data[i].tradeMoney
    tableData[i].money = data[i].money
    tableData[i].optionIp = data[i].optionIp
    tableData[i].optioners = data[i].optioners
    tableData[i].optionTime = data[i].optionTime // 权限表
    tableData[i].memo = data[i].memo
  }
  accountRecordForm.totalItemsNum = rData.totalItem
  accountRecordForm.tradeMoney = rData.tradeMoney
  accountRecordForm.totalMoney = rData.totalMoney
  store.commit('ht/setAccountRecordForm', accountRecordForm)
}

function getOnTimeBet (rData) {
  // console.log('get ON Time Bet ', rData)
  var data = rData.JsonData
  var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
  var tableData = betOrderInquireForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].orderId = i + 1
    tableData[i].name = data[i].name
    tableData[i].rType = data[i].rType
    tableData[i].gameType = transGameStr(data[i].rType)
    tableData[i].betTime = transTime(data[i].time)
    tableData[i].tableNum = data[i].roomName
    tableData[i].cc = data[i].cc
    tableData[i].memberName = data[i].name
    tableData[i].betOrderInfo = trasBetResult(data[i].rType, data[i].xzmx)
    tableData[i].betMoney = data[i].xz
    tableData[i].aBalance = data[i].ye
    tableData[i].ip = data[i].ip // 权限表
    tableData[i].terminal = data[i].terminal
    tableData[i].tablePara = getTablePara(
      data[i].rType,
      tableData[i].betOrderInfo
    )
  }
  betOrderInquireForm.totalItemsNum = rData.totalItem
  store.commit('ht/setBetOrderInquireForm', betOrderInquireForm)
}
function GetTradeMx (rData) {
  var data = rData.JsonData
  var tradeBetMx = data[0].xz
  store.commit('ht/setTradeBetMx', tradeBetMx)
}
function getHgInfo (rData) {
  var data = rData.JsonData
  var hgListForm = { tableData: [] }
  var tableData = hgListForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].Id = data[i].Id
    tableData[i].HgAccount = data[i].name
    tableData[i].name = data[i].nikename
    tableData[i].createDate = data[i].createDate
    tableData[i].lastLoginTime = data[i].lastLoginTime
    tableData[i].lastLoginIp = data[i].loginIp
    tableData[i].onLine = data[i].onLineState
    tableData[i].sEnable = data[i].sEnable == 1 ? '启用' : '禁用'
  }
  hgListForm.totalItemsNum = rData.totalItem
  store.commit('ht/setHgListForm', hgListForm)
}
function getMemberTrade (rData) {
  console.log('=========rData:', rData)
  var data = rData.JsonData
  var memberTradeForm = { tableData: [], totalItemsNum: 0 }
  var tableData = memberTradeForm.tableData
  var r = { yl: 0, bet: 0, xml_s: 0, xml_d: 0, yxxz: 0, count: 0 }
  for (let i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].bh = data[i].bh
    tableData[i].memberId = data[i].Id
    tableData[i].memberAccount = data[i].name
    tableData[i].rType = data[i].gameType
    tableData[i].game = transGameStr(data[i].gameType)
    tableData[i].teskNum = data[i].roomName
    tableData[i].cc = data[i].cc
    tableData[i].sTime = transTime(data[i].time)
    tableData[i].result = trasResult(data[i].gameType, data[i].result)
    tableData[i].tradeMx = '下注详情'

    if(tableData[i].rType == 'nn'){
      if(data[i].pk != null){
        // 牛一 至 牛九(a至i)   牛牛,炸弹,无牛(jkl)
        // 0庄赢 1闲赢
        let result = data[i].pk.split("-")
        let result1 = result[0]
        let result2 = result[1].split('')
        // console.log("result ", result1, result2)
        const nnResultMap = new Map([
          ["a", ["牛一"]],["b", ["牛二"]],["c", ["牛三"]],["d", ["牛四"]],
          ["e", ["牛五"]],["f", ["牛六"]],["g", ["牛七"]],["h", ["牛八"]],
          ["i", ["牛九"]],["j", ["牛牛"]],["k", ["炸弹"]],["l", ["无牛"]],
          ["default", [""]],
        ])
        var nnResultList = []
        var replaceNNResult = (r) => {
          const action = nnResultMap.get(r) || nnResultMap.get("default")
          nnResultList.push(action[0])
        }
        let nnPreResult = result1.split('')
        nnPreResult.forEach(v => {
          replaceNNResult(v)
        })
        // console.log(nnResultList, 'nnResultList')
        tableData[i].niuniuResult = nnResultList
        tableData[i].niuniuBetResult = result2
        // console.log('final ', nnResultList, result2)

        let nnWinLose = data[i].xzmx.split("$")
        nnWinLose.pop();
        let betnnResult = []
        for(let i = 0; i < nnWinLose.length; i++){
          // console.log(nn[i])
          betnnResult.push(nnWinLose[i].split("^")[0])
        }
        // console.log(betnnResult, 'betnnResult')
        let winLoseShow = []
        betnnResult.forEach(v => {
          // console.log(v)
          if(v >= 1 && v <= 4){
            // console.log('v >= 1 || v <= 4')
            if((v == 1 || v == 3) && result2[0] == 1){
              winLoseShow.push("输")
            }else if((v == 1 || v == 3) && result2[0] == 0) {
              winLoseShow.push("赢")
            }
            if((v == 2 || v == 4) && result2[0] == 1){
              winLoseShow.push("赢")
            }else if((v == 2 || v == 4) && result2[0] == 0) {
              winLoseShow.push("输")
            }
          }else if (v >= 5 && v <= 8) {
            // console.log('v >= 5 || v <= 8')
            if((v == 5 || v == 7) && result2[1] == 1){
              winLoseShow.push("输")
            }else if((v == 5 || v == 7) && result2[1] == 0) {
              winLoseShow.push("赢")
            }
            if((v == 6 || v == 8) && result2[1] == 1){
              winLoseShow.push("赢")
            }else if((v == 6 || v == 8) && result2[1] == 0) {
              winLoseShow.push("输")
            }
          }else if(v >= 9 && v <= 12){
            // console.log('v >= 9 || v <= 12')
            if((v == 9 || v == 11) && result2[2] == 1){
              winLoseShow.push("输")
            }else if((v == 9 || v == 11) && result2[2] == 0) {
              winLoseShow.push("赢")
            }
            if((v == 10 || v == 12) && result2[2] == 1){
              winLoseShow.push("赢")
            }else if((v == 10 || v == 12) && result2[2] == 0) {
              winLoseShow.push("输")
            }
          }
        })

        tableData[i].nnWinLose = winLoseShow
        // console.log(winLoseShow, 'wwwwwwwwwwwww')
      }
      let nn = data[i].xzmx.split('$')
      nn.pop()
      var betnn = []
      for(let i = 0; i < nn.length; i++){
        // console.log(nn[i])
        betnn.push(nn[i].split('^')[0])
      }
      const nnMap = new Map([
        ['1', ['庄翻倍1']],
        ['2', ['闲翻倍1']],
        ['3', ['庄平倍1']],
        ['4', ['闲平倍1']],
        ['5', ['庄翻倍2']],
        ['6', ['闲翻倍2']],
        ['7', ['庄平倍2']],
        ['8', ['闲平倍2']],
        ['9', ['庄翻倍3']],
        ['10', ['闲翻倍3']],
        ['11', ['庄平倍3']],
        ['12', ['闲平倍3']],
        ['default', ['']]
      ])
      var nnList = []
      var replaceNN = (r) => {
        const action = nnMap.get(r) || nnMap.get('default')
        nnList.push(action[0])
      }
      betnn.forEach((v, i, o)=>{
        replaceNN(v)
      })
      tableData[i].niuniu = nnList
      //牛牛下注金额
      var nnBet = [];
      for(let i = 0; i < nn.length; i++){
        nnBet.push(nn[i].split('^')[1])
      }
      tableData[i].niuniuBet = nnBet
    }else{
      tableData[i].betOrderInfo = trasBetResult(data[i].gameType, data[i].xzmx)
      tableData[i].tablePara = getTablePara(
        data[i].gameType,
        tableData[i].betOrderInfo
      )
    }
    tableData[i].totalBet = data[i].xz // 权限表
    tableData[i].totalPay = data[i].fh
    tableData[i].win = data[i].yl
    r.yl += data[i].yl
    tableData[i].xml = data[i].xml_s + '/' + data[i].xml_d
    r.xml_s += data[i].xml_s
    r.xml_d += data[i].xml_d
    tableData[i].xmKind = data[i].xmType
    tableData[i].validBet = data[i].yxxz
    r.yxxz += data[i].yxxz
    tableData[i].balance = data[i].ye
    tableData[i].balanceMemo = trasMemo(data[i].memo)
    tableData[i].ip = data[i].ip
    tableData[i].terminal = data[i].terminal
    r.count++
  }
  if (r.count > 1) {
    tableData[r.count] = {} // 统计
    tableData[r.count].memberId = '统计:'
    tableData[r.count].win = r.yl.toFixed(2)
    tableData[r.count].xml = r.xml_s + '/' + r.xml_d
    tableData[r.count].validBet = r.yxxz

    tableData[r.count + 1] = {}; // 所有统计
    tableData[r.count  + 1].memberId = '所有统计:'
    tableData[r.count  + 1].win = rData.yl.toFixed(2)
    tableData[r.count  + 1].xml = rData.xml_s + '/' + rData.xml_d
    tableData[r.count  + 1].validBet = rData.yxxz
  }
  memberTradeForm.totalItemsNum = rData.totalItem
  memberTradeForm.state = 1
  // console.log('memberTrade ', memberTradeForm)
  store.commit('ht/setMemberTradeForm', memberTradeForm)
}
function transTime (times) {
  return moment(times).format('YYYY-MM-DD HH:mm:ss')
}

function getAllMemberInfo (rData) {
  var data = rData.JsonData
  var memberTotalListForm = { tableData: [] }
  var tableData = memberTotalListForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].memberAccount = data[i].name
    tableData[i].name = data[i].nikename
    tableData[i].upperAgent = data[i].reference_name
    tableData[i].mBalance = data[i].ye
    tableData[i].xmb = data[i].xmb_s + '/' + data[i].xmb_d
    tableData[i].sEnable = data[i].sEnable == 1 ? '启用' : '禁用'
    tableData[i].createDate = data[i].createDate
    tableData[i].lastLoginIp = data[i].loginIp
    tableData[i].roomAddr = transRoom(data[i].roomAddr)
    tableData[i].onLineState = data[i].onLineState == 1 ? '在线' : '离线' // 权限表
    tableData[i].terminal = data[i].terminal
  }
  memberTotalListForm.totalItemsNum = rData.totalItem
  store.commit('ht/setMemberTotalListForm', memberTotalListForm)
}
function getAllAgentInfo (rData) {
  var data = rData.JsonData
  var AgentTotalListForm = { tableData: [] }
  var tableData = AgentTotalListForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].agentAccount = data[i].name
    tableData[i].name = data[i].nikename
    tableData[i].upperAgent = data[i].reference_name
    tableData[i].mBalance = data[i].ye
    tableData[i].xmb = data[i].xmb_s + '/' + data[i].xmb_d
    tableData[i].sEnable = data[i].sEnable == 1 ? '启用' : '禁用'
    tableData[i].createDate = data[i].createDate
    tableData[i].lastLoginIp = data[i].loginIp
    tableData[i].onLineState = data[i].onLineState == 1 ? '在线' : '离线' // 权限表
    tableData[i].terminal = data[i].terminal
  }
  AgentTotalListForm.totalItemsNum = rData.totalItem
  store.commit('ht/setAgentTotalListForm', AgentTotalListForm)
}
function editHgInfo (rData) {
  // 修改信息
  // var data = rData.JsonData
  store.commit('ht/setEditHgState', true)
  showMsg(rData)
}

function editUserInfo (rData) {
  // 修改信息
  var data = rData.JsonData
  var msg = data.data
  if (data.result != 'ok') return
  var formData =
    msg.level == 2 ? store.state.ht.agentAdminForm : store.state.ht.memberListForm
  var data2 = formData.tableData
  for (var i = 0; i < formData.tableData.length; i++) {
    var account =
      msg.level == 2
        ? formData.tableData[i].agentAccount
        : formData.tableData[i].memberAccount
    if (account == msg.name) {
      formData.tableData[i].xmb = msg.xmb
      formData.tableData[i].zcb = msg.zcb
      formData.tableData[i].name = msg.nikename
      formData.tableData[i].xmb = msg.xmb_s + '/' + msg.xmb_d
    }
  }
  if (msg.level == 2) {
    store.commit('ht/setMemberListForm', formData)
    if (data.result == 'ok') {
      store.commit('ht/setModifiyState', true)
      Message.success(data.msg)
    } else {
      Message.info(data.msg)
    }
  }
  if (msg.level == 3) {
    store.commit('ht/setAgentAdminForm', formData)
    if (data.result == 'ok') {
      store.commit('ht/setModifiyState', true)
      Message.success(data.msg)
    } else {
      Message.info(data.msg)
    }
  }
  // if (data.result == 'ok') {
  //   store.commit('ht/setAddMemberState', true)
  //   Message.success(data.msg)
  // } else {
  //   Message.info(data.msg)
  // }
}

function setMemberAdminForm (rData) {
  console.log('member ', rData)
  var data = rData.JsonData
  var memberListForm = { tableData: [] }
  var tableData = memberListForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].userId = data[i].Id
    tableData[i].memberAccount = data[i].name
    tableData[i].name = data[i].nikename
    tableData[i].upperAgent = data[i].reference_name
    tableData[i].mBalance = data[i].ye
    tableData[i].xmb_d = data[i].xmb_d
    tableData[i].xmb_s = data[i].xmb_s
    tableData[i].xmb = data[i].xmb_s + '/' + data[i].xmb_d
    tableData[i].xmKind = data[i].xmType == 0 ? '双边' : '单边'
    tableData[i].drawMoneyPw = data[i].withdrawPw
    tableData[i].sEnable = data[i].sEnable == 1 ? '启用' : '禁用'
    tableData[i].createDate = data[i].createDate
    tableData[i].lastLoginTime = data[i].lastLoginTime
    tableData[i].lastLoginIp = data[i].loginIp
    tableData[i].reference_name = data[i].reference_name
    tableData[i].onLine = data[i].onLineState == 1 ? '在线' : '离线' // 权限表
  }
  memberListForm.totalItemsNum = rData.totalItem
  store.commit('ht/setMemberListForm', memberListForm)
}

function showMsg (rData) {
  var data = rData.JsonData
  if (data.result === 'ok') {
    Message.success(data.msg)
  } else {
    Message.info(data.msg)
  }
  // setTimeout(() => {
  //   const iframe = document.createElement('IFRAME')
  //   iframe.style.display = 'none'
  //   iframe.setAttribute('src', 'data:text/plain,')
  //   document.documentElement.appendChild(iframe)
  //   window.frames[0].window.alert(data.msg)
  //   iframe.parentNode.removeChild(iframe)
  // }, 300)
}
function getOptScoreRecord (rData) {
  var data = rData.JsonData
  var addscoreDigFrm = {}
  addscoreDigFrm.name = data.name
  addscoreDigFrm.kind = data.kind
  addscoreDigFrm.optioner = data.optioner
  addscoreDigFrm.memo2 = data.memo2
  addscoreDigFrm.turnover = data.turnover
  addscoreDigFrm.optionerScore = data.optionerScore
  store.commit('ht/setAddscoreDigFrm', addscoreDigFrm)
}

function ChangeDlScore (rData) {
  var data = rData.JsonData
  if (data.result == 'ok') {
    var dataList =
      data.level == 2
        ? store.state.ht.agentAdminForm.tableData
        : store.state.ht.memberListForm.tableData
    for (var i = 0; i < dataList.length; i++) {
      if (data.level == 2)
        if (dataList[i].agentAccount == data.username)
          // 代理
          dataList[i].aBalance = data.ye
      if (data.level == 3)
        if (dataList[i].memberAccount == data.username)
          dataList[i].mBalance = data.ye
    }
  }
  if(data.result == 'ok'){
    Message.success(data.msg)
    store.commit('ht/setUpDownState', true)
  } else {
    Message.info(data.msg)
  }
  
  // showMsg(rData);
}

function SetMyCenterForm (rData) {
  // 个人中心
  store.state.WS_MSG = rData // 供登录框调用
  var data = rData.JsonData
  var myCenterForm = {
    userValue: [],
    userState: [],
    totalMemberNum: 0,
    totalAgentNum: 0
  }
  var obj = {
    name: data.name,
    level: data.level,
    zcb: data.zcb,
    xmb: data.xmb_s + '/' + data.xmb_d + ' (单/双)',
    ye: data.ye,
    loginTime: transTime(data.loginTime),
    loginIp: data.loginIp,
    token: data.token,
    loginId: data.Id
  }
  store.commit('ht/setMyInfo', data)
  myCenterForm.userValue.push(obj)
  var obj2 = {
    memberOnLineNum: data.memberOnLineNum,
    ownMemberBalance: data.ownMemberBalance,
    otherMemberBalance: (data.memberBalance - data.ownMemberBalance).toFixed(2),
    memberBalance: data.memberBalance,
    agentBalance: data.agentBalance
  }
  myCenterForm.userState.push(obj2)
  myCenterForm.totalMemberNum = data.totalMemberNum
  myCenterForm.totalAgentNum = data.totalAgentNum
  myCenterForm.memberAddNum = data.curDayAddMember
  myCenterForm.agentAddNum = data.curDayAddAgent
  store.commit('ht/setMyCenterForm', myCenterForm)
  // console.log(store)
}

function setAgentAdminForm (rData) {
  // console.log(rData)
  var data = rData.JsonData;
  var agentAdminForm = { tableData: [] }
  var tableData = agentAdminForm.tableData
  for (var i = 0; i < data.length; i++) {
    tableData[i] = {}
    tableData[i].agentAccount = data[i].name
    tableData[i].name = data[i].nikename
    tableData[i].aBalance = data[i].ye
    tableData[i].zcb = data[i].zcb
    tableData[i].xmb_s = data[i].xmb_s
    tableData[i].xmb_d = data[i].xmb_d
    tableData[i].xmb = data[i].xmb_s + '/' + data[i].xmb_d
    tableData[i].xmType = data[i].xmType == 0 ? '双边' : '单边'
    tableData[i].withdrawPw = data[i].withdrawPw
    tableData[i].sEnable = data[i].sEnable == 1 ? '启用' : '禁用'
    tableData[i].createDate = data[i].createDate
    tableData[i].lastLoginTime = data[i].lastLoginTime
    tableData[i].loginIp = data[i].loginIp
    tableData[i].jxb = data[i].jxb // 权限表
    tableData[i].reference_name = data[i].reference_name
    tableData[i].onLine = data[i].onLineState == 1 ? '在线' : '离线'
  }
  agentAdminForm.totalItemsNum = rData.totalItem
  // console.log('ws  ', agentAdminForm)
  store.commit('ht/setAgentAdminForm', agentAdminForm)
}

function getBulletin (rData) {
  if (!rData.JsonData.data[0]) {
    return;
  }
  let data = rData.JsonData
  if (data.result == 'ok') {
    let info = []
    info = data.data
    for (let i = 0; i < info.length; i++) {
      info[i].startTime = transTime(info[i].startTime)
      info[i].endTime = transTime(info[i].endTime)
    }
    store.commit('ht/setBulletinListData', info)
  } else {
    store.commit('ht/setBulletinListData', {})
  }
}

function setBulletin (rData) {
  let data = rData.JsonData
  if (data.result == 'ok') {
    Message.success({
      message: data.msg
    })
  } else {
    Message.warning({
      message: data.msg
    })
  }
}

function editBulletin (rData) {
  let data = rData.JsonData
  if (data.result == 'ok') {
    Message.success({
      message: data.msg
    })
  } else {
    Message.warning({
      message: data.msg
    })
  }
}

function delBulletin (rData) {
  let data = rData.JsonData
  if (data.result == 'ok') {
    Message.success({
      message: data.msg
    })
  } else {
    Message.warning({
      message: data.msg
    })
  }
}

function editOwnQQ(rData) {
  let data = rData.JsonData;
  if (data.result === 'ok') {
    Message.success(data.msg)
  } else {
    Message.info(data.msg)
  }
}

function trasMemo (memo) {
  if (memo == '' || memo == '本局无效' || !memo) return memo
  // console.log('memo:',memo)
  let split1 = memo.split('$')
  let str1 = '多台:'
  for (let i = 0; i < split1.length; i++) {
    let split2 = split1[i].split('_')
    str1 +=
      transGameStr(split2[0]) + '-' + split2[1] + ' 总投:' + split2[2] + ','
  }
  return str1
}
function transGameStr (strGame) {
  // 游戏类型转换
  var msg = {
    bjl: '百家乐',
    lh: '龙虎',
    nn: '牛牛',
    xjh: '炸金花',
    dx: '大小',
    tts: '推筒子',
    ssc: '时时彩',
    jsk3: '江苏快3',
    bjcs: '北京赛车'
  }
  return msg[strGame]
}

function transRoom (strRoomAddr) {
  //  console.log(strRoomAddr)
  if (strRoomAddr == null || strRoomAddr == '') return strRoomAddr
  let splitRoom = strRoomAddr.split('-')
  return transGameStr(splitRoom[0]) + '-' + splitRoom[1]
}

function trasResult (strGame, result) {
  // 转换游戏结果
  // console.log('strGame ', strGame, 'result ', result)
  // 牛1 至 牛9(a至i) 牛牛,炸弹,无牛(jkl)
  if (result == null) return ''
  if (strGame == 'nn') {
    var split1 = result.split('-')
    var strResult = ''
    for (var i = 0; i < split1[0].length; i++) {
      strResult += split1[0].substr(i, 1) == '0' ? '庄' : '闲'
      if (split1[1])
        strResult +=
          split1[1].substr(i, 1) == 1
            ? '平倍 | '
            : split1[1].substr(i, 1) + '倍 | '
    }
    return strResult
  }
  // a:庄 b:庄 闲对  c:庄 庄对  d:庄 闲对 庄对  e:闲(龙)  f:闲 闲对  g:闲 庄对  h:闲 闲对 庄对  i:和  j:和 闲对  k:和 庄对 l:和 闲对 庄对
  if (strGame == 'bjl') {
    var split1 = '庄,庄 闲对,庄 庄对,庄 闲对 庄对,闲,闲 闲对,闲 庄对,闲 闲对 庄对,和,和 闲对,和 庄对,和 闲对 庄对'.split(
      ','
    )
    var m = result.charCodeAt() - 97
    return split1[m]
  }

  if (strGame == 'lh') {
    // console.log('=======:', strGame, result, result.charCodeAt())
    var split1 = '龙,和,虎'.split(',')
    var m = result.charCodeAt() - 97
    let re = split1[m] + ' '
    // let a = result.substr(1, 1)
    // let b = result.substr(2, 1)
    // if (a == '1') re += '龙单 '
    // if (a == '2') re += '龙双 '
    // if (b == '1') re += '虎单 '
    // if (b == '2') re += '虎双 '
    // console.log('+++++++++', re)
    return re
  }
  if (strGame == 'dx') {
    var strResult = ''
    for (var i = 0; i < result.length; i++) {
      strResult += result.substr(i, 1) + '点 '
    }
    return strResult
  }
  if (strGame == 'tts') {
    // var splitTts='//对子 0-9(a-j),0点(k),1点(l),2点(k),3点(l),4点(k),5点(l),6点(k),7点(l),8点(k),9点(l),1点半(1),2点半(2),3点半(3),4点半(4),5点半(5),6点半(6),7点半(7),8点半(8),9点半(9)'
    // var splitTts='白板对子,对A,对2,对3,对4,对5,对6,对7,对8,对9,0点,1点,2点,3点,4点,5点,6点,7点,8点,9点'
    var split1 = result.split('-')
    var strResult = ''
    for (var i = 0; i < split1[0].length; i++) {
      strResult +=
        split1[0].substr(i, 1) == '0'
          ? '庄'
          : split1[0].substr(i, 1) == '2'
          ? '闲'
          : '和'
      if (split1[0].substr(i, 1) != 1)
        if (split1[1])
          strResult +=
            split1[1].substr(i, 1) == 1
              ? '平倍,'
              : split1[1].substr(i, 1) + '倍,'
    }
    return strResult
  }
  if (strGame == 'xjh') {
    var split1 = result.split('-')
    var strResult = ''
    for (var i = 0; i < split1[0].length; i++) {
      strResult += split1[0].substr(i, 1) == '0' ? '庄' : '闲'
      if (split1[1])
        strResult +=
          split1[1].substr(i, 1) == 1
            ? '平倍,'
            : split1[1].substr(i, 1) + '倍,'
    }
    return strResult
  }
  return result // 彩票
}

function trasBetResult (strGame, str) {
  // 转换下注
  // console.log('rType,xzmx', strGame, str)
  let mx = [];
  if (
    strGame != 'bjl' &&
    strGame != 'nn' &&
    strGame != 'lh' &&
    strGame != 'tts' &&
    strGame != 'xjh'
  )
    return str.split(' ') // casue of dx(want array got String), zike replace it (origin code: => return str;)
  if (strGame == 'bjl')
    var obj = { para0: '', para1: '', para2: '', para3: '', para4: '' }
  if (strGame == 'nn')
    var obj = {
      para0: '',
      para1: '',
      para2: '',
      para3: '',
      para4: '',
      para5: '',
      para6: '',
      para7: '',
      para8: '',
      para9: '',
      para10: '',
      para11: ''
    }
  if (strGame == 'lh')
    var obj = {
      para0: '',
      para1: '',
      para2: '',
      para3: '',
      para4: '',
      para5: '',
      para6: ''
    }
  if (strGame == 'tts')
    var obj = {
      para0: '',
      para1: '',
      para2: '',
      para3: '',
      para4: '',
      para5: '',
      para6: '',
      para7: '',
      para8: ''
    }
  if (strGame == 'xjh')
    var obj = {
      para0: '',
      para1: '',
      para2: '',
      para3: '',
      para4: '',
      para5: '',
      para6: '',
      para7: '',
      para8: ''
    }
  if (str != null) {
    var splitMx = str.split('$')
    let i = 0
    for (let item in obj) {
      for (let j in splitMx) {
        if (splitMx[j] != '') {
          var split2 = splitMx[j].split('^')
          if (split2[0] - 1 == i) obj[item] = split2[1] > 0 ? split2[1] : ''
        }
      }
      i++
    }
    mx.push(obj)
  }
  return mx
}

function getTablePara (rType, para) {
  if (
    !rType ||
    rType == 'dx' ||
    rType == 'bjcs' ||
    rType == 'ssc' ||
    rType == 'jsk3'
  )
    return []
  var nn = [
    '庄翻倍1',
    '闲翻倍1',
    '庄平倍1',
    '闲平倍1',
    '庄翻倍2',
    '闲翻倍2',
    '庄平倍2',
    '闲平倍2',
    '庄翻倍3',
    '闲翻倍3',
    '庄平倍3',
    '闲平倍3'
  ]
  var bjl = ['庄', '和', '闲', '庄对', '闲对']
  var lh = ['龙', '和', '虎'] // ['龙', '和', '虎', '龙单', '龙双', '虎单', '虎双'];
  var tts = [
    '闲翻倍1',
    '闲平倍1',
    '闲翻倍2',
    '闲平倍2',
    '闲翻倍3',
    '闲平倍3',
    '闲翻倍4',
    '闲平倍4'
  ]
  var xjh = [
    '闲翻倍1',
    '闲平倍1',
    '闲翻倍2',
    '闲平倍2',
    '闲翻倍3',
    '闲平倍3',
    '闲翻倍4',
    '闲平倍4'
  ]
  var gt = rType == '' ? this.mx_game : rType
  if (rType != '') {
    var obj =
      gt == 'nn'
        ? nn
        : gt == 'bjl'
        ? bjl
        : gt == 'lh'
        ? lh
        : gt == 'dx'
        ? dx
        : gt == 'tts'
        ? tts
        : xjh
  } else {
    var obj =
      gt == '牛牛'
        ? nn
        : gt == '百家乐'
        ? bjl
        : gt == '龙虎'
        ? lh
        : gt == '大小'
        ? dx
        : gt == '推筒子'
        ? tts
        : xjh
  }
  let p = []
  let a = para[0]
  for (let j in para[0]) {
    p.push(a[j])
  }
  let arrPara = []
  for (var i in obj) {
    var obj2 = {}
    obj2.label = obj[i]
    obj2.prop = 'para' + i
    let w1 = getTextWidth(obj[i])
    let w2 = getTextWidth(p[i])
    obj2.width = (w1 > w2 ? w1 : w2) + 20
    arrPara.push(obj2)
  }
  // console.log('arrPara:', arrPara, 'p ', p, 'rType', rType, 'para ', para)
  return arrPara
}

/**
 * 使用span标签包裹内容，然后计算span的宽度 width： px
 * @param valArr
 */
function getTextWidth (str) {
  let width = 0
  let html = document.createElement('span')
  html.innerText = str
  html.className = 'getTextWidth'
  document.querySelector('body').appendChild(html)
  width = document.querySelector('.getTextWidth').offsetWidth
  document.querySelector('.getTextWidth').remove()
  return width
}

export default {
  doData
};
