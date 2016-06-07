// Sass
import '../../css/spectrum.scss';
import '../../css/styles.scss';

// dependencies
import 'jquery-bez';
import toMarkdown from 'to-markdown';

// for sassjs preload
import '../sassjs/bourbon.js';
import '../sassjs/flattish.js';
import '../spectrum/spectrum.js';

// color pickers
import { colorList, colors } from './colors/_colorlist.js';
import './colors/_colorpickers.js';

// addons
import './addons/_addon-labeler.js';
import './addons/_large-header.js';
import {
  sidebarImg,
  sidebarImageLivePreview,
} from './addons/_sidebar-image.js';
import { rotatingHeaders, clickToRemove } from './addons/_dropzones.js';
import { stickies, topicSettings } from './addons/_pinned-topics.js';

let defaultImages = {};

$(document).ready(() => {
  /**
   * read default images as binary files
   * and create 8-bit unsigned integer arrays from the raw bytes
   */
  var xhrList = [];
  var urlList = [
    'img/sidebar.png',
    'img/sprites/dropdown.png',
    'img/sprites/dropdown-night.png',
    'img/sprites/hide.png',
    'img/sprites/save.png',
    'img/sprites/spritesheet.png',
    'img/sprites/stickies.png',
  ];

  /**
   * loop XHRs (shoutouts to https://stackoverflow.com/q/13445809/)
   *
   * introduce an IIFE for each loop iteration:
   *
   * code inside the function has its own `i`,
   * meaning that when the `onload` function is called,
   * it will access the parameter `i` of the anonymous function
   * and not the `i` of the outer scope
   * (even though that function has completed)
   * so the correct xhrList element will be processed each time
   */
  for (var i = 0; i < urlList.length; i++) {
    (function(i) {
      'use strict';

      xhrList[i] = new XMLHttpRequest();
      xhrList[i].open('GET', urlList[i], true);

      // specifies the response type
      xhrList[i].responseType = 'arraybuffer';

      xhrList[i].onload = (oEvent) => {
        // create an 8-bit unsigned integer array from the raw bytes
        let arr = new Uint8Array(xhrList[i].response);

        /**
         * Convert the int array to a binary string
         * We have to use apply() as we are converting an *array*
         * and String.fromCharCode() takes one or more single values, not
         * an array.
         *
         * shoutouts to MDN and https://stackoverflow.com/q/20035615
         */
        let raw = String.fromCharCode.apply(null, arr);

        /**
         * btoa() function creates a base-64 encoded ASCII string
         * from a "string" of binary data
         */
        let b64 = btoa(raw);

        // add content before base64 data (scheme, datatype, etc)
        let dataURL = `data:image/png;base64,${b64}`;

        // if sidebar, edit sidebar object properties
        if ((/sidebar/).test(urlList[i])) {
          sidebarImg.URL = dataURL;
          sidebarImg.URLreset = dataURL;
        } else if ((/stickies/).test(urlList[i])) {
          // otherwise, edit stickies object properties
          stickies.URL = dataURL;
        } else {
          defaultImages[urlList[i].slice(12, -4)] = dataURL;
        }
      };

      xhrList[i].send();
    }(i));
  }

  $.ajax({
    url: 'style/flattish.min.css',
  }).done((data) => {
    $('#target').html(data);
  }).done(() => {
    // affix iframe after scrolling past header
    $('#iframe-container').affix({
      offset: {
        top: $('.header').outerHeight(true),
        bottom: () => {
          return (
            $('#results').outerHeight(true) +
            $('#addons').outerHeight(true)
          );
        },
      }
    });
  });

  /**
   * copy to clipboard buttons
   */

  let clipboards = ['target', 'sidebarmd'];
  clipboards.forEach((element, index, array) => {
    // initialize tooltips
    $(`#${element}-clipboard`).tooltip({
      container: 'body',
    });

    $(`#${element}-clipboard`).click(() => {
      /**
       * create a Range interface
       * set the Range to contain the chosen Node and its elements
       * make sure nothing is preselected
       * add Range to Selection
       */
      if (document.selection) {
        // for IE
        let range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(`${element}`));
        range.select();
      } else if (window.getSelection) {
        let range = document.createRange();
        range.selectNode(document.getElementById(`${element}`));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }

      // copy highlighted text
      try {
        let success = document.execCommand('copy');
        if (success) {
          // change tooltip text
          $(`#${element}-clipboard`).trigger('copied', ['Copied!']);

          // un-highlight text
          window.getSelection().removeAllRanges();
        } else {
          $(`#${element}-clipboard`).trigger('copied', ['Copy with Ctrl-c']);
        }
      } catch (err) {
        $(`#${element}-clipboard`).trigger('copied', ['Copy with Ctrl-c']);
      }
    });

    /**
     * update tooltip title
     *
     * edit title based on try...catch statement, then reset title to default
     *
     * fixTitle method found in Bootstrap source code
     *   - fetches and replaces `data-original-title` attribute
     */
    $(`#${element}-clipboard`).bind('copied', (event, message) => {
      $(event.currentTarget).attr('title', message)
        .tooltip('fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('fixTitle');
    });
  });
});

