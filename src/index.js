/* See LICENSE file for terms of use */
'use strict'

import concat from 'lodash/concat'
import forEach from 'lodash/forEach'
import indexOf from 'lodash/indexOf'
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
    if(isUpdated){
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
    const { patchObj, id, isApplied, isUpdated } = patch
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
              ptc.ptcObj[index].start1 += lengthChange
              ptc.ptcObj[index].start2 += lengthChange
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
                if(obj.start1 + obj.length1 < ptcOrgStart){
                  startChange += obj.length2 - obj.length1
                  endChange += obj.length2 - obj.length1
                }else if(obj.start1 < ptcOrgStart && obj.start1 + obj.length1 > ptcOrgEnd){
                  return
                }else if(obj.start1 <= ptcOrgStart && obj.start1 + obj.length <= ptcOrgEnd){
                  let diffLength = 0
                  forEach(obj.diffs, diff => {
                    const opt = diff[0]
                    const chars = diff[1]
                    diffLength += chars.length
                    if(obj.start1 + diffLength <= ptcOrgStart){
                      startChange += opt * chars.length
                      endChange += opt * chars.length
                    }else{
                      startChange = opt * (ptcOrgStart - obj.start1)
                    }
                  })
                }
              })
            } catch(err) {

            }
          }
        }
      }
    })
    // forEach(patches, ptc => {
    //   const ptcId = ptc[0][0].id
    //   if(ptcId === id){
    //     updatedPatches.push([ptc[0], ptc[1], true])
    //   }else{
    //     if(ptc[1] === false){
    //       updatedPatches.push(ptc)
    //     }else{
    //       if(ptc.length === 3 && ptc[2]){
    //         updatedPatches.push(ptc)
    //       }else{
    //         try{
    //           const ptcLength = ptc[0].length
    //           const ptcStart = ptc[0][0].start1
    //           const ptcEnd = ptc[0][0][ptcLength - 1].start1 + ptc[0][0][ptcLength - 1].length1
    //           const patchOrgLength = patch.length1
    //           const patchOrgStart = patch[0].start1
    //           const patchOrgEnd = patch[patchOrgLength - 1].start1 + patch[patchOrgLength - 1].length1
    //           const patchNewLength = patch.length2
    //           const patchNewStart = patch[0].start2
    //           const patchNewEnd = patch[patchNewLength - 1].start2 + patch[patchNewLength - 1].length2
    //           if(ptcEnd < patchOrgStart){
    //             updatedPatches.push(ptc)
    //           }else if(ptcStart > patchOrgEnd){
    //             const lengthDiff = (patchNewEnd - patchNewStart) - (patchOrgEnd - patchOrgStart)
    //             let updatedPatch = concat([], ptc)
    //             updatedPatch = map(updatedPatch, tmp => {
    //               tmp.start1 += lengthDiff
    //               tmp.start2 += lengthDiff
    //             })
    //             updatedPatches.push(updatedPatch)
    //           }else{
    //             const mergedResult = this.threeWayMerge(content, patch, ptc[0])
    //             const mergedContent = mergedResult[0]
    //             let updatedPatch = this.diffMatchPatch.patch_make(newContent, mergedContent)
    //             updatedPatch = map(updatedPatch, tmp => {
    //               tmp.id = ptcId
    //               return tmp
    //             })
    //             updatedPatches.push([updatedPatch, true])
    //           }
    //         }catch (error){
    //           updatedPatches.push([ptc[0], false])
    //         }
    //       }
    //     }
    //   }
    // })
    // this.patches = updatedPatches
    // this.setContent(newContent)
    // this.newContent = undefined
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
          console.log(i)
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
    let patches = {
      patchObj: [],
      id: changes[0].id,
      isUpdated: true,
      isApplied: false
    }
    forEach(changes, change => {
      const { start, orgChars, newChars, id } = change
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
        length2: length2,
        id: id
      }
      patches.patchObj.push(patch)
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
