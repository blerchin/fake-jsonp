/*!
 * node-jsonp - index.js
 * Author:
 *    ngot <zhuanghengfei@gmail.com>
 */

'use strict'

/**
 * Module dependencies.
 */

let request = require('request')
let debug = require('debug')('fake-jsonp')

/**
 * JSONP sets up and allows you to execute a JSONP request
 * @param {String} url  The URL you are requesting with the JSON data
 * @param {Object} data The Data object you want to generate the URL params from
 * @param {String} method  The method name for the callback function. Defaults to callback (for example, flickr's is "jsoncallback")
 * @param {Function} callback  The callback you want to execute as an anonymous function. The first parameter of the anonymous callback function is the JSON
 *
 * @example
 * JSONP('http://twitter.com/users/oscargodson.json',function(json){
 *  console.log(json)
 * })
 *
 * @example
 * JSONP('http://api.flickr.com/services/feeds/photos_public.gne',{'id':'12389944@N03','format':'json'},'jsoncallback',function(json){
 *  console.log(json)
 * })
 *
 * @example
 * JSONP('http://graph.facebook.com/FacebookDevelopers', 'callback', function(json){
 *  console.log(json)
 * })
 */

function JSONP (url, data, method) {
  //  Set the defaults
  url = url || ''
  data = data
  method = method || 'callback'

  // Gets all the keys that belong
  // to an object
  var getKeys = function (obj) {
    var keys = []
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key)
      }
    }
    return keys
  }

  // Turn the data object into a query string.
  // Add check to see if the second parameter is indeed
  // a data object. If not, keep the default behaviour
  if (typeof data === 'object') {
    var queryString = ''
    var keys = getKeys(data)
    for (var i = 0; i < keys.length; i++) {
      queryString += encodeURIComponent(keys[i]) + '=' + encodeURIComponent(data[keys[i]])
      if (i !== keys.length - 1) {
        queryString += '&'
      }
    }
    url += '?' + queryString
  }

  // Use timestamp + a random factor to account for a lot of requests in a short time
  // e.g. jsonp1394571775161
  var generatedFunction = 'jsonp' + Math.round(Date.now() + Math.random() * 1000001)

  // Generate the temp JSONP function using the name above
  // First, call the function the user defined in the callback param [callback(json)]
  // Then delete the generated function from the global [delete global[generatedFunction]]

  // Check if the user set their own params, and if not add a ? to start a list of params
  // If in fact they did we add a & to add onto the params
  // example1: url = http://url.com THEN http://url.com?callback=X
  // example2: url = http://url.com?example=param THEN http://url.com?example=param&callback=X
  debug('jsonp url: "%s"', url)
  if (url.indexOf('?') === -1) {
    url = url + '?'
  } else {
    url = url + '&'
  }
  url = url + method + '=' + generatedFunction
  debug('jsonp url: "%s"', url)

  var options = {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    }
  }

  function extractJSON (body) {
    var json = body.split(generatedFunction)[1].replace(/[();]/g, '')
    debug('json: ', json)
    return JSON.parse(json)
  }

  return new Promise(function (resolve, reject) {
    request(options, function (err, res, body) {
      if (err) reject(err)
      else if (res.statusCode === 200) {
        debug('body: "%j"', body)

        resolve(extractJSON(body))
      }
    })
  })
}

module.exports = JSONP