var sass = new Sass();

sass.options({ style: Sass.style.compressed }, result => (
  console.log('set options')
));

// download the files immediately
for (var key in Sass.maps) {
  if (Sass.maps.hasOwnProperty(key)) {
    sass.preloadFiles(Sass.maps[key].base, Sass.maps[key].directory, Sass.maps[key].files, () => {
      console.log('files loaded');
    });
  }
}

// TODO: nest compile functions

/**
 * replace _vars.scss values with values from varEditor()
 *
 * function replacer(inputString, varEditor, replacementValue, callback) {
 *   let varNames = [];
 *   let testPatterns = [];
 *   inputString = inputString.replace(regexPatternCreator(varEditor, varNames, testPatterns), (...args) => {
 *     return callback(varNames, replacementValue, ...args);
 *   });
 *   return inputString;
 * }
 */
function replacer(inputString, varType, replacementValue, variable = null) {
  // edit _vars.scss
  function varEditor(input, varNameArray, regexArray) {
    /**
    * search for capital letters and convert to hyphen + lowercase letter
    * e.g. darkPrimary => dark-primary
    */
    if (input.match(/[A-Z]/g) !== null) {
      let capitalLetters = input.match(/[A-Z]/g);

      // check if variable name contains more than 1 capital letter
      if (capitalLetters.length > 1) {
        capitalLetters.forEach((element, index, array) => {
          input = input.replace(capitalLetters[index], `-${capitalLetters[index].toLowerCase()}`);
        });
      } else {
        [capitalLetters] = input.match(/[A-Z]/g);
        input = input.replace(capitalLetters, `-${capitalLetters.toLowerCase()}`);
      }
      regexArray.push(`(\\$${input}: .*?;)`)
      varNameArray.push(input);
    } else {
      regexArray.push(`(\\$${input}: .*?;)`)
      varNameArray.push(input);
    }
  }

  // create regexp patterns
  function regexPatternCreator(callback, varNameArray, regexArray) {
    callback(varNameArray, regexArray);
    return new RegExp(regexArray.join('|'), 'g');
  }

  // callback for booleans
  function booleanCallback(varNames, replacementValue, ...args) {
    if (args[1]) {
      return `$${varNames[0]}: ${replacementValue};`;
    }
  }

  let varNames = [];
  let testPatterns = [];

  // replace color variables
  if (varType === 'color') {
    inputString = inputString.replace(regexPatternCreator((varNames, testPatterns) => {
      for (var key in colors) {
        if (colors.hasOwnProperty(key)) {
          varEditor(key, varNames, testPatterns);
        }
      }
    }, varNames, testPatterns), (...args) => {
      for (var i = 0; i < replacementValue.length; i++) {
        if (args[i + 1]) {
          /**
           * since the default color values are objects
           * we need to evaluate differently if unchanged by user
           */
          if (typeof colors[replacementValue[i]] === 'object') {
            let color = colors[replacementValue[i]];
            return `$${varNames[i]}: ${colorList[color.color][color.colorCode]};`;
          } else if (typeof colors[replacementValue[i]] === 'string') {
            return `$${varNames[i]}: ${colors[replacementValue[i]]};`;
          }
        }
      }
    });
    return inputString;
  }

  // replace boolean variables
  if (varType === 'bool') {
    inputString = inputString.replace(regexPatternCreator((varNames, testPatterns) => {
      varEditor(variable, varNames, testPatterns);
    }, varNames, testPatterns), (...args) => {
      return booleanCallback(varNames, replacementValue, ...args);
    });
    return inputString;
  }
}

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
  console.log('All File APIS supported');
} else {
  alert('The File APIs are not fully supported in this browser.');
}

