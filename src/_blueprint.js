;(function(){

import '../node_modules/grafi-formatter/src/formatter'
import '../node_modules/grafi-grayscale/src/grayscale'
import 'pseudocolor'

  var grafi = {}
  grafi.pseudocolor = pseudocolor

  if (typeof module === 'object' && module.exports) {
    module.exports = grafi
  } else {
    this.grafi = grafi
  }
}())
