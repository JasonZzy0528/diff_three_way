export default {
  content: {
    normal: '<div class="feature columns"><div class="column left markdown-body"><div class="demo"><span class="screen"></span></div></div><div class="column right"><h3>Themes</h3><p>Atom comes pre-installed with four UI and eight syntax <a href="https://atom.io/themes">themes</a> in both dark and light colors. If you can\'t find what you\'re looking for, you can also install themes created by the Atom community or create your own.</p></div></div>',
    pressure: '<div class="markdown-body document-content"><h3><a id="why-atom" class="anchor" href="#why-atom" aria-hidden="true"><span class="octicon octicon-link"></span></a>Why Atom?</h3><p>There are a lot of text editors out there; why should you spend your time learning about and using Atom?</p><p>Editors like Sublime and TextMate offer convenience but only limited extensibility. On the other end of the spectrum, Emacs and Vim offer extreme flexibility, but they aren\'t very approachable and can only be customized with special-purpose scripting languages.</p><p>We think we can do better. Our goal is a zero-compromise combination of hackability and usability: an editor that will be welcoming to an elementary school student on their first day learning to code, but also a tool they won\'t outgrow as they develop into seasoned hackers.</p><p>As we\'ve used Atom to build Atom, what began as an experiment has gradually matured into a tool we can\'t live without. On the surface, Atom is the modern desktop text editor you\'ve come to expect. Pop the hood, however, and you\'ll discover a system begging to be hacked on.</p><h4><a id="the-nucleus-of-atom" class="anchor" href="#the-nucleus-of-atom" aria-hidden="true"><span class="octicon octicon-link"></span></a>The Nucleus of Atom</h4><p>The web is not without its faults, but two decades of development has forged it into an incredibly malleable and powerful platform. So when we set out to write a text editor that we ourselves would want to extend, web technology was the obvious choice. But first, we had to free it from its chains.</p><h5><a id="the-native-web" class="anchor" href="#the-native-web" aria-hidden="true"><span class="octicon octicon-link"></span></a>The Native Web</h5><p>Web browsers are great for browsing web pages, but writing code is a specialized activity that warrants dedicated tools. More importantly, the browser severely restricts access to the local system for security reasons, and for us, a text editor that couldn\'t write files or run local subprocesses was a non-starter.</p><p>For this reason, we didn\'t build Atom as a traditional web application. Instead, Atom is a specialized variant of Chromium designed to be a text editor rather than a web browser. Every Atom window is essentially a locally-rendered web page.</p><p>All the APIs available to a typical Node.js application are also available to the code running in each window\'s JavaScript context. This hybrid provides a really unique client-side development experience.</p><p>Since everything is local, you don\'t have to worry about asset pipelines, script concatenation, and asynchronous module definitions. If you want to load some code, just require it at the top of your file. Node\'s module system makes it easy to break the system down into lots of small, focused packages.</p><h5><a id="javascript-meet-c" class="anchor" href="#javascript-meet-c" aria-hidden="true"><span class="octicon octicon-link"></span></a>JavaScript, Meet C++</h5><p>Interacting with native code is also really simple. For example, we wrote a wrapper around the Oniguruma regular expression engine for our TextMate grammar support. In a browser, that would have required adventures with NaCl or Esprima. Node integration made it easy.</p><p>In addition to the Node APIs, we also expose APIs for native dialogs, adding application and context menu items, manipulating the window dimensions, etc.</p><h5><a id="web-tech-the-fun-parts" class="anchor" href="#web-tech-the-fun-parts" aria-hidden="true"><span class="octicon octicon-link"></span></a>Web Tech: The Fun Parts</h5><p>Another great thing about writing code for Atom is the guarantee that it\'s running on the newest version of Chromium. That means we can ignore issues like browser compatibility and polyfills. We can use all the web\'s shiny features of tomorrow, today.</p><p>For example, the layout of our workspace and panes is based on flexbox. It\'s an emerging standard and has gone through a lot of change since we started using it, but none of that mattered as long as it worked.</p><p>With the entire industry pushing web technology forward, we\'re confident that we\'re building Atom on fertile ground. Native UI technologies come and go, but the web is a standard that becomes more capable and ubiquitous with every passing year. We\'re excited to dig deeper into its toolbox.</p><h4><a id="an-open-source-text-editor" class="anchor" href="#an-open-source-text-editor" aria-hidden="true"><span class="octicon octicon-link"></span></a>An Open Source Text Editor</h4><p>We see Atom as a perfect complement to GitHub\'s primary mission of building better software by working together. Atom is a long-term investment, and GitHub will continue to support its development with a dedicated team going forward. But we also know that we can\'t achieve our vision for Atom alone. As Emacs and Vim have demonstrated over the past three decades, if you want to build a thriving, long-lasting community around a text editor, it has to be open source.</p><p>The entire Atom editor is free and open source and is available under the <a href="https://github.com/atom">https://github.com/atom</a> organization.</p></div>'
  },
  tests: {
    insert_only_no_conflict: {
      normal: {
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
      pressure: {
        changes: [
          [{
            start: 43,
            orgChars: '>',
            newChars: '><p>This is the Atom welcome screen and gives you a pretty good starting point for how to get started with the editor.</p>'
          }],
          [{
            start: 1115,
            orgChars: '>',
            newChars: '><p>You can find definitions for all of the various terms that we use throughout the manual in our <a href="/resources/sections/glossary/">Glossary</a>.</p>'
          }],
          [{
            start: 447,
            orgChars: ',',
            newChars: ',<img src="../../images/platform-selector.png" alt="Platform Selector" title="Platform Selector">'
          }],
          [{
            start: 4065,
            orgChars: '>',
            newChars: '><p>Parses a block of text (which was presumably created by the patch_toText function) and returns an array of patch objects.</p>'
          }],
          [{
            start: 4662,
            orgChars: '.',
            newChars: '. Reduces an array of patch objects to a block of text which looks extremely similar to the standard GNU diff/patch format. This text may be stored or transmitted.'
          }]
        ],
        result: '<div class="markdown-body document-content"><p>This is the Atom welcome screen and gives you a pretty good starting point for how to get started with the editor.</p><h3><a id="why-atom" class="anchor" href="#why-atom" aria-hidden="true"><span class="octicon octicon-link"></span></a>Why Atom?</h3><p>There are a lot of text editors out there; why should you spend your time learning about and using Atom?</p><p>Editors like Sublime and TextMate offer convenience but only limited extensibility. On the other end of the spectrum, Emacs and Vim offer extreme flexibility,<img src="../../images/platform-selector.png" alt="Platform Selector" title="Platform Selector"> but they aren\'t very approachable and can only be customized with special-purpose scripting languages.</p><p>We think we can do better. Our goal is a zero-compromise combination of hackability and usability: an editor that will be welcoming to an elementary school student on their first day learning to code, but also a tool they won\'t outgrow as they develop into seasoned hackers.</p><p>As we\'ve used Atom to build Atom, what began as an experiment has gradually matured into a tool we can\'t live without. On the surface, Atom is the modern desktop text editor you\'ve come to expect. Pop the hood, however, and you\'ll discover a system begging to be hacked on.</p><p>You can find definitions for all of the various terms that we use throughout the manual in our <a href="/resources/sections/glossary/">Glossary</a>.</p><h4><a id="the-nucleus-of-atom" class="anchor" href="#the-nucleus-of-atom" aria-hidden="true"><span class="octicon octicon-link"></span></a>The Nucleus of Atom</h4><p>The web is not without its faults, but two decades of development has forged it into an incredibly malleable and powerful platform. So when we set out to write a text editor that we ourselves would want to extend, web technology was the obvious choice. But first, we had to free it from its chains.</p><h5><a id="the-native-web" class="anchor" href="#the-native-web" aria-hidden="true"><span class="octicon octicon-link"></span></a>The Native Web</h5><p>Web browsers are great for browsing web pages, but writing code is a specialized activity that warrants dedicated tools. More importantly, the browser severely restricts access to the local system for security reasons, and for us, a text editor that couldn\'t write files or run local subprocesses was a non-starter.</p><p>For this reason, we didn\'t build Atom as a traditional web application. Instead, Atom is a specialized variant of Chromium designed to be a text editor rather than a web browser. Every Atom window is essentially a locally-rendered web page.</p><p>All the APIs available to a typical Node.js application are also available to the code running in each window\'s JavaScript context. This hybrid provides a really unique client-side development experience.</p><p>Since everything is local, you don\'t have to worry about asset pipelines, script concatenation, and asynchronous module definitions. If you want to load some code, just require it at the top of your file. Node\'s module system makes it easy to break the system down into lots of small, focused packages.</p><h5><a id="javascript-meet-c" class="anchor" href="#javascript-meet-c" aria-hidden="true"><span class="octicon octicon-link"></span></a>JavaScript, Meet C++</h5><p>Interacting with native code is also really simple. For example, we wrote a wrapper around the Oniguruma regular expression engine for our TextMate grammar support. In a browser, that would have required adventures with NaCl or Esprima. Node integration made it easy.</p><p>In addition to the Node APIs, we also expose APIs for native dialogs, adding application and context menu items, manipulating the window dimensions, etc.</p><h5><a id="web-tech-the-fun-parts" class="anchor" href="#web-tech-the-fun-parts" aria-hidden="true"><span class="octicon octicon-link"></span></a>Web Tech: The Fun Parts</h5><p>Another great thing about writing code for Atom is the guarantee that it\'s running on the newest version of Chromium. That means we can ignore issues like browser compatibility and polyfills. We can use all the web\'s shiny features of tomorrow, today.</p><p>For example, the layout of our workspace and panes is based on flexbox. It\'s an emerging standard and has gone through a lot of change since we started using it, but none of that mattered as long as it worked.</p><p>Parses a block of text (which was presumably created by the patch_toText function) and returns an array of patch objects.</p><p>With the entire industry pushing web technology forward, we\'re confident that we\'re building Atom on fertile ground. Native UI technologies come and go, but the web is a standard that becomes more capable and ubiquitous with every passing year. We\'re excited to dig deeper into its toolbox.</p><h4><a id="an-open-source-text-editor" class="anchor" href="#an-open-source-text-editor" aria-hidden="true"><span class="octicon octicon-link"></span></a>An Open Source Text Editor</h4><p>We see Atom as a perfect complement to GitHub\'s primary mission of building better software by working together. Reduces an array of patch objects to a block of text which looks extremely similar to the standard GNU diff/patch format. This text may be stored or transmitted. Atom is a long-term investment, and GitHub will continue to support its development with a dedicated team going forward. But we also know that we can\'t achieve our vision for Atom alone. As Emacs and Vim have demonstrated over the past three decades, if you want to build a thriving, long-lasting community around a text editor, it has to be open source.</p><p>The entire Atom editor is free and open source and is available under the <a href="https://github.com/atom">https://github.com/atom</a> organization.</p></div>'
      }
    },
    delete_no_conflict: {
      normal: {
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
      pressure: {
        changes: [
          [{
            start: 287,
            orgChars: '<p>Editors like Sublime and TextMate offer convenience but only limited extensibility. On the other end of the spectrum, Emacs and Vim offer extreme flexibility, but they aren\'t very approachable and can only be customized with special-purpose scripting languages.</p>',
            newChars: ''
          }],
          [{
            start: 2418,
            orgChars: 'JavaScript ',
            newChars: ''
          }],
          [{
            start: 1537,
            orgChars: 'But first, ',
            newChars: ''
          }],
          [
            {
              start: 4187,
              orgChars: 'Native UI technologies come and go, but the web is a standard that becomes more capable and ubiquitous with every passing year. We\'re excited to dig deeper into its toolbox.',
              newChars: ''
            },
            // {
            //   start: 4863,
            //   orgChars: '<h4><a id="an-open-source-text-editor" class="anchor" href="#an-open-source-text-editor" aria-hidden="true"><span class="octicon octicon-link"></span></a>An Open Source Text Editor</h4>',
            //   newChars: ''
            // }
          ]
        ],
        result: '<div class="markdown-body document-content"><h3><a id="why-atom" class="anchor" href="#why-atom" aria-hidden="true"><span class="octicon octicon-link"></span></a>Why Atom?</h3><p>There are a lot of text editors out there; why should you spend your time learning about and using Atom?</p><p>We think we can do better. Our goal is a zero-compromise combination of hackability and usability: an editor that will be welcoming to an elementary school student on their first day learning to code, but also a tool they won\'t outgrow as they develop into seasoned hackers.</p><p>As we\'ve used Atom to build Atom, what began as an experiment has gradually matured into a tool we can\'t live without. On the surface, Atom is the modern desktop text editor you\'ve come to expect. Pop the hood, however, and you\'ll discover a system begging to be hacked on.</p><h4><a id="the-nucleus-of-atom" class="anchor" href="#the-nucleus-of-atom" aria-hidden="true"><span class="octicon octicon-link"></span></a>The Nucleus of Atom</h4><p>The web is not without its faults, but two decades of development has forged it into an incredibly malleable and powerful platform. So when we set out to write a text editor that we ourselves would want to extend, web technology was the obvious choice. we had to free it from its chains.</p><h5><a id="the-native-web" class="anchor" href="#the-native-web" aria-hidden="true"><span class="octicon octicon-link"></span></a>The Native Web</h5><p>Web browsers are great for browsing web pages, but writing code is a specialized activity that warrants dedicated tools. More importantly, the browser severely restricts access to the local system for security reasons, and for us, a text editor that couldn\'t write files or run local subprocesses was a non-starter.</p><p>For this reason, we didn\'t build Atom as a traditional web application. Instead, Atom is a specialized variant of Chromium designed to be a text editor rather than a web browser. Every Atom window is essentially a locally-rendered web page.</p><p>All the APIs available to a typical Node.js application are also available to the code running in each window\'s context. This hybrid provides a really unique client-side development experience.</p><p>Since everything is local, you don\'t have to worry about asset pipelines, script concatenation, and asynchronous module definitions. If you want to load some code, just require it at the top of your file. Node\'s module system makes it easy to break the system down into lots of small, focused packages.</p><h5><a id="javascript-meet-c" class="anchor" href="#javascript-meet-c" aria-hidden="true"><span class="octicon octicon-link"></span></a>JavaScript, Meet C++</h5><p>Interacting with native code is also really simple. For example, we wrote a wrapper around the Oniguruma regular expression engine for our TextMate grammar support. In a browser, that would have required adventures with NaCl or Esprima. Node integration made it easy.</p><p>In addition to the Node APIs, we also expose APIs for native dialogs, adding application and context menu items, manipulating the window dimensions, etc.</p><h5><a id="web-tech-the-fun-parts" class="anchor" href="#web-tech-the-fun-parts" aria-hidden="true"><span class="octicon octicon-link"></span></a>Web Tech: The Fun Parts</h5><p>Another great thing about writing code for Atom is the guarantee that it\'s running on the newest version of Chromium. That means we can ignore issues like browser compatibility and polyfills. We can use all the web\'s shiny features of tomorrow, today.</p><p>For example, the layout of our workspace and panes is based on flexbox. It\'s an emerging standard and has gone through a lot of change since we started using it, but none of that mattered as long as it worked.</p><p>With the entire industry pushing web technology forward, we\'re confident that we\'re building Atom on fertile ground. </p><h4><a id="an-open-source-text-editor" class="anchor" href="#an-open-source-text-editor" aria-hidden="true"><span class="octicon octicon-link"></span></a>An Open Source Text Editor</h4><p>We see Atom as a perfect complement to GitHub\'s primary mission of building better software by working together. Atom is a long-term investment, and GitHub will continue to support its development with a dedicated team going forward. But we also know that we can\'t achieve our vision for Atom alone. As Emacs and Vim have demonstrated over the past three decades, if you want to build a thriving, long-lasting community around a text editor, it has to be open source.</p><p>The entire Atom editor is free and open source and is available under the <a href="https://github.com/atom">https://github.com/atom</a> organization.</p></div>'
      }
    },
    replace_no_conflict: {
      normal: {
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
    },
    mixed_no_confict: {
      normal: {
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
      },
    }
  }
}