// compile
$('#compile').click(() => {
  // disable inputs while compiling
  $('input, label.btn, button, .dropbox-container').addClass('disabled');
  $('label.btn, button').css('pointer-events', 'none');
  $('input, .dropbox').prop('disabled', true);
  clickToRemove('unbind');

  // hide 'save images' button and remove attached event handlers
  let bezierEasing = [0.4, 0, 0.2, 1];
  $('#save-images').prop('disabled', true)
    .fadeOut(200, $.bez(bezierEasing))
    .unbind();

  $('#sidebarmd-container').fadeOut(200, $.bez(bezierEasing));

  // disable drag and drop listeners while compiling
  if ($('.dropbox-panel').find('.in').length > 0) {
    dragAndDrop('disable');
  }

  // get file content
  sass.readFile('flattish/utils/_vars.scss', (content) => {
    if (content !== undefined) {
      console.log('reading _vars.scss');

      /**
       * REPLACE SASS VARIABLES
       *
       * replacer(inputString, varType, replacementValue, variable = null)
       */
      // colors
      content = replacer(content, 'color', Object.keys(colors));

      // TODO: see if this can be DRY-ed
      // large header
      if ($('#large-header-checkbox:checkbox').prop('checked')) {
        content = replacer(content, 'bool', true, 'headerLarge');
      } else {
        content = replacer(content, 'bool', false, 'headerLarge');
      }

      // random, rotating header
      if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
        content = replacer(content, 'bool', true, 'randomHeader');
        content = replacer(content, 'bool', Object.keys(rotatingHeaders).length, 'numHeaderImages');
      } else {
        content = replacer(content, 'bool', false, 'randomHeader');
      }

      // sidebar image
      if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
        content = replacer(content, 'bool', true, 'sidebarImg');
        content = replacer(content, 'bool', `${sidebarImg.height}px`, 'sidebarImgHeight');
      } else {
        content = replacer(content, 'bool', false, 'sidebarImg');
      }

      // pinned topics
      if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
        content = replacer(content, 'bool', true, 'pinnedTopics');

        // create Sass map
        let map = '';
        for (var key in topicSettings) {
          if (topicSettings.hasOwnProperty(key)) {
            if (typeof topicSettings[key] === 'object') {
              map += `
                ${key}: (
                  type: ${topicSettings[key].type},
                  image: ${topicSettings[key].image},
                ),
              `;
            }
          }
        }

        map = `(${map})`;

        // edit Sass map in source file
        content = replacer(content, 'bool', map, 'pinnedMap');
      } else {
        content = replacer(content, 'bool', false, 'pinnedTopics');
      }

      // register file to be available for @import
      sass.writeFile('flattish/utils/_vars.scss', content, (success) => {
        if (success) {
          console.log('_vars.scss successfully written');
        } else {
          console.log('writeFile failed');
        }

        // compile main Sass file
        sass.compileFile('flattish/flattish.scss', (result) => {
          // enable inputs after compilation
          $('input, label.btn, button, .dropbox-container')
            .removeClass('disabled');
          $('label.btn, button').css('pointer-events', 'auto');
          $('input, .dropbox').prop('disabled', false);

          console.log(result);

          // insert stylesheet CSS into <pre>
          $('#target').html(result.text.trim());
          // $('#clipboard-input').val(result.text.trim());

          if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
            let sidebarMarkup = `<blockquote>${$('iframe').contents()
              .find('blockquote.pinned-topics').html().trim()}</blockquote>`;

            /**
             * insert sidebar markdown into <pre>
             * edit to fit reddit markdown parser
             */
            $('#sidebarmd').html(toMarkdown(sidebarMarkup)
              .replace(/> \n/g, '\n># \n'));

            // show markdown container
            $('#sidebarmd-container')
              .fadeIn(200, $.bez(bezierEasing));
          }

          let finalPreview = result.text.trim();

          // replace variable names in live preview CSS
          // TODO: replace rotating headers
          finalPreview = finalPreview
            .replace(/%%dropdown%%/g, '"https://b.thumbs.redditmedia.com/n8Tjs0Bql4bCTP1yXHT6uyQ2FiNxqvyiqX0dmgEvGtU.png"')
            .replace(/%%dropdown-night%%/g, '"https://a.thumbs.redditmedia.com/2OhDOWNjWv07gPH_SInBCkIGV-Vvh79bOivLCefF-Y0.png"')
            .replace(/%%header%%/g, '"https://b.thumbs.redditmedia.com/fRsvIUIv8r1kjAnVvvPnYkxDLjzLMaNx3qDq8lVW-_c.png"')
            .replace(/%%spritesheet%%/g, '"https://b.thumbs.redditmedia.com/WwVfPsjJK8fP59rNqswJrUJTWvS9kCK83eSjybERWMw.png"')
            .replace(/%%save%%/g, '"https://b.thumbs.redditmedia.com/BSYuVoMV0MOiH4OA6vtW8VqLePOAqwnC69QrPmjRHgk.png"')
            .replace(/%%hide%%/g, '"https://b.thumbs.redditmedia.com/KIFC2QeI3sY7e9pL4_MqCgo5n9x5QwVmgcovfNm8RJc.png"')
            .replace(/%%sidebar%%/g, sidebarImg.URL)
            .replace(/%%stickies%%/g, stickies.URL);

          // zip images if rotating header or sidebar image addon is enabled
          (function () {
            const zip = new JSZip();

            // default required images
            for (var key in defaultImages) {
              if (defaultImages.hasOwnProperty(key)) {
                zip.file(`images/${[key]}.png`,
                  defaultImages[key]
                    .substr(defaultImages[key].indexOf(',') + 1),
                  { base64: true, }
                );
              }
            }

            // rotating headers
            if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
              for (var key in rotatingHeaders) {
                if (rotatingHeaders.hasOwnProperty(key)) {
                  zip.file(`images/${[key]}.png`,
                    // remove content before base64 data
                    rotatingHeaders[key].URL
                      .substr(rotatingHeaders[key].URL.indexOf(',') + 1),
                    { base64: true, }
                  );
                }
              }
            }

            // sidebar image
            if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
              zip.file('images/sidebar.png',
                // remove content before base64 data
                sidebarImg.URL.substr(sidebarImg.URL.indexOf(',') + 1),
                { base64: true, }
              );
            }

            // pinned topics
            if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
              zip.file('images/stickies.png',
                // remove content before base64 data
                stickies.URL.substr(sidebarImg.URL.indexOf(',') + 1),
                { base64: true, }
              );
            }

            // show 'save images button'
            $('#save-images').prop('disabled', false)
              .fadeIn(200, $.bez(bezierEasing));

            // Blob
            let blobLink = document.getElementById('save-images');
            if (JSZip.support.blob) {
              function downloadWithBlob() {
                zip.generateAsync({ type: 'blob' }).then((blob) => {
                  saveAs(blob, 'flattish_images.zip');
                }, (err) => {
                  blobLink.innerHTML += ` ${err}`;
                });

                return false;
              }

              // download blob zip on 'save images' button click
              $('#save-images').click(() => {
                downloadWithBlob();
              });
            }
          })();

          // re-enable drag and drop listeners if a dropbox panel is expanded
          if ($('.dropbox-panel').find('.in').length > 0) {
            dragAndDrop('enable');
          }

          // re-enable click to remove
          clickToRemove('bind');
        });
      });
    } else {
      console.log('readFile failed');
    }
  });
});