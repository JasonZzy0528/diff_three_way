/* See LICENSE file for terms of use */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _concat = require('lodash/concat');

var _concat2 = _interopRequireDefault(_concat);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _indexOf = require('lodash/indexOf');

var _indexOf2 = _interopRequireDefault(_indexOf);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _max = require('lodash/max');

var _max2 = _interopRequireDefault(_max);

var _min = require('lodash/min');

var _min2 = _interopRequireDefault(_min);

var _diffMatchPatch = require('diff-match-patch');

var _diffMatchPatch2 = _interopRequireDefault(_diffMatchPatch);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_util2.default.enableArrayEquals();

var Content = function () {
  function Content(content) {
    _classCallCheck(this, Content);

    this.diffMatchPatch = new _diffMatchPatch2.default();
    this.content = content;
    this.newContent = undefined;
    this.patches = [];
    this.loadPatches = this.loadPatches.bind(this);
    this.applyPatch = this.applyPatch.bind(this);
    this.setContent = this.setContent.bind(this);
    this.getContent = this.getContent.bind(this);
    this.threeWayMerge = this.threeWayMerge.bind(this);
    this.updatePatches = this.updatePatches.bind(this);
  }

  _createClass(Content, [{
    key: 'loadPatches',
    value: function loadPatches(patches) {
      this.patches = (0, _map2.default)(patches, function (patch) {
        return [patch, true]; //[patch, updated]
      });
    }
  }, {
    key: 'addPatch',
    value: function addPatch(patch) {
      this.patches.push([patch, true]);
    }
  }, {
    key: 'applyPatch',
    value: function applyPatch(patch, isReturnContent) {
      var content = this.content;
      (0, _forEach2.default)(patch, function (ptc) {
        var diffs = ptc.diffs,
            start1 = ptc.start1,
            length1 = ptc.length1;

        var replacement = '';
        (0, _forEach2.default)(diffs, function (diff) {
          if (diff[0] !== -1) {
            replacement += diff[1];
          }
        });
        content = content.substring(0, start1) + replacement + content.substring(start1 + length1, content.length);
      });
      if (isReturnContent) {
        return content;
      } else {
        this.newContent = content;
        this.updatePatches(patch);
      }
    }
  }, {
    key: 'updatePatches',
    value: function updatePatches(patch) {
      var _this = this;

      var patches = this.patches;
      if (patches.length === 0) {
        return;
      }
      var content = this.content,
          newContent = this.newContent;

      patches = (0, _filter2.default)(patches, function (ptc) {
        return !(0, _isEqual2.default)(ptc[0], patch);
      });
      var updatedPatches = [];
      (0, _forEach2.default)(patches, function (ptc) {
        if (ptc[1] === false) {
          updatedPatches.push(ptc);
        } else {
          try {
            var mergedResult = _this.threeWayMerge(content, patch, ptc[0]);
            var mergedContent = mergedResult[0];
            var updatedPatch = _this.diffMatchPatch.patch_make(newContent, mergedContent);
            updatedPatches.push([updatedPatch, true]);
          } catch (error) {
            console.error(error);
            updatedPatches.push([ptc[0], false]);
          }
        }
      });
      this.patches = updatedPatches;
      this.setContent(newContent);
      this.newContent = undefined;
    }
  }, {
    key: 'threeWayMerge',
    value: function threeWayMerge(content, optB, optC) {
      var contentLength = content.length;
      var optBCharsRange = [];
      var optCCharsRange = [];
      var optBChanges = 0;
      var optCChanges = 0;
      (0, _forEach2.default)(optB, function (patch) {
        var start1 = patch.start1,
            length1 = patch.length1,
            length2 = patch.length2;

        optBCharsRange.push(start1 - optBChanges);
        optBCharsRange.push(start1 - optBChanges + length1);
        optBChanges += length2 - length1;
      });
      (0, _forEach2.default)(optC, function (patch) {
        var start1 = patch.start1,
            length1 = patch.length1,
            length2 = patch.length2;

        optCCharsRange.push(start1 - optCChanges);
        optCCharsRange.push(start1 - optCChanges + length1);
        optCChanges += length2 - length1;
      });
      var start = (0, _min2.default)([(0, _min2.default)(optBCharsRange), (0, _min2.default)(optCCharsRange)]);
      var end = (0, _max2.default)([(0, _max2.default)(optBCharsRange), (0, _max2.default)(optCCharsRange)]);
      if (end >= contentLength) throw new Error('incorrect patch');
      var editingContent = content.substring(start, end);
      var contentDiff = this.genDiffLoop(0, editingContent);
      var optBDiff = this.genOptDiff(optBCharsRange, optB, content, start, end);
      var optCDiff = this.genOptDiff(optCCharsRange, optC, content, start, end);
      var next = true;
      var i = 0;
      var newContent = [];
      var isPatchApplied = true;
      while (next) {
        var oneL = contentDiff[i];
        var twoL = optBDiff[i];
        var threeL = optCDiff[i];
        var from = void 0;
        if (oneL || twoL || threeL) {
          var l = void 0;
          if (oneL && twoL && threeL) {
            if (oneL.equals(twoL)) {
              l = threeL;
              from = 'three';
            } else if (oneL.equals(threeL)) {
              l = twoL;
              from = 'two';
            } else if (twoL.equals(threeL)) {
              l = twoL;
              from = 'both';
            }
          } else if (twoL && !threeL) {
            l = twoL;
            from = 'two';
          } else if (!twoL && threeL) {
            l = threeL;
            from = 'three';
          }

          if (l === undefined) {
            throw new Error('Conflict at position ', i);
          } else {
            var op = l[0];
            if (op == 1) {
              var index = i == 0 ? 0 : i - 1;
              if (from == 'two') {
                contentDiff.splice(index, 0, l);
                optCDiff.splice(index, 0, l);
              } else if (from == 'three') {
                contentDiff.splice(index, 0, l);
                optBDiff.splice(index, 0, l);
              } else {
                contentDiff.splice(index, 0, l);
              }
            } else if (op == -1) {
              if (from == 'two') {
                contentDiff.splice(i, 1, l);
                optCDiff.splice(i, 1, l);
              } else if (from == 'three') {
                contentDiff.splice(i, 1, l);
                optBDiff.splice(i, 1, l);
              } else {
                //  from == 'both'
                contentDiff.splice(i, 1, l);
              }
            }
            newContent.push(l);
          }
        }
        next = next != false && (contentDiff[i + 1] || optBDiff[i + 1] || optCDiff[i + 1]);
        i++;
      }

      var mergedPatch = this.diffMatchPatch.patch_make(newContent);
      var mergedEditingContent = this.diffMatchPatch.patch_apply(mergedPatch, editingContent);
      isPatchApplied = this.isPatchApplied(mergedEditingContent[1]);
      if (!isPatchApplied) throw new Error('Conflict happened');
      var mergedContent = content.substring(0, start) + mergedEditingContent[0] + content.substring(end, contentLength);
      return [mergedContent, isPatchApplied];
    }
  }, {
    key: 'isPatchApplied',
    value: function isPatchApplied(patchStatus) {
      return (0, _indexOf2.default)(patchStatus, false) === -1;
    }
  }, {
    key: 'updateContent',
    value: function updateContent(content) {
      this.content = content;
    }
  }, {
    key: 'getPatches',
    value: function getPatches() {
      var patches = this.patches;
      return (0, _map2.default)((0, _filter2.default)(patches, function (patch) {
        return patch[1];
      }), function (patch) {
        return patch[0];
      });
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      return this.content;
    }
  }, {
    key: 'setContent',
    value: function setContent(content) {
      var type = typeof content === 'undefined' ? 'undefined' : _typeof(content);
      if (type === 'string') {
        this.content = content;
        return;
      }
      throw new TypeError('String expected, but got ' + type);
    }
  }, {
    key: 'createPatch',
    value: function createPatch(changes) {
      var _this2 = this;

      var patches = [];
      (0, _forEach2.default)(changes, function (change) {
        var start = change.start,
            orgChars = change.orgChars,
            newChars = change.newChars;

        var types = [typeof start === 'undefined' ? 'undefined' : _typeof(start), typeof orgChars === 'undefined' ? 'undefined' : _typeof(orgChars), typeof newChars === 'undefined' ? 'undefined' : _typeof(newChars)];
        var errorMessage = void 0;
        if (types[0] !== 'number') {
          errorMessage = 'Number expected, but got ' + types[0];
        }
        if (types[1] !== 'string') {
          errorMessage = 'String expected, but got ' + types[1];
        }
        if (types[2] !== 'string') {
          errorMessage = 'String expected, but got ' + types[2];
        }
        if (errorMessage) {
          throw new TypeError(errorMessage);
        }
        var diffs = _this2.diffMatchPatch.diff_main(orgChars, newChars);
        var length1 = orgChars.length;
        var length2 = newChars.length;
        var patch = {
          diffs: diffs,
          start1: start,
          start2: start,
          length1: length1,
          length2: length2
        };
        patches.push(patch);
      });
      return patches;
    }
  }, {
    key: 'genOptDiff',
    value: function genOptDiff(range, patches, content, start, end) {
      var me = this;
      var optDiff = [];
      (0, _forEach2.default)(range, function (position, index) {
        if (index % 2 !== 0) {
          var patch = patches[Math.floor(index / 2)];
          (0, _forEach2.default)(patch.diffs, function (diff) {
            var action = diff[0];
            var actionContent = diff[1];
            var diffs = [];
            if (actionContent.length > 1) {
              diffs = me.genDiffLoop(action, actionContent);
            } else {
              diffs.push(diff);
            }
            optDiff = (0, _concat2.default)(optDiff, diffs);
          });
        } else {
          var begin = index === 0 ? start : range[index - 1];
          if (position > begin) {
            var equalContent = content.substring(begin, position);
            var equalDiff = me.genDiffLoop(0, equalContent);
            optDiff = (0, _concat2.default)(optDiff, equalDiff);
          }
        }
        if (index === range.length - 1 && position !== end) {
          var _equalContent = content.substring(position, end);
          var _equalDiff = me.genDiffLoop(0, _equalContent);
          optDiff = (0, _concat2.default)(optDiff, _equalDiff);
        }
      });
      return optDiff;
    }
  }, {
    key: 'genDiffLoop',
    value: function genDiffLoop(action, content) {
      var diffs = [];
      (0, _forEach2.default)(content, function (char) {
        diffs.push([action, char]);
      });
      return diffs;
    }
  }]);

  return Content;
}();

exports.default = Content;
