import Cookies from 'js-cookie'
import AES from '@/api/aes'
import $Global from '@/api/global'

const TokenKey = 'Admin-Token'
const AutoLogin = 'ATOLN'
const HtInfo = 'ht_info'
const en = $Global.en
// 自动登录有效时间为 1小时 { expires: expTime }
const expTime = new Date(new Date().getTime() + 1 * 60 * 60 * 1000)

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setAutoLogin(atoln) {
  return Cookies.set(AutoLogin, atoln, { expires: expTime })
}

export function getAutoLogin() {
  return Cookies.get(AutoLogin)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setHtInfo(info) {
  return Cookies.set(HtInfo, AES.encrypt(info, en), { expires: expTime })
}

export function getHtInfo() {
  return AES.decrypt(AES.decrypt(Cookies.get(HtInfo), en), en)
}

export function getLIToken() {
  return AES.decrypt(localStorage.getItem('login_info'), en)
}

export function setLogout() {
  localStorage.clear()
  Cookies.remove(HtInfo)
  Cookies.remove(AutoLogin)
  window.location.reload()
}
