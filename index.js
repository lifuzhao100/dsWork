/**
 * @Author: lifuzhao
 * @Date: 2019-12-2019-12-01 22:14
 * @Project: dsWork
 */
import Koa from 'koa'
import Router from '@koa/router'
import koaBody from 'koa-body'
import redis from 'redis'
import api from './src/plugins/api'
const app = new Koa()
const router = new Router()
const client = redis.createClient()

app.use(koaBody({}))

client.on('error', err => {
  console.log('redis client err2：', err)
})

const SCHEDULE_CONFIG_KEY = 'scheduleConfig'

router.get('/hello', (ctx, next) => {
  ctx.body = 'hello world'
})

function Result() {
  this.success = false
  this.message = ''
  this.data = null
}

function wrapper(fn) {
  return new Promise(resolve => {
    fn(resolve)
  })
}

async function checkUser(body, checkInRedis) {
  let {username, password} = body
  let result = new Result()
  if (!username) {
    result.message = '请输入username'
  } else if (!password) {
    result.message = '请输入password'
  } else {
    if (checkInRedis) {
      await new Promise(resolve => {
        console.log('username', username)
        client.get(username, (err, replies) => {
          console.log('err', err)
          console.log('replies', replies)
          if (err || !replies) {
            result.message = '找不到该用户'
          } else {
            result.success = true
          }
          resolve()
        })
      })
    } else {
      result.success = true
    }
  }
  return result
}

router.post('/login', async (ctx, next) => {
  let {username, password} = ctx.request.body
  let result = await checkUser(ctx.request.body, false)
  if (result.success) {
    result = await api.login({username, password})
    if(result.success){
      result.success = true
      result.message = '成功'
      client.set(username, password)
      setTimeout(() => {
        api.getTimeEntriesNew({username, password})
      })
    }
  }
  ctx.status = 200
  ctx.body = result
})

router.post('/schedule/add', async (ctx, next) => {
  let result = await checkUser(ctx.request.body, true)
  console.log('/schedule/add', result)
  let {username, config} = ctx.request.body
  if (result.success) {
    client.hmset(SCHEDULE_CONFIG_KEY, username, JSON.stringify(config), (err, replies) => {
      buildSchedule(username, config)
    })
  }
  ctx.status = 200
  ctx.body = result
})

client.hgetall(SCHEDULE_CONFIG_KEY, (err, replies) => {
  if(err){
    throw err
  }
  Object.keys(replies).forEach(key => {
    buildSchedule(key, replies[key])
  })
})

function buildSchedule(username) {
  client.hgetall(SCHEDULE_CONFIG_KEY, (err, replies) => {
    console.log('buildSchedule')
    console.log('err', err)
    console.log('replies', replies)
  })
}

app
  .use(router.routes())
  .use(router.allowedMethods())

// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//   console.log(replies.length + " replies:");
//   replies.forEach(function (reply, i) {
//     console.log("    " + i + ": " + reply);
//   });
//   client.quit();
// });

// client.hmset('fff', {name:'fuzhao'})

// client.hmset('scheduleConfig', 'fuzhao@datastory.com.cn', [{id: 1, name: 'test'}])
// // client.hmset('scheduleConfig', 'dilu@163.com', 'asdfgh')
//
//
// client.hgetall('scheduleConfig', (err, result) => {
//   console.log('err', err)
//   console.log('result', result)
// })

// client.hmset('scheduleConfig', 'fuzhao@datastory.com.cn', 'azaa')

app.listen(2048, () => {
  console.log('server listening at port 2048')
})
