/*!
 * node-jsonp - test/index.test.js
 * Author:
 *    ngot <zhuanghengfei@gmail.com>
 */

'use strict'

/**
 * Module dependencies.
 */

let JSONP = require('../')
let querystring = require('querystring')

// See http://doc.jsfiddle.net/use/echo.html
let ENDPOINT = 'http://jsfiddle.net/echo/jsonp/'

describe('index.js', function () {
  it('querystring jsonp', function () {
    let obj = {
      a: 'a',
      b: 'b'
    }
    let qs = querystring.encode(obj)
    return JSONP(ENDPOINT + '?' + qs).then(function (res) {
      res.should.eql(obj)
    })
  })

  it('param jsonp', function () {
    let obj = {
      a: 'a',
      b: 'b'
    }
    JSONP(ENDPOINT, obj).then(function (res) {
      res.should.eql(obj)
    })
  })

  it('method', function () {
    let obj = {
      a: 'a',
      b: 'b'
    }
    JSONP(ENDPOINT, obj, 'callback').then(function (res) {
      res.should.eql(obj)
    })
  })
})
