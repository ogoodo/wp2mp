'use strict'

var assign = require('object-assign')
var loaderUtils = require('loader-utils')

module.exports = function MyLoader (text) {
  var self = this
  var callback = this.async()

  var config = assign(
    this.options.standard || {},
    loaderUtils.parseQuery(this.query)
  )

  console.log('^^^^^^^^^^^^^^^^^^^^^myloader')
  console.log(text)

  callback(0, text)

}
