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
import initializeClipboards from './_clipboards.js';
import replacer from './_replacer.js';

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

  initializeClipboards();
});

var sass = new Sass();

sass.options({ style: Sass.style.compressed }, result => (
  console.log('set options')
));

// download the files immediately
for (var key in Sass.maps) {
  if (Sass.maps.hasOwnProperty(key)) {
    sass.preloadFiles(Sass.maps[key].base, Sass.maps[key].directory, Sass.maps[key].files, () => console.log('files loaded'));
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
              $('#save-images').click(() => downloadWithBlob());
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