var Content = require('./dist').default
var _ = require('lodash')

let text = '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">themes</a> in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>'
let content = new Content(text)
let changes = [
  [{
    start: 257,
    orgChars: '>',
    newChars: '>Wonderful '
  }],
  [{
    start: 298,
    orgChars: '.',
    newChars: '. It\'s easy to customize and style Atom. You can tweak the look and feel of your UI with CSS/Less and add major features with HTML and JavaScript. Check out the video on.'
  }],
  [{
    start: 166,
    orgChars: '>',
    newChars: '><h3>Under the hood</h3>'
  }]
]

let patches = _.map(changes, change => {
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
console.log(mergedContent)