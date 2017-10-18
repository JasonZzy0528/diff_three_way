export default {
  content: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">themes</a> in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>',
  tests: {
    insert_only_no_conflict: {
      changes: [
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
      ],
      result: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><h3>Under the hood</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">Wonderful themes</a> in both dark and light colors. It\'s easy to customize and style Atom. You can tweak the look and feel of your UI with CSS/Less and add major features with HTML and JavaScript. Check out the video on. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>'
    },
    delete_no_conflict: {
      changes: [
        [{
          start: 225,
          orgChars: '<a href="https://atom.io/themes">themes</a> ',
          newChars: ''
        }],
        [{
          start: 152,
          orgChars: '<h3>Themes</h3>',
          newChars: ''
        }],
        [{
          start: 391,
          orgChars: 'community ',
          newChars: ''
        }]
      ],
      result: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><p>Atom comes pre-installed with four UI and eight syntax in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom or create your own.</p></div></div>'
    },
    replace_no_conflict: {
      changes: [
        [{
          start: 48,
          orgChars: 'left',
          newChars: 'right'
        }],
        [{
          start: 145,
          orgChars: 'right',
          newChars: 'left'
        }],
        [{
          start: 152,
          orgChars: '<h3>Themes</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">themes</a> in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p>',
          newChars: '<h3>Open source</h3><p>Atom is open source. Be part of the Atom community or help improve your favorite text editor.</p>'
        }]
      ],
      result: '<div class="feature columns"><div class="column right markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column left"><h3>Open source</h3><p>Atom is open source. Be part of the Atom community or help improve your favorite text editor.</p></div></div>'
    }
  }
}