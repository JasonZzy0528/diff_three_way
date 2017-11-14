/* See LICENSE file for terms of use */
'use strict'

import concat from 'lodash/concat'
import extend from 'lodash/extend'
import forEach from 'lodash/forEach'
import indexOf from 'lodash/indexOf'
import isArray from 'lodash/isArray'
import max from 'lodash/max'
import min from 'lodash/min'
import diff_match_patch from 'diff-match-patch'
import util from './util'

util.enableArrayEquals()

class Content {
  constructor(content){
    this.diffMatchPatch = new diff_match_patch()
    this.content = content
    this.newContent = undefined
    this.patches = []
    this.loadPatches = this.loadPatches.bind(this)
    this.applyPatch = this.applyPatch.bind(this)
    this.setContent = this.setContent.bind(this)
    this.getContent = this.getContent.bind(this)
    this.threeWayMerge = this.threeWayMerge.bind(this)
    this.updatePatches = this.updatePatches.bind(this)
  }

  loadPatches(patches){
    this.patches = concat([], patches)
  }

  addPatch(patch){
    this.patches.push([patch, true])
  }

  applyPatch(patch, isReturnContent) {
    let content = this.content
    const { patchObj, id, isApplied, isUpdated } = patch
    if(isApplied){
      throw new Error('The patch cannot be applied, because it was applied before')
    }
    if(!isUpdated){
      throw new Error('The patch cannot be applied, because it has conflict')
    }
    if(id === undefined || id === null){
      throw new Error('id cannot be undefined or null')
    }
    forEach(patchObj, ptc => {
      const { diffs, start1, length1 } = ptc
      let replacement = ''
      forEach(diffs, diff => {
        if(diff[0] !== -1){
          replacement += diff[1]
        }
      })
      content = content.substring(0, start1) + replacement + content.substring(start1 + length1, content.length)
    })
    if(isReturnContent){
      return content
    }else{
      this.newContent = content
      this.updatePatches(patch)
    }
  }

