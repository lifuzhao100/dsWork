/**
 * @Author: lifuzhao
 * @Date: 2019-12-2019-12-01 22:34
 * @Project: dsWork
 */

const request = require('superagent')

request('post', 'http://127.0.0.1:2048/login')
  .send('username=fuzhao@datastory.com.cn&password=dstory!@#Q1')
  .end((err, res) => {
    // console.log('err', err)
    console.log('res', res.text)
  })

// request.post('http://127.0.0.1:2048/schedule/add')
//   .send('username=fuzhao@datastory.com.cn&password=dstory!@#Q1&config=测试')
//   .end((err, res) => {
//     console.log('err', err)
//     console.log('res', res.text)
//   })
