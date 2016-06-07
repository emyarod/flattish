import '../../css/spectrum.scss';
import '../../css/styles.scss';

import 'jquery-bez';
import toMarkdown from 'to-markdown';

import '../sassjs/bourbon.js';
import '../sassjs/flattish.js';
import '../spectrum/spectrum.js';

import { colorList, colors } from './colors/colorlist.js';
import './colors/colorpickers.js';

// TODO: documentation

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

import './addons/addons.js';

// large header
$('#large-header-checkbox:checkbox').change(() => {
  if ($('#large-header-checkbox:checkbox').prop('checked')) {
    // if pinned topics
    if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header pinned-topics" type="text/css">
          .titlebox blockquote {
            top: 312px;
          }

          @media (min-width: 992px) {
            #header-bottom-left {
              left: 0;
            }
          }
        </style>
      `);
    } else {
      $('iframe').contents().find('head').append(`
        <style class="large-header" type="text/css">
          @media (min-width: 992px) {
            #header-bottom-left {
              left: 48px;
            }
          }
        </style>
      `);
    }

    // if rotating header
    if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header rotating-header" type="text/css">
          input[name=uh] ~ a::after {
            height: 420px;
          }
        </style>
      `);
    }

    // if sidebar image
    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header sidebar-image" type="text/css">
          .side {
            top: ${297 + sidebarImg.height + 16}px;
          }
        </style>
      `);
    } else {
      $('iframe').contents().find('head').append(`
        <style class="large-header" type="text/css">
          .side {
            top: 297px;
          }
        </style>
      `);
    }

    $('iframe').contents().find('head').append(`
      <style class="large-header" type="text/css">
        div.content {
          top: 297px;
        }

        #header-bottom-left {
          top: 172px;
        }

        @media (min-width: 1200px) {
          #header-bottom-left {
            top: 245px;
          }
        }

        body::before {
          height: 420px;
        }
      </style>
    `);

  } else {
    // if pinned topics
    if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="pinned-topics" type="text/css">
          .titlebox blockquote {
            top: 239px;
          }
        </style>
      `);
    }

    // if sidebar image
    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="sidebar-image" type="text/css">
          .side {
            top: ${223 + sidebarImg.height + 16}px;
          }
        </style>
      `);
    }

    $('iframe').contents().find('head .large-header').detach();
  }
});

/**
 * enable/disable button
 * update tooltip title
 */
function compileButtonEnabler(state) {
  if (state === 'enable') {
    $('#compile').removeClass('disabled').prop('disabled', false);
    $('#compile-div').removeClass('disabled')
      .attr('title', '')
      .tooltip('destroy');
  } else if (state === 'disable') {
    $('#compile').addClass('disabled').prop('disabled', true);
    $('#compile-div').addClass('disabled')
      .attr('title', 'Please correct all errors!')
      .tooltip();
  }
}

// live preview
var sidebarImg = {
  height: 224,
  URL: '',
  reset: () => {
    sidebarImg.height = 224;
    sidebarImg.URL = sidebarImg.URLreset;
  }
}

function sidebarImageLivePreview(image) {
  if (image !== undefined) {
    if (image.search(/data:image\/png;base64,/) !== -1) {
      sidebarImg.URL = image;
    }
  }

  if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
    // if large header
    if ($('#large-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="sidebar-image large-header" type="text/css">
          .side {
            top: ${297 + sidebarImg.height + 16}px;
          }
        </style>
      `);
    } else {
      $('iframe').contents().find('head').append(
        `
        <style class="sidebar-image" type="text/css">
          .side {
            top: ${223 + sidebarImg.height + 16}px;
          }
        </style>
        `
      );
    }

    $('iframe').contents().find('head').append(`
      <style class="sidebar-image" type="text/css">
        .titlebox::before {
          position: absolute;
          top: ${-sidebarImg.height - 16}px;
          right: -330px;
          display: block;
          height: ${sidebarImg.height}px;
          width: 330px;
          content: '';
          border-radius: 2px;
          background: url(${sidebarImg.URL}) center;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                      0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        }

        @media (max-resolution: 1dppx) and (min-width: 992px) {
          .titlebox::before {
            right: 0;
          }
        }
      </style>
    `);
  } else {
    // if large header
    if ($('#large-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header" type="text/css">
          .side {
            top: 297px;
          }
        </style>
      `);
    }

    $('iframe').contents().find('head .sidebar-image').detach();
  }
}

// rotating headers
var rotatingHeaders = {};

// click to remove uploaded header images
function clickToRemove(status) {
  let [selector] = $('#rotating-header-dropbox');

  if (status === 'bind') {
    $('#rotating-header-dropbox ~ .uploaded .thumbnail').click((event) => {
      /**
       * removes header image when thumbnail is clicked
       *
       * EXAMPLE:
       * given the following object rotatingHeaders
       *
       * rotatingHeaders = {
       *   header1: { URL: 'a', },
       *   header2: { URL: 'b', },
       *   header3: { URL: 'c', },
       *   header4: { URL: 'd', },
       * }
       *
       * if 'header2' is to be removed,
       *
       * 1) 'header2' takes on the value of 'header3'
       * 2) 'header3' takes on the value of 'header4'
       * 3) 'header4' is removed from the object
       *
       * so ultimately we are left with
       *
       * rotatingHeaders = {
       *   header1: { URL: 'a', },
       *   header2: { URL: 'c', },
       *   header3: { URL: 'd', },
       * }
       */

      /**
       * `index` is the integer indicating the position of
       * the clicked element relative to its sibling elements
       * within the jQuery object.
       *
       * toBeDeleted always points at the the last key in
       * rotatingHeaders
       */
      // FIXME: remove console.logs
      let index = $('#rotating-header-dropbox-container .thumbnail')
        .index(event.currentTarget);
      let toBeDeleted = Object.keys(rotatingHeaders).length;

      // reassign keys and values
      for (var i = index + 1; i < toBeDeleted; i++) {
        let newKey = `header${i}`;
        let oldKey = `header${i + 1}`;
        console.log(`${newKey} becomes ${oldKey}`);
        rotatingHeaders[newKey] = rotatingHeaders[oldKey];
      }

      // delete the removed key from rotatingHeaders
      console.log(`delete header${toBeDeleted}`);
      delete rotatingHeaders[`header${toBeDeleted}`];

      // remove thumbnail markup
      $(event.currentTarget).parent().fadeOut().remove();

      console.log(rotatingHeaders);

      // return error if fewer than 2 headers have been uploaded
      if (Object.keys(rotatingHeaders).length < 2) {
        validationError(selector, 'amount');
      }
    });
  } else if (status === 'unbind') {
    // remove all handlers attached
    $('#rotating-header-dropbox ~ .uploaded .thumbnail').unbind();
  }
}

// dropzone

// TODO: check fallback
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
  console.log('All File APIS supported');
} else {
  alert('The File APIs are not fully supported in this browser.');
}

// load file as image to get image dimensions
function checkDimensions(file, callback) {
  let image = new Image();
  image.onload = (file) => {
    if (callback) {
      callback(image);
    }
  }

  image.src = file.target.result;
}

// read input and output base64
function readImg(file, location, returnBase64) {
  let reader = new FileReader();
  reader.onload = (event) => {
    checkDimensions(event, (image) => {
      if (location === 'sidebar') {
        // resize image if not 330px wide
        if (image.width !== 330) {
          // create canvas element
          $('.header')
            .after('<canvas id="canvas" width="0" height="0"></canvas>');
          let [canvas] = $('#canvas');
          let context = canvas.getContext('2d');
          let scaleFactor = image.width / 330;

          // resize canvas to exactly fit resized image
          $('#canvas').prop({
            'width': '330',
            'height': `${Math.round(image.height / scaleFactor)}`,
          });

          // recalculate image height
          sidebarImg.height = Math.round(image.height / scaleFactor);

          // draw image on canvas to convert to base64
          context.drawImage(image, 0, 0, 330, image.height / scaleFactor);

          // return base64 for resized image
          returnBase64(canvas.toDataURL());

          // detach canvas element
          $('#canvas').detach();
        } else {
          // image height remains
          sidebarImg.height = image.height;

          // return base64 for resized image
          returnBase64(reader.result);
        }
      } else if (location === 'rotating-header') {
        returnBase64(reader.result);
      }
    });
  }

  reader.readAsDataURL(file);
}

function validationError(selector, criterion) {
  // determine selector for labels
  let labelSelector;
  if (dropzone.location === 'sidebar') {
    labelSelector = 'a[href="#sidebar-img-panel"]';
  } else if (dropzone.location === 'rotating-header') {
    labelSelector = 'a[href="#rotating-header-panel"]';
  }

  // determine error message based on validation tests
  let errorMessage;
  if (criterion === 'size') {
    errorMessage = 'Images must be under 500kb!';
  } else if (criterion === 'type') {
    errorMessage = 'Invalid file type!';
  } else if (criterion === 'amount') {
    errorMessage = 'Must upload at least 2 images!';
  }

  // remove warning labels
  $(labelSelector).find('.label-warning').detach();

  // disable compile button
  compileButtonEnabler('disable');

  // remove error text
  $(selector).siblings('.bg-danger').detach();

  // add warning label
  $(labelSelector)
    .prepend(`<span class="label label-warning">Error</span>`);

  // change dropbox border color
  $(selector).parent().css('border-color', '#f2dede');

  // throw error
  $(selector).siblings('.uploaded')
    .before(`<p class="bg-danger">${errorMessage}</p>`);
}

function previewImg(input, location, selector = undefined) {
  // image type regex
  let imageType = /^image\//;

  function validationSuccess(base64, filename, filesize) {
    // enable compile button
    compileButtonEnabler('enable');

    // remove warning label
    $(selector).parents('.panel-default').find('.label-warning')
      .detach();

    // reset dropbox border color
    $(selector).parent().css('border-color', '#d9edf7');

    // insert thumbnail
    $(selector).siblings('.uploaded')
      .append(`<div class="col-md-3"><div class="thumbnail"><img src="${base64}" style="max-height:50px" alt="Image preview..."></div></div>`);

    // show file details
    $(selector).siblings('.uploaded').find('.thumbnail').last()
      .append(`<p><strong>${filename}</strong> - ${filesize} bytes</p>`);
  }

  if (location === 'sidebar') {
    let { files: [file] } = input;
    if (selector === undefined) {
      // click and upload
      selector = input;
    } else {
      // drag and drop
      [selector] = $('#sidebar-img-dropbox');
    }

    // remove warning labels
    $('a[href="#sidebar-img-panel"] .label-warning').detach();

    // remove error text
    $(selector).siblings('.bg-danger').detach();

    // wipe thumbnail(s) and file details
    $(selector).siblings('.uploaded').empty();

    if (file) {
      let filename = file.name;
      let filesize = file.size;

      // file type validation
      if (imageType.test(file.type)) {
        // read contents of uploaded file(s)
        readImg(file, location, (base64) => {
          // validate file size
          if (file.size > 500000) {
            // wipe thumbnail(s) and file details
            $(selector).siblings('.uploaded').empty();

            // return error due to file size
            validationError(selector, 'size');
          } else {
            // live preview
            sidebarImageLivePreview(base64);

            validationSuccess(base64, filename, filesize);
          }
        });
      } else {
        // wipe thumbnail(s) and file details
        $(selector).siblings('.uploaded').empty();

        // return error due to file type
        validationError(selector, 'type');
      }
    }
  } else if (location == 'rotating-header') {
    let { files: fileObj } = input;
    if (selector === undefined) {
      // click and upload
      selector = input;
    } else {
      // drag and drop
      [selector] = $('#rotating-header-dropbox');
    }

    // remove warning labels
    $('a[href="#rotating-header-panel"] .label-warning').detach();

    // remove error text
    $(selector).siblings('.bg-danger').detach();

    // flag for exiting for...in loop
    let abort = false;

    // will track number of header images uploaded in current loop iteration
    let counter = 1;

    // will track number of total header images stored in rotatingHeaders
    let position;
    if (Object.keys(rotatingHeaders).length != 0) {
      position = Object.keys(rotatingHeaders).length + 1;
    } else {
      position = 1;
    }

    for (var key in fileObj) {
      if (abort) {
        // exit loop
        break;
      } else if (fileObj.hasOwnProperty(key)) {
        if (fileObj) {
          let filename = fileObj[key].name;
          let filesize = fileObj[key].size;

          // file type validation
          if (imageType.test(fileObj[key].type)) {
            // read contents of uploaded file(s)
            readImg(fileObj[key], location, (base64) => {
              // validate file size
              if (filesize > 500000) {
                // return error due to file size
                validationError(selector, 'size');

                // edit flag
                abort = true;
              } else {
                // edit rotatingHeaders object
                console.log(`position = ${position}`);
                rotatingHeaders[`header${position}`] = {
                  // FIXME: -- filename for debugging
                  name: filename,
                  URL: base64,
                };

                if (!abort) {
                  validationSuccess(base64, filename, filesize);
                }

                // error if fewer than 2 headers have been uploaded
                if (Object.keys(rotatingHeaders).length < 2) {
                  validationError(selector, 'amount');
                } else{
                  // remove warning labels
                  $('a[href="#rotating-header-panel"] .label-warning')
                    .detach();

                  // remove error text
                  $(selector).siblings('.bg-danger').detach();
                }

                if (counter !== fileObj.length) {
                  // increment counter and position
                  counter++;
                  position++;
                } else {
                  // remove all handlers attached
                  clickToRemove('unbind');

                  // click to remove
                  clickToRemove('bind');

                  console.log(rotatingHeaders);
                }
              }
            });
          } else {
            // wipe thumbnail(s) and file details
            $(selector).siblings('.uploaded').empty();

            // return error due to file type
            validationError(selector, 'type');

            // edit flag
            abort = true;
          }
        }
      }
    }
  }
}

function clickableDropbox(option, location, status) {
  let [fileSelect] = $(option).parents('.addons__checkbox-container')
    .find('.dropbox-container');
  let [fileElem] = $(option).parents('.addons__checkbox-container')
    .find('.dropbox');

  let [uploaded] = $(option).parents('.addons__checkbox-container')
    .find('.uploaded');

  // sanitize dropbox content
  $(uploaded).empty();

  // recolor dropbox border
  $(fileSelect).css('border-color', '#d9edf7');

  if (status === 'enable') {
    // dropbox drag and drop behavior
    fileSelect.onclick = (event) => {
      // sanitize input field value
      $(fileElem).val('');

      // activate manual file upload unless thumbnail is clicked
      if ($(event.target).is('.thumbnail')) {
        event.preventDefault();
        return;
      } else {
        fileElem.click();
      }
    };

    // dropbox click behavior
    $(fileElem).change((event) => {
      previewImg(event.currentTarget, location);
    });
  } else if (status === 'disable') {
    // remove dropbox change event handler
    $(fileElem).unbind();
  }
}

// full window drag and drop upload
var dropzone = {
  // flag for triggering dropbox hover css styles
  counter: 0,
  location: '',
  dragenter: (event) => {
    event.stopPropagation();
    event.preventDefault();

    // increment counter
    dropzone.counter++;
  },
  dragover: (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!$('body').hasClass('droppable')) {
      $('body').addClass('droppable');
    }
  },
  drop: (event) => {
    event.stopPropagation();
    event.preventDefault();
    let files = event.dataTransfer;

    // add dropbox styles to body
    if ($('body').hasClass('droppable')) {
      $('body').removeClass('droppable');
      dropzone.counter = 0;
    }

    previewImg(files, dropzone.location, event.currentTarget);
  },
  dragleave: (event) => {
    event.stopPropagation();
    event.preventDefault();

    // decrement counter
    dropzone.counter--;
    if (dropzone.counter === 0) {
      // remove dropbox styles from body
      if ($('body').hasClass('droppable')) {
        $('body').removeClass('droppable');
      }
    }
  },
}

// full window drag and drop event listener enabler/disabler
function dragAndDrop(status) {
  let [bopped] = $('body');

  // add or remove event listeners for drag and drop actions
  for (var key in dropzone) {
    if (dropzone.hasOwnProperty(key)) {
      if (typeof dropzone[key] === 'function') {
        if (status === 'enable') {
          // add listeners
          bopped.addEventListener(key, dropzone[key], false);
        } else if (status === 'disable') {
          // remove listeners
          bopped.removeEventListener(key, dropzone[key], false);
        }
      }
    }
  }
}


// TODO: DRY
$('a[href="#rotating-header-panel"]').on('hide.bs.tab', (e) => {
  // disable drag and drop listeners
  dragAndDrop('disable');
  console.log('rotating-header disable');
});

$('a[href="#rotating-header-panel"]').on('shown.bs.tab', (e) => {
  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
    // enable drag and drop listeners
    dragAndDrop('enable');
    console.log('rotating-header enable');
    // set dropzone location
    dropzone.location = 'rotating-header';
  }
});

// rotating header checkbox
$('#rotating-header-checkbox:checkbox').change((event) => {
  let bezierEasing = [0.4, 0, 0.2, 1];

  // set dropzone location
  dropzone.location = 'rotating-header';

  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
    // empty rotatingHeaders object
    rotatingHeaders = {};

    // create dropbox
    clickableDropbox(event.currentTarget, dropzone.location, 'enable');

    // enable drag and drop listeners
    dragAndDrop('enable');

    $('#rotating-header-dropbox-container')
      // show and enable dropbox container
      .fadeIn(200, $.bez(bezierEasing))
      .prop('disabled', false)
      .removeClass('disabled')

      // remove error message
      .find('.bg-danger').detach();


    /**
     * IIFE to instantly display error on rotating header addon enable
     * throwing error on addon enable forces user to take action
     */
    (function () {
      let labelSelector = 'a[href="#rotating-header-panel"]';
      let [selector] = $('#rotating-header-dropbox');

      // disable compile button
      compileButtonEnabler('disable');

      // add warning label
      $(labelSelector)
      .prepend(`<span class="label label-warning">Error</span>`);

      // change dropbox border color
      $(selector).parent().css('border-color', '#f2dede');

      // throw error
      $(selector).siblings('.uploaded')
      .before(`<p class="bg-danger">Must upload at least 2 images!</p>`);
    }());
  } else {
    // enable compile button
    compileButtonEnabler('enable');

    // remove warning labels
    $('#rotating-header-label').siblings('.label-warning').detach();

    // destroy dropbox
    clickableDropbox(event.currentTarget, dropzone.location, 'disable');

    // disable drag and drop listeners
    dragAndDrop('disable');

    // hide and disable dropbox container
    $('#rotating-header-dropbox-container')
      .fadeOut(200, $.bez(bezierEasing))
      .prop('disabled', true)
      .addClass('disabled');
  }
});

$('a[href="#sidebar-img-panel"]').on('hide.bs.tab', (e) => {
  // disable drag and drop listeners
  dragAndDrop('disable');
  console.log('sidebar disable');
});

$('a[href="#sidebar-img-panel"]').on('shown.bs.tab', (e) => {
  if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
    // enable drag and drop listeners
    dragAndDrop('enable');
    console.log('sidebar enable');
    // set dropzone location
    dropzone.location = 'sidebar';
  }
});

// sidebar image checkbox
$('#sidebar-img-checkbox:checkbox').change((event) => {
  let bezierEasing = [0.4, 0, 0.2, 1];

  // set dropzone location
  dropzone.location = 'sidebar';

  if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
    // reset sidebar image URL and dimensions
    sidebarImg.reset();

    // create dropbox
    clickableDropbox(event.currentTarget, dropzone.location, 'enable');

    // enable drag and drop listeners
    dragAndDrop('enable');

    $('#sidebar-img-dropbox-container')
      // show and enable dropbox container
      .fadeIn(200, $.bez(bezierEasing))
      .prop('disabled', false)
      .removeClass('disabled')

      // remove error message
      .find('.bg-danger').detach();
  } else {
    // enable compile button
    compileButtonEnabler('enable');

    // remove warning labels
    $('#sidebar-img-label').siblings('.label-warning').detach();

    // destroy dropbox
    clickableDropbox(event.currentTarget, dropzone.location, 'disable');

    // disable drag and drop listeners
    dragAndDrop('disable');

    // hide and disable dropbox container
    $('#sidebar-img-dropbox-container')
      .fadeOut(200, $.bez(bezierEasing))
      .prop('disabled', true)
      .addClass('disabled');
  }

  // reset live preview values
  sidebarImageLivePreview();
});

var numStickiedLinks; // number of stickied links
var numStickiedMenus; // number of stickied menus

// desired image backgrounds for stickies
var stickyLinkImages;
var stickyMenuImages;

// pinned topics
// TODO: sidebar markdown generator
let stickies = {
  URL: '',
  album: '0 0',
  notice: '-120px 0',
  calendar: '-60px -60px',
  help: '0 -120px',
  info: '-120px -120px',
  media: '-180px -60px',
  shows: '0 -180px',
};

let topicSettings = {
  counter: 0,
  reset: () => {
    // delete all keys except counter and reset function
    for (var key in topicSettings) {
      if (topicSettings.hasOwnProperty(key)) {
        if (key !== 'counter' && key !== 'reset') {
          delete topicSettings[key];
        }
      }
    }

    // reset counter
    topicSettings.counter = 0;
  },
};

// pinned topics validation
function pinnedTopicsValidation(status) {
  if (status === 'disable') {
    // remove warning labels
    $('a[href="#pinned-topics-panel"] .label-warning').detach();

    // disable compile button
    compileButtonEnabler('disable');

    // add warning label
    $('a[href="#pinned-topics-panel"]')
      .prepend(`<span class="label label-warning">Error</span>`);
  } else if (status === 'enable') {
    // enable compile button
    compileButtonEnabler('enable');

    // remove warning labels
    $('a[href="#pinned-topics-panel"] .label-warning').detach();
  }
}

// check if required fields are filled
function pinnedTopicsTestRequiredFields() {
  let test = true;
  $('#pinned-topics-panel input:required').each((index, value) => {
    // for URL inputs, validate URLs
    if ($(value).attr('type') === 'url') {
      if (!re_weburl.test($(value).val())) {
        test = false;
      }
    } else if (!$(value).val()) {
      // fail test if required fields are empty
      test = false;
    }
  });

  if (test) {
    // clear warning labels and enable compile button
    pinnedTopicsValidation('enable');
  } else {
    // disable compile button until required forms are filled
    pinnedTopicsValidation('disable');
  }
}

// add pinned topic and event listeners for each topic
function addTopic() {
  /**
   * LIVE PREVIEW FUNCTIONS
   *   `topicSettings.counter` refers to the latest topic that has been added
   *   `currentTopic` refers to the topic being modified at the current time
   * 1. pinned links
   * 2. pinned menus
   * 3. URL input fields
   */

  // 1. live preview for pinned links
  function pinnedLinksLivePreview(topicNum) {
    if (topicNum === topicSettings.counter) {
      $(`#topic${topicNum}-text`).keyup((event) => {
        if (!$(event.currentTarget).val()) {
          // add error class to input group
          $(event.currentTarget).parent('.input-group').addClass('has-error');

          // replace iframe values with default
          $('iframe').contents().find(`#topic${topicNum} a`)
            .text('reddit: the front page of the internet');
        } else {
          // remove error class from input group
          $(event.currentTarget).parent('.input-group').removeClass('has-error');

          // replace iframe values
          $('iframe').contents().find(`#topic${topicNum} a`)
            .text($(event.currentTarget).val());
        }
      });
    } else {
      // topicNum === currentTopic
      $(`#${topicNum}-text`).keyup((event) => {
        if (!$(event.currentTarget).val()) {
          // add error class to input group
          $(event.currentTarget).parent('.input-group').addClass('has-error');

          // replace iframe values with default
          $('iframe').contents().find(`#${topicNum} a`)
            .text('reddit: the front page of the internet');
        } else {
          // remove error class from input group
          $(event.currentTarget).parent('.input-group')
            .removeClass('has-error');

          // replace iframe values
          $('iframe').contents().find(`#${topicNum} a`)
            .text($(event.currentTarget).val());
        }
      });
    }
  }

  // 2. live preview for pinned menus
  function pinnedMenulinksLivePreview(topicNum) {
    if (topicNum === topicSettings.counter) {
      $(`.topic${topicNum}-menulink-text`).keyup((event) => {
        // manipulate from `topic1-menulink1-text` to `topic1-menulink-1`
        let id = $(event.currentTarget).attr('id');
        id = `#${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;

        $('iframe').contents().find(id).text($(event.currentTarget).val());
      });
    } else {
      // topicNum === currentTopic
      $(`.${topicNum}-menulink-text`).keyup((event) => {
        // manipulate from `topic1-menulink1-text` to `topic1-menulink-1`
        let id = $(event.currentTarget).attr('id');
        id = `#${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;

        if (!$(event.currentTarget).val()) {
          // add error class to input group
          $(event.currentTarget).parent('.input-group').addClass('has-error');

          // replace iframe values with default
          $('iframe').contents().find(id)
            .text('reddit: the front page of the internet');
        } else {
          // remove error class from input group
          $(event.currentTarget).parent('.input-group')
            .removeClass('has-error');

          // replace iframe values
          $('iframe').contents().find(id).text($(event.currentTarget).val());
        }
      });
    }
  }

  // 3. URL keyup listener
  function URLkeyupListener() {
    $('#pinned-topics-panel input[type="url"]').keyup((event) => {
      if (!$(event.currentTarget).val() || !re_weburl.test($(event.currentTarget).val())) {
        // add error class to input group
        $(event.currentTarget).parent().addClass('has-error')

        // remove duplicate error messages
        $(event.currentTarget).parent().siblings('.text-danger').detach();

        // add error message
        $(event.currentTarget).parent().after('<p class="text-danger">Invalid URL!</p>');
      } else {
        // remove error class from input group
        $(event.currentTarget).parent().removeClass('has-error');

        // remove error messages
        $(event.currentTarget).parent().siblings('.text-danger').detach();
      }
    });
  }

  let bezierEasing = [0.4, 0, 0.2, 1];

  // increment counter
  topicSettings.counter++;

  // enable remove topic button if more than 1 topic
  if (topicSettings.counter > 1) {
    $('#remove-topic').prop('disabled', false);
  }

  /**
   * DEFAULT MARKUP
   */
  $('#pinned-topics-config').append(`
    <div class="pinned-topic col-md-12" id="topic${topicSettings.counter}">
      <h4>Topic ${topicSettings.counter}</h4>
      <div class="col-md-12 topic-image">
        <h5>Background image</h5>
        <div class="btn-group btn-group-justified" role="group" data-toggle="buttons">
          <label class="btn btn-default active">
            <input type="radio" name="options" autocomplete="off" checked> Album
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Notice
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Calendar
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Help
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Info
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Media
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off"> Shows
          </label>
        </div>
      </div>
      <div class="col-md-12 topic-type">
        <h5>Type</h5>
        <div class="btn-group btn-group-justified" data-toggle="buttons">
          <label class="btn btn-default active">
            <input type="radio" name="options" autocomplete="off" checked>Link
          </label>
          <label class="btn btn-default">
            <input type="radio" name="options" autocomplete="off">Menu
          </label>
        </div>
        <div id="topic${topicSettings.counter}-link-container">
          <div class="form-horizontal">
            <div class="form-group">
              <label for="topic${topicSettings.counter}-text" class="col-md-2 control-label">Hyperlink</label>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">[</div>
                  <input type="text" class="form-control" id="topic${topicSettings.counter}-text" placeholder="reddit: the front page of the internet" required>
                  <div class="input-group-addon">]</div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">(</div>
                  <input type="url" class="form-control" id="topic${topicSettings.counter}-link" placeholder="https://www.reddit.com/" required>
                  <div class="input-group-addon">)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="topic${topicSettings.counter}-menu-container" style="display:none">
          <div class="menulinks">
          <div class="form-horizontal">
            <div class="form-group">
              <label for="topic${topicSettings.counter}-menulink1-text" class="col-md-2 control-label">Hyperlink 1</label>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">[</div>
                  <input type="text" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-text" id="topic${topicSettings.counter}-menulink1-text" placeholder="reddit: the front page of the internet" disabled>
                  <div class="input-group-addon">]</div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="input-group has-error">
                  <div class="input-group-addon">(</div>
                  <input type="url" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-link" id="topic${topicSettings.counter}-menulink1-link" placeholder="https://www.reddit.com/" disabled>
                  <div class="input-group-addon">)</div>
                </div>
              </div>
            </div>
          </div>
            <div class="form-horizontal">
              <div class="form-group">
                <label for="topic${topicSettings.counter}-menulink2-text" class="col-md-2 control-label">Hyperlink 2</label>
                <div class="col-md-5">
                  <div class="input-group has-error">
                    <div class="input-group-addon">[</div>
                    <input type="text" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-text" id="topic${topicSettings.counter}-menulink2-text" placeholder="reddit: the front page of the internet" disabled>
                    <div class="input-group-addon">]</div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="input-group has-error">
                    <div class="input-group-addon">(</div>
                    <input type="url" class="form-control topic${topicSettings.counter}-menulink topic${topicSettings.counter}-menulink-link" id="topic${topicSettings.counter}-menulink2-link" placeholder="https://www.reddit.com/" disabled>
                    <div class="input-group-addon">)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-group" id="topic${topicSettings.counter}-menulinks-control" aria-label="topic${topicSettings.counter}-menulinks-control">
            <button type="button" class="btn btn-primary add-menulink" disabled>+</button>
            <button type="button" class="btn btn-primary remove-menulink" disabled>-</button>
          </div>
        </div>
      </div>
    </div>
  `);

  // default live preview contents
  $('iframe').contents().find('blockquote.pinned-topics').append(`
    <p id="topic${topicSettings.counter}">
      <a href="https://reddit.com" onclick="return false">reddit: the front page of the internet</a>
    </p>
  `);

  // add new key and values to topicSettings
  topicSettings[`topic${topicSettings.counter}`] = {
    type: $(`#topic${topicSettings.counter} .topic-type .active`)
      .text()
      .trim()
      .toLowerCase(),
    image: $(`#topic${topicSettings.counter} .topic-image .active`)
      .text()
      .trim()
      .toLowerCase(),
    menulinks: 2,
  };

  /**
   * EVENT LISTENERS
   */

  // unbind old listener
  $(`#topic${topicSettings.counter}`).unbind();

  // for each topic, add event listener
  $(`#topic${topicSettings.counter}`).change((event) => {
    let currentTopic = $(event.currentTarget).attr('id');
    let topicType = $(`#${currentTopic} .topic-type .active`)
      .text()
      .trim()
      .toLowerCase();
    let topicImage = $(`#${currentTopic} .topic-image .active`)
      .text()
      .trim()
      .toLowerCase();

    topicSettings[currentTopic].type = topicType;
    topicSettings[currentTopic].image = topicImage;

    /**
     * TOPIC TYPE LISTENERS
     * 1. LINK option is chosen
     * 2. MENU option is chosen
     */
    if (topicType === 'link') {
      /**
       * 1. IF LINK IS CHOSEN
       */

      // hide, disable, and unrequire pinned menu inputs
      $(`#${currentTopic}-menu-container`).hide();
      $(`.${currentTopic}-menulink, #${currentTopic}-menulinks-control .add-menulink`)
        .prop({
          'disabled': true,
          'required': false,
        });

      // enable, require, and show pinned link input
      $(`#${currentTopic}-text, #${currentTopic}-link`).prop({
        'disabled': false,
        'required': true,
      });

      $(`#${currentTopic}-link-container`).fadeIn(200, $.bez(bezierEasing));

      // live preview
      if (!$(`#${currentTopic}-text`).val()) {
        $('iframe').contents().find(`#${currentTopic}`).replaceWith(`
          <p id="${currentTopic}">
            <a href="https://reddit.com" onclick="return false">reddit: the front page of the internet</a>
          </p>
        `);
      } else {
        $('iframe').contents().find(`#${currentTopic}`).replaceWith(`
          <p id="${currentTopic}">
            <a href="${$(`#${currentTopic}-link`).val()}">${$(`#${currentTopic}-text`).val()}</a>
          </p>
        `);
      }

      // TODO: DRY
      // test required fields on topic type change
      pinnedTopicsTestRequiredFields();

      // unbind old listeners
      $(`#pinned-topics-panel input:required`).unbind();

      // live preview for pinned links
      pinnedLinksLivePreview(currentTopic);

      // URL keyup listener
      URLkeyupListener();

      // validation for required input forms
      $('#pinned-topics-panel input:required').keyup((event) => {
        pinnedTopicsTestRequiredFields();
      });
    } else if (topicType === 'menu') {
      /**
       * 2. IF MENU IS CHOSEN
       */

      // hide, disable, and unrequire pinned link input
      $(`#${currentTopic}-link-container`).hide();
      $(`#${currentTopic}-text, #${currentTopic}-link`).prop({
        'disabled': true,
        'required': false,
      });

      // enable, require, and show pinned menu inputs
      $(`.${currentTopic}-menulink, #${currentTopic}-menulinks-control .add-menulink`)
        .prop({
          'disabled': false,
          'required': true,
        });

      $(`#${currentTopic}-menu-container`).fadeIn(200, $.bez(bezierEasing));

      // live preview menulink text
      let menuLinksContent = {};
      $(`.${currentTopic}-menulink-text`).each((index, value) => {
        // manipulate from `topic1-menulink1-text` to `topic1-menulink-1`
        let id = value.id;
        id = `${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;
        menuLinksContent[id] = {};

        // assign key-value pair
        if (!$(`#${value.id}`).val()) {
          menuLinksContent[id].text = 'reddit: the front page of the internet';
        } else {
          menuLinksContent[id].text = $(`#${value.id}`).val();
        }
      });

      // live preview menulink links
      $(`.${currentTopic}-menulink-link`).each((index, value) => {
        // manipulate from `topic1-menulink1-link` to `topic1-menulink-1`
        let id = value.id;
        id = `${id.slice(0, -5).slice(0, -1)}-${id.slice(0, -5).slice(-1)}`;

        // assign key-value pair
        if (!$(`#${value.id}`).val()) {
          menuLinksContent[id].link = 'https://reddit.com/';
        } else {
          menuLinksContent[id].link = $(`#${value.id}`).val();
        }
      });

      // insert markup
      let replacementMarkup = '';
      for (var key in menuLinksContent) {
        if (menuLinksContent.hasOwnProperty(key)) {
          replacementMarkup = `${replacementMarkup}
          <li>
            <a id="${key}" href="${menuLinksContent[key].link}" onclick="return false">${menuLinksContent[key].text}</a>
          </li>`;
        }
      }

      $('iframe').contents().find(`#${currentTopic}`).replaceWith(`
        <ul id="${currentTopic}">
          ${replacementMarkup}
        </ul>
      `);

      // TODO: DRY
      // test required fields on topic type change
      pinnedTopicsTestRequiredFields();

      // unbind old listeners
      $(`#pinned-topics-panel input:required`).unbind();

      // live preview for pinned menus
      pinnedMenulinksLivePreview(currentTopic);

      // URL keyup listener
      URLkeyupListener();

      // validation for required input forms
      $('#pinned-topics-panel input:required').keyup((event) => {
        pinnedTopicsTestRequiredFields();
      });
    }

    /**
     * MENULINK CONTROLS
     *
     * control # of menulinks per pinned menu
     */

    // unbind old listener
    $(`#${currentTopic} .add-menulink,
      #${currentTopic} .remove-menulink`).unbind();

    // add menulink
    $(`#${currentTopic} .add-menulink`).click(() => {
      // increment number of menulinks for this particular topic
      topicSettings[currentTopic].menulinks++;

      // enable remove menulink button if more than 2 menulinks are present
      if (topicSettings[currentTopic].menulinks > 2) {
        $(`#${currentTopic}-menulinks-control .remove-menulink`)
        .prop('disabled', false);
      }

      // append markup
      $(`#${currentTopic}-menu-container .menulinks`).append(`
        <div class="form-horizontal">
          <div class="form-group">
            <label for="${currentTopic}-menulink${topicSettings[currentTopic].menulinks}-text" class="col-md-2 control-label">Hyperlink ${topicSettings[currentTopic].menulinks}</label>
            <div class="col-md-5">
              <div class="input-group has-error">
                <div class="input-group-addon">[</div>
                <input type="text" class="form-control ${currentTopic}-menulink ${currentTopic}-menulink-text" id="${currentTopic}-menulink${topicSettings[currentTopic].menulinks}-text" placeholder="reddit: the front page of the internet" required>
                <div class="input-group-addon">]</div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="input-group has-error">
                <div class="input-group-addon">(</div>
                <input type="url" class="form-control ${currentTopic}-menulink ${currentTopic}-menulink-link" id="${currentTopic}-menulink${topicSettings[currentTopic].menulinks}-link" placeholder="https://www.reddit.com/" required>
                <div class="input-group-addon">)</div>
              </div>
            </div>
          </div>
        </div>
      `);

      // validation for required input forms
      pinnedTopicsTestRequiredFields();

      // unbind old listeners
      $(`#pinned-topics-panel input:required`).unbind();

      // live preview for pinned menus
      pinnedMenulinksLivePreview(currentTopic);

      // URL keyup listener
      URLkeyupListener();

      // live preview
      $('iframe').contents().find(`#${currentTopic} ul`).append(`
        <li>
          <a id="${currentTopic}-menulink-${topicSettings[currentTopic].menulinks}" href="https://reddit.com" onclick"return false"=>reddit: the front page of the internet</a>
        </li>
      `);
    });

    // remove menulink
    $(`#${currentTopic} .remove-menulink`).click(() => {
      // decrement number of menulinks for this particular topic (if amount > 2)
      if (topicSettings[currentTopic].menulinks > 2) {
        topicSettings[currentTopic].menulinks--;
      }

      // disable remove menulink button if only 2 menulinks remain
      if (topicSettings[currentTopic].menulinks === 2) {
        $(`#${currentTopic}-menulinks-control .remove-menulink`)
        .prop('disabled', true);
      }

      // remove last menulink input form
      $(`#${currentTopic}-menu-container .form-horizontal`).last().remove();

      // validation for required input forms
      pinnedTopicsTestRequiredFields();

      // live preview
      $('iframe').contents().find(`#${currentTopic} ul li`).last().remove();
    });

    /**
     * TOPIC IMAGE LISTENERS
     */
    switch (true) {
      case topicImage === 'album':
        $('iframe').contents()
          .find(`blockquote.pinned-topics #${currentTopic}`)
          .css('background-position', stickies.album);
        break;
      case topicImage === 'notice':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.notice);
        break;
      case topicImage === 'calendar':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.calendar);
        break;
      case topicImage === 'help':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.help);
        break;
      case topicImage === 'info':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.info);
        break;
      case topicImage === 'media':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.media);
        break;
      case topicImage === 'shows':
      $('iframe').contents()
        .find(`blockquote.pinned-topics #${currentTopic}`)
        .css('background-position', stickies.shows);
        break;
      default:
        // album
        break;
    }

    console.log(topicSettings);
  });

  // unbind old listeners
  $(`#pinned-topics-panel input:required`).unbind();

  // live preview for pinned links
  pinnedLinksLivePreview(topicSettings.counter);

  // live preview for pinned menus
  pinnedMenulinksLivePreview(topicSettings.counter);

  // URL keyup listener
  URLkeyupListener();

  // validation for required input forms
  $('#pinned-topics-panel input:required').keyup((event) => {
    pinnedTopicsTestRequiredFields();
  });

  // fade in markup
  $(`#topic${topicSettings.counter}`).hide().fadeIn(200, $.bez(bezierEasing));
}