  updatePatches(patch) {
    let patches = concat([], this.patches)
    const { patchObj, id } = patch
    if(patchObj.length === 0){
      throw new Error('patchObj cannot be empty')
    }
    const { content, newContent } = this
    let updatedPatches = []
    forEach(patches, ptc => {
      const ptcId = ptc.id
      if(ptcId === id){
        ptc.isApplied = true
        ptc.isUpdated = true
        updatedPatches.push(ptc)
      }else{
        const ptcIsApplied = ptc.isApplied
        const ptcIsUpdated = ptc.isUpdated
        if(ptcIsApplied || !ptcIsUpdated){
          updatedPatches.push(ptc)
        }else{
          const ptcObj = ptc.patchObj
          const ptcOrgStart = ptcObj[0].start1
          const ptcOrgEnd = ptcObj[ptcObj.length - 1].start1 + ptcObj[ptcObj.length - 1].length1
          const patchOrgStart = patchObj[0].start1
          const patchOrgEnd = patchObj[patchObj.length - 1].start1 + patchObj[patchObj.length - 1].length1
          if(ptcOrgStart > patchOrgEnd) {
            let lengthChange = 0
            forEach(patchObj, obj => {
              lengthChange += obj.length2 - obj.length1
            })
            forEach(ptcObj, (obj, index) => {
              ptc.patchObj[index].start1 += lengthChange
              ptc.patchObj[index].start2 += lengthChange
            })
            updatedPatches.push(ptc)
          } else if (ptcOrgEnd < patchOrgStart) {
            updatedPatches.push(ptc)
          } else {
            try {
              const mergedResult = this.threeWayMerge(content, patchObj, ptcObj)
              const mergedContent = mergedResult[0]
              let startChange = 0
              let endChange = 0
              forEach(patchObj, obj => {
                if(obj.start1 + obj.length1 <= ptcOrgStart + startChange){
                  startChange += obj.length2 - obj.length1
                  endChange += obj.length2 - obj.length1
                }else if(obj.start1 <= ptcOrgStart + startChange){
                  let diffLength = 0
                  forEach(obj.diffs, diff => {
                    const opt = diff[0]
                    const chars = diff[1]
                    if(obj.start1 + diffLength <= ptcOrgStart + startChange){
                      startChange += opt * chars.length
                      endChange += opt * chars.length
                    }else{
                      if(ptcOrgStart + startChange - obj.start1 - diffLength + chars.length >= 0){
                        startChange += opt * (ptcOrgStart + startChange - obj.start1 - diffLength + chars.length)
                      }
                      if(obj.start1 + diffLength <= ptcOrgEnd + endChange){
                        endChange += opt * chars.length
                      } else if(obj.start1 + diffLength - chars.length <= ptcOrgEnd + endChange){
                        endChange += opt * (ptcOrgEnd + endChange - obj.start1 - diffLength + chars.length)
                      }
                    }
                    diffLength += chars.length
                  })
                }else if(obj.start1 > ptcOrgStart && obj.start1 + obj.length1 <= ptcOrgEnd){
                  let diffLength
                  forEach(obj.diffs, diff => {
                    const opt = diff[0]
                    const chars = diff[1]
                    if(obj.start1 + diffLength <= ptcOrgEnd + endChange){
                      endChange += opt * chars.length
                    } else if(obj.start1 + diffLength - chars.length <= ptcOrgEnd + endChange){
                      endChange += opt * (ptcOrgEnd + endChange - obj.start1 - diffLength + chars.length)
                    }
                    diffLength += chars.length
                  })
                }
              })
              const newStart = ptc.patchObj[0].start1 + startChange
              const newEnd = ptc.patchObj[ptc.patchObj.length - 1].start1 + ptc.patchObj[ptc.patchObj.length - 1].length1 + endChange
              let updatedPatchObj = this.diffMatchPatch.patch_make(newContent, mergedContent)
              let tmpDiffs = []
              let length2Change = 0
              forEach(updatedPatchObj, (tmp, index) => {
                if(tmp.start1 > newEnd || tmp.start1 + tmp.length1 < newStart){
                  return
                }
                if (tmp.start1 <= newStart) {
                  if(tmp.start1 + tmp.length1 < newStart){
                    return
                  } else {
                    let tmpLength = 0
                    forEach(tmp.diffs, diff => {
                      let opt = diff[0]
                      let chars = diff[1]
                      if (opt === 0) {
                        if (chars.length + tmp.start1 + tmpLength > newStart && chars.length + tmp.start1 + tmpLength <= newEnd) {
                          tmpDiffs.push([opt, chars.substring(newStart - tmp.start1 - tmpLength, chars.length)])
                        } else if (chars.length + tmp.start1 + tmpLength >= newStart && chars.length + tmp.start1 + tmpLength >= newEnd && tmp.start1 + tmpLength < newEnd) {
                          tmpDiffs.push([opt, chars.substring(chars.length + tmp.start1 + tmpLength - newStart, newEnd - tmp.start1 - tmpLength)])
                        }
                        tmpLength += chars.length
                      } else {
                        if (tmp.start1 + tmpLength <= newEnd) {
                          tmpDiffs.push(diff)
                          length2Change += opt * chars.length
                        }
                      }
                    })
                  }
                } else if(tmp.start1 >= newStart) {
                  if(tmp.start1 > newEnd){
                    return
                  }
                  if (tmp.start1 + tmp.length1 >= newEnd) {
                    if(index === 0){
                      tmpDiffs.push([0, newContent.substring(newStart, tmp.start1)])
                      let tmpLength = 0
                      forEach(tmp.diffs, diff => {
                        let opt = diff[0]
                        let chars = diff[1]
                        if (opt === 0) {
                          if (chars.length + tmp.start1 + tmpLength > newEnd) {
                            tmpDiffs.push([opt, chars.substring(0, newEnd - tmp.start1 - tmpLength)])
                          }
                          tmpLength += chars.length
                        } else {
                          if (tmp.start1 + tmpLength < newEnd) {
                            tmpDiffs.push(diff)
                            length2Change += opt * chars.length
                          }
                        }
                      })
                    }else{
                      let tmpLength = 0
                      forEach(tmp.diffs, diff => {
                        let opt = diff[0]
                        let chars = diff[1]
                        if (opt === 0) {
                          if (chars.length + tmp.start1 + tmpLength > newEnd) {
                            tmpDiffs.push([opt, chars.substring(0, newEnd - tmp.start1 - tmpLength)])
                          } else {
                            tmpDiffs.push(diff)
                          }
                          tmpLength += chars.length
                        } else {
                          if (tmp.start1 + tmpLength < newEnd) {
                            tmpDiffs.push(diff)
                            length2Change += opt * chars.length
                          }
                        }
                      })
                    }
                  } else {
                    if(index === 0){
                      tmpDiffs.push([0, newContent.substring(newStart, tmp.start1)])
                    }
                    tmpDiffs = concat(tmpDiffs, tmp.diffs)
                  }
                }
                if(index === updatedPatchObj.length - 1){
                  if(tmp.start1 + tmp.length1 <= newEnd){
                    tmpDiffs.push([0, newContent.substring(tmp.start1 + tmp.length1, newEnd)])
                  }
                }
              })
              let tmpPatchObj = [
                {
                  diffs: tmpDiffs,
                  start1: newStart,
                  start2: newStart,
                  length1: newEnd - newStart,
                  length2: newEnd - newStart + length2Change
                }
              ]
              const updatedPatch = {
                patchObj: tmpPatchObj,
                id: ptcId,
                isApplied: false,
                isUpdated: true
              }
              updatedPatches.push(updatedPatch)
            } catch(err) {
              console.log(err)
              ptc.isUpdated = false
              updatedPatches.push(ptc)
            }
          }
        }
      }
    })
    this.patches = updatedPatches
    this.setContent(newContent)
    this.newContent = undefined
  }

