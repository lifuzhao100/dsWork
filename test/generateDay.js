/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-29 14:09
 * @Project: dsWork
 */
const dayjs = require('dayjs')
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')

const now = dayjs('2019-11-29 08:00')
console.log(typeof now.valueOf())

let dateList = []
let targetWeek = dayjs(),
  tempDate = dayjs()
while (tempDate.isSame(targetWeek, 'week')) {
  let date = tempDate.format('YYYY-MM-DD')
  dateList.push({
    label: date,
    value: date,
    day: tempDate.format('dddd'),
    isWeekend: tempDate.get('day') === 0 || tempDate.get('day') === 6
  })
  tempDate = tempDate.add(1, 'day')
  if (!tempDate.isSame(targetWeek, 'week') && dateList.length < 4) {
    targetWeek = targetWeek.add(1, 'week')
  }
}
// console.log(dateList)
