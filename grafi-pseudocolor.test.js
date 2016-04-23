var assert = require('assert')
var grafi = require('./grafi-pseudocolor.js')

var imageData = grafi.pseudocolor({data: [255, 255, 255, 127], width: 1, height: 1})

assert(imageData.constructor.toString().match(/function\s(\w*)/)[1] === 'GrafiImageData',
  'returned object is an instance of GrafiImageData')

assert(imageData.data[0] === 255, 'R channel is 255')
assert(imageData.data[1] === 0, 'G channel is 0')
assert(imageData.data[2] === 0, 'B channel is 0')
assert(imageData.data[3] === 127, 'alpha channel is not altered')