  threeWayMerge(content, optB, optC) {
    const contentLength = content.length
    let optBCharsRange = []
    let optCCharsRange = []
    let optBChanges = 0
    let optCChanges = 0
    forEach(optB, patch => {
      const { start1, length1, length2 } = patch
      optBCharsRange.push(start1 - optBChanges)
      if(start1 === 0){
        optBCharsRange.push(start1 - optBChanges + length1 - 1)
      }else{
        optBCharsRange.push(start1 - optBChanges + length1)
      }
      optBChanges += length2 - length1
    })
    forEach(optC, patch => {
      const { start1, length1, length2 } = patch
      optCCharsRange.push(start1 - optCChanges)
      if(start1 === 0){
        optCCharsRange.push(start1 - optCChanges + length1 - 1)
      }else{
        optCCharsRange.push(start1 - optCChanges + length1)
      }
      optCChanges += length2 - length1
    })

    const start = min([min(optBCharsRange), min(optCCharsRange)])
    const end = max([max(optBCharsRange), max(optCCharsRange)])
    if(end >= contentLength) throw new Error('incorrect patch')
    const editingContent = content.substring(start, end)
    let contentDiff = this.genDiffLoop(0, editingContent)
    let optBDiff = this.genOptDiff(optBCharsRange, optB, content, start, end)
    let optCDiff = this.genOptDiff(optCCharsRange, optC, content, start, end)
    let next = true
    let i = 0
    let newContent = []
    let isPatchApplied = true
    while(next){
      const oneL = contentDiff[i]
      const twoL = optBDiff[i]
      const threeL = optCDiff[i]
      let from
      if(oneL || twoL || threeL){
        let l
        if(oneL && twoL && threeL){
          if(oneL.equals(twoL)){
            l = threeL
            from = 'three'
          } else if(oneL.equals(threeL)){
            l = twoL
            from = 'two'
          } else if(twoL.equals(threeL)){
            l = twoL
            from = 'both'
          }
        } else if(twoL && !threeL){
          l = twoL
          from = 'two'
        } else if(!twoL && threeL){
          l = threeL
          from = 'three'
        }

        if(l === undefined){
          throw new Error('Conflict at position ', i)
        } else {
          const op = l[0]
          if(op == 1){
            const index = i == 0 ? 0 : i-1
            if(from == 'two'){
              contentDiff.splice(index, 0, l)
              optCDiff.splice(index, 0, l)
            } else if (from == 'three'){
              contentDiff.splice(index, 0, l)
              optBDiff.splice(index, 0, l)
            } else {
              contentDiff.splice(index, 0, l)
            }
          } else if(op == -1){
            if(from == 'two'){
              contentDiff.splice(i, 1, l)
              optCDiff.splice(i, 1, l)
            } else if (from == 'three'){
              contentDiff.splice(i, 1, l)
              optBDiff.splice(i, 1, l)
            } else {
              //  from == 'both'
              contentDiff.splice(i, 1, l)
            }
          }
          newContent.push(l)
        }
      }
      next = next != false && (contentDiff[i + 1] || optBDiff[i + 1] || optCDiff[i + 1])
      i++
    }

    const mergedPatch = this.diffMatchPatch.patch_make(newContent)
    const mergedEditingContent = this.diffMatchPatch.patch_apply(mergedPatch, editingContent)
    isPatchApplied = this.isPatchApplied(mergedEditingContent[1])
    if(!isPatchApplied) throw new Error('Conflict happened')
    const mergedContent = content.substring(0, start) + mergedEditingContent[0] + content.substring(end, contentLength)
    return [mergedContent, isPatchApplied]
  }

