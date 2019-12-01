/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-27 13:44
 * @Project: dsWork
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from "./mutations";
import getters from "./getters";
import actions from './actions'

Vue.use(Vuex)
export default new Vuex.Store({
  state: state,
  mutations: mutations,
  getters: getters,
  actions: actions
})
