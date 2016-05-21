import '../../css/spectrum.scss';
import '../../css/styles.scss';

import 'jquery-bez';

import '../sassjs/bourbon.js';
import '../sassjs/flattish.js';
import '../spectrum/spectrum.js';

import { colorList, colors } from './colorlist.js';
import {
  paletteArrayCreator,
  paletteConstructorArray,
  palettes,
  createSpectrum,
} from './colorpickers.js';

// addons

// pinned topics
var pinnedTopics;
var numStickiedLinks; // number of stickied links
var numStickiedMenus; // number of stickied menus

// desired image backgrounds for stickies
var stickyLinkImages;
var stickyMenuImages;

$(document).ready(() => {
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
            $('#addons-container').outerHeight(true)
          );
        },
      }
    });
  });

  // copy to clipboard button

  // initialize tooltip
  $('.btn-clipboard').tooltip({
    container: 'body',
  });

  $('.btn-clipboard').click(() => {
    /**
     * create a Range interface
     * set the Range to contain the chosen Node and its elements
     * make sure nothing is preselected
     * add Range to Selection
     */
    if (document.selection) {
      // for IE
      let range = document.body.createTextRange();
      range.moveToElementText(document.getElementById('target'));
      range.select();
    } else if (window.getSelection) {
      let range = document.createRange();
      range.selectNode(document.getElementById('target'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }

    // copy highlighted text
    try {
      let success = document.execCommand('copy');
      if (success) {
        // change tooltip text
        $('.btn-clipboard').trigger('copied', ['Copied!']);

        // un-highlight text
        window.getSelection().removeAllRanges();
      } else {
        $('.btn-clipboard').trigger('copied', ['Copy with Ctrl-c']);
      }
    } catch (err) {
      $('.btn-clipboard').trigger('copied', ['Copy with Ctrl-c']);
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
  $('.btn-clipboard').bind('copied', (event, message) => {
    $(event.currentTarget).attr('title', message)
      .tooltip('fixTitle')
      .tooltip('show')
      .attr('title', 'Copy to clipboard')
      .tooltip('fixTitle');
  });
});

var sass = new Sass();

sass.options({ style: Sass.style.compressed }, result => (
  console.log('set options')
));

// download the files immediately
for (var key in Sass.maps) {
  if (Sass.maps.hasOwnProperty(key)) {
    console.log(`loading ${key}`);
    sass.preloadFiles(Sass.maps[key].base, Sass.maps[key].directory, Sass.maps[key].files, () => {
      console.log('files loaded');
    });
  }
}

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


// returns inline styles for live preview
// FIXME: -- global var
var inlineStyleSelectors = [];

function inlineStyler(cssObject) {
  if (typeof cssObject === 'object') {
    for (var selector in cssObject) {
      if (inlineStyleSelectors.indexOf(selector) === -1) {
        inlineStyleSelectors.push(selector);
      }

      if (cssObject.hasOwnProperty(selector)) {
        let block = cssObject[selector];
        for (var property in block) {
          if (block.hasOwnProperty(property)) {
            let value = block[property];
            $('iframe').contents().find(selector).css(property, value);
          }
        }
      }
    }
  }
}

// addon labels
var addonLabeler = {
  addons: [
    'large-header',
    'rotating-header',
    'sidebar-img',
  ],
  enable: (addon) => {
    $(`#${addon}-label`)
      .addClass('label-info')
      .removeClass('label-default')
      .html('Enabled');

  },
  disable: (addon) => {
    $(`#${addon}-label`)
      .addClass('label-default')
      .removeClass('label-info')
      .html('Disabled');
  }
}

addonLabeler.addons.forEach((element, index, array) => {
  $(`#${element}-checkbox:checkbox`).change(() => {
    if ($(`#${element}-checkbox:checkbox`).prop('checked')) {
      addonLabeler.enable(element);
    } else {
      addonLabeler.disable(element);
    }
  });
});

// large header
$('#large-header-checkbox:checkbox').change(() => {
  if ($('#large-header-checkbox:checkbox').prop('checked')) {
    inlineStyler({
      'div.content': {
        'top': '297px',
      },
      '#header-bottom-left': {
        'top': '172px',
      },
      '.side': {
        'top': '297px',
      },
    });

    $('iframe').contents().find('style').append(
      `
      @media (min-width: 992px) {
        #header-bottom-left {
          left: 48px;
        }
      }
      @media (min-width: 1200px) {
        #header-bottom-left {
          top: 245px;
        }
      }
      body::before {
        height: 420px;
      }
      `
    );
    // if pinned topics
    if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
      inlineStyler({
        '.titlebox blockquote': {
          'top': '312px',
        },
      });

      $('iframe').contents().find('style').append(
        `
        @media (min-width: 992px) {
          #header-bottom-left {
            left: 0;
          }
        }
        `
      );
    }

    // if sidebar image
    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
      inlineStyler({
        '.side': {
          'top': `${297 + sidebarImg.height + 16}px`,
        },
      });
    }
  } else {
    // normal header
    inlineStyler({
      'div.content': {
        'top': '223px',
      },
      '#header-bottom-left': {
        'top': '86px',
      },
      '.side': {
        'top': '223px',
      },
    });

    $('iframe').contents().find('style').append(
      `
      body::before {
        height: 223px;
      }

      @media (min-width: 992px) {
        #header-bottom-left {
          left: unset;
        }
      }
      @media (min-width: 1200px) {
        #header-bottom-left {
          top: 159px;
        }
      }
      `
    );

    // if pinned topics
    if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
      inlineStyler({
        '.titlebox blockquote': {
          'top': '239px',
        },
      });
    }

    // if sidebar image
    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
      inlineStyler({
        '.side': {
          'top': `${223 + sidebarImg.height + 16}px`,
        },
      });
    }
  }
});

