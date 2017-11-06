# diff_three_way

[![Travis](https://travis-ci.org/JasonZzy0528/diff_three_way.svg)](https://travis-ci.org/JasonZzy0528/diff_three_way)
[![npm package](https://img.shields.io/npm/v/diff_three_way.svg?style=flat-square)](https://www.npmjs.com/package/diff_three_way)

## Installation

```
npm install diff_three_way --save
```

## Usage
### ES6
```javascript
import Content from 'diff_three_way'
let content = new Content()
```
### ES5
```javascript
var Content = require('diff_three_way').default
var content = new Content()
```

## API
* `content.setContent(str)` - set 'content' of current content instance.
* `content.createPatch(array)` - create a patch based on the input array.
    Input object should look like:
    ```json
    [{
      "start": 257, // the index of first charater
      "orgChars": ">", // the origin characters
      "newChars": ">Wonderful "  // the updated characters
    }]
    ```
* `content.loadPatches(array)` - load patches(array of patch object) to current content instance.
* `content.getPatches()` - get patches(array of patch object) in current content instance.
* `content.applyPatch(object, boolean)` - apply patch object on content to update 'content' in current content instance, if there multiple patches loaded in current content instance, then those patches will be updated by three way merge, conflict ones will be ignored when `getPatches()` is called.
    Returns 'content' applied patch object when `boolean` is true('content' in current content instance will not be updated).
    No returns when `boolean` is false.