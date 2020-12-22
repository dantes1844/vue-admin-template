import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
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
  login({ commit }, userInfo) {
    const { userNameOrEmailAddress, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userNameOrEmailAddress: userNameOrEmailAddress.trim(), password: password })
      .then(response => {
        var accessToken = response.data.result.accessToken;
        commit('SET_TOKEN', accessToken)//通知vuex修改全局状态
        setToken(accessToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.userId).then(response => {
        const { result } = response.data

        if (!result) {
          reject('Verification failed, please Login again.')
        }

        const { roleNames, name } = result
        // roles must be a non-empty array
        if (!roleNames || roleNames.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        console.log('modules.user.js roles before:',roleNames);
        commit('SET_ROLES', roleNames)
        console.log('modules.user.js roles after:',roleNames);
        commit('SET_NAME', name)
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

