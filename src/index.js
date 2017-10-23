/* See LICENSE file for terms of use */
'use strict'

import concat from 'lodash/concat'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import indexOf from 'lodash/indexOf'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
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
    this.patches = map(patches, patch => {
      return [patch, true] //[patch, updated]
    })
  }

  addPatch(patch){
    this.patches.push([patch, true])
  }

  applyPatch(patch, isReturnContent) {
    let content = this.content
    forEach(patch, ptc => {
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
    let patches = this.patches
    if(patches.length === 0){
      return
    }
    const { content, newContent } = this
    patches = filter(patches, ptc => {
      return !isEqual(ptc[0], patch)
    })
    let updatedPatches = []
    forEach(patches, ptc => {
      if(ptc[1] === false){
        updatedPatches.push(ptc)
      }else{
        try{
          const mergedResult = this.threeWayMerge(content, patch, ptc[0])
          const mergedContent = mergedResult[0]
          const updatedPatch = this.diffMatchPatch.patch_make(newContent, mergedContent)
          updatedPatches.push([updatedPatch, true])
        }catch (error){
          console.error(error)
          updatedPatches.push([ptc[0], false])
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
      optBCharsRange.push(start1 - optBChanges + length1)
      optBChanges += length2 - length1
    })
    forEach(optC, patch => {
      const { start1, length1, length2 } = patch
      optCCharsRange.push(start1 - optCChanges)
      optCCharsRange.push(start1 - optCChanges + length1)
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
    const patches = this.patches
    return map(filter(patches, patch => {return patch[1]}), patch => { return patch[0] })
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
    let patches = []
    forEach(changes, change => {
      const { start, orgChars, newChars } = change
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
      const length1 = orgChars.length
      const length2 = newChars.length
      const patch = {
        diffs: diffs,
        start1: start,
        start2: start,
        length1: length1,
        length2: length2
      }
      patches.push(patch)
    })
    return patches
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
    return this.diffMatchPatch.patch_toText(patches)
  }

  patchFromText (text) {
    return this.diffMatchPatch.patch_fromText(text)
  }
}

export default Content