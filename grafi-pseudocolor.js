;(function () {
  /**
    ## ImageData object constructor
    Every return from grafi method is formatted to an ImageData object.
    This constructor is used when `window` is not available.
   */
  function ImageData (pixelData, width, height) {
    this.width = width
    this.height = height
    this.data = pixelData
  }

  /**
    ## formatter
    Internal function used to format pixel data into ImageData object

    ### Parameters
      - pixelData `Uint8ClampedArray`: pixel representation of the image
      - width `Number`: width of the image
      - hight `Number`: height of the image

    ### Example
        formatter(new Uint8ClampedArray[400], 10, 10)
        // ImageData { data: Uint8ClampedArray[400], width: 10, height: 10, }
   */
  function formatter (pixelData, width, height) {
    var colorDepth = pixelData.length / (width * height)

    // Length of pixelData must be multipul of available pixels (width * height).
    // Maximum color depth allowed is 4 (RGBA)
    if (Math.round(colorDepth) !== colorDepth || colorDepth > 4) {
      throw new Error('data and size of the image does now match')
    }

    if (!(pixelData instanceof Uint8ClampedArray)) {
      throw new Error('pixel data passed is not an Uint8ClampedArray')
    }

    // If window is avilable create ImageData using browser API,
    // otherwise call ImageData constructor
    if (typeof window === 'object' && colorDepth === 4) {
      return new window.ImageData(pixelData, width, height)
    }
    return new ImageData(pixelData, width, height)
  }
  /**
    ## grayscale method
    Grayscale color of an given image.
    If no option is passed, it defaults to { mode: 'luma', monochrome: false }

    ### Parameters
      - imageData `Object`: ImageData object
      - option `Object` : Option object
          - mode `String` : grayscaling mode, 'luma', 'simple', or 'average'
          - monochrome `Boolean` : output to be monochrome (single color depth) image

    ### Example
        var input = { data: Uint8ClampedArray[400], width: 10, height: 10, }
        grafi.grayscale(input, {mode: 'average', monochrome: true})
        // Since monochrome flag is true, returned object will have smaller data
        // ImageData { data: Uint8ClampedArray[100], width: 10, height: 10, }
   */
  function grayscale (imgData, option) {
    // set check options object & set default options if necessary
    option = option || {}
    option.mode = option.mode || 'luma'
    option.monochrome = option.monochrome || false
    option.channel = Number(option.channel) || 1

    // different grayscale methods
    var mode = {
      'luma': function (r, g, b) {
        return 0.299 * r + 0.587 * g + 0.114 * b
      },
      'simple': function (r, g, b, a, c) {
        return arguments[c]
      },
      'average': function (r, g, b) {
        return (r + g + b) / 3
      }
    }

    // sanitary check for input data
    var dataLength = imgData.data.length
    var pixelSize = imgData.width * imgData.height
    if (dataLength / pixelSize !== 4) {
      throw new Error('ImageObject has incorrect color depth, please pass RGBA image')
    }

    var newPixelData = new Uint8ClampedArray(pixelSize * (option.monochrome || 4))
    var i, _grayscaled, _index

    // loop through pixel size, extract r, g, b values & calculate grayscaled value
    for (i = 0; i < pixelSize; i++) {
      _index = i * 4
      _grayscaled = mode[option.mode](imgData.data[_index], imgData.data[_index + 1], imgData.data[_index + 2], imgData.data[_index + 3], option.channel)
      if (option.monochrome) {
        newPixelData[i] = _grayscaled
        continue
      }
      newPixelData[_index] = _grayscaled
      newPixelData[_index + 1] = _grayscaled
      newPixelData[_index + 2] = _grayscaled
      newPixelData[_index + 3] = imgData.data[_index + 3]
    }
    return formatter(newPixelData, imgData.width, imgData.height)
  }
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

  var grafi = {}
  grafi.pseudocolor = pseudocolor

  if (typeof module === 'object' && module.exports) {
    module.exports = grafi
  } else {
    this.grafi = grafi
  }
}())
