import request from '@/utils/request'

export function login(data) {
  var response = request({
    url: '/api/TokenAuth/Authenticate',
    method: 'post',
    data
  })
  return response;
}

export function getInfo() {
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

export function getUserList(params){
  return request({
    url:'/api/services/app/user/getAll',
    method:'get',
    params
  });
}

export function createUser(createUserDto){
  return request({
    url:'/api/services/app/user/create',
    method:'post',
    data:createUserDto
  });
}

export function deleteUser(userId){
  return request({
    url:'/api/services/app/user/delete',
    method:'delete',
    params:{id:userId}
  });
}
