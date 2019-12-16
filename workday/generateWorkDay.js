/**
 * @Author: lifuzhao
 * @Date: 2019-12-2019-12-10 10:11
 * @Project: dsWork
 * 主要想实现的逻辑是
 * 这里维护每年的工作日，对于工时提醒，仅包含在工作日中日期才会进行提醒
 */
const {writeFile} = require('fs')
const {join} = require('path')
const dayjs = require('dayjs')


const thisYear = dayjs()
const nextYear = dayjs().add(1, 'year')

function generateJson(year) {
  let fileName = year.format('YYYY') + '.json'
  let list = []
  let start = year.startOf('year')
  while (start.isSame(year, 'year') && list.length < 365) {
    let date = start.format('YYYY-MM-DD'),
      day = start.format('dddd'),
      isWeekend = start.get('day') === 0 || start.get('day') === 6
    if (!isWeekend) {
      list.push(date)
    }
    start = start.add(1, 'day')
  }
  writeFile(join(__dirname, fileName), JSON.stringify(list), err => {
    if (err) {
      throw err
    }
    console.log(`生成 ${fileName} 成功`)
  })
}

generateJson(thisYear)
generateJson(nextYear)
