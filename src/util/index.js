import concat from 'lodash/concat'
import forEach from 'lodash/forEach'

let genDiffLoop = (action, content) => {
  let diffs = []
  forEach(content, char => {
    diffs.push([action, char])
  })
  return diffs
}

let genOptDiff = (range, patches, content, start, end) => {
  let optDiff = []
  forEach(range, (position, index) => {
    if(index % 2 !== 0){
      const patch = patches[Math.floor(index/2)]
      forEach(patch.diffs, diff => {
        const action = diff[0]
        const actionContent = diff[1]
        let diffs = []
        if(actionContent.length > 1){
          diffs = genDiffLoop(action, actionContent)
        }else{
          diffs.push(diff)
        }
        optDiff = concat(optDiff, diffs)
      })
    }else{
      const begin = index === 0 ? start : range[index - 1]
      if(position > begin){
        const equalContent = content.substring(begin, position)
        const equalDiff = genDiffLoop(0, equalContent)
        optDiff = concat(optDiff, equalDiff)
      }
    }
    if(index === range.length - 1 && position !== end){
      const equalContent = content.substring(position, end)
      const equalDiff = genDiffLoop(0, equalContent)
      optDiff = concat(optDiff, equalDiff)
    }
  })
  return optDiff
}

let enableArrayEquals = () => {
  // Warn if overriding existing method
  if(Array.prototype.equals) console.warn('Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there\'s a framework conflict or you\'ve got double inclusions in your code.')
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false

    // compare lengths - can save a lot of time
    if (this.length != array.length) return false

    for (var i = 0, l=this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i])) return false
      }
      else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false
      }
    }
    return true
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, 'equals', {enumerable: false})
}

export default {
  enableArrayEquals: enableArrayEquals,
  genOptDiff: genOptDiff,
  genDiffLoop: genDiffLoop
}