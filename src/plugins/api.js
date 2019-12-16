/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-29 15:28
 * @Project: dsWork
 */
import {loginUrl, timeEntriesAddUrl, timeEntriesNewUrl} from "../config/constant";
import request from "superagent";
import cheerio from "cheerio";
import store from "../store";
import fn from '../plugins/fn'
// import superagentCache from 'superagent-cache'

// superagentCache(request)
const requestMap = {}
const api = {
  async getToken(config = {}) {
    let {method = 'get', url, params = {}, username} = config
    let cookieMap = store.state.cookieMap
    let result = {
      success: false,
      message: '获取Token失败',
      data: ''
    }
    let cookie = cookieMap[username] || ''
    if (!requestMap[url]) {
      requestMap[url] = new Promise(resolve => {
        request[method](url)
        // .set("cookie", cookie)
          .send(fn.getFormData(params))
          .end((err, res) => {
            console.log('getToken err', err)
            if (!err) {
              let $ = cheerio.load(res.text)
              let inputs = $('[name=authenticity_token]')
              if (inputs.length > 0) {
                inputs.each((index, ele) => {
                  let input = $(ele)
                  result.data = input.attr('value')
                })
                result.message = ''
              } else {
                result.message = '已经登录过了，无需重新登录'
                store.commit('updateIsLogged', true)
              }
              result.success = true
            } else {
              store.commit('updateIsLogged', false)
            }
            console.log('getToken result', result)
            resolve()
          })
        
      })
    }
    await requestMap[url]
    delete requestMap[url]
    return result
  },
  async login(user) {
    let result = {
      success: false,
      message: ''
    }
    let res = await api.getToken({url: loginUrl})
    if (!res.success) {
      result.message = '获取token失败'
      return result
    }
    if (!res.data) {
      result.success = true
      result.message = res.message
      return result
    }
    
    let params = {
      username: user.username,
      password: user.password,
      authenticity_token: res.data,
      utf8: '✓',
      back_url: '',
      login: '登录',
    }
    if (!requestMap[loginUrl]) {
      requestMap[loginUrl] = new Promise(resolve => {
        request.post(loginUrl)
          .send(fn.getFormData(params))
          // .set('cookie', res.cookie)
          .end((err, response) => {
            console.log('login err', err)
            if (err) {
              result.message = err
              store.commit('updateIsLogged', false)
            } else {
              store.commit('updateIsLogged', true)
              result.success = true
              result.message = '登录成功'
              result.cookie = res.cookie
              store.commit('updateCookieMap', {
                username: user.username,
                cookie: res.cookie
              })
            }
            console.log('login result', result)
            resolve(result)
          })
      })
    }
    result = await requestMap[loginUrl]
    delete requestMap[loginUrl]
    return result
  },
  async getTimeEntriesNew(user) {
    user = user || store.state.user
    let result = {
      success: false,
      token: '',
      projectList: [],
      activitiesList: []
    }
    if (!requestMap[timeEntriesNewUrl]) {
      requestMap[timeEntriesNewUrl] = new Promise(resolve => {
        request.get(timeEntriesNewUrl)
          .end((err, res) => {
            if (!err) {
              let $ = cheerio.load(res.text)
              let form = $('#new_time_entry')
              $('#time_entry_project_id option', form).each((index, ele) => {
                let value = $(ele).attr('value'),
                  label = $(ele).text()
                if (!value) return
                result.projectList.push({
                  value,
                  label
                })
              })
              $('#time_entry_activity_id option', form).each((index, ele) => {
                let value = $(ele).attr('value'),
                  label = $(ele).text()
                if (!value) return
                result.activitiesList.push({
                  value,
                  label
                })
              })
              result.token = $('[name=authenticity_token]', form).val()
              if (result.token) {
                result.success = true
              }
            }
            console.log('getTimeEntriesNew result', result)
            resolve()
          })
      })
    }
    await requestMap[timeEntriesNewUrl]
    delete requestMap[timeEntriesNewUrl]
    return result
  },
  // 登记工时
  addTimeEntry(params, id) {
    let result = {
      success: false,
      message: ''
    }
    let url = timeEntriesAddUrl
    if (id) {
      url = timeEntriesAddUrl + '/' + id
      params._method = 'patch'
    }
    return new Promise(resolve => {
      request.post(url)
        .send(fn.getFormData(params))
        .end((err, res) => {
          if (err) {
            result.message = err
          } else {
            result.success = true
          }
          resolve(result)
        })
    })
  },
  deleteTimeEntry(token, id) {
    let result = {
      success: false,
      message: ''
    }
    let url = timeEntriesAddUrl + '/' + id
    let params = {
      _method: 'delete',
      authenticity_token: token
    }
    return new Promise(resolve => {
      request.post(url)
        .send(fn.getFormData(params))
        .end((err, res) => {
          if (err) {
            result.message = err
          } else {
            result.success = true
          }
          resolve(result)
        })
    })
  }
}
api.install = Vue => {
  Vue.prototype.$api = api
}
export default api