// rotating header validation
$('#rotating-header-checkbox:checkbox').change(() => {
  let bezierEasing = [0.4, 0, 0.2, 1];
  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
    // show div
    $('#rotating-header__div').show(200, $.bez(bezierEasing))
      .fadeIn(200, $.bez(bezierEasing))
      .slideDown(200, $.bez(bezierEasing));

    // enable input field
    $('#rotating-header__input').prop({
      disabled: false,
      required: true,
    });
  } else {
    // hide div
    $('#rotating-header__div').hide(200, $.bez(bezierEasing))
      .fadeOut(200, $.bez(bezierEasing))
      .slideUp(200, $.bez(bezierEasing));

    // disable input field
    $('#rotating-header__input').prop({
      disabled: true,
      required: false,
    });
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
    sidebarImg.URL = 'https://b.thumbs.redditmedia.com/_hGE-XHXCAJOIsz4vtml2tiYvqyCc_R2K0oJgt1qeWI.png';
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
      inlineStyler({
        '.side': {
          'top': `${297 + sidebarImg.height + 16}px`,
        },
      });
    } else {
      inlineStyler({
        '.side': {
          'top': `${223 + sidebarImg.height + 16}px`,
        },
      });
    }

    $('iframe').contents().find('style').append(
      `
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
      `
    );
  } else {
    // if large header
    if ($('#large-header-checkbox:checkbox').prop('checked')) {
      inlineStyler({
        '.side': {
          'top': '297px',
        },
      });
    } else {
      inlineStyler({
        '.side': {
          'top': '223px',
        },
      });
    }

    $('iframe').contents().find('style').append(
      `
      .titlebox::before {
        display: none;
      }

      @media (max-resolution: 1dppx) and (min-width: 992px) {
        .titlebox::before {
          right: unset;
        }
      }
      `
    );
  }
}

// dropzone

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

function readImg(file, location, returnBase64) {
  let reader = new FileReader();
  reader.onload = (event) => {
    checkDimensions(event, (image) => {
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

        if (location === 'sidebar') {
          // recalculate image height
          sidebarImg.height = Math.round(image.height / scaleFactor);
        }

        // draw image on canvas to convert to base64
        context.drawImage(image, 0, 0, 330, image.height / scaleFactor);

        // return base64 for resized image
        returnBase64(canvas.toDataURL());

        // detach canvas element
        $('#canvas').detach();
      } else {
        if (location === 'sidebar') {
          // image height remains
          sidebarImg.height = image.height;
        }

        // return base64 for resized image
        returnBase64(reader.result);
      }
    });
  }

  reader.readAsDataURL(file);
}

