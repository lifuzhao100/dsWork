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
  updateUserList(state, userList) {
    state.userList = userList
  },
  updateUser(state, user) {
    state.user = user
  },
  updateAllScheduleList(state, allScheduleList) {
    state.allScheduleList = allScheduleList
  },
  updateCookieMap(state, {username, cookie}) {
    let cookieMap = state.cookieMap
    cookieMap[username] = cookie
    state.cookieMap = cookieMap
  }
}
