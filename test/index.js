/* eslint-env mocha */
/* eslint no-unused-vars: 0*/

import should from 'should'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import startsWith from 'lodash/startsWith'
import map from 'lodash/map'
import Content from '../src'
import contentData from './data/content-data'

const { content, tests } = contentData
const testKeys = Object.keys(tests)

let insertTests = []
let deleteTests = []
let mixedTests = []
let replaceTests = []

forEach(testKeys, key => {
  if(startsWith(key, 'insert')){
    insertTests.push(key)
  }else if(startsWith(key, 'delete')){
    deleteTests.push(key)
  }else if(startsWith(key, 'replace')){
    replaceTests.push(key)
  }else if(startsWith(key, 'mixed')){
    mixedTests.push(key)
  }
})

/*
 * Insert test
 */

describe('Insert', function() {
  forEach(insertTests, test => {
    describe(test, function() {
      const data = tests[test]
      it('should patches all insert actions ', function() {
        let contentObj = new Content(content)
        let patches = map(data.changes, change => {
          return contentObj.createPatch(change)
        })
        contentObj.loadPatches(patches)
        let hasPatch = true
        while(hasPatch){
          const patchesInContent = contentObj.getPatches()
          if(patchesInContent.length > 0){
            contentObj.applyPatch(patchesInContent[0])
          }else{
            hasPatch = false
          }
        }
        const mergedContent = contentObj.getContent()
        mergedContent.should.be.eql(data.result)
      })
    })
  })
})

/*
 * delete test
 */

describe('Delete', function() {
  forEach(deleteTests, test => {
    describe(test, function() {
      const data = tests[test]
      it('should patches all Delete actions ', function() {
        let contentObj = new Content(content)
        let patches = map(data.changes, change => {
          return contentObj.createPatch(change)
        })
        contentObj.loadPatches(patches)
        let hasPatch = true
        while(hasPatch){
          const patchesInContent = contentObj.getPatches()
          if(patchesInContent.length > 0){
            contentObj.applyPatch(patchesInContent[0])
          }else{
            hasPatch = false
          }
        }
        const mergedContent = contentObj.getContent()
        mergedContent.should.be.eql(data.result)
      })
    })
  })
})

/*
 * replace test
 */

describe('Replace', function() {
  forEach(replaceTests, test => {
    describe(test, function() {
      const data = tests[test]
      it('should patches all Replace actions ', function() {
        let contentObj = new Content(content)
        let patches = map(data.changes, change => {
          return contentObj.createPatch(change)
        })
        contentObj.loadPatches(patches)
        let hasPatch = true
        while(hasPatch){
          const patchesInContent = contentObj.getPatches()
          if(patchesInContent.length > 0){
            contentObj.applyPatch(patchesInContent[0])
            if(patchesInContent.length === 1){
              hasPatch = false
            }
          }else{
            hasPatch = false
          }
        }
        const mergedContent = contentObj.getContent()
        mergedContent.should.be.eql(data.result)
      })
    })
  })
})