function previewImg(input, location, selector = undefined) {
  // let file = input.files[0];
  let { files: [file] } = input;
  if (selector === undefined) {
    selector = input;
  } else {
    [selector] = $(selector).find('.dropbox');
  }

  if (file) {
    // file type validation
    let imageType = /^image\//;
    if (imageType.test(file.type)) {
      // read contents of uploaded file(s)
      readImg(file, location, (base64) => {
        // validate file size
        if (file.size > 500000) {
          // disable compile button
          compileButtonEnabler('disable');

          // add warning label
          $(selector).parents('.panel-default').find('h4')
            .append(`<span class="label label-warning">Error</span>`);

          // change dropbox border color
          $(selector).parent().css('border-color', '#f2dede');

          // throw error
          $(selector).siblings('.file-details')
            .html(`<p class="bg-danger">File size over 500kb!</p>`);
        } else {
          if (location = 'sidebar') {
            // live preview
            sidebarImageLivePreview(base64);

            // enable compile button
            compileButtonEnabler('enable');

            // remove warning label
            $(selector).parents('.panel-default').find('.label-warning')
              .detach();

            // reset dropbox border color
            $(selector).parent().css('border-color', '#d9edf7');

            // insert thumbnail
            $(selector).siblings('.thumb-container')
              .html(`<img src="${base64}" width="100" alt="Image preview...">`);

            // show file details
            $(selector).siblings('.file-details')
              .html(`<p><strong>${file.name}</strong> - ${file.size} bytes</p>`);
          }
        }
      });
    } else {
      // disable compile button
      compileButtonEnabler('disable');

      // add warning label
      $(selector).parents('.panel-default').find('h4')
        .append(`<span class="label label-warning">Error</span>`);

      // change dropbox border color
      $(selector).parent().css('border-color', '#f2dede');

      // throw error
      $(selector).siblings('.file-details')
        .html(`<p class="bg-danger">Invalid file type!</p>`);
    }
  }
}

