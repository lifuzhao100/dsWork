/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-28 18:08
 * @Project: dsWork
 */
// 谷歌插件版storage
let isExtension = false
try {
  isExtension = !!chrome.storage.local
} catch (e) {

}
const storage = {
  /**
   * @
   */
  async getItem(item) {
    let storageResult = await storage.getItems([item])
    return storageResult[item.key]
  },
  getItems(items) {
    return new Promise(resolve => {
      let obj = {}
      if (isExtension) {
        let keys = items.map(item => item.key)
        chrome.storage.local.get(keys, function (result) {
          items.forEach(({key, defaultValue}) => {
            if (result.hasOwnProperty(key)) {
              obj[key] = result[key]
            } else {
              obj[key] = defaultValue
            }
          })
          resolve(obj)
        })
      } else {
        items.forEach(item => {
          let {key, defaultValue} = item
          let str = localStorage.getItem(key)
          obj[key] = defaultValue
          if (str) {
            try {
              if (defaultValue instanceof Array) {
                let temp = JSON.parse(str)
                if (temp instanceof Array) {
                  obj[key] = temp
                }
              } else if (defaultValue instanceof Object) {
                let temp = JSON.parse(str)
                if (temp instanceof Object) {
                  obj[key] = temp
                }
              } else {
                obj[key] = str
              }
            } catch (e) {
            
            }
          }
        })
        resolve(obj)
      }
    })
  },
  setItem(key, value) {
    let items = {
      [key]: value
    }
    return storage.setItems(items)
  },
  /**
   *
   * @param items {Object}
   * @returns {Promise<unknown>}
   */
  setItems(items) {
    return new Promise(resolve => {
      if (isExtension) {
        chrome.storage.local.set(items, function () {
          resolve()
        })
      } else {
        Object.keys(items).forEach(key => {
          let temp = items[key]
          if (temp) {
            if (typeof temp === 'object') {
              temp = JSON.stringify(temp)
            }
          }
          localStorage.setItem(key, temp)
        })
        resolve()
      }
    })
  }
}
storage.install = Vue => {
  Vue.prototype.$storage = storage
}
export default storage
