/**
 * @Author: lifuzhao
 * @Date: 2019-11-27 14:36
 * @Project: dsWork
 */
import fs from 'qs'

const fn = {
  setTitle(title) {
    let prefix = ' | 数说故事 东半球最牛逼的大数据公司'
    title = title || '工时管理'
    title = title + prefix
    document.title = title
  },
  // getFormData(data) {
  //   let paramsList = []
  //   Object.keys(data).map(key => {
  //     if (Array.isArray(data[key])) {
  //       data[key].forEach(item => {
  //         paramsList.push(`${key}[]=${item}`)
  //       })
  //     } else if (data[key] && typeof data[key] === 'object') {
  //       Object.keys(data[key]).forEach(itemKey => {
  //         paramsList.push(`${key}[${itemKey}]=${data[key][itemKey]}`)
  //       })
  //     } else {
  //       let result = data[key] || ''
  //       paramsList.push(`${key}=${result}`)
  //     }
  //   })
  //   return paramsList.join('&')
  // }
  getFormData(data) {
    return fs.stringify(data, {arrayFormat: 'brackets'})
  }
}
fn.install = Vue => {
  Vue.prototype.$fn = fn
}
export default fn
