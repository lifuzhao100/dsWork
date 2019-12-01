/**
 * @Author: lifuzhao
 * @Date: 2019-11-27 14:36
 * @Project: dsWork
 */
import objectToFormData from 'object-to-formdata'

const fn = {
  getAppPath(type) {
    switch (type) {
      case 'pop':
        return chrome.runtime.getURL('./popup.html')
      case 'app':
      default:
        return chrome.runtime.getURL('./dsWork.html')
    }
  },
  getFormData(params = {}) {
    return objectToFormData(params)
  },
  setTitle(title) {
    let prefix = ' | 数说故事 东半球最牛逼的大数据公司'
    title = title || '工时管理'
    title = title + prefix
    document.title = title
  }
}
fn.install = Vue => {
  Vue.prototype.$fn = fn
}
export default fn
