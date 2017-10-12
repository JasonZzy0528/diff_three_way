export default {
  insert_no_conflict_test: {
    content: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">themes</a> in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>',
    actions: [
      { applyPatch: this.changes[0] },
      { applyPatch: self.changes[0] },
      { applyPatch: self.changes[0] },
    ],
    changes: [
      {
        start: 257,
        orgChars: '',
        newChars: 'Wonderful '
      },
      {
        start: 298,
        orgChars: '',
        newChars: 'It\'s easy to customize and style Atom. You can tweak the look and feel of your UI with CSS/Less and add major features with HTML and JavaScript. Check out the video on. '
      },
      {
        start: 166,
        orgChars: '',
        newChars: '<h3>Under the hood</h3>'
      }
    ],
    result: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><h3>Under the hood</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">Wonderful themes</a> in both dark and light colors. It\'s easy to customize and style Atom. You can tweak the look and feel of your UI with CSS/Less and add major features with HTML and JavaScript. Check out the video on. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>'
  },
  delete_no_conflict_test: {
    content: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">themes</a> in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>',
  },
  replace_no_conflict_test: {

  },
  mixed_actions_no_conflict_test: {

  },
  insert_with_conflict_test: {
    content: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">themes</a> in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>',
    changes: [
      {
        start: 257,
        orgChars: '',
        newChars: 'Wonderful '
      },
      {
        start: 257,
        orgChars: '',
        newChars: 'Amazing'
      },
      {
        start: 166,
        orgChars: '',
        newChars: '<h3>Under the hood</h3>'
      }
    ]
  }

}