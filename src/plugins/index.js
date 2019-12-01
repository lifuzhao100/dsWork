/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-27 14:01
 * @Project: dsWork
 */
import Vue from 'vue'
import fn from './fn'
import storage from './storage'
import api from './api'
export const bus = new Vue()
bus.install = Vue => {
  Vue.prototype.$bus = bus
}
const plugins = [
  fn,
  bus,
  storage,
  api
]
plugins.forEach(plugin => {
  Vue.use(plugin)
})

