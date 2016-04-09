/**
  ## pseudocolor method
  Brief description

  ### Parameters
    - imageData `Object`: ImageData object
    - option `Object` : Option object

  ### Example
      //code sample goes here
 */
function pseudocolor (imgData, option) {
  // check options object & set default variables
  option = option || {}

  // Check length of data & avilable pixel size to make sure data is good data
  var pixelSize = imgData.width * imgData.height
  var dataLength = imgData.data.length
  var colorDepth = dataLength / pixelSize
  if (colorDepth !== 4) {
    throw new Error('ImageObject has incorrect color depth')
  }

  var grayschaledData = grayscale(imgData).data
  var newPixelData = new Uint8ClampedArray(pixelSize * 4)
  var redLookupTable = new Uint8ClampedArray(256)
  var greenLookupTable = new Uint8ClampedArray(256)
  var blueLookupTable = new Uint8ClampedArray(256)

  redLookupTable.forEach(function (d, i) {
    var n = 0
    if (i > 128 && i < 192) {
      n = (i - 128) * (256 / (192 - 128))
    }
    if (i >= 192) {
      n = 255
    }
    redLookupTable[i] = n
  })

  greenLookupTable.forEach(function (d, i) {
    var n = 255
    if (i < 64) {
      n = i * (256 / 64)
    }
    if (i >= 192) {
      n = 255 - ((i - 191) * (256 / (256 - 192)))
    }
    greenLookupTable[i] = n
  })

  blueLookupTable.forEach(function (d, i) {
    var n = 0
    if (i > 64 && i < 128) {
      n = 255 - ((i - 63) * (256 / (192 - 128)))
    }
    if (i < 65) {
      n = 255
    }
    blueLookupTable[i] = n
  })

  var p, _index
  for (p = 0; p < pixelSize; p++) {
    _index = p * 4
    newPixelData[_index] = redLookupTable[grayschaledData[_index]]
    newPixelData[_index + 1] = greenLookupTable[grayschaledData[_index + 1]]
    newPixelData[_index + 2] = blueLookupTable[grayschaledData[_index + 2]]
    newPixelData[_index + 3] = imgData.data[_index + 3]
  }

  return formatter(newPixelData, imgData.width, imgData.height)
}
