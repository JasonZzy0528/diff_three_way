/* eslint-env mocha */
/* eslint no-unused-vars: 0*/

import should from 'should'
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import Content from '../src'
import contentData from './data/content-data'

describe('Insert', function() {
  const insert = Object.keys(contentData)[0]
  const data = contentData[insert]
  describe(insert, function() {
    it('should patches all insert actions ', function() {
      let content = new Content(data.content)
      let patches = map(data.changes, change => {
        return content.createPatch(change)
      })
      content.loadPatches(patches)
      let hasPatch = true
      while(hasPatch){
        const patchesInContent = content.getPatches()
        if(patchesInContent.length > 0){
          content.applyPatch(patchesInContent[0])
        }else{
          hasPatch = false
        }
      }
      const mergedContent = content.getContent()
      mergedContent.should.be.eql(data.result)
    })
  })
})