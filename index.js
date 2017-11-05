import Content from './src/index'
// import
// let content = `<p>Para 1</p>
// <p>Para <strong>BOLD</strong> 2. Second Sentence.</p>
// <p>Para 3</p>`
let changes = [
  [
    {
      'id': 'd33a9cb7-31c0-4927-94cc-016af97b3b89',
      'start': 23,
      'orgChars': '<strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong>',
      'newChars': '<strong>BOLDER</strong><strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong><strong>BOLD</strong>'
    }
  ],
  // [
  //   {
  //     'id': '7e825db6-b8e3-441a-b52b-268a7b784c92',
  //     'start': 49,
  //     'orgChars': 'econ',
  //     'newChars': ''
  //   }
  // ]
]
let merger = new Content()
changes.forEach(change => {
  const patch = merger.createPatch(change)
  console.log(JSON.stringify(patch))
})
