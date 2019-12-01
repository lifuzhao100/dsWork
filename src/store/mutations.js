/**
 * @Author: lifuzhao
 * @Date: 2019-11-27 23:34
 * @Project: dsWork
 */
export default {
  updateLoginLoading(state, loginLoading) {
    state.loginLoading = loginLoading
  },
  updateIsLogged(state, isLogged) {
    state.isLogged = isLogged
  },
  updateUser(state, user) {
    state.user = user
  },
  updateAllScheduleList(state, allScheduleList) {
    state.allScheduleList = allScheduleList
  }
}