// live preview markup
$('#pinned-topics-checkbox:checkbox').change(() => {
  if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
    $('iframe').contents().find('.usertext-body .md').prepend(`
      <blockquote class="pinned-topics"></blockquote>
    `);

    $('iframe').contents().find('head').append(`
      <style class="pinned-topics" type="text/css">
        .res-nightmode .titlebox blockquote::after {
          background-color: #424242;
        }

        .titlebox blockquote {
          position: fixed;
          left: 16px;
          border: 0;
          margin: 0 !important;
          padding: 0;
        }

        .titlebox blockquote::after {
          position: absolute;
          top: 0;
          z-index: -1;
          display: block;
          height: 100%;
          width: 60px;
          content: '';
          border-radius: 2px;
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
          0px 2px 2px 0px rgba(0, 0, 0, 0.14),
          0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
          background-color: #fff;
        }

        .titlebox blockquote p,
        .titlebox blockquote ul,
        .titlebox blockquote a {
          border-bottom-right-radius: 2px;
          border-top-right-radius: 2px;
        }

        .titlebox blockquote p,
        .titlebox blockquote ul {
          width: 60px;
          height: 60px;
          margin: 0 !important;
          overflow: hidden;
          background: url(${stickies.URL}) no-repeat;
        }

        .titlebox blockquote p:hover {
          width: 100%;
          background-color: #00bcd4 !important;
        }

        .titlebox blockquote a {
          display: block;
          height: 60px;
          border-left-width: 60px;
          border-left-style: solid;
          border-left-color: transparent;
          padding: 0 16px;
          line-height: 60px;
          font-size: 14px;
          color: #fff !important;
          background-clip: padding-box;
          background-color: #616161;
        }

        .titlebox blockquote a:hover {
          color: #00bcd4 !important;
        }

        .titlebox blockquote ul {
          padding: 0;
        }

        .titlebox blockquote ul:hover {
          width: 100%;
          overflow: visible;
          background-color: #00bcd4 !important;
        }

        .titlebox blockquote ul ul {
          background-image: none !important;
          background-color: transparent !important;
        }

        .titlebox blockquote ul ul:hover {
          background-color: transparent !important;
        }

        .titlebox blockquote ul li {
          list-style-type: none;
        }

        .titlebox blockquote ul li a {
          border: 0;
          margin-left: 60px;
        }

        div.content {
          margin: 0 15px 0 91px;
        }

        @media (max-resolution: 1dppx) and (min-width: 992px) {
          div.content {
            max-width: calc(100% - 503px);
            margin-left: 93px !important;
          }
        }
      </style>
    `);

    // if large header
    if ($('#large-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header pinned-topics" type="text/css">
          .titlebox blockquote {
            top: 312px;
          }

          @media (min-width: 992px) {
            #header-bottom-left {
              left: 0;
            }
          }
        </style>
      `);
    } else {
      $('iframe').contents().find('head').append(`
        <style class="large-header pinned-topics" type="text/css">
          .titlebox blockquote {
            top: 239px;
          }
        </style>
      `);
    }
  } else {
    // if large header
    if ($('#large-header-checkbox:checkbox').prop('checked')) {
      $('iframe').contents().find('head').append(`
        <style class="large-header" type="text/css">
          @media (min-width: 992px) {
            #header-bottom-left {
              left: 48px;
            }
          }
        </style>
      `);
    }

    $('iframe').contents().find('head .pinned-topics').detach();
    $('iframe').contents().find('.md .pinned-topics').detach();
  }
});

// pinned topics controls
$('#pinned-topics-checkbox:checkbox').change(() => {
  let bezierEasing = [0.4, 0, 0.2, 1];

  if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
    // show and enable control buttons div
    $('#pinned-topics-control').show(200, $.bez(bezierEasing))
      .fadeIn(200, $.bez(bezierEasing));

    // enable buttons
    $('#add-topic').prop('disabled', false);

    // reset topicSettings object
    topicSettings.reset();

    // prepopulate with 1 topic
    addTopic();

    // validation for required input forms
    pinnedTopicsTestRequiredFields();
  } else {
    // hide and disable control buttons div
    $('#pinned-topics-control').hide(200, $.bez(bezierEasing))
      .fadeOut(200, $.bez(bezierEasing));

    // disable buttons
    $('#add-topic').prop('disabled', true);
    $('#remove-topic').prop('disabled', true);

    // clear topics, data, and event handlers
    $('#pinned-topics-config').empty();

    // clear warning labels and enable compile button
    pinnedTopicsValidation('enable');
  }
});

// add topic
$('#add-topic').click((event) => {
  addTopic();
  console.log(topicSettings);
});

// remove topic
$('#remove-topic').click((event) => {
  let bezierEasing = [0.4, 0, 0.2, 1];
  if (topicSettings.counter > 1) {
    // delete key
    delete topicSettings[`topic${topicSettings.counter}`];

    // remove markup and all bound events
    $('#pinned-topics-config .pinned-topic').last()
      .fadeOut(200, $.bez(bezierEasing), () => {
        $('#pinned-topics-config .pinned-topic').last().remove();
    });

    // decrement counter
    topicSettings.counter--;
  }

  // disable remove topic button if only 1 topic remains
  if (topicSettings.counter === 1) {
    $('#remove-topic').prop('disabled', true);
  }

  // live preview
  $('iframe').contents().find('blockquote.pinned-topics').children().last()
    .remove();
});


// FIXME: remove this if unneeded
$('iframe').load(() => {
  // $('iframe').contents().find('body').css('background-color', 'purple');
  // $('iframe').contents().find('style').append('body { background-color: purple; }');
});

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