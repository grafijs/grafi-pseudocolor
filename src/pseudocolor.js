/**
  ## pseudocolor method
  Gibe grayscaled image rainbow pseudocolor
  TODO: support different pseudocolor scheme

  ### Parameters
    - imageData `Object`: ImageData object
    - option `Object` : Option object
        - grayscaled `Boolean` : input imageData is grayscaled or not

  ### Example
      var input = { data: Uint8ClampedArray[400], width: 10, height: 10 }
      // turn image into pseudocolor
      grafi.pseudocolor(input)
      // if input image is already grayscaled, pass grayscaled flag to bypass redundant grayscaling
      grafi.pseudocolor(input, {grayscaled: true})
 */
function pseudocolor (imgData, option) {
  // sanitary check for input data
  checkColorDepth(imgData)

  // check options object & set default variables
  option = option || {}
  option.grayscaled = option.grayscaled || false

  var pixelSize = imgData.width * imgData.height
  var grayscaledData = imgData.data
  if (!option.grayscaled) {
    grayscaledData = grayscale(imgData).data
  }
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

  var pixel, index
  for (pixel = 0; pixel < pixelSize; pixel++) {
    index = pixel * 4
    newPixelData[index] = redLookupTable[grayscaledData[index]]
    newPixelData[index + 1] = greenLookupTable[grayscaledData[index + 1]]
    newPixelData[index + 2] = blueLookupTable[grayscaledData[index + 2]]
    newPixelData[index + 3] = imgData.data[index + 3]
  }

  return formatter(newPixelData, imgData.width, imgData.height)
}
