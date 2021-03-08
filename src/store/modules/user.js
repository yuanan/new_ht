import { login } from '@/api/user'
import { getToken, setToken, removeToken, setLogout } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'
import AES from '@/api/aes'
import $Global from '@/api/global'
import $ws from '@/api/ws2'
// import $pomelo from '@/api/pomelo'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, sendStr) {
    // const { username, password } = sendStr
    return new Promise((resolve, reject) => {
      login(sendStr).then(response => {
        const en = $Global.en
        var body = response.data
        var msg = JSON.parse(AES.decrypt(body, en))
        console.log('msg ', msg)
        if (msg.router === 'LoginErr') {
          Message.info(msg.reason)
          reject()
        }
        if (msg.JsonData.enable === 0) {
          Message.info('亲, 您的帐户被锁定, 请联系上级！')
          reject()
        }
        $ws.doData(body)
        $Global.optioner.UserName = msg.JsonData.name
        $Global.optioner.Id = msg.JsonData.Id
        $Global.selectInfo.selectAgent = msg.JsonData.name
        $Global.optioner.xmb_s = msg.JsonData.xmb_s
        $Global.optioner.xmb_d = msg.JsonData.xmb_d
        $Global.optioner.zcb = msg.JsonData.zcb
        $Global.optioner.gx = msg.JsonData.gx
        $Global.optioner.xmType = msg.JsonData.xmType === 0 ? '双边' : '单边'
        $Global.optioner.arrJxb = msg.JsonData.jxb.split(',')
        $Global.optioner.level = msg.JsonData.level
        $Global.optioner.token = msg.JsonData.token
        $Global.optioner.webSit = msg.JsonData.webSit
        $Global.optioner.customerId = msg.JsonData.customerId
        $Global.gxLength = msg.JsonData.gx.split('^').length
        // 判断是否是万利的代理
        msg.JsonData.gx.split('^')[2] === '20338' && ($Global.isWL = true)
        commit('SET_NAME', msg.JsonData.name)
        // $pomelo.conn((err, res) => {
        //   if (err) console.error(err)
        //   if (res.code === 200) {
        //     console.log('res.code ', res.code)
        //     $Global.Pass = password
        //     const ht_info = { account: username, password: password }
        //     setHtInfo(AES.encrypt(JSON.stringify(ht_info), en))
        //     setAutoLogin('true')
        //     commit('SET_TOKEN', msg.JsonData.token)
        //     commit('SET_NAME', msg.JsonData.name)
        //   }
        // })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // let token = getToken()
      if ($Global.optioner.token !== '') {
        commit('SET_ROLES', ['admin'])
        commit('SET_AVATAR', require('@/assets/images/admin.png'))
        resolve(['admin'])
      } else {
        reject('请重新登录验证')
      }
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      setLogout()
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
