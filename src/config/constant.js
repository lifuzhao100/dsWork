/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-27 23:49
 * @Project: dsWork
 */
let baseUrl = 'http://39.98.57.31:8585/'
if (process.env.NODE_ENV === 'development') {
  baseUrl = '/'
}
// 登录接口地址
export const loginUrl = baseUrl + 'redmine/login'

// 添加筛选器的接口
export const filterUrl = baseUrl + 'redmine/queries/filter?type=TimeEntryQuery&name=user_id'
// 查询耗时接口地址
export const timeEntriesUrl = baseUrl + 'redmine/time_entries'

// 登记工时，获取表单必要参数
export const timeEntriesNewUrl = baseUrl + 'redmine/time_entries/new'
export const timeEntriesAddUrl = baseUrl + 'redmine/time_entries'

export const actionsList = [
  {
    label: '弹窗通知',
    value: 'notification'
  },
//   {
//   label: '自动登记',
//   value: 'addTimeEntry'
// }
]
