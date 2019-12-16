/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-27 14:25
 * @Project: dsWork
 */
import storage from '../plugins/storage'

const initScheduleList = [{
  "name": "默认下班前提醒",
  "time": "18:00",
  "actions": ["notification"],
  "username": "fuzhao@datastory.com.cn",
  "id": "2"
}, {
  "name": "默认上班后提醒",
  "time": "10:15",
  "actions": ["notification"],
  "username": "fuzhao@datastory.com.cn",
  "id": "1"
}]

export default {
  async initStore({commit}) {
    let {user, allScheduleList} = await storage.getItems([
      {
        key: 'user',
        defaultValue: {}
      }, {
        key: 'allScheduleList',
        defaultValue: []
      }]
    )
    commit('updateAllScheduleList', allScheduleList)
    commit('updateUser', user)
  },
  async saveUser({commit}, payload) {
    let {userList, allScheduleList} = await storage.getItems([
      {
        key: 'userList',
        defaultValue: []
      },
      {
        key: 'allScheduleList',
        defaultValue: []
      }
    ])
    let isInit = userList.findIndex(user => user.username === payload.username) !== -1 && allScheduleList.findIndex(schedule => schedule.username === payload.username) !== -1
    let data = {
      user: payload
    }
    if (!isInit) {
      initScheduleList.forEach(schedule => {
        schedule.username = payload.username
      })
      allScheduleList = initScheduleList.concat(allScheduleList)
      data.allScheduleList = allScheduleList
      data.userList = userList.push(payload)
    }
    await storage.setItems(data)
    if (!isInit) {
      commit('updateAllScheduleList', allScheduleList)
    }
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
    let {user, allScheduleList} = await storage.getItems([
      {
        key: 'user',
        defaultValue: {}
      },
      {
        key: 'allScheduleList',
        defaultValue: []
      }])
    allScheduleList = allScheduleList.filter(schedule => schedule.username !== user.username)
    await storage.setItem('allScheduleList', allScheduleList)
    commit('updateAllScheduleList', allScheduleList)
  },
}
