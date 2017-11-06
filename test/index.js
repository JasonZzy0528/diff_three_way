/* eslint-env mocha */
/* eslint no-unused-vars: 0*/

import should from 'should'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import startsWith from 'lodash/startsWith'
import map from 'lodash/map'
import Content from '../src/index'
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
      const contentKeys = Object.keys(data)
      forEach(contentKeys, key => {
        describe(key, function() {
          const { patchPositions } = data[key]
          let contentObj = new Content(content[key])
          let patches = map(data[key].changes, change => {
            return contentObj.createPatch(change)
          })
          contentObj.loadPatches(patches)
          forEach(patches, (ptc, index) => {
            const patchesInContent = contentObj.getPatches()
            if(patchesInContent[index]){
              contentObj.applyPatch(patchesInContent[index])
              if(index < patches.length - 1 && patchPositions){
                describe(`appling patch ${index}`, function() {
                  const updatedPatches = contentObj.getPatches()
                  forEach(updatedPatches, (patch, ptcIndex) => {
                    if(ptcIndex > index){
                      describe(`updating patch ${ptcIndex}`, function() {
                        const { patchObj } = patch
                        const start = patchObj[0].start1
                        const end = patchObj[patchObj.length - 1].start1 + patchObj[patchObj.length - 1].length1
                        const expectedStart = patchPositions[index][ptcIndex - index - 1].start
                        const expectedEnd = patchPositions[index][ptcIndex - index - 1].end
                        describe('patch start', function() {
                          it('should equal to expected patch start', () => {
                            start.should.be.eql(expectedStart)
                          })
                        })
                        describe('patch end', function() {
                          it('should equal to expected patch end', () => {
                            end.should.be.eql(expectedEnd)
                          })
                        })
                      })
                    }
                  })
                })
              }
            }
          })
          const mergedContent = contentObj.getContent()
          describe('new content string', function() {
            it('should equal to expected content string', function() {
              mergedContent.should.be.eql(data[key].result)
            })
          })
        })
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
      const contentKeys = Object.keys(data)
      forEach(contentKeys, key => {
        describe(key, function() {
          it('should patches all delete actions ', function() {
            const { patchPositions } = data[key]
            let contentObj = new Content(content[key])
            let patches = map(data[key].changes, change => {
              return contentObj.createPatch(change)
            })
            contentObj.loadPatches(patches)
            forEach(patches, (ptc, index) => {
              const patchesInContent = contentObj.getPatches()
              if(patchesInContent[index]){
                contentObj.applyPatch(patchesInContent[index])
                if(index < patches.length - 1 && patchPositions){
                  describe(`appling patch ${index}`, function() {
                    const updatedPatches = contentObj.getPatches()
                    forEach(updatedPatches, (patch, ptcIndex) => {
                      if(ptcIndex > index){
                        describe(`updating patch ${ptcIndex}`, function() {
                          const { patchObj } = patch
                          const start = patchObj[0].start1
                          const end = patchObj[patchObj.length - 1].start1 + patchObj[patchObj.length - 1].length1
                          const expectedStart = patchPositions[index][ptcIndex - index - 1].start
                          const expectedEnd = patchPositions[index][ptcIndex - index - 1].end
                          describe('patch start', function() {
                            it('should equal to expected patch start', () => {
                              start.should.be.eql(expectedStart)
                            })
                          })
                          describe('patch end', function() {
                            it('should equal to expected patch end', () => {
                              end.should.be.eql(expectedEnd)
                            })
                          })
                        })
                      }
                    })
                  })
                }
              }
            })
            const mergedContent = contentObj.getContent()
            mergedContent.should.be.eql(data[key].result)
          })
        })
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
      const contentKeys = Object.keys(data)
      forEach(contentKeys, key => {
        describe(key, function() {
          it('should patches all replace actions ', function() {
            const { patchPositions } = data[key]
            let contentObj = new Content(content[key])
            let patches = map(data[key].changes, change => {
              return contentObj.createPatch(change)
            })
            contentObj.loadPatches(patches)
            forEach(patches, (ptc, index) => {
              const patchesInContent = contentObj.getPatches()
              if(patchesInContent[index]){
                contentObj.applyPatch(patchesInContent[index])
                if(index < patches.length - 1 && patchPositions){
                  describe(`appling patch ${index}`, function() {
                    const updatedPatches = contentObj.getPatches()
                    forEach(updatedPatches, (patch, ptcIndex) => {
                      if(ptcIndex > index){
                        describe(`updating patch ${ptcIndex}`, function() {
                          const { patchObj } = patch
                          const start = patchObj[0].start1
                          const end = patchObj[patchObj.length - 1].start1 + patchObj[patchObj.length - 1].length1
                          const expectedStart = patchPositions[index][ptcIndex - index - 1].start
                          const expectedEnd = patchPositions[index][ptcIndex - index - 1].end
                          describe('patch start', function() {
                            it('should equal to expected patch start', () => {
                              start.should.be.eql(expectedStart)
                            })
                          })
                          describe('patch end', function() {
                            it('should equal to expected patch end', () => {
                              end.should.be.eql(expectedEnd)
                            })
                          })
                        })
                      }
                    })
                  })
                }
              }
            })
            const mergedContent = contentObj.getContent()
            mergedContent.should.be.eql(data[key].result)
          })
        })
      })
    })
  })
})

/*
* mixed test
*/

describe('Mixed', function() {
  forEach(mixedTests, test => {
    describe(test, function() {
      const data = tests[test]
      const contentKeys = Object.keys(data)
      forEach(contentKeys, key => {
        describe(key, function() {
          it('should patches all mixed actions ', function() {
            const { patchPositions } = data[key]
            let contentObj = new Content(content[key])
            let patches = map(data[key].changes, change => {
              return contentObj.createPatch(change)
            })
            contentObj.loadPatches(patches)
            let hasPatch = true
            forEach(patches, (ptc, index) => {
              const patchesInContent = contentObj.getPatches()
              if(patchesInContent[index]){
                contentObj.applyPatch(patchesInContent[index])
                if(index < patches.length - 1 && patchPositions){
                  describe(`appling patch ${index}`, function() {
                    const updatedPatches = contentObj.getPatches()
                    forEach(updatedPatches, (patch, ptcIndex) => {
                      if(ptcIndex > index){
                        describe(`updating patch ${ptcIndex}`, function() {
                          const { patchObj } = patch
                          const start = patchObj[0].start1
                          const end = patchObj[patchObj.length - 1].start1 + patchObj[patchObj.length - 1].length1
                          const expectedStart = patchPositions[index][ptcIndex - index - 1].start
                          const expectedEnd = patchPositions[index][ptcIndex - index - 1].end
                          describe('patch start', function() {
                            it('should equal to expected patch start', () => {
                              start.should.be.eql(expectedStart)
                            })
                          })
                          describe('patch end', function() {
                            it('should equal to expected patch end', () => {
                              end.should.be.eql(expectedEnd)
                            })
                          })
                        })
                      }
                    })
                  })
                }
              }
            })
            const mergedContent = contentObj.getContent()
            mergedContent.should.be.eql(data[key].result)
          })
        })
      })
    })
  })
})
