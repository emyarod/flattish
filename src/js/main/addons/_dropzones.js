import { compileButtonEnabler } from './_compile-button-enabler.js';
import {
  sidebarImg,
  sidebarImageLivePreview,
} from './_sidebar-image.js';

// rotating headers
export var rotatingHeaders = {};

// click to remove uploaded header images
export function clickToRemove(status) {
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
      let index = $('#rotating-header-dropbox-container .thumbnail')
        .index(event.currentTarget);
      let toBeDeleted = Object.keys(rotatingHeaders).length;

      // reassign keys and values
      for (var i = index + 1; i < toBeDeleted; i++) {
        let newKey = `header${i}`;
        let oldKey = `header${i + 1}`;
        rotatingHeaders[newKey] = rotatingHeaders[oldKey];
      }

      // delete the removed key from rotatingHeaders
      delete rotatingHeaders[`header${toBeDeleted}`];

      // remove thumbnail markup
      $(event.currentTarget).parent().fadeOut().remove();

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
              // validate file size in KiB
              if (filesize > 512000) {
                // return error due to file size
                validationError(selector, 'size');

                // edit flag
                abort = true;
                return false;
              } else {
                // edit rotatingHeaders object
                rotatingHeaders[`header${position}`] = {
                  URL: base64,
                };

                if (!abort) {
                  validationSuccess(base64, filename, filesize);
                } else {
                  return false;
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
});

$('a[href="#rotating-header-panel"]').on('shown.bs.tab', (e) => {
  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
    // enable drag and drop listeners
    dragAndDrop('enable');
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
});

$('a[href="#sidebar-img-panel"]').on('shown.bs.tab', (e) => {
  if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
    // enable drag and drop listeners
    dragAndDrop('enable');
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