/* eslint-disable */
import './PomeloClient.js'
import defaultSetting from '@/settings'
import global from './global'
import AES from './aes'
import ws from './ws2'
var nHeartBeat = 0
var s_timer
var interval = null
var isConn = true
var p_server = new Pomelo()
var p_server2 = new Pomelo()

function conn(cb) {
  const en = global.en
  var loginInfo = JSON.parse(AES.decrypt(localStorage.getItem('login_info'), en))
  var msg = { uid: loginInfo.login_id }
  var msg2 = { userId: loginInfo.login_id, token: loginInfo.login_token }
  p_server.init({ host: defaultSetting.ip, port: defaultSetting.pomelo_ws_port, log: true },
    function () {
      p_server.request('gate.gateHandler.queryEntry', msg, function (res) {
        console.log('first res ', res)
        p_server.disconnect()
        if (res.code === 200) {
          p_server2.init(
            { host: res.host, port: res.port, log: true },
            function (res) {
              p_server2.request('connector.entryHandler.entry', msg2, function (res) {
                console.log('connector.entryHandler.entry ----------========', res)
                if (res.code === 200) {
                  startTimer()
                  cb(null, res)
                }
              })
            }
          )
        } else {
          cb(null, res)
        }
      })
    }
  )
}

p_server2.on('close', function (e) {
  console.log('close ')
  p_server2.disconnect()
  if (interval != null) {
    window.clearInterval(interval)
    interval = null
  }
  // clearInterval(interval);
  // 连接关闭
  // if(isConn) {
  //   isConn = false
    console.log('enter close state reconnect ................', new Date())
    interval = setInterval(() => {
      // console.log('）））））））））））一直Interval 。。。。。。。。。。。。。。。', new Date())
      conn((err, res) => {
        if (res.code === 200) {
          // alert(res.code, new Date())
          clearInterval(interval)
          interval = null
          // startTimer()
          isConn = true
          console.log('isConn interval++++++++++ ', interval)
        }
        // isConn = true
      });
      // isConn = true
    }, 5000)
  // }
})

p_server2.on('onMsg', function (e) {
  // 被踢开
  console.log('----onMsg------:', e)
})

p_server2.on('onKick', function (e) {
  // 被踢开
  alert('亲,有相同帐号登录,你被踢出来了!')
  kick()
})

function kick() {
  nHeartBeat = 0
  p_server2.disconnect()
  clearInterval(s_timer)
  window.location.reload()
}

var n = 0
function send(msg) {
  n = n + 1
  const en = global.en
  const msgSend = AES.encrypt(JSON.stringify(msg), en)
  // console.log('----------------- send  ', n, '------', msg)
  var route = 'agent.agentHandler.getMsg'
  p_server2.request(route, msgSend, function (res) {
    // console.log('res ', res)
    ws.doData(res)
  })
}

function startTimer() {
  console.log('----------- before start Timer -------------- ', s_timer)
  clearInterval(s_timer)
  s_timer = null
  // clearInterval(interval)
  s_timer = setInterval(() => {
    chkHeartBeat(p_server2)
  }, 5000)
  
  console.log('----------- after start Timer -------------- ', s_timer)
}

function chkHeartBeat(server) {
  console.log('------------------------CheckHeartBeat', nHeartBeat)
  if (nHeartBeat > 30) {
    console.log('自检测跳线了')
    alert('因网络信号不好, 需重新登录!', nHeartBeat)
    server.disconnect()
    clearInterval(s_timer)
    window.location.reload()
  }
  nHeartBeat += 5
  var msg = { uid: global.optioner.Id } // 记得改
  var route = 'agent.agentHandler.chkHardBean'
  server.request(route, msg, function (data) {
    if (data.code === '07') {
      console.log('data.code ............ ', data.code)
      nHeartBeat = 0
    }
  })
}
export default { conn, send, kick }
