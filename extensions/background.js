import dayjs from "dayjs"
import 'babel-polyfill'
import storage from "../src/plugins/storage";
import api from '../src/plugins/api'
import request from 'superagent'

function open() {
  let index = chrome.runtime.getURL('./index.html')
  window.open(index, '_blank')
}

// 首次安装插件时或者点击浏览器右上角插件icon时自动打开页面
chrome.runtime.onInstalled.addListener(open)
chrome.browserAction.onClicked.addListener(open)

// storage更新时调用
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  await buildSchedule()
})
const timersMap = {}

async function buildSchedule() {
  const dates = await updateWorkDays()
  let allScheduleList = await storage.getItem({key: 'allScheduleList', defaultValue: []})
  Object.keys(timersMap).forEach(timerKey => {
    clearTimeout(timerKey)
    delete timersMap[timerKey]
  })
  let notificationList = [],
    addTimeEntryList = []
  let now = dayjs()
  allScheduleList.forEach(({id, time, username, actions, config, operateHistoryList = []}) => {
    let dateTimes = dates.map(date => ({
      date: date,
      time: time,
      dateTime: date + ' ' + time
    })).filter(item => now.isBefore(dayjs(item.dateTime)))
    let operateList = dateTimes.map(({date, dateTime}) => {
      let timerKey = username + '_' + id + '_' + dateTime
      let timeout = dayjs(dateTime).valueOf() - now.valueOf()
      return {
        id: id,
        timerKey,
        username,
        date: date,
        dateTime,
        config,
        timeout: timeout
      }
    }).filter(({timerKey}) => {
      return operateHistoryList.findIndex(operate => operate.timerKey === timerKey) === -1
    })
    if (actions.includes('notification')) {
      notificationList = notificationList.concat(operateList)
    } else if (actions.includes('addTimeEntry')) {
      addTimeEntryList = addTimeEntryList.concat(operateList)
    }
  })
  buildNotificationSchedule(notificationList)
  // buildAddTimeEntrySchedule(addTimeEntryList)
}

function buildNotificationSchedule(list) {
  list.forEach(({id, timerKey, timeout, username}) => {
    console.log('buildNotificationSchedule timeout', timeout)
    let data = {
      type: 'notification',
      data: {
        username: username,
        timerKey: timerKey
      }
    }
    timersMap[timerKey] = setTimeout(async () => {
      // 由于一些原因，导致没有active tab 接受这个message 增加重试机制
      // 时间间隔是30秒
      await retry(() => sendMessageToContentScript(data), 30 * 1000)
      await updateOperateHistoryList({
        username: username,
        id: id,
        timerKey: timerKey,
        operation: 'notification'
      })
    }, timeout)
  })
}

function buildAddTimeEntrySchedule(list) {
  list.forEach(({id, timerKey, timeout, config, username}) => {
    timersMap[timerKey] = setTimeout(async () => {
      await retry(() => addTimeEntry(config), 30 * 1000)
      await updateOperateHistoryList({
        username,
        id,
        timerKey: timerKey,
        operation: 'addTimeEntry'
      })
    }, timeout)
  })
}

async function retry(fn, timeout) {
  let result = await fn()
  console.log('action result', result)
  if (result.success) {
    return result
  }
  return new Promise(resolve => {
    setTimeout(async () => {
      result = await retry(fn, timeout)
      resolve(result)
    }, timeout)
  })
}

// 把关闭提示，自动登记工时这些动作的时间保存下
async function updateOperateHistoryList({username, scheduleId, operation, timerKey}) {
  let allScheduleList = await storage.getItems({key: 'allScheduleList', defaultValue: []})
  allScheduleList.find(schedule => {
    if (schedule.username === username && schedule.id === scheduleId) {
      schedule.operateHistoryList = schedule.operateHistoryList || []
      schedule.operateHistoryList.unshift({
        createTime: dayjs().format('YYYY-MM-DD HH:mm'),
        timerKey: timerKey,
        operation: operation
      })
      return true
    }
    return false
  })
  await storage.setItem('allScheduleList', allScheduleList)
}

function sendMessageToContentScript(data) {
  return new Promise(resolve => {
    chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
      let result = {
        success: false,
        message: ''
      }
      if (!tab) {
        result.message = '没有active tab'
        resolve(result)
      } else {
        chrome.tabs.sendMessage(tab.id, data, res => {
          if (!res) {
            result.message = '发送失败'
          } else {
            result.success = true
            result.data = res
          }
          resolve(result)
        });
      }
    });
  })
}

async function addTimeEntry(config) {
  let result = {
    success: false,
    message: ''
  }
  return new Promise(async resolve => {
    let params = {
      utf8: '✓',
      back_url: '',
      commit: '创建',
      time_entry: config
    }
    let {success, token, message} = await api.getTimeEntriesNew()
    if (!success) {
      result.message = message || '获取token出错'
      resolve(result)
    } else {
      params.authenticity_token = token
      let res = await api.addTimeEntry(params)
      if (!res.success) {
        result.message = '登记工时失败'
      } else {
        result.success = true
        result.message = '登记工时成功'
      }
      resolve(resolve)
    }
  })
}

const workdayMap = {}

async function updateWorkDays() {
  const year = dayjs().format('YYYY')
  if (workdayMap[year]) return workdayMap[year]
  return new Promise(resolve => {
    request.get(`https://lifuzhao100.github.io/dsWork/${year}.json`)
      .end((err, res) => {
        let dates = []
        if (Array.isArray(res.body)) {
          let today = dayjs().startOf('day')
          dates = res.body.filter(date => {
            let item = dayjs(date, 'YYYY').endOf('day')
            return today.isBefore(item)
          })
        }
        workdayMap[year] = dates
        resolve(dates)
      })
  })
}

const now = dayjs()
const nextYear = dayjs().add(1, 'year').startOf('year')

setTimeout(() => {
  updateWorkDays()
}, nextYear.toDate().getTime() - now.toDate().getTime())

buildSchedule().then(() => {
  console.log('单纯想调用 then')
})

