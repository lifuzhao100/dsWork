import Notification from 'element-ui/lib/notification'
import 'element-ui/lib/theme-chalk/notification.css'
import './content.css'

let countAtSameTime = 0,
  notificationHandler = null
let page = chrome.runtime.getURL('./index.html')
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let {type, data} = message
  switch (type) {
    case 'notification':
      notify(data)
      sendResponse({
        type: 'receiveNotification',
        data: {
          timerKey: data.timerKey,
          message: '收到该条通知'
        }
      })
      break
    case 'other 1':
      break
    case 'other 2':
      break
    default:
  }
  return true
})

function notify(data) {
  countAtSameTime++
  clearTimeout(notificationHandler)
  notificationHandler = setTimeout(() => {
    callback()
    Notification.warning({
      title: '工时填报定时提醒',
      dangerouslyUseHTMLString: true,
      message: `<strong style="color: #E6A23C">${data.username}</strong> 小可爱，要记得填报工时哦💗+${countAtSameTime}`,
      duration: 0,
      onClick: () => {
        window.open(page + '#/record/add', '_blank')
      }
    })
  }, 0)
}