  isPatchApplied(patchStatus) {
    return indexOf(patchStatus, false) === -1
  }

  updateContent(content) {
    this.content = content
  }

  getPatches() {
    return concat([], this.patches)
  }

  getContent() {
    return this.content
  }

  setContent(content) {
    const type = typeof content
    if(type === 'string'){
      this.content = content
      return
    }
    throw new TypeError(`String expected, but got ${type}`)
  }

  createPatch(changes) {
    const type = typeof changes
    if(type === 'object' && !isArray(changes)){
      const { id, text1, text2 } = changes
      const patchObj = this.diffMatchPatch.patch_make(text1, text2)
      let patches = {
        patchObj: patchObj,
        id: id,
        isUpdated: true,
        isApplied: false
      }
      return patches
    } else if (type === 'object') {
      let patches = {
        patchObj: [],
        id: changes[0].id,
        isUpdated: true,
        isApplied: false
      }
      let lengthChange = 0
      forEach(changes, (change, index) => {
        const { start, orgChars, newChars } = change
        let lengthUpdate = 0
        const types = [typeof start, typeof orgChars, typeof newChars]
        let errorMessage
        if(types[0] !== 'number'){
          errorMessage = `Number expected, but got ${types[0]}`
        }
        if(types[1] !== 'string'){
          errorMessage = `String expected, but got ${types[1]}`
        }
        if(types[2] !== 'string'){
          errorMessage = `String expected, but got ${types[2]}`
        }
        if(errorMessage){
          throw new TypeError(errorMessage)
        }
        const diffs = this.diffMatchPatch.diff_main(orgChars, newChars)
        forEach(diffs, diff => {
          const opt = diff[0]
          const length = diff[1].length
          lengthUpdate += opt * length
        })
        const length1 = orgChars.length
        const length2 = newChars.length
        let patch = {}
        if(index === 0){
          patch = {
            diffs: diffs,
            start1: start,
            start2: start,
            length1: length1,
            length2: length2
          }
        } else {
          patch = {
            diffs: diffs,
            start1: start + lengthChange,
            start2: start + lengthChange,
            length1: length1,
            length2: length2
          }
        }
        patches.patchObj.push(patch)
        lengthChange += lengthUpdate
      })
      return patches
    }
    throw new TypeError(`String expected, but got ${type}`)
  }

  genOptDiff(range, patches, content, start, end) {
    let me = this
    let optDiff = []
    forEach(range, (position, index) => {
      if(index % 2 !== 0){
        const patch = patches[Math.floor(index/2)]
        forEach(patch.diffs, diff => {
          const action = diff[0]
          const actionContent = diff[1]
          let diffs = []
          if(actionContent.length > 1){
            diffs = me.genDiffLoop(action, actionContent)
          }else{
            diffs.push(diff)
          }
          optDiff = concat(optDiff, diffs)
        })
      }else{
        const begin = index === 0 ? start : range[index - 1]
        if(position > begin){
          const equalContent = content.substring(begin, position)
          const equalDiff = me.genDiffLoop(0, equalContent)
          optDiff = concat(optDiff, equalDiff)
        }
      }
      if(index === range.length - 1 && position !== end){
        const equalContent = content.substring(position, end)
        const equalDiff = me.genDiffLoop(0, equalContent)
        optDiff = concat(optDiff, equalDiff)
      }
    })
    return optDiff
  }

  genDiffLoop (action, content) {
    let diffs = []
    forEach(content, char => {
      diffs.push([action, char])
    })
    return diffs
  }

  patchToText (patches) {
    const { patchObj } = patches
    const patchText = this.diffMatchPatch.patch_toText(patchObj)
    const newPatch = extend({}, patches, { patchObj: patchText })
    return JSON.stringify(newPatch)
  }

  patchFromText (text) {
    const patch = JSON.parse(text)
    const patchObj = this.diffMatchPatch.patch_fromText(patch.patchObj)
    const newPatch = extend({}, patch, { patchObj: patchObj })
    return newPatch
  }
}

export default Content
