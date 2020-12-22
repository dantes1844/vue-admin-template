import Cookies from 'js-cookie'

const TokenKey = 'Laobai.Logon.CookieToken'
const AntiForgeryAntiForgery = 'XSRF-TOKEN';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAntiForgeryToken() {
  return Cookies.get(AntiForgeryAntiForgery)
}

export function setAntiForgeryToken() {
  return Cookies.set(AntiForgeryAntiForgery)
}

export function removeAntiForgeryToken() {
  return Cookies.remove(AntiForgeryAntiForgery)
}
