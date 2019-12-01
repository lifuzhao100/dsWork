/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-28 17:26
 * @Project: dsWork
 */
export default {
  scheduleList(state) {
    let {user, allScheduleList} = state
    console.log('getters scheduleList')
    console.log(allScheduleList.filter(schedule => schedule.username === user.username))
    return allScheduleList.filter(schedule => schedule.username === user.username)
  },
}
