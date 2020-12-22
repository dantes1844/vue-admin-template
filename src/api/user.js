import request from '@/utils/request'

export function login(data) {
  var response = request({
    url: '/api/TokenAuth/Authenticate',
    method: 'post',
    data
  })
  console.log('response',response);
  return response;
}

export function getInfo(token) {
  return request({
    url: '/api/TokenAuth/GetUserInfo',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/api/TokenAuth/Logout',
    method: 'post'
  })
}
