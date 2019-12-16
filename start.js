/**
 * @Author: lifuzhao
 * @Date: 2019-12-2019-12-01 22:21
 * @Project: dsWork
 */
require('babel-polyfill')
require('babel-register')({
  presets:[
    'env'
  ]
})
module.exports = require('./index')
