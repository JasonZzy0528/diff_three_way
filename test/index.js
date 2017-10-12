import Content from '../src'


const text = 'beep boop beep boop beep boop beep boop beep boop beep boop boop beep boop beep boop beep boop beep boop beep boop'
const content = new Content(text)
const changes1 = [
  {
    start: 5,
    orgChars: 'boop beep',
    newChars: 'boos beep'
  }
]

const changes2 = [
  {
    start: 5,
    orgChars: 'boop beep',
    newChars: 'boop bees'
  }
]
const patch1 = content.createPatch(changes1)
const patch2 = content.createPatch(changes2)

let patches = [patch1, patch2]
content.loadPatches(patches)
content.applyPatch(patch1)
console.log(content.getContent())
const newPatches = content.getPatches()
content.applyPatch(newPatches[0])
console.log(content.getContent())

