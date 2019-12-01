/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-27 14:25
 * @Project: dsWork
 */
import storage from '../plugins/storage'

export default {
  async initStore({commit}) {
    let storageResult = await storage.getItems([
      {
        key: 'user',
        defaultValue: {}
      }, {
        key: 'allScheduleList',
        defaultValue: []
      }]
    )
    console.log('initStore')
    console.log('storageResult', storageResult)
    commit('updateAllScheduleList', storageResult.allScheduleList)
    commit('updateUser', storageResult.user)
  },
  async saveUser({commit}, payload) {
    await storage.setItems({
      user: payload,
      isLogged: true
    })
    commit('updateUser', payload)
    commit('updateIsLogged', true)
  },
  async saveScheduleItem({dispatch, commit}, payload) {
    let storageResult = await storage.getItems([{key: 'user', defaultValue: {}}, {
      key: 'allScheduleList',
      defaultValue: []
    }])
    let user = storageResult.user,
      allScheduleList = storageResult.allScheduleList
    payload.username = user.username
    let allScheduleListByCurrentUser = allScheduleList.filter(schedule => schedule.username === user.username)
    if (allScheduleListByCurrentUser.length === 0) {
      payload.id = 1
    } else {
      payload.id = Math.max.apply(null, allScheduleListByCurrentUser.map(schedule => schedule.id)) + 1
    }
    payload.id = '' + payload.id
    allScheduleList.unshift(payload)
    await storage.setItem('allScheduleList', allScheduleList)
    commit('updateAllScheduleList', allScheduleList)
  },
  async deleteScheduleItem({commit}, id) {
    let storageResult = await storage.getItems([{key: 'user', defaultValue: {}}, {
      key: 'allScheduleList',
      defaultValue: []
    }])
    let user = storageResult.user,
      allScheduleList = storageResult.allScheduleList
    allScheduleList = allScheduleList.filter(schedule => schedule.username !== user.username || schedule.id !== id)
    await storage.setItem('allScheduleList', allScheduleList)
    commit('updateAllScheduleList', allScheduleList)
  },
  async deleteAllSchedule({commit}) {
    let storageResult = await storage.getItems([{key: 'user', defaultValue: {}}, {
      key: 'allScheduleList',
      defaultValue: []
    }])
    let user = storageResult.user,
      allScheduleList = storageResult.allScheduleList
    allScheduleList = allScheduleList.filter(schedule => schedule.username === user.username)
    await storage.setItem('allScheduleList', allScheduleList)
    commit('updateAllScheduleList', allScheduleList)
  },
}