function createClickableDropbox(option, location) {
  let [fileSelect] = $(option).parents('.addons__checkbox-container')
    .find('.dropbox-container');
  let [fileElem] = $(option).parents('.addons__checkbox-container')
    .find('.dropbox');
  let [thumbnail] = $(option).parents('.addons__checkbox-container')
    .find('.thumb-container');
  let [details] = $(option).parents('.addons__checkbox-container')
    .find('.file-details');

  // sanitize dropbox content
  $(thumbnail).html('');
  $(details).html('');
  $(fileSelect).css('border-color', '#d9edf7');

  // dropbox drag and drop behavior
  fileSelect.onclick = (event) => {
    // sanitize input field value
    $(fileElem).val('');

    // activate manual file upload
    fileElem.click();
  };

  // dropbox click behavior
  $(fileElem).change((event) => {
    previewImg(event.currentTarget, location);
  });
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

// enable drag and drop listeners for dropboxes on accordion show
$('#sidebar-img-panel').on('shown.bs.collapse', (event) => {
  if ($(event.currentTarget).find('input[type=checkbox]').prop('checked')) {
    dragAndDrop('enable');
  }
});

// disable drag and drop listeners for dropboxes on accordion hide
$('#sidebar-img-panel').on('hidden.bs.collapse', (event) => {
  if ($(event.currentTarget).find('input[type=checkbox]').prop('checked')) {
    dragAndDrop('disable');
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
    createClickableDropbox(event.currentTarget, dropzone.location);

    // enable drag and drop listeners
    dragAndDrop('enable');

    // show div
    $('#sidebar-img-div')
      .show(200, $.bez(bezierEasing))
      .fadeIn(200, $.bez(bezierEasing))
      .slideDown(200, $.bez(bezierEasing));

    // show and enable dropbox container
    $('#sidebar-img-dropbox-container')
      .show(200, $.bez(bezierEasing))
      .prop('disabled', false)
      .removeClass('disabled')
      .fadeIn(200, $.bez(bezierEasing))
      .slideDown(200, $.bez(bezierEasing));
  } else {
    // enable compile button
    compileButtonEnabler('enable');

    // remove warning labels
    $('#sidebar-img-label').siblings('.label-warning').detach();

    // disable drag and drop listeners
    dragAndDrop('disable');

    // hide div
    $('#sidebar-img-div')
      .hide(200, $.bez(bezierEasing))
      .fadeOut(200, $.bez(bezierEasing))
      .slideUp(200, $.bez(bezierEasing));

    // hide and disable dropbox container
    $('#sidebar-img-dropbox-container')
      .hide(200, $.bez(bezierEasing))
      .fadeOut(200, $.bez(bezierEasing))
      .slideUp(200, $.bez(bezierEasing))
      .prop('disabled', true)
      .addClass('disabled');
  }

  // reset live preview values
  sidebarImageLivePreview();
});

$('iframe').load(() => {
  // $('iframe').contents().find('body').css('background-color', 'purple');
  // $('iframe').contents().find('style').append('body { background-color: purple; }');
});

// compile
$('#compile').click(() => {
  // disable inputs while compiling
  $('input').addClass('disabled').prop('disabled', true);
  $('.dropbox-container').addClass('disabled');
  $('.dropbox').prop('disabled', true);

  // remove save images button while compiling
  $('#save-images').detach();

  // disable drag and drop listeners while compiling
  if ($('.dropbox-panel').find('.in').length > 0) {
    dragAndDrop('disable');
  }

  // get file content
  sass.readFile('flattish/utils/_vars.scss', (content) => {
    if (content !== undefined) {
      console.log('reading _vars.scss');

      // replace Sass variables
      // colors
      content = replacer(content, 'color', Object.keys(colors));

      // large header
      if ($('#large-header-checkbox:checkbox').prop('checked')) {
        console.log('checked');
        content = replacer(content, 'bool', true, 'headerLarge');
      } else {
        console.log('not checked');
        content = replacer(content, 'bool', false, 'headerLarge');
      }

      // random, rotating header
      if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
        console.log('checked');
        content = replacer(content, 'bool', true, 'randomHeader');
        content = replacer(content, 'bool', $('#rotating-header__input').val(), 'numHeaderImages');
      } else {
        console.log('not checked');
        content = replacer(content, 'bool', false, 'randomHeader');
      }

      // sidebar image
      if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
        console.log('checked');
        content = replacer(content, 'bool', true, 'sidebarImg');
        content = replacer(content, 'bool', `${sidebarImg.height}px`, 'sidebarImgHeight');
      } else {
        console.log('not checked');
        content = replacer(content, 'bool', false, 'sidebarImg');
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
          $('input').removeClass('disabled').prop('disabled', false);
          $('.dropbox-container').removeClass('disabled');
          $('.dropbox').prop('disabled', false);

          // remove inline styles
          for (var i = 0; i < inlineStyleSelectors.length; i++) {
            $('iframe').contents().find(`${inlineStyleSelectors[i]}[style]`)
            .removeAttr('style');
          }

          console.log('compiled');
          console.log(result);

          // insert code into <pre>
          $('#target').html(result.text.trim());
          $('#clipboard-input').val(result.text.trim());

          let finalPreview = result.text.trim();

          finalPreview = finalPreview
            .replace(/%%dropdown%%/g, '../../../img/src/sidebar/dropdown--arrow-drop-down.png')
            .replace(/%%dropdown-night%%/g, '../../../img/src/sidebar/dropdown-night--arrow-drop-down.png')
            .replace(/%%header%%/g, '../../../img/headers/header.png')
            .replace(/%%spritesheet%%/g, '../../../img/sprites/spritesheet.png')
            .replace(/%%save%%/g, '../../../img/sprites/save.png')
            .replace(/%%hide%%/g, '../../../img/sprites/hide.png')
            .replace(/%%sidebar%%/g, sidebarImg.URL);
          $('iframe').contents().find('style')
            .html(`html,body{overflow-y:hidden;}${finalPreview}`);

          // save image button
          if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
            if (sidebarImg.URL.search(/data:image\/png;base64,/) !== -1) {
              $('#compile-div').append(`<a id="save-images" class="btn btn-default" href="${sidebarImg.URL}" download="sidebar.png">Save images</a>`);
            }
          }

          // re-enable drag and drop listeners if a dropbox panel is expanded
          if ($('.dropbox-panel').find('.in').length > 0) {
            dragAndDrop('enable');
          }
        });
      });
    } else {
      console.log('readFile failed');
    }
  });
});