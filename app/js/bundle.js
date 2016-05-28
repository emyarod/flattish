/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	__webpack_require__(12);

	__webpack_require__(13);

	__webpack_require__(11);

	__webpack_require__(6);

	__webpack_require__(7);

	__webpack_require__(8);

	var _colorlist = __webpack_require__(1);

	var _colorpickers = __webpack_require__(5);

	$(document).ready(function () {
	  $.ajax({
	    url: 'style/flattish.min.css'
	  }).done(function (data) {
	    $('#target').html(data);
	  }).done(function () {
	    // affix iframe after scrolling past header
	    $('#iframe-container').affix({
	      offset: {
	        top: $('.header').outerHeight(true),
	        bottom: function bottom() {
	          return $('#results').outerHeight(true) + $('#addons').outerHeight(true);
	        }
	      }
	    });
	  });

	  // copy to clipboard button

	  // initialize tooltip
	  $('.btn-clipboard').tooltip({
	    container: 'body'
	  });

	  $('.btn-clipboard').click(function () {
	    /**
	     * create a Range interface
	     * set the Range to contain the chosen Node and its elements
	     * make sure nothing is preselected
	     * add Range to Selection
	     */
	    if (document.selection) {
	      // for IE
	      var range = document.body.createTextRange();
	      range.moveToElementText(document.getElementById('target'));
	      range.select();
	    } else if (window.getSelection) {
	      var _range = document.createRange();
	      _range.selectNode(document.getElementById('target'));
	      window.getSelection().removeAllRanges();
	      window.getSelection().addRange(_range);
	    }

	    // copy highlighted text
	    try {
	      var success = document.execCommand('copy');
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
	  $('.btn-clipboard').bind('copied', function (event, message) {
	    $(event.currentTarget).attr('title', message).tooltip('fixTitle').tooltip('show').attr('title', 'Copy to clipboard').tooltip('fixTitle');
	  });
	});

	var sass = new Sass();

	sass.options({ style: Sass.style.compressed }, function (result) {
	  return console.log('set options');
	});

	// download the files immediately
	for (var key in Sass.maps) {
	  if (Sass.maps.hasOwnProperty(key)) {
	    console.log('loading ' + key);
	    sass.preloadFiles(Sass.maps[key].base, Sass.maps[key].directory, Sass.maps[key].files, function () {
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
	    (function () {
	      var capitalLetters = input.match(/[A-Z]/g);

	      // check if variable name contains more than 1 capital letter
	      if (capitalLetters.length > 1) {
	        capitalLetters.forEach(function (element, index, array) {
	          input = input.replace(capitalLetters[index], '-' + capitalLetters[index].toLowerCase());
	        });
	      } else {
	        var _input$match = input.match(/[A-Z]/g);

	        var _input$match2 = _slicedToArray(_input$match, 1);

	        capitalLetters = _input$match2[0];

	        input = input.replace(capitalLetters, '-' + capitalLetters.toLowerCase());
	      }
	      regexArray.push('(\\$' + input + ': .*?;)');
	      varNameArray.push(input);
	    })();
	  } else {
	    regexArray.push('(\\$' + input + ': .*?;)');
	    varNameArray.push(input);
	  }
	}

	// create regexp patterns
	function regexPatternCreator(callback, varNameArray, regexArray) {
	  callback(varNameArray, regexArray);
	  return new RegExp(regexArray.join('|'), 'g');
	}

	// callback for booleans
	function booleanCallback(varNames, replacementValue) {
	  if (arguments.length <= 3 ? undefined : arguments[3]) {
	    return '$' + varNames[0] + ': ' + replacementValue + ';';
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
	function replacer(inputString, varType, replacementValue) {
	  var variable = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	  var varNames = [];
	  var testPatterns = [];

	  // replace color variables
	  if (varType === 'color') {
	    inputString = inputString.replace(regexPatternCreator(function (varNames, testPatterns) {
	      for (var key in _colorlist.colors) {
	        if (_colorlist.colors.hasOwnProperty(key)) {
	          varEditor(key, varNames, testPatterns);
	        }
	      }
	    }, varNames, testPatterns), function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      for (var i = 0; i < replacementValue.length; i++) {
	        if (args[i + 1]) {
	          /**
	           * since the default color values are objects
	           * we need to evaluate differently if unchanged by user
	           */
	          if (_typeof(_colorlist.colors[replacementValue[i]]) === 'object') {
	            var color = _colorlist.colors[replacementValue[i]];
	            return '$' + varNames[i] + ': ' + _colorlist.colorList[color.color][color.colorCode] + ';';
	          } else if (typeof _colorlist.colors[replacementValue[i]] === 'string') {
	            return '$' + varNames[i] + ': ' + _colorlist.colors[replacementValue[i]] + ';';
	          }
	        }
	      }
	    });
	    return inputString;
	  }

	  // replace boolean variables
	  if (varType === 'bool') {
	    inputString = inputString.replace(regexPatternCreator(function (varNames, testPatterns) {
	      varEditor(variable, varNames, testPatterns);
	    }, varNames, testPatterns), function () {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      return booleanCallback.apply(undefined, [varNames, replacementValue].concat(args));
	    });
	    return inputString;
	  }
	}

	// returns inline styles for live preview
	// FIXME: -- global var
	var inlineStyleSelectors = [];

	function inlineStyler(cssObject) {
	  if ((typeof cssObject === 'undefined' ? 'undefined' : _typeof(cssObject)) === 'object') {
	    for (var selector in cssObject) {
	      if (inlineStyleSelectors.indexOf(selector) === -1) {
	        inlineStyleSelectors.push(selector);
	      }

	      if (cssObject.hasOwnProperty(selector)) {
	        var block = cssObject[selector];
	        for (var property in block) {
	          if (block.hasOwnProperty(property)) {
	            var value = block[property];
	            $('iframe').contents().find(selector).css(property, value);
	          }
	        }
	      }
	    }
	  }
	}

	// addon labels
	var addonLabeler = {
	  addons: ['large-header', 'rotating-header', 'sidebar-img', 'pinned-topics'],
	  enable: function enable(addon) {
	    $('#' + addon + '-label').addClass('label-info').removeClass('label-default').html('Enabled');
	  },
	  disable: function disable(addon) {
	    $('#' + addon + '-label').addClass('label-default').removeClass('label-info').html('Disabled');
	  }
	};

	addonLabeler.addons.forEach(function (element, index, array) {
	  $('#' + element + '-checkbox:checkbox').change(function () {
	    if ($('#' + element + '-checkbox:checkbox').prop('checked')) {
	      addonLabeler.enable(element);
	    } else {
	      addonLabeler.disable(element);
	    }
	  });
	});

	// large header
	$('#large-header-checkbox:checkbox').change(function () {
	  if ($('#large-header-checkbox:checkbox').prop('checked')) {
	    inlineStyler({
	      'div.content': {
	        'top': '297px'
	      },
	      '#header-bottom-left': {
	        'top': '172px'
	      },
	      '.side': {
	        'top': '297px'
	      }
	    });

	    $('iframe').contents().find('style').append('\n      @media (min-width: 992px) {\n        #header-bottom-left {\n          left: 48px;\n        }\n      }\n      @media (min-width: 1200px) {\n        #header-bottom-left {\n          top: 245px;\n        }\n      }\n      body::before {\n        height: 420px;\n      }\n      ');
	    // if pinned topics
	    if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
	      inlineStyler({
	        '.titlebox blockquote': {
	          'top': '312px'
	        }
	      });

	      $('iframe').contents().find('style').append('\n        @media (min-width: 992px) {\n          #header-bottom-left {\n            left: 0;\n          }\n        }\n        ');
	    }

	    // if sidebar image
	    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
	      inlineStyler({
	        '.side': {
	          'top': 297 + sidebarImg.height + 16 + 'px'
	        }
	      });
	    }
	  } else {
	    // normal header
	    inlineStyler({
	      'div.content': {
	        'top': '223px'
	      },
	      '#header-bottom-left': {
	        'top': '86px'
	      },
	      '.side': {
	        'top': '223px'
	      }
	    });

	    $('iframe').contents().find('style').append('\n      body::before {\n        height: 223px;\n      }\n\n      @media (min-width: 992px) {\n        #header-bottom-left {\n          left: unset;\n        }\n      }\n      @media (min-width: 1200px) {\n        #header-bottom-left {\n          top: 159px;\n        }\n      }\n      ');

	    // if pinned topics
	    if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
	      inlineStyler({
	        '.titlebox blockquote': {
	          'top': '239px'
	        }
	      });
	    }

	    // if sidebar image
	    if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
	      inlineStyler({
	        '.side': {
	          'top': 223 + sidebarImg.height + 16 + 'px'
	        }
	      });
	    }
	  }
	});

	// rotating header validation
	$('#rotating-header-checkbox:checkbox').change(function () {
	  var bezierEasing = [0.4, 0, 0.2, 1];
	  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
	    // show div
	    $('#rotating-header__div').show(200, $.bez(bezierEasing)).fadeIn(200, $.bez(bezierEasing)).slideDown(200, $.bez(bezierEasing));

	    // enable input field
	    $('#rotating-header__input').prop({
	      disabled: false,
	      required: true
	    });
	  } else {
	    // hide div
	    $('#rotating-header__div').hide(200, $.bez(bezierEasing)).fadeOut(200, $.bez(bezierEasing)).slideUp(200, $.bez(bezierEasing));

	    // disable input field
	    $('#rotating-header__input').prop({
	      disabled: true,
	      required: false
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
	    $('#compile-div').removeClass('disabled').attr('title', '').tooltip('destroy');
	  } else if (state === 'disable') {
	    $('#compile').addClass('disabled').prop('disabled', true);
	    $('#compile-div').addClass('disabled').attr('title', 'Please correct all errors!').tooltip();
	  }
	}

	// live preview
	var sidebarImg = {
	  height: 224,
	  URL: '',
	  reset: function reset() {
	    sidebarImg.height = 224;
	    sidebarImg.URL = 'https://b.thumbs.redditmedia.com/_hGE-XHXCAJOIsz4vtml2tiYvqyCc_R2K0oJgt1qeWI.png';
	  }
	};

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
	          'top': 297 + sidebarImg.height + 16 + 'px'
	        }
	      });
	    } else {
	      inlineStyler({
	        '.side': {
	          'top': 223 + sidebarImg.height + 16 + 'px'
	        }
	      });
	    }

	    $('iframe').contents().find('style').append('\n      .titlebox::before {\n        position: absolute;\n        top: ' + (-sidebarImg.height - 16) + 'px;\n        right: -330px;\n        display: block;\n        height: ' + sidebarImg.height + 'px;\n        width: 330px;\n        content: \'\';\n        border-radius: 2px;\n        background: url(' + sidebarImg.URL + ') center;\n        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),\n                    0px 2px 2px 0px rgba(0, 0, 0, 0.14),\n                    0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n      }\n\n      @media (max-resolution: 1dppx) and (min-width: 992px) {\n        .titlebox::before {\n          right: 0;\n        }\n      }\n      ');
	  } else {
	    // if large header
	    if ($('#large-header-checkbox:checkbox').prop('checked')) {
	      inlineStyler({
	        '.side': {
	          'top': '297px'
	        }
	      });
	    } else {
	      inlineStyler({
	        '.side': {
	          'top': '223px'
	        }
	      });
	    }

	    $('iframe').contents().find('style').append('\n      .titlebox::before {\n        display: none;\n      }\n\n      @media (max-resolution: 1dppx) and (min-width: 992px) {\n        .titlebox::before {\n          right: unset;\n        }\n      }\n      ');
	  }
	}

	// live preview
	var rotatingHeaders = {};

	function rotatingHeaderLivePreview(image) {
	  console.log(Object.keys(rotatingHeaders));
	  var values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {}
	  // inlineStyler({});


	  //
	  // if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
	  //   // if large header
	  //   if ($('#large-header-checkbox:checkbox').prop('checked')) {
	  //     inlineStyler({
	  //       '.side': {
	  //         'top': `${297 + sidebarImg.height + 16}px`,
	  //       },
	  //     });
	  //   } else {
	  //     inlineStyler({
	  //       '.side': {
	  //         'top': `${223 + sidebarImg.height + 16}px`,
	  //       },
	  //     });
	  //   }
	  //
	  //   $('iframe').contents().find('style').append(
	  //     `
	  //     .titlebox::before {
	  //       position: absolute;
	  //       top: ${-sidebarImg.height - 16}px;
	  //       right: -330px;
	  //       display: block;
	  //       height: ${sidebarImg.height}px;
	  //       width: 330px;
	  //       content: '';
	  //       border-radius: 2px;
	  //       background: url(${sidebarImg.URL}) center;
	  //       box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
	  //                   0px 2px 2px 0px rgba(0, 0, 0, 0.14),
	  //                   0px 1px 5px 0px rgba(0, 0, 0, 0.12);
	  //     }
	  //
	  //     @media (max-resolution: 1dppx) and (min-width: 992px) {
	  //       .titlebox::before {
	  //         right: 0;
	  //       }
	  //     }
	  //     `
	  //   );
	  // } else {
	  //   // if large header
	  //   if ($('#large-header-checkbox:checkbox').prop('checked')) {
	  //     inlineStyler({
	  //       '.side': {
	  //         'top': '297px',
	  //       },
	  //     });
	  //   } else {
	  //     inlineStyler({
	  //       '.side': {
	  //         'top': '223px',
	  //       },
	  //     });
	  //   }
	  //
	  //   $('iframe').contents().find('style').append(
	  //     `
	  //     .titlebox::before {
	  //       display: none;
	  //     }
	  //
	  //     @media (max-resolution: 1dppx) and (min-width: 992px) {
	  //       .titlebox::before {
	  //         right: unset;
	  //       }
	  //     }
	  //     `
	  //   );
	  // }
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
	  var image = new Image();
	  image.onload = function (file) {
	    if (callback) {
	      callback(image);
	    }
	  };

	  image.src = file.target.result;
	}

	function readImg(file, location, returnBase64) {
	  var reader = new FileReader();
	  reader.onload = function (event) {
	    checkDimensions(event, function (image) {
	      // resize image if not 330px wide
	      if (image.width !== 330) {
	        // create canvas element
	        $('.header').after('<canvas id="canvas" width="0" height="0"></canvas>');

	        var _$ = $('#canvas');

	        var _$2 = _slicedToArray(_$, 1);

	        var canvas = _$2[0];

	        var context = canvas.getContext('2d');
	        var scaleFactor = image.width / 330;

	        // resize canvas to exactly fit resized image
	        $('#canvas').prop({
	          'width': '330',
	          'height': '' + Math.round(image.height / scaleFactor)
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
	  };

	  reader.readAsDataURL(file);
	}

	function previewImg(input, location) {
	  var selector = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

	  // image type regex
	  var imageType = /^image\//;

	  function validationError(criterion) {
	    // determine selector for labels
	    var labelSelector = void 0;
	    if (dropzone.location === 'sidebar') {
	      labelSelector = 'a[href="#sidebar-img-panel"]';
	    } else if (dropzone.location === 'rotating-header') {
	      labelSelector = 'a[href="#rotating-header-panel"]';
	    }

	    // determine error message based on validation tests
	    var errorMessage = void 0;
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

	    // add warning label
	    $(labelSelector).prepend('<span class="label label-warning">Error</span>');

	    // change dropbox border color
	    $(selector).parent().css('border-color', '#f2dede');

	    // wipe thumbnail
	    $(selector).siblings('.thumb-container').empty();

	    // throw error
	    $(selector).siblings('.file-details').html('<p class="bg-danger">' + errorMessage + '</p>');
	  }

	  function validationSuccess(base64, filename, filesize) {
	    // enable compile button
	    compileButtonEnabler('enable');

	    // remove warning label
	    $(selector).parents('.panel-default').find('.label-warning').detach();

	    // reset dropbox border color
	    $(selector).parent().css('border-color', '#d9edf7');

	    // insert thumbnail
	    $(selector).siblings('.thumb-container').append('<img src="' + base64 + '" width="100" alt="Image preview...">');

	    // show file details
	    $(selector).siblings('.file-details').append('<p><strong>' + filename + '</strong> - ' + filesize + ' bytes</p>');
	  }

	  if (location === 'sidebar') {
	    (function () {
	      var _input$files = _slicedToArray(input.files, 1);

	      var file = _input$files[0];

	      if (selector === undefined) {
	        // click and upload
	        selector = input;
	      } else {
	        var _$3 = $('#sidebar-img-dropbox');
	        // drag and drop


	        var _$4 = _slicedToArray(_$3, 1);

	        selector = _$4[0];
	      }

	      // remove warning labels
	      $('a[href="#sidebar-img-panel"]').find('.label-warning').detach();

	      // wipe thumbnail and file details
	      $(selector).siblings('.thumb-container').empty();
	      $(selector).siblings('.file-details').empty();

	      if (file) {
	        (function () {
	          var filename = file.name;
	          var filesize = file.size;

	          // file type validation
	          if (imageType.test(file.type)) {
	            // read contents of uploaded file(s)
	            readImg(file, location, function (base64) {
	              // validate file size
	              if (file.size > 500000) {
	                // return error due to file size
	                validationError('size');
	              } else {
	                // live preview
	                sidebarImageLivePreview(base64);

	                validationSuccess(base64, filename, filesize);
	              }
	            });
	          } else {
	            validationError('type');
	          }
	        })();
	      }
	    })();
	  } else if (location == 'rotating-header') {
	    (function () {
	      var fileObj = input.files;

	      if (selector === undefined) {
	        // click and upload
	        selector = input;
	      } else {
	        var _$5 = $('#rotating-header-dropbox');
	        // drag and drop


	        var _$6 = _slicedToArray(_$5, 1);

	        selector = _$6[0];
	      }

	      // remove warning labels
	      $('a[href="#rotating-header-panel"]').find('.label-warning').detach();

	      // wipe thumbnail and file details
	      $(selector).siblings('.thumb-container').empty();
	      $(selector).siblings('.file-details').empty();

	      // flag for exiting for...in loop
	      var abort = false;

	      var loop = function loop(callback) {
	        // validate number of file uploads is greater than 1
	        if (fileObj.length > 1) {
	          var key;

	          (function () {
	            // will track number of header images uploaded
	            var counter = 1;

	            for (key in fileObj) {
	              if (abort) {
	                // exit loop
	                break;
	              } else if (fileObj.hasOwnProperty(key)) {
	                if (fileObj) {
	                  (function () {
	                    var filename = fileObj[key].name;
	                    var filesize = fileObj[key].size;

	                    // file type validation
	                    if (imageType.test(fileObj[key].type)) {
	                      // read contents of uploaded file(s)
	                      readImg(fileObj[key], location, function (base64) {
	                        // validate file size
	                        if (filesize > 500000) {
	                          // return error due to file size
	                          validationError('size');
	                        } else {
	                          // edit rotatingHeaders object
	                          rotatingHeaders['header' + counter] = {
	                            URL: base64
	                          };

	                          if (counter !== fileObj.length) {
	                            // increment counter
	                            counter++;
	                          }

	                          // console.log(`counter = ${counter}`);
	                          // console.log(`length = ${fileObj.length}`);

	                          console.log('aaa');
	                          // console.log(rotatingHeaders);

	                          // live preview
	                          // sidebarImageLivePreview(base64);
	                          // rotatingHeaderLivePreview(base64);

	                          if (!abort) {
	                            validationSuccess(base64, filename, filesize);
	                          }
	                        }
	                      });
	                    } else {
	                      validationError('type');

	                      // edit flag
	                      abort = true;
	                    }
	                  })();
	                }
	              }
	            }
	          })();
	        } else {
	          validationError('amount');

	          // edit flag
	          abort = true;
	        }

	        callback();
	      };

	      loop(function () {
	        console.log('ccc');
	        console.log(rotatingHeaders);
	      });

	      console.log('bbb');
	      console.log(rotatingHeaders);
	    })();
	  }
	}

	function createClickableDropbox(option, location) {
	  var _$$parents$find = $(option).parents('.addons__checkbox-container').find('.dropbox-container');

	  var _$$parents$find2 = _slicedToArray(_$$parents$find, 1);

	  var fileSelect = _$$parents$find2[0];

	  var _$$parents$find3 = $(option).parents('.addons__checkbox-container').find('.dropbox');

	  var _$$parents$find4 = _slicedToArray(_$$parents$find3, 1);

	  var fileElem = _$$parents$find4[0];

	  var _$$parents$find5 = $(option).parents('.addons__checkbox-container').find('.thumb-container');

	  var _$$parents$find6 = _slicedToArray(_$$parents$find5, 1);

	  var thumbnail = _$$parents$find6[0];

	  var _$$parents$find7 = $(option).parents('.addons__checkbox-container').find('.file-details');

	  var _$$parents$find8 = _slicedToArray(_$$parents$find7, 1);

	  var details = _$$parents$find8[0];

	  // sanitize dropbox content

	  $(thumbnail).empty();
	  $(details).empty();
	  $(fileSelect).css('border-color', '#d9edf7');

	  // dropbox drag and drop behavior
	  fileSelect.onclick = function (event) {
	    // sanitize input field value
	    $(fileElem).val('');

	    // activate manual file upload
	    fileElem.click();
	  };

	  // dropbox click behavior
	  $(fileElem).change(function (event) {
	    previewImg(event.currentTarget, location);
	  });
	}

	// full window drag and drop upload
	var dropzone = {
	  // flag for triggering dropbox hover css styles
	  counter: 0,
	  location: '',
	  dragenter: function dragenter(event) {
	    event.stopPropagation();
	    event.preventDefault();

	    // increment counter
	    dropzone.counter++;
	  },
	  dragover: function dragover(event) {
	    event.stopPropagation();
	    event.preventDefault();
	    if (!$('body').hasClass('droppable')) {
	      $('body').addClass('droppable');
	    }
	  },
	  drop: function drop(event) {
	    event.stopPropagation();
	    event.preventDefault();
	    var files = event.dataTransfer;

	    // add dropbox styles to body
	    if ($('body').hasClass('droppable')) {
	      $('body').removeClass('droppable');
	      dropzone.counter = 0;
	    }

	    previewImg(files, dropzone.location, event.currentTarget);
	  },
	  dragleave: function dragleave(event) {
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
	  }
	};

	// full window drag and drop event listener enabler/disabler
	function dragAndDrop(status) {
	  var _$7 = $('body');

	  var _$8 = _slicedToArray(_$7, 1);

	  var bopped = _$8[0];

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

	$('a[href="#rotating-header-panel"]').on('hide.bs.tab', function (e) {
	  // disable drag and drop listeners
	  dragAndDrop('disable');
	  console.log('rotating-header disable');
	});

	$('a[href="#rotating-header-panel"]').on('shown.bs.tab', function (e) {
	  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
	    // enable drag and drop listeners
	    dragAndDrop('enable');
	    console.log('rotating-header enable');
	    // set dropzone location
	    dropzone.location = 'rotating-header';
	  }
	});

	// sidebar image checkbox
	$('#rotating-header-checkbox:checkbox').change(function (event) {
	  var bezierEasing = [0.4, 0, 0.2, 1];

	  // set dropzone location
	  dropzone.location = 'rotating-header';

	  if ($('#rotating-header-checkbox:checkbox').prop('checked')) {
	    // reset sidebar image URL and dimensions
	    // sidebarImg.reset();

	    // create dropbox
	    createClickableDropbox(event.currentTarget, dropzone.location);

	    // enable drag and drop listeners
	    dragAndDrop('enable');

	    // show and enable dropbox container
	    $('#rotating-header-dropbox-container').show(200, $.bez(bezierEasing)).fadeIn(200, $.bez(bezierEasing)).slideDown(200, $.bez(bezierEasing)).prop('disabled', false).removeClass('disabled');
	  } else {
	    // enable compile button
	    compileButtonEnabler('enable');

	    // remove warning labels
	    $('#rotating-header-label').siblings('.label-warning').detach();

	    // disable drag and drop listeners
	    dragAndDrop('disable');

	    // hide and disable dropbox container
	    $('#rotating-header-dropbox-container').hide(200, $.bez(bezierEasing)).fadeOut(200, $.bez(bezierEasing)).slideUp(200, $.bez(bezierEasing)).prop('disabled', true).addClass('disabled');
	  }

	  // reset live preview values
	  // sidebarImageLivePreview();
	});

	$('a[href="#sidebar-img-panel"]').on('hide.bs.tab', function (e) {
	  // disable drag and drop listeners
	  dragAndDrop('disable');
	  console.log('sidebar disable');
	});

	$('a[href="#sidebar-img-panel"]').on('shown.bs.tab', function (e) {
	  if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
	    // enable drag and drop listeners
	    dragAndDrop('enable');
	    console.log('sidebar enable');
	    // set dropzone location
	    dropzone.location = 'sidebar';
	  }
	});

	// sidebar image checkbox
	$('#sidebar-img-checkbox:checkbox').change(function (event) {
	  var bezierEasing = [0.4, 0, 0.2, 1];

	  // set dropzone location
	  dropzone.location = 'sidebar';

	  if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
	    // reset sidebar image URL and dimensions
	    sidebarImg.reset();

	    // create dropbox
	    createClickableDropbox(event.currentTarget, dropzone.location);

	    // enable drag and drop listeners
	    dragAndDrop('enable');

	    // show and enable dropbox container
	    $('#sidebar-img-dropbox-container').show(200, $.bez(bezierEasing)).fadeIn(200, $.bez(bezierEasing)).slideDown(200, $.bez(bezierEasing)).prop('disabled', false).removeClass('disabled');
	  } else {
	    // enable compile button
	    compileButtonEnabler('enable');

	    // remove warning labels
	    $('#sidebar-img-label').siblings('.label-warning').detach();

	    // disable drag and drop listeners
	    dragAndDrop('disable');

	    // hide and disable dropbox container
	    $('#sidebar-img-dropbox-container').hide(200, $.bez(bezierEasing)).fadeOut(200, $.bez(bezierEasing)).slideUp(200, $.bez(bezierEasing)).prop('disabled', true).addClass('disabled');
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
	$('#pinned-topics-checkbox:checkbox').change(function () {
	  var bezierEasing = [0.4, 0, 0.2, 1];

	  if ($('#pinned-topics-checkbox:checkbox').prop('checked')) {
	    // show and enable dropbox container
	    $('#add-topic').show(200, $.bez(bezierEasing)).fadeIn(200, $.bez(bezierEasing)).slideDown(200, $.bez(bezierEasing)).prop('disabled', false);
	  } else {
	    // hide and disable dropbox container
	    $('#add-topic').hide(200, $.bez(bezierEasing)).fadeOut(200, $.bez(bezierEasing)).slideUp(200, $.bez(bezierEasing)).prop('disabled', true);
	  }
	});

	var pinnedTopics = {};

	$('#add-topic').click(function (event) {
	  $('#addon-expansion').append('\n    <div class="btn-group btn-group-justified" role="group" data-toggle="buttons">\n      <label class="btn btn-primary active">\n        <input type="radio" name="options" id="option1" autocomplete="off" checked> Radio 1\n      </label>\n      <label class="btn btn-primary">\n        <input type="radio" name="options" id="option2" autocomplete="off"> Radio 2\n      </label>\n      <label class="btn btn-primary">\n        <input type="radio" name="options" id="option3" autocomplete="off"> Radio 3\n      </label>\n      <label class="btn btn-primary">\n        <input type="radio" name="options" id="option4" autocomplete="off"> Radio 4\n      </label>\n    </div>\n    ');
	});

	$('iframe').load(function () {
	  // $('iframe').contents().find('body').css('background-color', 'purple');
	  // $('iframe').contents().find('style').append('body { background-color: purple; }');
	});

	// compile
	$('#compile').click(function () {
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
	  sass.readFile('flattish/utils/_vars.scss', function (content) {
	    if (content !== undefined) {
	      console.log('reading _vars.scss');

	      // replace Sass variables
	      // colors
	      content = replacer(content, 'color', Object.keys(_colorlist.colors));

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
	        content = replacer(content, 'bool', sidebarImg.height + 'px', 'sidebarImgHeight');
	      } else {
	        console.log('not checked');
	        content = replacer(content, 'bool', false, 'sidebarImg');
	      }

	      // register file to be available for @import
	      sass.writeFile('flattish/utils/_vars.scss', content, function (success) {
	        if (success) {
	          console.log('_vars.scss successfully written');
	        } else {
	          console.log('writeFile failed');
	        }

	        // compile main Sass file
	        sass.compileFile('flattish/flattish.scss', function (result) {
	          // enable inputs after compilation
	          $('input').removeClass('disabled').prop('disabled', false);
	          $('.dropbox-container').removeClass('disabled');
	          $('.dropbox').prop('disabled', false);

	          // remove inline styles
	          for (var i = 0; i < inlineStyleSelectors.length; i++) {
	            $('iframe').contents().find(inlineStyleSelectors[i] + '[style]').removeAttr('style');
	          }

	          console.log('compiled');
	          console.log(result);

	          // insert code into <pre>
	          $('#target').html(result.text.trim());
	          $('#clipboard-input').val(result.text.trim());

	          var finalPreview = result.text.trim();

	          finalPreview = finalPreview.replace(/%%dropdown%%/g, '"https://b.thumbs.redditmedia.com/n8Tjs0Bql4bCTP1yXHT6uyQ2FiNxqvyiqX0dmgEvGtU.png"').replace(/%%dropdown-night%%/g, '"https://a.thumbs.redditmedia.com/2OhDOWNjWv07gPH_SInBCkIGV-Vvh79bOivLCefF-Y0.png"').replace(/%%header%%/g, '"https://b.thumbs.redditmedia.com/fRsvIUIv8r1kjAnVvvPnYkxDLjzLMaNx3qDq8lVW-_c.png"').replace(/%%spritesheet%%/g, '"https://b.thumbs.redditmedia.com/WwVfPsjJK8fP59rNqswJrUJTWvS9kCK83eSjybERWMw.png"').replace(/%%save%%/g, '"https://b.thumbs.redditmedia.com/BSYuVoMV0MOiH4OA6vtW8VqLePOAqwnC69QrPmjRHgk.png"').replace(/%%hide%%/g, '"https://b.thumbs.redditmedia.com/KIFC2QeI3sY7e9pL4_MqCgo5n9x5QwVmgcovfNm8RJc.png"').replace(/%%sidebar%%/g, sidebarImg.URL);
	          $('iframe').contents().find('style').html('html,body{overflow-y:hidden;}' + finalPreview);

	          // save image button
	          if ($('#sidebar-img-checkbox:checkbox').prop('checked')) {
	            if (sidebarImg.URL.search(/data:image\/png;base64,/) !== -1) {
	              $('#compile-div').append('<a id="save-images" class="btn btn-default" href="' + sidebarImg.URL + '" download="sidebar.png">Save images</a>');
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var colorList = exports.colorList = {
	  'red': {
	    '50': '#ffebee',
	    '100': '#ffcdd2',
	    '200': '#ef9a9a',
	    '300': '#e57373',
	    '400': '#ef5350',
	    '500': '#f44336',
	    '600': '#e53935',
	    '700': '#d32f2f',
	    '800': '#c62828',
	    '900': '#b71c1c',
	    'A100': '#ff8a80',
	    'A200': '#ff5252',
	    'A400': '#ff1744',
	    'A700': '#d50000'
	  },
	  'pink': {
	    '50': '#fce4ec',
	    '100': '#f8bbd0',
	    '200': '#f48fb1',
	    '300': '#f06292',
	    '400': '#ec407a',
	    '500': '#e91e63',
	    '600': '#d81b60',
	    '700': '#c2185b',
	    '800': '#ad1457',
	    '900': '#880e4f',
	    'A100': '#ff80ab',
	    'A200': '#ff4081',
	    'A400': '#f50057',
	    'A700': '#c51162'
	  },
	  'purple': {
	    '50': '#f3e5f5',
	    '100': '#e1bee7',
	    '200': '#ce93d8',
	    '300': '#ba68c8',
	    '400': '#ab47bc',
	    '500': '#9c27b0',
	    '600': '#8e24aa',
	    '700': '#7b1fa2',
	    '800': '#6a1b9a',
	    '900': '#4a148c',
	    'A100': '#ea80fc',
	    'A200': '#e040fb',
	    'A400': '#d500f9',
	    'A700': '#aa00ff'
	  },
	  'deepPurple': {
	    '50': '#ede7f6',
	    '100': '#d1c4e9',
	    '200': '#b39ddb',
	    '300': '#9575cd',
	    '400': '#7e57c2',
	    '500': '#673ab7',
	    '600': '#5e35b1',
	    '700': '#512da8',
	    '800': '#4527a0',
	    '900': '#311b92',
	    'A100': '#b388ff',
	    'A200': '#7c4dff',
	    'A400': '#651fff',
	    'A700': '#6200ea'
	  },
	  'indigo': {
	    '50': '#e8eaf6',
	    '100': '#c5cae9',
	    '200': '#9fa8da',
	    '300': '#7986cb',
	    '400': '#5c6bc0',
	    '500': '#3f51b5',
	    '600': '#3949ab',
	    '700': '#303f9f',
	    '800': '#283593',
	    '900': '#1a237e',
	    'A100': '#8c9eff',
	    'A200': '#536dfe',
	    'A400': '#3d5afe',
	    'A700': '#304ffe'
	  },
	  'blue': {
	    '50': '#e3f2fd',
	    '100': '#bbdefb',
	    '200': '#90caf9',
	    '300': '#64b5f6',
	    '400': '#42a5f5',
	    '500': '#2196f3',
	    '600': '#1e88e5',
	    '700': '#1976d2',
	    '800': '#1565c0',
	    '900': '#0d47a1',
	    'A100': '#82b1ff',
	    'A200': '#448aff',
	    'A400': '#2979ff',
	    'A700': '#2962ff'
	  },
	  'lightBlue': {
	    '50': '#e1f5fe',
	    '100': '#b3e5fc',
	    '200': '#81d4fa',
	    '300': '#4fc3f7',
	    '400': '#29b6f6',
	    '500': '#03a9f4',
	    '600': '#039be5',
	    '700': '#0288d1',
	    '800': '#0277bd',
	    '900': '#01579b',
	    'A100': '#80d8ff',
	    'A200': '#40c4ff',
	    'A400': '#00b0ff',
	    'A700': '#0091ea'
	  },
	  'cyan': {
	    '50': '#e0f7fa',
	    '100': '#b2ebf2',
	    '200': '#80deea',
	    '300': '#4dd0e1',
	    '400': '#26c6da',
	    '500': '#00bcd4',
	    '600': '#00acc1',
	    '700': '#0097a7',
	    '800': '#00838f',
	    '900': '#006064',
	    'A100': '#84ffff',
	    'A200': '#18ffff',
	    'A400': '#00e5ff',
	    'A700': '#00b8d4'
	  },
	  'teal': {
	    '50': '#e0f2f1',
	    '100': '#b2dfdb',
	    '200': '#80cbc4',
	    '300': '#4db6ac',
	    '400': '#26a69a',
	    '500': '#009688',
	    '600': '#00897b',
	    '700': '#00796b',
	    '800': '#00695c',
	    '900': '#004d40',
	    'A100': '#a7ffeb',
	    'A200': '#64ffda',
	    'A400': '#1de9b6',
	    'A700': '#00bfa5'
	  },
	  'green': {
	    '50': '#e8f5e9',
	    '100': '#c8e6c9',
	    '200': '#a5d6a7',
	    '300': '#81c784',
	    '400': '#66bb6a',
	    '500': '#4caf50',
	    '600': '#43a047',
	    '700': '#388e3c',
	    '800': '#2e7d32',
	    '900': '#1b5e20',
	    'A100': '#b9f6ca',
	    'A200': '#69f0ae',
	    'A400': '#00e676',
	    'A700': '#00c853'
	  },
	  'lightGreen': {
	    '50': '#f1f8e9',
	    '100': '#dcedc8',
	    '200': '#c5e1a5',
	    '300': '#aed581',
	    '400': '#9ccc65',
	    '500': '#8bc34a',
	    '600': '#7cb342',
	    '700': '#689f38',
	    '800': '#558b2f',
	    '900': '#33691e',
	    'A100': '#ccff90',
	    'A200': '#b2ff59',
	    'A400': '#76ff03',
	    'A700': '#64dd17'
	  },
	  'lime': {
	    '50': '#f9fbe7',
	    '100': '#f0f4c3',
	    '200': '#e6ee9c',
	    '300': '#dce775',
	    '400': '#d4e157',
	    '500': '#cddc39',
	    '600': '#c0ca33',
	    '700': '#afb42b',
	    '800': '#9e9d24',
	    '900': '#827717',
	    'A100': '#f4ff81',
	    'A200': '#eeff41',
	    'A400': '#c6ff00',
	    'A700': '#aeea00'
	  },
	  'yellow': {
	    '50': '#fffde7',
	    '100': '#fff9c4',
	    '200': '#fff59d',
	    '300': '#fff176',
	    '400': '#ffee58',
	    '500': '#ffeb3b',
	    '600': '#fdd835',
	    '700': '#fbc02d',
	    '800': '#f9a825',
	    '900': '#f57f17',
	    'A100': '#ffff8d',
	    'A200': '#ffff00',
	    'A400': '#ffea00',
	    'A700': '#ffd600'
	  },
	  'amber': {
	    '50': '#fff8e1',
	    '100': '#ffecb3',
	    '200': '#ffe082',
	    '300': '#ffd54f',
	    '400': '#ffca28',
	    '500': '#ffc107',
	    '600': '#ffb300',
	    '700': '#ffa000',
	    '800': '#ff8f00',
	    '900': '#ff6f00',
	    'A100': '#ffe57f',
	    'A200': '#ffd740',
	    'A400': '#ffc400',
	    'A700': '#ffab00'
	  },
	  'orange': {
	    '50': '#fff3e0',
	    '100': '#ffe0b2',
	    '200': '#ffcc80',
	    '300': '#ffb74d',
	    '400': '#ffa726',
	    '500': '#ff9800',
	    '600': '#fb8c00',
	    '700': '#f57c00',
	    '800': '#ef6c00',
	    '900': '#e65100',
	    'A100': '#ffd180',
	    'A200': '#ffab40',
	    'A400': '#ff9100',
	    'A700': '#ff6d00'
	  },
	  'deepOrange': {
	    '50': '#fbe9e7',
	    '100': '#ffccbc',
	    '200': '#ffab91',
	    '300': '#ff8a65',
	    '400': '#ff7043',
	    '500': '#ff5722',
	    '600': '#f4511e',
	    '700': '#e64a19',
	    '800': '#d84315',
	    '900': '#bf360c',
	    'A100': '#ff9e80',
	    'A200': '#ff6e40',
	    'A400': '#ff3d00',
	    'A700': '#dd2c00'
	  },
	  'brown': {
	    '50': '#efebe9',
	    '100': '#d7ccc8',
	    '200': '#bcaaa4',
	    '300': '#a1887f',
	    '400': '#8d6e63',
	    '500': '#795548',
	    '600': '#6d4c41',
	    '700': '#5d4037',
	    '800': '#4e342e',
	    '900': '#3e2723'
	  },
	  'grey': {
	    '50': '#fafafa',
	    '100': '#f5f5f5',
	    '200': '#eeeeee',
	    '300': '#e0e0e0',
	    '400': '#bdbdbd',
	    '500': '#9e9e9e',
	    '600': '#757575',
	    '700': '#616161',
	    '800': '#424242',
	    '900': '#212121'
	  },
	  'blueGrey': {
	    '50': '#eceff1',
	    '100': '#cfd8dc',
	    '200': '#b0bec5',
	    '300': '#90a4ae',
	    '400': '#78909c',
	    '500': '#607d8b',
	    '600': '#546e7a',
	    '700': '#455a64',
	    '800': '#37474f',
	    '900': '#263238',
	    '1000': '#11171a'
	  }
	};

	// colors
	var colors = exports.colors = {
	  primary: {
	    color: 'cyan',
	    colorCode: '500'
	  },
	  darkPrimary: {
	    color: 'cyan',
	    colorCode: '700'
	  },
	  lightPrimary: {
	    color: 'cyan',
	    colorCode: '300'
	  },
	  accent: {
	    color: 'orange',
	    colorCode: 'A200'
	  },
	  darkAccent: {
	    color: 'orange',
	    colorCode: 'A400'
	  },
	  lightAccent: {
	    color: 'orange',
	    colorCode: 'A100'
	  },
	  linkColor: {
	    color: 'blue',
	    colorCode: '500'
	  },
	  linkColorHover: {
	    color: 'blue',
	    colorCode: '300'
	  },
	  linkColorActive: {
	    color: 'blue',
	    colorCode: '700'
	  },
	  linkColorVisited: {
	    color: 'deepPurple',
	    colorCode: '300'
	  },
	  linkColorNight: {
	    color: 'blue',
	    colorCode: '500'
	  },
	  linkColorHoverNight: {
	    color: 'blue',
	    colorCode: '300'
	  },
	  linkColorActiveNight: {
	    color: 'blue',
	    colorCode: '700'
	  },
	  linkColorVisitedNight: {
	    color: 'deepPurple',
	    colorCode: '300'
	  },
	  upvote: {
	    color: 'deepOrange',
	    colorCode: '500'
	  },
	  downvote: {
	    color: 'indigo',
	    colorCode: '500'
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.palettes = undefined;
	exports.paletteArrayCreator = paletteArrayCreator;
	exports.paletteConstructorArray = paletteConstructorArray;
	exports.createSpectrum = createSpectrum;

	var _colorlist = __webpack_require__(1);

	/**
	 * generate color palette arrays
	 * output is based on color codes
	 *
	 * e.g. colors['primary'].palette = [
	 *   ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4',],
	 *   ['#00bcd4','#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107',],
	 *   ['#ff9800','#ff5722','#795548','#9e9e9e','#607d8b','#fff', '#000'],
	 * ];
	 */
	function paletteArrayCreator(newPalette, colorCode) {
	  /**
	   * create base palette array
	   * basePalette = [
	   *   ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue',],
	   *   ['cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber',],
	   *   ['orange', 'deepOrange', 'brown', 'grey', 'blueGrey',],
	   * ];
	   */
	  var basePalette = [];
	  var tempArray = [];

	  // get color names from colorList
	  for (var i = 0; i < Object.keys(_colorlist.colorList).length; i++) {

	    // push every 7 values or until array ends
	    if (i % 7 === 6 || i === Object.keys(_colorlist.colorList).length - 1) {
	      tempArray.push(Object.keys(_colorlist.colorList)[i]);
	      basePalette.push(tempArray);
	      tempArray = [];
	    } else {
	      tempArray.push(Object.keys(_colorlist.colorList)[i]);
	    }
	  }

	  // push the 3 arrays that form a palette into new array
	  basePalette.forEach(function (element, index, array) {
	    return newPalette[index] = array[index].slice();
	  });

	  // get HEX codes from nested array elements
	  newPalette.forEach(function (element, index, array) {
	    newPalette[index].forEach(function (element, i, array) {
	      return newPalette[index][i] = _colorlist.colorList[element][colorCode];
	    });
	  });

	  // add white and black HEX codes
	  newPalette[newPalette.length - 1].push('#fff', '#000');
	}

	for (var key in _colorlist.colors) {
	  if (_colorlist.colors.hasOwnProperty(key)) {
	    // initialize object property
	    _colorlist.colors[key].palette = [];

	    // create HEX code arrays
	    paletteArrayCreator(_colorlist.colors[key].palette, _colorlist.colors[key].colorCode);
	  }
	}

	/**
	 * spectrum color pickers
	 * initialize all new palettes
	 */
	function paletteConstructorArray(keyArray) {

	  // palette constructor
	  function Palette(key) {
	    this.id = '#' + key + 'ColorPicker';
	    this.swatch = _colorlist.colorList[_colorlist.colors[key].color][_colorlist.colors[key].colorCode];
	    this.value = key;
	    this.colorPalette = _colorlist.colors[key].palette;

	    if (key.indexOf('Night') !== -1) {
	      this.replacerClassName = 'nightmode';
	    } else {
	      this.replacerClassName = '';
	    }
	  }

	  var newArray = [];
	  keyArray.forEach(function (element, index, array) {
	    return newArray.push(new Palette(array[index]));
	  });
	  return newArray;
	}

	/**
	 * construct Palette objects from color[key]'s
	 * palettes =  [Palette, Palette, Palette, Palette];
	 */
	var palettes = exports.palettes = paletteConstructorArray(Object.keys(_colorlist.colors));

	// generate color swatches based on palettes
	function createSpectrum(id, swatch) {
	  var palette = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	  var replacerClassName = arguments[3];
	  var value = arguments[4];

	  $(id).spectrum({
	    color: swatch,
	    palette: palette,
	    replacerClassName: replacerClassName,
	    theme: 'sp-light',
	    showInput: true,
	    showInitial: true,
	    showPalette: true,
	    preferredFormat: 'hex3',
	    containerClassName: id.slice(1) + 'Container'
	  });

	  // show input text box
	  $(id).show();

	  $(id).change(function () {
	    // set spectrum value equal to input field value
	    $(id).spectrum('set', $(id).val());

	    // change live preview iframe
	    var newColor = $(id).val();
	    function hexToRgb(hex) {
	      /**
	       * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	       */

	      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
	        return r + r + g + g + b + b;
	      });

	      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	      return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	      } : null;
	    }

	    if (id === '#primaryColorPicker') {
	      $('iframe').contents().find('style').append('\n        .submit-link .morelink a,\n        .submit-text .morelink a,\n        .submit-page button[type="submit"],\n        #sr-form .save-button button,\n        .save-button>button:nth-child(1) {\n          background: ' + newColor + ' radial-gradient(circle,rgba(77,208,225,0.3) 15%,transparent 30%) no-repeat 50% 50%/0!important;\n        }\n        .login-form-side input[type="checkbox"]:checked+label::before,\n        .c-checkbox input[type="checkbox"]:checked+label::before,\n        .flairtoggle input[type="checkbox"]:checked+label::before,\n        .linefield input[type="checkbox"]:checked+label::before,\n        .roundfield-content input[type="checkbox"]:checked+label::before {\n          border-color: ' + newColor + '!important;\n          background: ' + newColor + ' url(\'../../../img/sprites/spritesheet.png\') -246px -138px;\n        }\n        .toggleButton.enabled {\n          background-color: ' + newColor + ';\n        }\n        #wikiactions a,\n        #moderation_tools a,\n        .footer a,\n        .bottommenu a {\n          background: linear-gradient(to top,' + newColor + ' 50%,transparent 50%);\n          background-size: 100% 200%;\n          background-repeat: no-repeat;\n        }\n        ');
	    } else if (id === '#darkPrimaryColorPicker') {
	      $('iframe').contents().find('style').append('\n        .submit-link .morelink a:hover, .submit-text .morelink a:hover,\n        .submit-page button[type="submit"]:hover, #sr-form .save-button button:hover, .save-button > button:nth-child(1):hover,\n        .toggleButton.enabled::before {\n          background-color: ' + newColor + ' !important;\n        }\n        ');
	    } else if (id === '#lightPrimaryColorPicker') {
	      var rVal = hexToRgb(newColor).r;
	      var gVal = hexToRgb(newColor).g;
	      var bVal = hexToRgb(newColor).b;
	      $('iframe').contents().find('style').text($('iframe').contents().find('style').text().replace(/rgba\(77,208,225,0\.3\)/g, 'rgba(' + rVal + ',' + gVal + ',' + bVal + ',0.3)'));
	    } else if (id === '#accentColorPicker') {
	      $('iframe').contents().find('style').append('\n        .tabmenu li a:hover::after,\n        .tabmenu li #viewImagesButton:hover::after,\n        ul.tabmenu.formtab li a:hover::after {\n          border-bottom: 2px solid ' + newColor + ';\n        }\n        .tabmenu li.selected a,\n        ul.tabmenu.formtab li.selected a {\n          border-bottom-color: ' + newColor + ';\n        }\n        input[type="text"]:focus,\n        input[type="password"]:focus,\n        input[type="url"]:focus,\n        textarea:focus {\n          border-bottom-color: ' + newColor + ' !important;\n        }\n        #sr-more-link {\n          background-color: ' + newColor + ' !important;\n        }\n        #search:hover::before {\n          color: ' + newColor + ';\n        }\n        #search input[type="text"]:focus {\n          border-bottom: 1px solid' + newColor + ';\n        }\n        label + #moresearchinfo {\n          border-color: ' + newColor + ';\n        }\n        ');
	    } else if (id === '#darkAccentColorPicker') {} else if (id === '#lightAccentColorPicker') {
	      var _rVal = hexToRgb(newColor).r;
	      var _gVal = hexToRgb(newColor).g;
	      var _bVal = hexToRgb(newColor).b;
	      $('iframe').contents().find('style').append('\n        #header-bottom-left .tabmenu li a,\n        #header-bottom-left .tabmenu li #viewImagesButton {\n          background: transparent radial-gradient(circle, rgba(' + _rVal + ', ' + _gVal + ', ' + _bVal + ', 0.3) 15%, transparent 30%) no-repeat 50% 50%/0 !important;\n        }\n        ');
	    } else if (id === '#linkColorColorPicker') {
	      $('iframe').contents().find('style').append('\n        body a,\n        #siteTable > .thing .title {\n          color: ' + newColor + ';\n        }\n        ');
	    } else if (id === '#linkColorHoverColorPicker') {
	      $('iframe').contents().find('style').append('\n        body a:hover,\n        #siteTable > .thing .title:hover {\n          color: ' + newColor + ';\n        }\n        ');
	    } else if (id === '#linkColorActiveColorPicker') {
	      $('iframe').contents().find('style').append('\n        body a:active,\n        #siteTable > .thing .title:active {\n          color: ' + newColor + ';\n        }\n        ');
	    } else if (id === '#linkColorVisitedColorPicker') {
	      $('iframe').contents().find('style').append('\n        body a:visited,\n        #siteTable > .thing .title:visited {\n          color: ' + newColor + ';\n        }\n        ');
	    } else if (id === '#linkColorNightColorPicker') {} else if (id === '#linkColorHoverNightColorPicker') {} else if (id === '#linkColorActiveNightColorPicker') {} else if (id === '#linkColorVisitedNightColorPicker') {} else if (id === '#upvoteColorPicker') {
	      $('iframe').contents().find('style').append('\n        .sidecontentbox .gadget .thing span.score.likes,\n        #siteTable .score.likes,\n        .thing .link .score.likes {\n          color: ' + newColor + ';\n        }\n        .arrow.upmod::before,\n        .arrow.upmod:hover::before,\n        .arrow.upmod:focus::after,\n        .arrow.up:focus::after {\n          background-color: ' + newColor + ';\n        }\n        ');
	    } else if (id === '#downvoteColorPicker') {
	      $('iframe').contents().find('style').append('\n        .sidecontentbox .gadget .thing span.score.dislikes,\n        #siteTable .score.dislikes,\n        .thing .link .score.dislikes,\n        .sidecontentbox .gadget .thing span.score.dislikes {\n          color: ' + newColor + ';\n        }\n        .arrow.downmod::before,\n        .arrow.downmod:hover::before,\n        .arrow.downmod:focus::after,\n        .arrow.down:focus::after {\n          background-color: ' + newColor + ';\n        }\n        ');
	    }

	    // after error handling, set variable to final spectrum value
	    _colorlist.colors[value] = $('.' + id.slice(1) + 'Container input').val();
	    console.log(value + ' = ' + _colorlist.colors[value]);
	  });
	}

	// generate swatches for each palette
	palettes.forEach(function (element, index, array) {
	  return createSpectrum(array[index].id, array[index].swatch, array[index].colorPalette, array[index].replacerClassName, array[index].value);
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	(function (Sass) {
	  'use strict';

	  // make sure the namespace is available

	  !Sass.maps && (Sass.maps = {});

	  // files map for bourbon v4.2.1 - http://bourbon.io/
	  Sass.maps.bourbon = {
	    // make the source file available in "../../vendors/bourbon"
	    // directory: 'bourbon',
	    directory: '../../vendors/bourbon',
	    // using rawgit to directly access the github repository via CORS
	    // NOTE: that this will only work for preloading, as lazyloading throws security exceptions
	    base: 'https://cdn.rawgit.com/thoughtbot/bourbon/v4.2.1/app/assets/stylesheets/',
	    files: ['_bourbon.scss', '_bourbon-deprecated-upcoming.scss', 'addons/_border-color.scss', 'addons/_border-radius.scss', 'addons/_border-style.scss', 'addons/_border-width.scss', 'addons/_buttons.scss', 'addons/_clearfix.scss', 'addons/_ellipsis.scss', 'addons/_font-stacks.scss', 'addons/_hide-text.scss', 'addons/_margin.scss', 'addons/_padding.scss', 'addons/_position.scss', 'addons/_prefixer.scss', 'addons/_retina-image.scss', 'addons/_size.scss', 'addons/_text-inputs.scss', 'addons/_timing-functions.scss', 'addons/_triangle.scss', 'addons/_word-wrap.scss', 'css3/_animation.scss', 'css3/_appearance.scss', 'css3/_backface-visibility.scss', 'css3/_background-image.scss', 'css3/_background.scss', 'css3/_border-image.scss', 'css3/_calc.scss', 'css3/_columns.scss', 'css3/_filter.scss', 'css3/_flex-box.scss', 'css3/_font-face.scss', 'css3/_font-feature-settings.scss', 'css3/_hidpi-media-query.scss', 'css3/_hyphens.scss', 'css3/_image-rendering.scss', 'css3/_keyframes.scss', 'css3/_linear-gradient.scss', 'css3/_perspective.scss', 'css3/_placeholder.scss', 'css3/_radial-gradient.scss', 'css3/_selection.scss', 'css3/_text-decoration.scss', 'css3/_transform.scss', 'css3/_transition.scss', 'css3/_user-select.scss', 'functions/_assign-inputs.scss', 'functions/_contains-falsy.scss', 'functions/_contains.scss', 'functions/_is-length.scss', 'functions/_is-light.scss', 'functions/_is-number.scss', 'functions/_is-size.scss', 'functions/_modular-scale.scss', 'functions/_px-to-em.scss', 'functions/_px-to-rem.scss', 'functions/_shade.scss', 'functions/_strip-units.scss', 'functions/_tint.scss', 'functions/_transition-property-name.scss', 'functions/_unpack.scss', 'helpers/_convert-units.scss', 'helpers/_directional-values.scss', 'helpers/_font-source-declaration.scss', 'helpers/_gradient-positions-parser.scss', 'helpers/_linear-angle-parser.scss', 'helpers/_linear-gradient-parser.scss', 'helpers/_linear-positions-parser.scss', 'helpers/_linear-side-corner-parser.scss', 'helpers/_radial-arg-parser.scss', 'helpers/_radial-gradient-parser.scss', 'helpers/_radial-positions-parser.scss', 'helpers/_render-gradients.scss', 'helpers/_shape-size-stripper.scss', 'helpers/_str-to-num.scss', 'settings/_asset-pipeline.scss', 'settings/_prefixer.scss', 'settings/_px-to-em.scss']
	  };
	})(Sass);

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	(function (Sass) {
	  'use strict';

	  // make sure the namespace is available

	  !Sass.maps && (Sass.maps = {});

	  // files map for flattish v0.1 - https://emyarod.github.io/flattish
	  Sass.maps.flattish = {
	    // make the source file available in "flattish/flattish.scss"
	    directory: 'flattish',
	    // https://github.com/thoughtbot/bourbon/blob/v4.2.1/app/assets/stylesheets/
	    // using rawgit to directly access the github repository via CORS
	    // NOTE: that this will only work for preloading, as lazyloading throws security exceptions
	    base: '../../style',
	    files: ['utils/_color-list.scss', 'utils/_vars.scss', 'utils/_mixins.scss', 'utils/_functions.scss', 'utils/_addons.scss', 'components/_buttons.scss', 'components/_cards.scss', 'components/_dropdowns.scss', 'components/_expandos.scss', 'components/_menus.scss', 'components/_res.scss', 'components/_ripple.scss', 'components/_spritesheet.scss', 'components/_tables.scss', 'components/_tabs.scss', 'components/_text-fields.scss', 'components/_thumbnails.scss', 'components/_toggles.scss', 'components/_tooltips.scss', 'components/_typography.scss', 'components/_vote-arrows.scss', 'modules/content/_sitetable.scss', 'modules/_content.scss', 'modules/header/_header-bottom-left.scss', 'modules/header/_header-bottom-right.scss', 'modules/header/_sr-bar.scss', 'modules/_header.scss', 'modules/sidebar/_login.scss', 'modules/sidebar/_search.scss', 'modules/sidebar/_sidecontentbox.scss', 'modules/sidebar/_submit.scss', 'modules/sidebar/_titlebox.scss', 'modules/_sidebar.scss', 'modules/_footer.scss', 'modules/_base.scss', 'pages/_comments-page.scss', 'pages/_compose-page.scss', 'pages/_flair-page.scss', 'pages/_search-page.scss', 'pages/_settings-page.scss', 'pages/_stylesheet-page.scss', 'pages/_submit-page.scss', 'pages/_top-page.scss', 'pages/_wiki-page.scss', 'flattish.scss']
	  };
	})(Sass);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// Spectrum Colorpicker v1.8.0
	// https://github.com/bgrins/spectrum
	// Author: Brian Grinstead
	// License: MIT

	(function (factory) {
	    "use strict";

	    if (true) {
	        // AMD
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == "object" && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == "object") {
	        // CommonJS
	        module.exports = factory(require('jquery'));
	    } else {
	        // Browser
	        factory(jQuery);
	    }
	})(function ($, undefined) {
	    "use strict";

	    var defaultOpts = {

	        // Callbacks
	        beforeShow: noop,
	        move: noop,
	        change: noop,
	        show: noop,
	        hide: noop,

	        // Options
	        color: false,
	        flat: false,
	        showInput: false,
	        allowEmpty: false,
	        showButtons: true,
	        clickoutFiresChange: true,
	        showInitial: false,
	        showPalette: false,
	        showPaletteOnly: false,
	        hideAfterPaletteSelect: false,
	        togglePaletteOnly: false,
	        showSelectionPalette: true,
	        localStorageKey: false,
	        appendTo: "body",
	        maxSelectionSize: 7,
	        cancelText: "cancel",
	        chooseText: "ok",
	        togglePaletteMoreText: "more",
	        togglePaletteLessText: "less",
	        clearText: "Clear Color Selection",
	        noColorSelectedText: "No Color Selected",
	        preferredFormat: false,
	        className: "", // Deprecated - use containerClassName and replacerClassName instead.
	        containerClassName: "",
	        replacerClassName: "",
	        showAlpha: false,
	        theme: "sp-light",
	        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
	        selectionPalette: [],
	        disabled: false,
	        offset: null
	    },
	        spectrums = [],
	        IE = !!/msie/i.exec(window.navigator.userAgent),
	        rgbaSupport = function () {
	        function contains(str, substr) {
	            return !! ~('' + str).indexOf(substr);
	        }

	        var elem = document.createElement('div');
	        var style = elem.style;
	        style.cssText = 'background-color:rgba(0,0,0,.5)';
	        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
	    }(),
	        replaceInput = ["<div class='sp-replacer'>", "<div class='sp-preview'><div class='sp-preview-inner'></div></div>", "</div>"].join(''),
	        markup = function () {

	        // IE does not support gradients with multiple stops, so we need to simulate
	        //  that for the rainbow slider with 8 divs that each have a single gradient
	        var gradientFix = "";
	        if (IE) {
	            for (var i = 1; i <= 6; i++) {
	                gradientFix += "<div class='sp-" + i + "'></div>";
	            }
	        }

	        return ["<div class='sp-container sp-hidden'>", "<div class='sp-palette-container'>", "<div class='sp-palette sp-thumb sp-cf'></div>", "<div class='sp-palette-button-container sp-cf'>", "<button type='button' class='sp-palette-toggle'></button>", "</div>", "</div>", "<div class='sp-picker-container'>", "<div class='sp-top sp-cf'>", "<div class='sp-fill'></div>", "<div class='sp-top-inner'>", "<div class='sp-color'>", "<div class='sp-sat'>", "<div class='sp-val'>", "<div class='sp-dragger'></div>", "</div>", "</div>", "</div>", "<div class='sp-clear sp-clear-display'>", "</div>", "<div class='sp-hue'>", "<div class='sp-slider'></div>", gradientFix, "</div>", "</div>", "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>", "</div>", "<div class='sp-input-container sp-cf'>", "<input class='sp-input form-control' type='text' spellcheck='false'  />", "</div>", "<div class='sp-initial sp-thumb sp-cf'></div>", "<div class='sp-button-container sp-cf'>", "<a class='sp-cancel' href='#'></a>", "<button type='button' class='sp-choose'></button>", "</div>", "</div>", "</div>"].join("");
	    }();

	    function paletteTemplate(p, color, className, opts) {
	        var html = [];
	        for (var i = 0; i < p.length; i++) {
	            var current = p[i];
	            if (current) {
	                var tiny = tinycolor(current);
	                var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
	                c += tinycolor.equals(color, current) ? " sp-thumb-active" : "";
	                var formattedString = tiny.toString(opts.preferredFormat || "rgb");
	                var swatchStyle = rgbaSupport ? "background-color:" + tiny.toRgbString() : "filter:" + tiny.toFilter();
	                html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
	            } else {
	                var cls = 'sp-clear-display';
	                html.push($('<div />').append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>').attr('title', opts.noColorSelectedText)).html());
	            }
	        }
	        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
	    }

	    function hideAll() {
	        for (var i = 0; i < spectrums.length; i++) {
	            if (spectrums[i]) {
	                spectrums[i].hide();
	            }
	        }
	    }

	    function instanceOptions(o, callbackContext) {
	        var opts = $.extend({}, defaultOpts, o);
	        opts.callbacks = {
	            'move': bind(opts.move, callbackContext),
	            'change': bind(opts.change, callbackContext),
	            'show': bind(opts.show, callbackContext),
	            'hide': bind(opts.hide, callbackContext),
	            'beforeShow': bind(opts.beforeShow, callbackContext)
	        };

	        return opts;
	    }

	    function spectrum(element, o) {

	        var opts = instanceOptions(o, element),
	            flat = opts.flat,
	            showSelectionPalette = opts.showSelectionPalette,
	            localStorageKey = opts.localStorageKey,
	            theme = opts.theme,
	            callbacks = opts.callbacks,
	            resize = throttle(reflow, 10),
	            visible = false,
	            isDragging = false,
	            dragWidth = 0,
	            dragHeight = 0,
	            dragHelperHeight = 0,
	            slideHeight = 0,
	            slideWidth = 0,
	            alphaWidth = 0,
	            alphaSlideHelperWidth = 0,
	            slideHelperHeight = 0,
	            currentHue = 0,
	            currentSaturation = 0,
	            currentValue = 0,
	            currentAlpha = 1,
	            palette = [],
	            paletteArray = [],
	            paletteLookup = {},
	            selectionPalette = opts.selectionPalette.slice(0),
	            maxSelectionSize = opts.maxSelectionSize,
	            draggingClass = "sp-dragging",
	            shiftMovementDirection = null;

	        var doc = element.ownerDocument,
	            body = doc.body,
	            boundElement = $(element),
	            disabled = false,
	            container = $(markup, doc).addClass(theme),
	            pickerContainer = container.find(".sp-picker-container"),
	            dragger = container.find(".sp-color"),
	            dragHelper = container.find(".sp-dragger"),
	            slider = container.find(".sp-hue"),
	            slideHelper = container.find(".sp-slider"),
	            alphaSliderInner = container.find(".sp-alpha-inner"),
	            alphaSlider = container.find(".sp-alpha"),
	            alphaSlideHelper = container.find(".sp-alpha-handle"),
	            textInput = container.find(".sp-input"),
	            paletteContainer = container.find(".sp-palette"),
	            initialColorContainer = container.find(".sp-initial"),
	            cancelButton = container.find(".sp-cancel"),
	            clearButton = container.find(".sp-clear"),
	            chooseButton = container.find(".sp-choose"),
	            toggleButton = container.find(".sp-palette-toggle"),
	            isInput = boundElement.is("input"),
	            isInputTypeColor = isInput && boundElement.attr("type") === "color" && inputTypeColorSupport(),
	            shouldReplace = isInput && !flat,
	            replacer = shouldReplace ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]),
	            offsetElement = shouldReplace ? replacer : boundElement,
	            previewElement = replacer.find(".sp-preview-inner"),
	            initialColor = opts.color || isInput && boundElement.val(),
	            colorOnShow = false,
	            currentPreferredFormat = opts.preferredFormat,
	            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
	            isEmpty = !initialColor,
	            allowEmpty = opts.allowEmpty && !isInputTypeColor;

	        function applyOptions() {

	            if (opts.showPaletteOnly) {
	                opts.showPalette = true;
	            }

	            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);

	            if (opts.palette) {
	                palette = opts.palette.slice(0);
	                paletteArray = $.isArray(palette[0]) ? palette : [palette];
	                paletteLookup = {};
	                for (var i = 0; i < paletteArray.length; i++) {
	                    for (var j = 0; j < paletteArray[i].length; j++) {
	                        var rgb = tinycolor(paletteArray[i][j]).toRgbString();
	                        paletteLookup[rgb] = true;
	                    }
	                }
	            }

	            container.toggleClass("sp-flat", flat);
	            container.toggleClass("sp-input-disabled", !opts.showInput);
	            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
	            container.toggleClass("sp-clear-enabled", allowEmpty);
	            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
	            container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
	            container.toggleClass("sp-palette-disabled", !opts.showPalette);
	            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
	            container.toggleClass("sp-initial-disabled", !opts.showInitial);
	            container.addClass(opts.className).addClass(opts.containerClassName);

	            reflow();
	        }

	        function initialize() {

	            if (IE) {
	                container.find("*:not(input)").attr("unselectable", "on");
	            }

	            applyOptions();

	            if (shouldReplace) {
	                boundElement.after(replacer).hide();
	            }

	            if (!allowEmpty) {
	                clearButton.hide();
	            }

	            if (flat) {
	                boundElement.after(container).hide();
	            } else {

	                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
	                if (appendTo.length !== 1) {
	                    appendTo = $("body");
	                }

	                appendTo.append(container);
	            }

	            updateSelectionPaletteFromStorage();

	            offsetElement.on("click.spectrum touchstart.spectrum", function (e) {
	                if (!disabled) {
	                    toggle();
	                }

	                e.stopPropagation();

	                if (!$(e.target).is("input")) {
	                    e.preventDefault();
	                }
	            });

	            if (boundElement.is(":disabled") || opts.disabled === true) {
	                disable();
	            }

	            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
	            container.click(stopPropagation);

	            // Handle user typed input
	            textInput.change(setFromTextInput);
	            textInput.on("paste", function () {
	                setTimeout(setFromTextInput, 1);
	            });
	            textInput.keydown(function (e) {
	                if (e.keyCode == 13) {
	                    setFromTextInput();
	                }
	            });

	            cancelButton.text(opts.cancelText);
	            cancelButton.on("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	                revert();
	                hide();
	            });

	            clearButton.attr("title", opts.clearText);
	            clearButton.on("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	                isEmpty = true;
	                move();

	                if (flat) {
	                    //for the flat style, this is a change event
	                    updateOriginalInput(true);
	                }
	            });

	            chooseButton.text(opts.chooseText);
	            chooseButton.on("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();

	                if (IE && textInput.is(":focus")) {
	                    textInput.trigger('change');
	                }

	                if (isValid()) {
	                    updateOriginalInput(true);
	                    hide();
	                }
	            });

	            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
	            toggleButton.on("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();

	                opts.showPaletteOnly = !opts.showPaletteOnly;

	                // To make sure the Picker area is drawn on the right, next to the
	                // Palette area (and not below the palette), first move the Palette
	                // to the left to make space for the picker, plus 5px extra.
	                // The 'applyOptions' function puts the whole container back into place
	                // and takes care of the button-text and the sp-palette-only CSS class.
	                if (!opts.showPaletteOnly && !flat) {
	                    container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
	                }
	                applyOptions();
	            });

	            draggable(alphaSlider, function (dragX, dragY, e) {
	                currentAlpha = dragX / alphaWidth;
	                isEmpty = false;
	                if (e.shiftKey) {
	                    currentAlpha = Math.round(currentAlpha * 10) / 10;
	                }

	                move();
	            }, dragStart, dragStop);

	            draggable(slider, function (dragX, dragY) {
	                currentHue = parseFloat(dragY / slideHeight);
	                isEmpty = false;
	                if (!opts.showAlpha) {
	                    currentAlpha = 1;
	                }
	                move();
	            }, dragStart, dragStop);

	            draggable(dragger, function (dragX, dragY, e) {

	                // shift+drag should snap the movement to either the x or y axis.
	                if (!e.shiftKey) {
	                    shiftMovementDirection = null;
	                } else if (!shiftMovementDirection) {
	                    var oldDragX = currentSaturation * dragWidth;
	                    var oldDragY = dragHeight - currentValue * dragHeight;
	                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

	                    shiftMovementDirection = furtherFromX ? "x" : "y";
	                }

	                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
	                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

	                if (setSaturation) {
	                    currentSaturation = parseFloat(dragX / dragWidth);
	                }
	                if (setValue) {
	                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
	                }

	                isEmpty = false;
	                if (!opts.showAlpha) {
	                    currentAlpha = 1;
	                }

	                move();
	            }, dragStart, dragStop);

	            if (!!initialColor) {
	                _set(initialColor);

	                // In case color was black - update the preview UI and set the format
	                // since the set function will not run (default color is black).
	                updateUI();
	                currentPreferredFormat = opts.preferredFormat || tinycolor(initialColor).format;

	                addColorToSelectionPalette(initialColor);
	            } else {
	                updateUI();
	            }

	            if (flat) {
	                show();
	            }

	            function paletteElementClick(e) {
	                if (e.data && e.data.ignore) {
	                    _set($(e.target).closest(".sp-thumb-el").data("color"));
	                    move();
	                } else {
	                    _set($(e.target).closest(".sp-thumb-el").data("color"));
	                    move();

	                    // If the picker is going to close immediately, a palette selection
	                    // is a change.  Otherwise, it's a move only.
	                    if (opts.hideAfterPaletteSelect) {
	                        updateOriginalInput(true);
	                        hide();
	                    } else {
	                        updateOriginalInput();
	                    }
	                }

	                return false;
	            }

	            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
	            paletteContainer.on(paletteEvent, ".sp-thumb-el", paletteElementClick);
	            initialColorContainer.on(paletteEvent, ".sp-thumb-el:nth-child(1)", { ignore: true }, paletteElementClick);
	        }

	        function updateSelectionPaletteFromStorage() {

	            if (localStorageKey && window.localStorage) {

	                // Migrate old palettes over to new format.  May want to remove this eventually.
	                try {
	                    var oldPalette = window.localStorage[localStorageKey].split(",#");
	                    if (oldPalette.length > 1) {
	                        delete window.localStorage[localStorageKey];
	                        $.each(oldPalette, function (i, c) {
	                            addColorToSelectionPalette(c);
	                        });
	                    }
	                } catch (e) {}

	                try {
	                    selectionPalette = window.localStorage[localStorageKey].split(";");
	                } catch (e) {}
	            }
	        }

	        function addColorToSelectionPalette(color) {
	            if (showSelectionPalette) {
	                var rgb = tinycolor(color).toRgbString();
	                if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
	                    selectionPalette.push(rgb);
	                    while (selectionPalette.length > maxSelectionSize) {
	                        selectionPalette.shift();
	                    }
	                }

	                if (localStorageKey && window.localStorage) {
	                    try {
	                        window.localStorage[localStorageKey] = selectionPalette.join(";");
	                    } catch (e) {}
	                }
	            }
	        }

	        function getUniqueSelectionPalette() {
	            var unique = [];
	            if (opts.showPalette) {
	                for (var i = 0; i < selectionPalette.length; i++) {
	                    var rgb = tinycolor(selectionPalette[i]).toRgbString();

	                    if (!paletteLookup[rgb]) {
	                        unique.push(selectionPalette[i]);
	                    }
	                }
	            }

	            return unique.reverse().slice(0, opts.maxSelectionSize);
	        }

	        function drawPalette() {

	            var currentColor = get();

	            var html = $.map(paletteArray, function (palette, i) {
	                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
	            });

	            updateSelectionPaletteFromStorage();

	            if (selectionPalette) {
	                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
	            }

	            paletteContainer.html(html.join(""));
	        }

	        function drawInitial() {
	            if (opts.showInitial) {
	                var initial = colorOnShow;
	                var current = get();
	                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
	            }
	        }

	        function dragStart() {
	            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
	                reflow();
	            }
	            isDragging = true;
	            container.addClass(draggingClass);
	            shiftMovementDirection = null;
	            boundElement.trigger('dragstart.spectrum', [get()]);
	        }

	        function dragStop() {
	            isDragging = false;
	            container.removeClass(draggingClass);
	            boundElement.trigger('dragstop.spectrum', [get()]);
	        }

	        function setFromTextInput() {

	            var value = textInput.val();

	            if ((value === null || value === "") && allowEmpty) {
	                _set(null);
	                move();
	                updateOriginalInput();
	            } else {
	                var tiny = tinycolor(value);
	                if (tiny.isValid()) {
	                    _set(tiny);
	                    move();
	                    updateOriginalInput();
	                } else {
	                    textInput.addClass("sp-validation-error");
	                }
	            }
	        }

	        function toggle() {
	            if (visible) {
	                hide();
	            } else {
	                show();
	            }
	        }

	        function show() {
	            var event = $.Event('beforeShow.spectrum');

	            if (visible) {
	                reflow();
	                return;
	            }

	            boundElement.trigger(event, [get()]);

	            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
	                return;
	            }

	            hideAll();
	            visible = true;

	            $(doc).on("keydown.spectrum", onkeydown);
	            $(doc).on("click.spectrum", clickout);
	            $(window).on("resize.spectrum", resize);
	            replacer.addClass("sp-active");
	            container.removeClass("sp-hidden");

	            reflow();
	            updateUI();

	            colorOnShow = get();

	            drawInitial();
	            callbacks.show(colorOnShow);
	            boundElement.trigger('show.spectrum', [colorOnShow]);
	        }

	        function onkeydown(e) {
	            // Close on ESC
	            if (e.keyCode === 27) {
	                hide();
	            }
	        }

	        function clickout(e) {
	            // Return on right click.
	            if (e.button == 2) {
	                return;
	            }

	            // If a drag event was happening during the mouseup, don't hide
	            // on click.
	            if (isDragging) {
	                return;
	            }

	            if (clickoutFiresChange) {
	                updateOriginalInput(true);
	            } else {
	                revert();
	            }
	            hide();
	        }

	        function hide() {
	            // Return if hiding is unnecessary
	            if (!visible || flat) {
	                return;
	            }
	            visible = false;

	            $(doc).off("keydown.spectrum", onkeydown);
	            $(doc).off("click.spectrum", clickout);
	            $(window).off("resize.spectrum", resize);

	            replacer.removeClass("sp-active");
	            container.addClass("sp-hidden");

	            callbacks.hide(get());
	            boundElement.trigger('hide.spectrum', [get()]);
	        }

	        function revert() {
	            _set(colorOnShow, true);
	            updateOriginalInput(true);
	        }

	        function _set(color, ignoreFormatChange) {
	            if (tinycolor.equals(color, get())) {
	                // Update UI just in case a validation error needs
	                // to be cleared.
	                updateUI();
	                return;
	            }

	            var newColor, newHsv;
	            if (!color && allowEmpty) {
	                isEmpty = true;
	            } else {
	                isEmpty = false;
	                newColor = tinycolor(color);
	                newHsv = newColor.toHsv();

	                currentHue = newHsv.h % 360 / 360;
	                currentSaturation = newHsv.s;
	                currentValue = newHsv.v;
	                currentAlpha = newHsv.a;
	            }
	            updateUI();

	            if (newColor && newColor.isValid() && !ignoreFormatChange) {
	                currentPreferredFormat = opts.preferredFormat || newColor.getFormat();
	            }
	        }

	        function get(opts) {
	            opts = opts || {};

	            if (allowEmpty && isEmpty) {
	                return null;
	            }

	            return tinycolor.fromRatio({
	                h: currentHue,
	                s: currentSaturation,
	                v: currentValue,
	                a: Math.round(currentAlpha * 1000) / 1000
	            }, { format: opts.format || currentPreferredFormat });
	        }

	        function isValid() {
	            return !textInput.hasClass("sp-validation-error");
	        }

	        function move() {
	            updateUI();

	            callbacks.move(get());
	            boundElement.trigger('move.spectrum', [get()]);
	        }

	        function updateUI() {

	            textInput.removeClass("sp-validation-error");

	            updateHelperLocations();

	            // Update dragger background color (gradients take care of saturation and value).
	            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
	            dragger.css("background-color", flatColor.toHexString());

	            // Get a format that alpha will be included in (hex and names ignore alpha)
	            var format = currentPreferredFormat;
	            if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
	                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
	                    format = "rgb";
	                }
	            }

	            var realColor = get({ format: format }),
	                displayColor = '';

	            //reset background info for preview element
	            previewElement.removeClass("sp-clear-display");
	            previewElement.css('background-color', 'transparent');

	            if (!realColor && allowEmpty) {
	                // Update the replaced elements background with icon indicating no color selection
	                previewElement.addClass("sp-clear-display");
	            } else {
	                var realHex = realColor.toHexString(),
	                    realRgb = realColor.toRgbString();

	                // Update the replaced elements background color (with actual selected color)
	                if (rgbaSupport || realColor.alpha === 1) {
	                    previewElement.css("background-color", realRgb);
	                } else {
	                    previewElement.css("background-color", "transparent");
	                    previewElement.css("filter", realColor.toFilter());
	                }

	                if (opts.showAlpha) {
	                    var rgb = realColor.toRgb();
	                    rgb.a = 0;
	                    var realAlpha = tinycolor(rgb).toRgbString();
	                    var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

	                    if (IE) {
	                        alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
	                    } else {
	                        alphaSliderInner.css("background", "-webkit-" + gradient);
	                        alphaSliderInner.css("background", "-moz-" + gradient);
	                        alphaSliderInner.css("background", "-ms-" + gradient);
	                        // Use current syntax gradient on unprefixed property.
	                        alphaSliderInner.css("background", "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
	                    }
	                }

	                displayColor = realColor.toString(format);
	            }

	            // Update the text entry input as it changes happen
	            if (opts.showInput) {
	                textInput.val(displayColor);
	            }

	            if (opts.showPalette) {
	                drawPalette();
	            }

	            drawInitial();
	        }

	        function updateHelperLocations() {
	            var s = currentSaturation;
	            var v = currentValue;

	            if (allowEmpty && isEmpty) {
	                //if selected color is empty, hide the helpers
	                alphaSlideHelper.hide();
	                slideHelper.hide();
	                dragHelper.hide();
	            } else {
	                //make sure helpers are visible
	                alphaSlideHelper.show();
	                slideHelper.show();
	                dragHelper.show();

	                // Where to show the little circle in that displays your current selected color
	                var dragX = s * dragWidth;
	                var dragY = dragHeight - v * dragHeight;
	                dragX = Math.max(-dragHelperHeight, Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight));
	                dragY = Math.max(-dragHelperHeight, Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight));
	                dragHelper.css({
	                    "top": dragY + "px",
	                    "left": dragX + "px"
	                });

	                var alphaX = currentAlpha * alphaWidth;
	                alphaSlideHelper.css({
	                    "left": alphaX - alphaSlideHelperWidth / 2 + "px"
	                });

	                // Where to show the bar that displays your current selected hue
	                var slideY = currentHue * slideHeight;
	                slideHelper.css({
	                    "top": slideY - slideHelperHeight + "px"
	                });
	            }
	        }

	        function updateOriginalInput(fireCallback) {
	            var color = get(),
	                displayColor = '',
	                hasChanged = !tinycolor.equals(color, colorOnShow);

	            if (color) {
	                displayColor = color.toString(currentPreferredFormat);
	                // Update the selection palette with the current color
	                addColorToSelectionPalette(color);
	            }

	            if (isInput) {
	                boundElement.val(displayColor);
	            }

	            if (fireCallback && hasChanged) {
	                callbacks.change(color);
	                boundElement.trigger('change', [color]);
	            }
	        }

	        function reflow() {
	            if (!visible) {
	                return; // Calculations would be useless and wouldn't be reliable anyways
	            }
	            dragWidth = dragger.width();
	            dragHeight = dragger.height();
	            dragHelperHeight = dragHelper.height();
	            slideWidth = slider.width();
	            slideHeight = slider.height();
	            slideHelperHeight = slideHelper.height();
	            alphaWidth = alphaSlider.width();
	            alphaSlideHelperWidth = alphaSlideHelper.width();

	            if (!flat) {
	                container.css("position", "absolute");
	                if (opts.offset) {
	                    container.offset(opts.offset);
	                } else {
	                    container.offset(getOffset(container, offsetElement));
	                }
	            }

	            updateHelperLocations();

	            if (opts.showPalette) {
	                drawPalette();
	            }

	            boundElement.trigger('reflow.spectrum');
	        }

	        function destroy() {
	            boundElement.show();
	            offsetElement.off("click.spectrum touchstart.spectrum");
	            container.remove();
	            replacer.remove();
	            spectrums[spect.id] = null;
	        }

	        function option(optionName, optionValue) {
	            if (optionName === undefined) {
	                return $.extend({}, opts);
	            }
	            if (optionValue === undefined) {
	                return opts[optionName];
	            }

	            opts[optionName] = optionValue;

	            if (optionName === "preferredFormat") {
	                currentPreferredFormat = opts.preferredFormat;
	            }
	            applyOptions();
	        }

	        function enable() {
	            disabled = false;
	            boundElement.attr("disabled", false);
	            offsetElement.removeClass("sp-disabled");
	        }

	        function disable() {
	            hide();
	            disabled = true;
	            boundElement.attr("disabled", true);
	            offsetElement.addClass("sp-disabled");
	        }

	        function setOffset(coord) {
	            opts.offset = coord;
	            reflow();
	        }

	        initialize();

	        var spect = {
	            show: show,
	            hide: hide,
	            toggle: toggle,
	            reflow: reflow,
	            option: option,
	            enable: enable,
	            disable: disable,
	            offset: setOffset,
	            set: function set(c) {
	                _set(c);
	                updateOriginalInput();
	            },
	            get: get,
	            destroy: destroy,
	            container: container
	        };

	        spect.id = spectrums.push(spect) - 1;

	        return spect;
	    }

	    /**
	    * checkOffset - get the offset below/above and left/right element depending on screen position
	    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
	    */
	    function getOffset(picker, input) {
	        var extraY = 0;
	        var dpWidth = picker.outerWidth();
	        var dpHeight = picker.outerHeight();
	        var inputHeight = input.outerHeight();
	        var doc = picker[0].ownerDocument;
	        var docElem = doc.documentElement;
	        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
	        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
	        var offset = input.offset();
	        var offsetLeft = offset.left;
	        var offsetTop = offset.top;

	        offsetTop += inputHeight;

	        offsetLeft -= Math.min(offsetLeft, offsetLeft + dpWidth > viewWidth && viewWidth > dpWidth ? Math.abs(offsetLeft + dpWidth - viewWidth) : 0);

	        offsetTop -= Math.min(offsetTop, offsetTop + dpHeight > viewHeight && viewHeight > dpHeight ? Math.abs(dpHeight + inputHeight - extraY) : extraY);

	        return {
	            top: offsetTop,
	            bottom: offset.bottom,
	            left: offsetLeft,
	            right: offset.right,
	            width: offset.width,
	            height: offset.height
	        };
	    }

	    /**
	    * noop - do nothing
	    */
	    function noop() {}

	    /**
	    * stopPropagation - makes the code only doing this a little easier to read in line
	    */
	    function stopPropagation(e) {
	        e.stopPropagation();
	    }

	    /**
	    * Create a function bound to a given object
	    * Thanks to underscore.js
	    */
	    function bind(func, obj) {
	        var slice = Array.prototype.slice;
	        var args = slice.call(arguments, 2);
	        return function () {
	            return func.apply(obj, args.concat(slice.call(arguments)));
	        };
	    }

	    /**
	    * Lightweight drag helper.  Handles containment within the element, so that
	    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
	    */
	    function draggable(element, onmove, onstart, onstop) {
	        onmove = onmove || function () {};
	        onstart = onstart || function () {};
	        onstop = onstop || function () {};
	        var doc = document;
	        var dragging = false;
	        var offset = {};
	        var maxHeight = 0;
	        var maxWidth = 0;
	        var hasTouch = 'ontouchstart' in window;

	        var duringDragEvents = {};
	        duringDragEvents["selectstart"] = prevent;
	        duringDragEvents["dragstart"] = prevent;
	        duringDragEvents["touchmove mousemove"] = move;
	        duringDragEvents["touchend mouseup"] = stop;

	        function prevent(e) {
	            if (e.stopPropagation) {
	                e.stopPropagation();
	            }
	            if (e.preventDefault) {
	                e.preventDefault();
	            }
	            e.returnValue = false;
	        }

	        function move(e) {
	            if (dragging) {
	                // Mouseup happened outside of window
	                if (IE && doc.documentMode < 9 && !e.button) {
	                    return stop();
	                }

	                var t0 = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
	                var pageX = t0 && t0.pageX || e.pageX;
	                var pageY = t0 && t0.pageY || e.pageY;

	                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
	                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

	                if (hasTouch) {
	                    // Stop scrolling in iOS
	                    prevent(e);
	                }

	                onmove.apply(element, [dragX, dragY, e]);
	            }
	        }

	        function start(e) {
	            var rightclick = e.which ? e.which == 3 : e.button == 2;

	            if (!rightclick && !dragging) {
	                if (onstart.apply(element, arguments) !== false) {
	                    dragging = true;
	                    maxHeight = $(element).height();
	                    maxWidth = $(element).width();
	                    offset = $(element).offset();

	                    $(doc).on(duringDragEvents);
	                    $(doc.body).addClass("sp-dragging");

	                    move(e);

	                    prevent(e);
	                }
	            }
	        }

	        function stop() {
	            if (dragging) {
	                $(doc).off(duringDragEvents);
	                $(doc.body).removeClass("sp-dragging");

	                // Wait a tick before notifying observers to allow the click event
	                // to fire in Chrome.
	                setTimeout(function () {
	                    onstop.apply(element, arguments);
	                }, 0);
	            }
	            dragging = false;
	        }

	        $(element).on("touchstart mousedown", start);
	    }

	    function throttle(func, wait, debounce) {
	        var timeout;
	        return function () {
	            var context = this,
	                args = arguments;
	            var throttler = function throttler() {
	                timeout = null;
	                func.apply(context, args);
	            };
	            if (debounce) clearTimeout(timeout);
	            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
	        };
	    }

	    function inputTypeColorSupport() {
	        return $.fn.spectrum.inputTypeColorSupport();
	    }

	    /**
	    * Define a jQuery plugin
	    */
	    var dataID = "spectrum.id";
	    $.fn.spectrum = function (opts, extra) {

	        if (typeof opts == "string") {

	            var returnValue = this;
	            var args = Array.prototype.slice.call(arguments, 1);

	            this.each(function () {
	                var spect = spectrums[$(this).data(dataID)];
	                if (spect) {
	                    var method = spect[opts];
	                    if (!method) {
	                        throw new Error("Spectrum: no such method: '" + opts + "'");
	                    }

	                    if (opts == "get") {
	                        returnValue = spect.get();
	                    } else if (opts == "container") {
	                        returnValue = spect.container;
	                    } else if (opts == "option") {
	                        returnValue = spect.option.apply(spect, args);
	                    } else if (opts == "destroy") {
	                        spect.destroy();
	                        $(this).removeData(dataID);
	                    } else {
	                        method.apply(spect, args);
	                    }
	                }
	            });

	            return returnValue;
	        }

	        // Initializing a new instance of spectrum
	        return this.spectrum("destroy").each(function () {
	            var options = $.extend({}, $(this).data(), opts);
	            var spect = spectrum(this, options);
	            $(this).data(dataID, spect.id);
	        });
	    };

	    $.fn.spectrum.load = true;
	    $.fn.spectrum.loadOpts = {};
	    $.fn.spectrum.draggable = draggable;
	    $.fn.spectrum.defaults = defaultOpts;
	    $.fn.spectrum.inputTypeColorSupport = function inputTypeColorSupport() {
	        if (typeof inputTypeColorSupport._cachedResult === "undefined") {
	            var colorInput = $("<input type='color'/>")[0]; // if color element is supported, value will default to not null
	            inputTypeColorSupport._cachedResult = colorInput.type === "color" && colorInput.value !== "";
	        }
	        return inputTypeColorSupport._cachedResult;
	    };

	    $.spectrum = {};
	    $.spectrum.localization = {};
	    $.spectrum.palettes = {};

	    $.fn.spectrum.processNativeColorInputs = function () {
	        var colorInputs = $("input[type=color]");
	        if (colorInputs.length && !inputTypeColorSupport()) {
	            colorInputs.spectrum({
	                preferredFormat: "hex6"
	            });
	        }
	    };

	    // TinyColor v1.1.2
	    // https://github.com/bgrins/TinyColor
	    // Brian Grinstead, MIT License

	    (function () {

	        var trimLeft = /^[\s,#]+/,
	            trimRight = /\s+$/,
	            tinyCounter = 0,
	            math = Math,
	            mathRound = math.round,
	            mathMin = math.min,
	            mathMax = math.max,
	            mathRandom = math.random;

	        var tinycolor = function tinycolor(color, opts) {

	            color = color ? color : '';
	            opts = opts || {};

	            // If input is already a tinycolor, return itself
	            if (color instanceof tinycolor) {
	                return color;
	            }
	            // If we are called as a function, call using new instead
	            if (!(this instanceof tinycolor)) {
	                return new tinycolor(color, opts);
	            }

	            var rgb = inputToRGB(color);
	            this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = mathRound(1000 * this._a) / 1000, this._format = opts.format || rgb.format;
	            this._gradientType = opts.gradientType;

	            // Don't let the range of [0,255] come back in [0,1].
	            // Potentially lose a little bit of precision here, but will fix issues where
	            // .5 gets interpreted as half of the total, instead of half of 1
	            // If it was supposed to be 128, this was already taken care of by `inputToRgb`
	            if (this._r < 1) {
	                this._r = mathRound(this._r);
	            }
	            if (this._g < 1) {
	                this._g = mathRound(this._g);
	            }
	            if (this._b < 1) {
	                this._b = mathRound(this._b);
	            }

	            this._ok = rgb.ok;
	            this._tc_id = tinyCounter++;
	        };

	        tinycolor.prototype = {
	            isDark: function isDark() {
	                return this.getBrightness() < 128;
	            },
	            isLight: function isLight() {
	                return !this.isDark();
	            },
	            isValid: function isValid() {
	                return this._ok;
	            },
	            getOriginalInput: function getOriginalInput() {
	                return this._originalInput;
	            },
	            getFormat: function getFormat() {
	                return this._format;
	            },
	            getAlpha: function getAlpha() {
	                return this._a;
	            },
	            getBrightness: function getBrightness() {
	                var rgb = this.toRgb();
	                return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	            },
	            setAlpha: function setAlpha(value) {
	                this._a = boundAlpha(value);
	                this._roundA = mathRound(1000 * this._a) / 1000;
	                return this;
	            },
	            toHsv: function toHsv() {
	                var hsv = rgbToHsv(this._r, this._g, this._b);
	                return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
	            },
	            toHsvString: function toHsvString() {
	                var hsv = rgbToHsv(this._r, this._g, this._b);
	                var h = mathRound(hsv.h * 360),
	                    s = mathRound(hsv.s * 100),
	                    v = mathRound(hsv.v * 100);
	                return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
	            },
	            toHsl: function toHsl() {
	                var hsl = rgbToHsl(this._r, this._g, this._b);
	                return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
	            },
	            toHslString: function toHslString() {
	                var hsl = rgbToHsl(this._r, this._g, this._b);
	                var h = mathRound(hsl.h * 360),
	                    s = mathRound(hsl.s * 100),
	                    l = mathRound(hsl.l * 100);
	                return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
	            },
	            toHex: function toHex(allow3Char) {
	                return rgbToHex(this._r, this._g, this._b, allow3Char);
	            },
	            toHexString: function toHexString(allow3Char) {
	                return '#' + this.toHex(allow3Char);
	            },
	            toHex8: function toHex8() {
	                return rgbaToHex(this._r, this._g, this._b, this._a);
	            },
	            toHex8String: function toHex8String() {
	                return '#' + this.toHex8();
	            },
	            toRgb: function toRgb() {
	                return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
	            },
	            toRgbString: function toRgbString() {
	                return this._a == 1 ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
	            },
	            toPercentageRgb: function toPercentageRgb() {
	                return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
	            },
	            toPercentageRgbString: function toPercentageRgbString() {
	                return this._a == 1 ? "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" : "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
	            },
	            toName: function toName() {
	                if (this._a === 0) {
	                    return "transparent";
	                }

	                if (this._a < 1) {
	                    return false;
	                }

	                return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
	            },
	            toFilter: function toFilter(secondColor) {
	                var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
	                var secondHex8String = hex8String;
	                var gradientType = this._gradientType ? "GradientType = 1, " : "";

	                if (secondColor) {
	                    var s = tinycolor(secondColor);
	                    secondHex8String = s.toHex8String();
	                }

	                return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
	            },
	            toString: function toString(format) {
	                var formatSet = !!format;
	                format = format || this._format;

	                var formattedString = false;
	                var hasAlpha = this._a < 1 && this._a >= 0;
	                var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

	                if (needsAlphaFormat) {
	                    // Special case for "transparent", all other non-alpha formats
	                    // will return rgba when there is transparency.
	                    if (format === "name" && this._a === 0) {
	                        return this.toName();
	                    }
	                    return this.toRgbString();
	                }
	                if (format === "rgb") {
	                    formattedString = this.toRgbString();
	                }
	                if (format === "prgb") {
	                    formattedString = this.toPercentageRgbString();
	                }
	                if (format === "hex" || format === "hex6") {
	                    formattedString = this.toHexString();
	                }
	                if (format === "hex3") {
	                    formattedString = this.toHexString(true);
	                }
	                if (format === "hex8") {
	                    formattedString = this.toHex8String();
	                }
	                if (format === "name") {
	                    formattedString = this.toName();
	                }
	                if (format === "hsl") {
	                    formattedString = this.toHslString();
	                }
	                if (format === "hsv") {
	                    formattedString = this.toHsvString();
	                }

	                return formattedString || this.toHexString();
	            },

	            _applyModification: function _applyModification(fn, args) {
	                var color = fn.apply(null, [this].concat([].slice.call(args)));
	                this._r = color._r;
	                this._g = color._g;
	                this._b = color._b;
	                this.setAlpha(color._a);
	                return this;
	            },
	            lighten: function lighten() {
	                return this._applyModification(_lighten, arguments);
	            },
	            brighten: function brighten() {
	                return this._applyModification(_brighten, arguments);
	            },
	            darken: function darken() {
	                return this._applyModification(_darken, arguments);
	            },
	            desaturate: function desaturate() {
	                return this._applyModification(_desaturate, arguments);
	            },
	            saturate: function saturate() {
	                return this._applyModification(_saturate, arguments);
	            },
	            greyscale: function greyscale() {
	                return this._applyModification(_greyscale, arguments);
	            },
	            spin: function spin() {
	                return this._applyModification(_spin, arguments);
	            },

	            _applyCombination: function _applyCombination(fn, args) {
	                return fn.apply(null, [this].concat([].slice.call(args)));
	            },
	            analogous: function analogous() {
	                return this._applyCombination(_analogous, arguments);
	            },
	            complement: function complement() {
	                return this._applyCombination(_complement, arguments);
	            },
	            monochromatic: function monochromatic() {
	                return this._applyCombination(_monochromatic, arguments);
	            },
	            splitcomplement: function splitcomplement() {
	                return this._applyCombination(_splitcomplement, arguments);
	            },
	            triad: function triad() {
	                return this._applyCombination(_triad, arguments);
	            },
	            tetrad: function tetrad() {
	                return this._applyCombination(_tetrad, arguments);
	            }
	        };

	        // If input is an object, force 1 into "1.0" to handle ratios properly
	        // String input requires "1.0" as input, so 1 will be treated as 1
	        tinycolor.fromRatio = function (color, opts) {
	            if ((typeof color === 'undefined' ? 'undefined' : _typeof(color)) == "object") {
	                var newColor = {};
	                for (var i in color) {
	                    if (color.hasOwnProperty(i)) {
	                        if (i === "a") {
	                            newColor[i] = color[i];
	                        } else {
	                            newColor[i] = convertToPercentage(color[i]);
	                        }
	                    }
	                }
	                color = newColor;
	            }

	            return tinycolor(color, opts);
	        };

	        // Given a string or object, convert that input to RGB
	        // Possible string inputs:
	        //
	        //     "red"
	        //     "#f00" or "f00"
	        //     "#ff0000" or "ff0000"
	        //     "#ff000000" or "ff000000"
	        //     "rgb 255 0 0" or "rgb (255, 0, 0)"
	        //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
	        //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
	        //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
	        //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
	        //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
	        //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
	        //
	        function inputToRGB(color) {

	            var rgb = { r: 0, g: 0, b: 0 };
	            var a = 1;
	            var ok = false;
	            var format = false;

	            if (typeof color == "string") {
	                color = stringInputToObject(color);
	            }

	            if ((typeof color === 'undefined' ? 'undefined' : _typeof(color)) == "object") {
	                if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
	                    rgb = rgbToRgb(color.r, color.g, color.b);
	                    ok = true;
	                    format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
	                } else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
	                    color.s = convertToPercentage(color.s);
	                    color.v = convertToPercentage(color.v);
	                    rgb = hsvToRgb(color.h, color.s, color.v);
	                    ok = true;
	                    format = "hsv";
	                } else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
	                    color.s = convertToPercentage(color.s);
	                    color.l = convertToPercentage(color.l);
	                    rgb = hslToRgb(color.h, color.s, color.l);
	                    ok = true;
	                    format = "hsl";
	                }

	                if (color.hasOwnProperty("a")) {
	                    a = color.a;
	                }
	            }

	            a = boundAlpha(a);

	            return {
	                ok: ok,
	                format: color.format || format,
	                r: mathMin(255, mathMax(rgb.r, 0)),
	                g: mathMin(255, mathMax(rgb.g, 0)),
	                b: mathMin(255, mathMax(rgb.b, 0)),
	                a: a
	            };
	        }

	        // Conversion Functions
	        // --------------------

	        // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
	        // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

	        // `rgbToRgb`
	        // Handle bounds / percentage checking to conform to CSS color spec
	        // <http://www.w3.org/TR/css3-color/>
	        // *Assumes:* r, g, b in [0, 255] or [0, 1]
	        // *Returns:* { r, g, b } in [0, 255]
	        function rgbToRgb(r, g, b) {
	            return {
	                r: bound01(r, 255) * 255,
	                g: bound01(g, 255) * 255,
	                b: bound01(b, 255) * 255
	            };
	        }

	        // `rgbToHsl`
	        // Converts an RGB color value to HSL.
	        // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
	        // *Returns:* { h, s, l } in [0,1]
	        function rgbToHsl(r, g, b) {

	            r = bound01(r, 255);
	            g = bound01(g, 255);
	            b = bound01(b, 255);

	            var max = mathMax(r, g, b),
	                min = mathMin(r, g, b);
	            var h,
	                s,
	                l = (max + min) / 2;

	            if (max == min) {
	                h = s = 0; // achromatic
	            } else {
	                    var d = max - min;
	                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	                    switch (max) {
	                        case r:
	                            h = (g - b) / d + (g < b ? 6 : 0);break;
	                        case g:
	                            h = (b - r) / d + 2;break;
	                        case b:
	                            h = (r - g) / d + 4;break;
	                    }

	                    h /= 6;
	                }

	            return { h: h, s: s, l: l };
	        }

	        // `hslToRgb`
	        // Converts an HSL color value to RGB.
	        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
	        // *Returns:* { r, g, b } in the set [0, 255]
	        function hslToRgb(h, s, l) {
	            var r, g, b;

	            h = bound01(h, 360);
	            s = bound01(s, 100);
	            l = bound01(l, 100);

	            function hue2rgb(p, q, t) {
	                if (t < 0) t += 1;
	                if (t > 1) t -= 1;
	                if (t < 1 / 6) return p + (q - p) * 6 * t;
	                if (t < 1 / 2) return q;
	                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	                return p;
	            }

	            if (s === 0) {
	                r = g = b = l; // achromatic
	            } else {
	                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	                    var p = 2 * l - q;
	                    r = hue2rgb(p, q, h + 1 / 3);
	                    g = hue2rgb(p, q, h);
	                    b = hue2rgb(p, q, h - 1 / 3);
	                }

	            return { r: r * 255, g: g * 255, b: b * 255 };
	        }

	        // `rgbToHsv`
	        // Converts an RGB color value to HSV
	        // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
	        // *Returns:* { h, s, v } in [0,1]
	        function rgbToHsv(r, g, b) {

	            r = bound01(r, 255);
	            g = bound01(g, 255);
	            b = bound01(b, 255);

	            var max = mathMax(r, g, b),
	                min = mathMin(r, g, b);
	            var h,
	                s,
	                v = max;

	            var d = max - min;
	            s = max === 0 ? 0 : d / max;

	            if (max == min) {
	                h = 0; // achromatic
	            } else {
	                    switch (max) {
	                        case r:
	                            h = (g - b) / d + (g < b ? 6 : 0);break;
	                        case g:
	                            h = (b - r) / d + 2;break;
	                        case b:
	                            h = (r - g) / d + 4;break;
	                    }
	                    h /= 6;
	                }
	            return { h: h, s: s, v: v };
	        }

	        // `hsvToRgb`
	        // Converts an HSV color value to RGB.
	        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
	        // *Returns:* { r, g, b } in the set [0, 255]
	        function hsvToRgb(h, s, v) {

	            h = bound01(h, 360) * 6;
	            s = bound01(s, 100);
	            v = bound01(v, 100);

	            var i = math.floor(h),
	                f = h - i,
	                p = v * (1 - s),
	                q = v * (1 - f * s),
	                t = v * (1 - (1 - f) * s),
	                mod = i % 6,
	                r = [v, q, p, p, t, v][mod],
	                g = [t, v, v, q, p, p][mod],
	                b = [p, p, t, v, v, q][mod];

	            return { r: r * 255, g: g * 255, b: b * 255 };
	        }

	        // `rgbToHex`
	        // Converts an RGB color to hex
	        // Assumes r, g, and b are contained in the set [0, 255]
	        // Returns a 3 or 6 character hex
	        function rgbToHex(r, g, b, allow3Char) {

	            var hex = [pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))];

	            // Return a 3 character hex if possible
	            if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
	                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	            }

	            return hex.join("");
	        }
	        // `rgbaToHex`
	        // Converts an RGBA color plus alpha transparency to hex
	        // Assumes r, g, b and a are contained in the set [0, 255]
	        // Returns an 8 character hex
	        function rgbaToHex(r, g, b, a) {

	            var hex = [pad2(convertDecimalToHex(a)), pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))];

	            return hex.join("");
	        }

	        // `equals`
	        // Can be called with any tinycolor input
	        tinycolor.equals = function (color1, color2) {
	            if (!color1 || !color2) {
	                return false;
	            }
	            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
	        };
	        tinycolor.random = function () {
	            return tinycolor.fromRatio({
	                r: mathRandom(),
	                g: mathRandom(),
	                b: mathRandom()
	            });
	        };

	        // Modification Functions
	        // ----------------------
	        // Thanks to less.js for some of the basics here
	        // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

	        function _desaturate(color, amount) {
	            amount = amount === 0 ? 0 : amount || 10;
	            var hsl = tinycolor(color).toHsl();
	            hsl.s -= amount / 100;
	            hsl.s = clamp01(hsl.s);
	            return tinycolor(hsl);
	        }

	        function _saturate(color, amount) {
	            amount = amount === 0 ? 0 : amount || 10;
	            var hsl = tinycolor(color).toHsl();
	            hsl.s += amount / 100;
	            hsl.s = clamp01(hsl.s);
	            return tinycolor(hsl);
	        }

	        function _greyscale(color) {
	            return tinycolor(color).desaturate(100);
	        }

	        function _lighten(color, amount) {
	            amount = amount === 0 ? 0 : amount || 10;
	            var hsl = tinycolor(color).toHsl();
	            hsl.l += amount / 100;
	            hsl.l = clamp01(hsl.l);
	            return tinycolor(hsl);
	        }

	        function _brighten(color, amount) {
	            amount = amount === 0 ? 0 : amount || 10;
	            var rgb = tinycolor(color).toRgb();
	            rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
	            rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
	            rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
	            return tinycolor(rgb);
	        }

	        function _darken(color, amount) {
	            amount = amount === 0 ? 0 : amount || 10;
	            var hsl = tinycolor(color).toHsl();
	            hsl.l -= amount / 100;
	            hsl.l = clamp01(hsl.l);
	            return tinycolor(hsl);
	        }

	        // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
	        // Values outside of this range will be wrapped into this range.
	        function _spin(color, amount) {
	            var hsl = tinycolor(color).toHsl();
	            var hue = (mathRound(hsl.h) + amount) % 360;
	            hsl.h = hue < 0 ? 360 + hue : hue;
	            return tinycolor(hsl);
	        }

	        // Combination Functions
	        // ---------------------
	        // Thanks to jQuery xColor for some of the ideas behind these
	        // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

	        function _complement(color) {
	            var hsl = tinycolor(color).toHsl();
	            hsl.h = (hsl.h + 180) % 360;
	            return tinycolor(hsl);
	        }

	        function _triad(color) {
	            var hsl = tinycolor(color).toHsl();
	            var h = hsl.h;
	            return [tinycolor(color), tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })];
	        }

	        function _tetrad(color) {
	            var hsl = tinycolor(color).toHsl();
	            var h = hsl.h;
	            return [tinycolor(color), tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })];
	        }

	        function _splitcomplement(color) {
	            var hsl = tinycolor(color).toHsl();
	            var h = hsl.h;
	            return [tinycolor(color), tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })];
	        }

	        function _analogous(color, results, slices) {
	            results = results || 6;
	            slices = slices || 30;

	            var hsl = tinycolor(color).toHsl();
	            var part = 360 / slices;
	            var ret = [tinycolor(color)];

	            for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
	                hsl.h = (hsl.h + part) % 360;
	                ret.push(tinycolor(hsl));
	            }
	            return ret;
	        }

	        function _monochromatic(color, results) {
	            results = results || 6;
	            var hsv = tinycolor(color).toHsv();
	            var h = hsv.h,
	                s = hsv.s,
	                v = hsv.v;
	            var ret = [];
	            var modification = 1 / results;

	            while (results--) {
	                ret.push(tinycolor({ h: h, s: s, v: v }));
	                v = (v + modification) % 1;
	            }

	            return ret;
	        }

	        // Utility Functions
	        // ---------------------

	        tinycolor.mix = function (color1, color2, amount) {
	            amount = amount === 0 ? 0 : amount || 50;

	            var rgb1 = tinycolor(color1).toRgb();
	            var rgb2 = tinycolor(color2).toRgb();

	            var p = amount / 100;
	            var w = p * 2 - 1;
	            var a = rgb2.a - rgb1.a;

	            var w1;

	            if (w * a == -1) {
	                w1 = w;
	            } else {
	                w1 = (w + a) / (1 + w * a);
	            }

	            w1 = (w1 + 1) / 2;

	            var w2 = 1 - w1;

	            var rgba = {
	                r: rgb2.r * w1 + rgb1.r * w2,
	                g: rgb2.g * w1 + rgb1.g * w2,
	                b: rgb2.b * w1 + rgb1.b * w2,
	                a: rgb2.a * p + rgb1.a * (1 - p)
	            };

	            return tinycolor(rgba);
	        };

	        // Readability Functions
	        // ---------------------
	        // <http://www.w3.org/TR/AERT#color-contrast>

	        // `readability`
	        // Analyze the 2 colors and returns an object with the following properties:
	        //    `brightness`: difference in brightness between the two colors
	        //    `color`: difference in color/hue between the two colors
	        tinycolor.readability = function (color1, color2) {
	            var c1 = tinycolor(color1);
	            var c2 = tinycolor(color2);
	            var rgb1 = c1.toRgb();
	            var rgb2 = c2.toRgb();
	            var brightnessA = c1.getBrightness();
	            var brightnessB = c2.getBrightness();
	            var colorDiff = Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) + Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) + Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b);

	            return {
	                brightness: Math.abs(brightnessA - brightnessB),
	                color: colorDiff
	            };
	        };

	        // `readable`
	        // http://www.w3.org/TR/AERT#color-contrast
	        // Ensure that foreground and background color combinations provide sufficient contrast.
	        // *Example*
	        //    tinycolor.isReadable("#000", "#111") => false
	        tinycolor.isReadable = function (color1, color2) {
	            var readability = tinycolor.readability(color1, color2);
	            return readability.brightness > 125 && readability.color > 500;
	        };

	        // `mostReadable`
	        // Given a base color and a list of possible foreground or background
	        // colors for that base, returns the most readable color.
	        // *Example*
	        //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
	        tinycolor.mostReadable = function (baseColor, colorList) {
	            var bestColor = null;
	            var bestScore = 0;
	            var bestIsReadable = false;
	            for (var i = 0; i < colorList.length; i++) {

	                // We normalize both around the "acceptable" breaking point,
	                // but rank brightness constrast higher than hue.

	                var readability = tinycolor.readability(baseColor, colorList[i]);
	                var readable = readability.brightness > 125 && readability.color > 500;
	                var score = 3 * (readability.brightness / 125) + readability.color / 500;

	                if (readable && !bestIsReadable || readable && bestIsReadable && score > bestScore || !readable && !bestIsReadable && score > bestScore) {
	                    bestIsReadable = readable;
	                    bestScore = score;
	                    bestColor = tinycolor(colorList[i]);
	                }
	            }
	            return bestColor;
	        };

	        // Big List of Colors
	        // ------------------
	        // <http://www.w3.org/TR/css3-color/#svg-color>
	        var names = tinycolor.names = {
	            aliceblue: "f0f8ff",
	            antiquewhite: "faebd7",
	            aqua: "0ff",
	            aquamarine: "7fffd4",
	            azure: "f0ffff",
	            beige: "f5f5dc",
	            bisque: "ffe4c4",
	            black: "000",
	            blanchedalmond: "ffebcd",
	            blue: "00f",
	            blueviolet: "8a2be2",
	            brown: "a52a2a",
	            burlywood: "deb887",
	            burntsienna: "ea7e5d",
	            cadetblue: "5f9ea0",
	            chartreuse: "7fff00",
	            chocolate: "d2691e",
	            coral: "ff7f50",
	            cornflowerblue: "6495ed",
	            cornsilk: "fff8dc",
	            crimson: "dc143c",
	            cyan: "0ff",
	            darkblue: "00008b",
	            darkcyan: "008b8b",
	            darkgoldenrod: "b8860b",
	            darkgray: "a9a9a9",
	            darkgreen: "006400",
	            darkgrey: "a9a9a9",
	            darkkhaki: "bdb76b",
	            darkmagenta: "8b008b",
	            darkolivegreen: "556b2f",
	            darkorange: "ff8c00",
	            darkorchid: "9932cc",
	            darkred: "8b0000",
	            darksalmon: "e9967a",
	            darkseagreen: "8fbc8f",
	            darkslateblue: "483d8b",
	            darkslategray: "2f4f4f",
	            darkslategrey: "2f4f4f",
	            darkturquoise: "00ced1",
	            darkviolet: "9400d3",
	            deeppink: "ff1493",
	            deepskyblue: "00bfff",
	            dimgray: "696969",
	            dimgrey: "696969",
	            dodgerblue: "1e90ff",
	            firebrick: "b22222",
	            floralwhite: "fffaf0",
	            forestgreen: "228b22",
	            fuchsia: "f0f",
	            gainsboro: "dcdcdc",
	            ghostwhite: "f8f8ff",
	            gold: "ffd700",
	            goldenrod: "daa520",
	            gray: "808080",
	            green: "008000",
	            greenyellow: "adff2f",
	            grey: "808080",
	            honeydew: "f0fff0",
	            hotpink: "ff69b4",
	            indianred: "cd5c5c",
	            indigo: "4b0082",
	            ivory: "fffff0",
	            khaki: "f0e68c",
	            lavender: "e6e6fa",
	            lavenderblush: "fff0f5",
	            lawngreen: "7cfc00",
	            lemonchiffon: "fffacd",
	            lightblue: "add8e6",
	            lightcoral: "f08080",
	            lightcyan: "e0ffff",
	            lightgoldenrodyellow: "fafad2",
	            lightgray: "d3d3d3",
	            lightgreen: "90ee90",
	            lightgrey: "d3d3d3",
	            lightpink: "ffb6c1",
	            lightsalmon: "ffa07a",
	            lightseagreen: "20b2aa",
	            lightskyblue: "87cefa",
	            lightslategray: "789",
	            lightslategrey: "789",
	            lightsteelblue: "b0c4de",
	            lightyellow: "ffffe0",
	            lime: "0f0",
	            limegreen: "32cd32",
	            linen: "faf0e6",
	            magenta: "f0f",
	            maroon: "800000",
	            mediumaquamarine: "66cdaa",
	            mediumblue: "0000cd",
	            mediumorchid: "ba55d3",
	            mediumpurple: "9370db",
	            mediumseagreen: "3cb371",
	            mediumslateblue: "7b68ee",
	            mediumspringgreen: "00fa9a",
	            mediumturquoise: "48d1cc",
	            mediumvioletred: "c71585",
	            midnightblue: "191970",
	            mintcream: "f5fffa",
	            mistyrose: "ffe4e1",
	            moccasin: "ffe4b5",
	            navajowhite: "ffdead",
	            navy: "000080",
	            oldlace: "fdf5e6",
	            olive: "808000",
	            olivedrab: "6b8e23",
	            orange: "ffa500",
	            orangered: "ff4500",
	            orchid: "da70d6",
	            palegoldenrod: "eee8aa",
	            palegreen: "98fb98",
	            paleturquoise: "afeeee",
	            palevioletred: "db7093",
	            papayawhip: "ffefd5",
	            peachpuff: "ffdab9",
	            peru: "cd853f",
	            pink: "ffc0cb",
	            plum: "dda0dd",
	            powderblue: "b0e0e6",
	            purple: "800080",
	            rebeccapurple: "663399",
	            red: "f00",
	            rosybrown: "bc8f8f",
	            royalblue: "4169e1",
	            saddlebrown: "8b4513",
	            salmon: "fa8072",
	            sandybrown: "f4a460",
	            seagreen: "2e8b57",
	            seashell: "fff5ee",
	            sienna: "a0522d",
	            silver: "c0c0c0",
	            skyblue: "87ceeb",
	            slateblue: "6a5acd",
	            slategray: "708090",
	            slategrey: "708090",
	            snow: "fffafa",
	            springgreen: "00ff7f",
	            steelblue: "4682b4",
	            tan: "d2b48c",
	            teal: "008080",
	            thistle: "d8bfd8",
	            tomato: "ff6347",
	            turquoise: "40e0d0",
	            violet: "ee82ee",
	            wheat: "f5deb3",
	            white: "fff",
	            whitesmoke: "f5f5f5",
	            yellow: "ff0",
	            yellowgreen: "9acd32"
	        };

	        // Make it easy to access colors via `hexNames[hex]`
	        var hexNames = tinycolor.hexNames = flip(names);

	        // Utilities
	        // ---------

	        // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
	        function flip(o) {
	            var flipped = {};
	            for (var i in o) {
	                if (o.hasOwnProperty(i)) {
	                    flipped[o[i]] = i;
	                }
	            }
	            return flipped;
	        }

	        // Return a valid alpha value [0,1] with all invalid values being set to 1
	        function boundAlpha(a) {
	            a = parseFloat(a);

	            if (isNaN(a) || a < 0 || a > 1) {
	                a = 1;
	            }

	            return a;
	        }

	        // Take input from [0, n] and return it as [0, 1]
	        function bound01(n, max) {
	            if (isOnePointZero(n)) {
	                n = "100%";
	            }

	            var processPercent = isPercentage(n);
	            n = mathMin(max, mathMax(0, parseFloat(n)));

	            // Automatically convert percentage into number
	            if (processPercent) {
	                n = parseInt(n * max, 10) / 100;
	            }

	            // Handle floating point rounding errors
	            if (math.abs(n - max) < 0.000001) {
	                return 1;
	            }

	            // Convert into [0, 1] range if it isn't already
	            return n % max / parseFloat(max);
	        }

	        // Force a number between 0 and 1
	        function clamp01(val) {
	            return mathMin(1, mathMax(0, val));
	        }

	        // Parse a base-16 hex value into a base-10 integer
	        function parseIntFromHex(val) {
	            return parseInt(val, 16);
	        }

	        // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
	        // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
	        function isOnePointZero(n) {
	            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
	        }

	        // Check to see if string passed in is a percentage
	        function isPercentage(n) {
	            return typeof n === "string" && n.indexOf('%') != -1;
	        }

	        // Force a hex value to have 2 characters
	        function pad2(c) {
	            return c.length == 1 ? '0' + c : '' + c;
	        }

	        // Replace a decimal with it's percentage value
	        function convertToPercentage(n) {
	            if (n <= 1) {
	                n = n * 100 + "%";
	            }

	            return n;
	        }

	        // Converts a decimal to a hex value
	        function convertDecimalToHex(d) {
	            return Math.round(parseFloat(d) * 255).toString(16);
	        }
	        // Converts a hex value to a decimal
	        function convertHexToDecimal(h) {
	            return parseIntFromHex(h) / 255;
	        }

	        var matchers = function () {

	            // <http://www.w3.org/TR/css3-values/#integers>
	            var CSS_INTEGER = "[-\\+]?\\d+%?";

	            // <http://www.w3.org/TR/css3-values/#number-value>
	            var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

	            // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
	            var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

	            // Actual matching.
	            // Parentheses and commas are optional, but not required.
	            // Whitespace can take the place of commas or opening paren
	            var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	            var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

	            return {
	                rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
	                rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
	                hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
	                hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
	                hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
	                hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
	                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
	                hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	            };
	        }();

	        // `stringInputToObject`
	        // Permissive string parsing.  Take in a number of formats, and output an object
	        // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
	        function stringInputToObject(color) {

	            color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
	            var named = false;
	            if (names[color]) {
	                color = names[color];
	                named = true;
	            } else if (color == 'transparent') {
	                return { r: 0, g: 0, b: 0, a: 0, format: "name" };
	            }

	            // Try to match string input using regular expressions.
	            // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	            // Just return an object and let the conversion functions handle that.
	            // This way the result will be the same whether the tinycolor is initialized with string or object.
	            var match;
	            if (match = matchers.rgb.exec(color)) {
	                return { r: match[1], g: match[2], b: match[3] };
	            }
	            if (match = matchers.rgba.exec(color)) {
	                return { r: match[1], g: match[2], b: match[3], a: match[4] };
	            }
	            if (match = matchers.hsl.exec(color)) {
	                return { h: match[1], s: match[2], l: match[3] };
	            }
	            if (match = matchers.hsla.exec(color)) {
	                return { h: match[1], s: match[2], l: match[3], a: match[4] };
	            }
	            if (match = matchers.hsv.exec(color)) {
	                return { h: match[1], s: match[2], v: match[3] };
	            }
	            if (match = matchers.hsva.exec(color)) {
	                return { h: match[1], s: match[2], v: match[3], a: match[4] };
	            }
	            if (match = matchers.hex8.exec(color)) {
	                return {
	                    a: convertHexToDecimal(match[1]),
	                    r: parseIntFromHex(match[2]),
	                    g: parseIntFromHex(match[3]),
	                    b: parseIntFromHex(match[4]),
	                    format: named ? "name" : "hex8"
	                };
	            }
	            if (match = matchers.hex6.exec(color)) {
	                return {
	                    r: parseIntFromHex(match[1]),
	                    g: parseIntFromHex(match[2]),
	                    b: parseIntFromHex(match[3]),
	                    format: named ? "name" : "hex"
	                };
	            }
	            if (match = matchers.hex3.exec(color)) {
	                return {
	                    r: parseIntFromHex(match[1] + '' + match[1]),
	                    g: parseIntFromHex(match[2] + '' + match[2]),
	                    b: parseIntFromHex(match[3] + '' + match[3]),
	                    format: named ? "name" : "hex"
	                };
	            }

	            return false;
	        }

	        window.tinycolor = tinycolor;
	    })();

	    $(function () {
	        if ($.fn.spectrum.load) {
	            $.fn.spectrum.processNativeColorInputs();
	        }
	    });
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(2)();
	// imports


	// module
	exports.push([module.id, ".sp-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 9999994;\n  display: inline-block;\n  padding: 0;\n  *display: inline;\n  *zoom: 1;\n  overflow: hidden;\n  border-radius: 2px;\n  user-select: none;\n  font: normal 12px \"Roboto\", \"Helvetica\", \"Arial\", \"sans-serif\";\n  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12); }\n  .sp-container.sp-flat {\n    position: relative;\n    box-shadow: none;\n    background-color: lightgray; }\n  .sp-container button {\n    user-select: none;\n    height: 36px;\n    min-width: 64px;\n    padding: 0 8px;\n    border: 0;\n    border-radius: 2px;\n    font-weight: bold;\n    font-family: \"Roboto\", \"Helvetica\", \"Arial\", \"sans-serif\";\n    font-size: 14px;\n    letter-spacing: normal;\n    line-height: 36px;\n    text-align: center;\n    text-transform: uppercase;\n    vertical-align: middle;\n    background: none transparent;\n    outline: 0;\n    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n    .sp-container button::-moz-focus-inner {\n      border: 0; }\n    .sp-container button:hover {\n      background-color: rgba(153, 153, 153, 0.2); }\n    .sp-container button:focus:not(:active) {\n      background-color: rgba(0, 0, 0, 0.12); }\n    .sp-container button:active {\n      background-color: rgba(153, 153, 153, 0.4); }\n  .sp-container.sp-dragging .sp-input,\n  .sp-container.sp-input-disabled .sp-input-container,\n  .sp-container.sp-buttons-disabled .sp-button-container,\n  .sp-container.sp-palette-buttons-disabled .sp-palette-button-container {\n    user-select: none; }\n\n.sp-light {\n  background-color: #fff; }\n  .sp-light button,\n  .sp-light .sp-cancel,\n  .sp-light .sp-cancel:hover {\n    color: #000; }\n  .sp-light .sp-palette .sp-thumb-el {\n    border: 1px solid #fff; }\n\n.sp-dark {\n  background-color: #424242; }\n  .sp-dark button,\n  .sp-dark .sp-cancel,\n  .sp-dark .sp-cancel:hover {\n    color: #fff; }\n  .sp-dark .sp-palette .sp-thumb-el {\n    border: 1px solid #424242; }\n\n.sp-top {\n  position: relative;\n  width: 100%;\n  display: inline-block;\n  margin-bottom: 3px; }\n\n.sp-top-inner {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0; }\n\n.sp-color {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 20%;\n  font: normal 12px \"Roboto\", \"Helvetica\", \"Arial\", \"sans-serif\"; }\n\n.sp-hue {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 84%;\n  height: 100%;\n  font: normal 12px \"Roboto\", \"Helvetica\", \"Arial\", \"sans-serif\";\n  background: linear-gradient(to bottom, #f00 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n  cursor: row-resize; }\n\n.sp-clear-enabled .sp-hue {\n  top: 33px;\n  height: 77.5%; }\n\n.sp-clear-enabled .sp-clear {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 84%;\n  display: block;\n  height: 28px; }\n\n.sp-fill {\n  padding-top: 80%; }\n\n.sp-sat {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: linear-gradient(to right, #fff, rgba(204, 154, 129, 0));\n  filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr='#FFFFFFFF', endColorstr='#00CC9A81'); }\n\n.sp-val {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: linear-gradient(to top, #000, rgba(204, 154, 129, 0));\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00CC9A81', endColorstr='#FF000000'); }\n\n.sp-alpha-enabled .sp-top {\n  margin-bottom: 18px; }\n\n.sp-alpha-enabled .sp-alpha {\n  display: block; }\n\n.sp-alpha-handle {\n  position: absolute;\n  top: -4px;\n  bottom: -4px;\n  width: 6px;\n  left: 50%;\n  border: 1px solid #000;\n  cursor: pointer;\n  background: #fff;\n  opacity: .8;\n  user-select: none; }\n\n.sp-alpha {\n  position: relative;\n  bottom: -14px;\n  right: 0;\n  left: 0;\n  display: none;\n  height: 8px;\n  user-select: none;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==\"); }\n\n.sp-alpha-inner {\n  border: solid 1px #333;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  display: block; }\n\n.sp-clear {\n  display: none;\n  user-select: none;\n  font: normal 12px \"Roboto\", \"Helvetica\", \"Arial\", \"sans-serif\";\n  box-sizing: border-box; }\n  .sp-clear.sp-clear-display {\n    background-position: center; }\n\n.sp-replacer {\n  border: solid 1px #ccc;\n  border-radius: 4px;\n  margin: 0;\n  padding: 6px 12px;\n  display: inline-block;\n  color: #333;\n  user-select: none;\n  overflow: hidden;\n  cursor: pointer;\n  *zoom: 1;\n  *display: inline;\n  background: #fff;\n  vertical-align: middle; }\n  .sp-replacer.sp-disabled {\n    cursor: default;\n    border-color: silver;\n    color: silver; }\n\n.sp-preview {\n  position: relative;\n  width: 16px;\n  height: 16px;\n  z-index: 0;\n  float: left;\n  user-select: none;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==\"); }\n\n.sp-dragger {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 5px;\n  width: 5px;\n  border: 1px solid #fff;\n  user-select: none;\n  border-radius: 5px;\n  background: #000;\n  cursor: pointer; }\n\n.sp-slider {\n  position: absolute;\n  top: 0;\n  left: -1px;\n  right: -1px;\n  height: 3px;\n  user-select: none;\n  background: #fff;\n  opacity: .8; }\n\n.sp-palette-only .sp-picker-container {\n  display: none; }\n\n.sp-palette-only .sp-palette-container {\n  border: 0; }\n\n.sp-initial-disabled .sp-initial {\n  display: none; }\n\n.sp-initial-disabled .sp-input-container {\n  width: 100%; }\n\n.sp-1 {\n  height: 17%;\n  filter: progid:dximagetransform.microsoft.gradient(startcolorstr='$red', endcolorstr='$yellow'); }\n\n.sp-2 {\n  height: 16%;\n  filter: progid:dximagetransform.microsoft.gradient(startcolorstr='$yellow', endcolorstr='$green'); }\n\n.sp-3 {\n  height: 17%;\n  filter: progid:dximagetransform.microsoft.gradient(startcolorstr='$green', endcolorstr='$cyan_aqua'); }\n\n.sp-4 {\n  height: 17%;\n  filter: progid:dximagetransform.microsoft.gradient(startcolorstr='$cyan_aqua', endcolorstr='$blue'); }\n\n.sp-5 {\n  height: 16%;\n  filter: progid:dximagetransform.microsoft.gradient(startcolorstr='$blue', endcolorstr='$magenta'); }\n\n.sp-6 {\n  height: 17%;\n  filter: progid:dximagetransform.microsoft.gradient(startcolorstr='$magenta', endcolorstr='$red'); }\n\n.sp-hidden {\n  display: none !important; }\n\n.sp-cf {\n  *zoom: 1; }\n  .sp-cf::before, .sp-cf::after {\n    content: '';\n    display: table; }\n  .sp-cf::after {\n    clear: both; }\n\n@media (max-device-width: 480px) {\n  .sp-color {\n    right: 40%; }\n  .sp-hue {\n    left: 63%; }\n  .sp-fill {\n    padding-top: 60%; } }\n\n.sp-input-container {\n  float: right;\n  width: 100px;\n  margin-bottom: 4px; }\n\n.sp-input.sp-validation-error {\n  border: 1px solid #f00;\n  background: #fdd; }\n\n.sp-picker-container {\n  position: relative;\n  float: left;\n  padding: 10px;\n  padding-bottom: 300px;\n  margin-bottom: -290px;\n  width: 172px;\n  box-sizing: content-box; }\n\n.sp-palette-container {\n  position: relative;\n  float: left;\n  padding: 10px;\n  padding-bottom: 300px;\n  margin-bottom: -290px; }\n\n.sp-palette {\n  *width: 220px;\n  max-width: 220px; }\n  .sp-palette .sp-thumb-el {\n    position: relative;\n    display: block;\n    float: left;\n    width: 16px;\n    height: 16px;\n    margin: 1px;\n    cursor: pointer;\n    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n    .sp-palette .sp-thumb-el:hover, .sp-palette .sp-thumb-el.sp-thumb-active {\n      border-color: orange; }\n  .sp-palette span:hover, .sp-palette span.sp-thumb-active {\n    border-color: #000; }\n  .sp-palette .sp-thumb-inner {\n    background-position: 50% 50%;\n    background-repeat: no-repeat; }\n  .sp-palette .sp-thumb-light.sp-thumb-active .sp-thumb-inner {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUeNpiYBhsgJFMffxAXABlN5JruT4Q3wfi/0DsT64h8UD8HmpIPCWG/KemIfOJCUB+Aoacx6EGBZyHBqI+WsDCwuQ9mhxeg2A210Ntfo8klk9sOMijaURm7yc1UP2RNCMbKE9ODK1HM6iegYLkfx8pligC9lCD7KmRof0ZhjQACDAAceovrtpVBRkAAAAASUVORK5CYII=\"); }\n  .sp-palette .sp-thumb-dark.sp-thumb-active .sp-thumb-inner {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAMdJREFUOE+tkgsNwzAMRMugEAahEAahEAZhEAqlEAZhEAohEAYh81X2dIm8fKpEspLGvudPOsUYpxE2BIJCroJmEW9qJ+MKaBFhEMNabSy9oIcIPwrB+afvAUFoK4H0tMaQ3XtlrggDhOVVMuT4E5MMG0FBbCEYzjYT7OxLEvIHQLY2zWwQ3D+9luyOQTfKDiFD3iUIfPk8VqrKjgAiSfGFPecrg6HN6m/iBcwiDAo7WiBeawa+Kwh7tZoSCGLMqwlSAzVDhoK+6vH4G0P5wdkAAAAASUVORK5CYII=\"); }\n\n.sp-palette-toggle {\n  margin-top: 5px; }\n\n.sp-thumb-el {\n  position: relative;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==\"); }\n\n.sp-initial {\n  border: solid 1px transparent;\n  float: left; }\n  .sp-initial span {\n    border: none;\n    margin: 0;\n    display: block;\n    float: left;\n    width: 30px;\n    height: 32px; }\n  .sp-initial .sp-clear-display {\n    background-position: center; }\n\n.sp-palette-button-container,\n.sp-button-container {\n  float: right; }\n\n.sp-cancel {\n  display: inline-block;\n  text-decoration: none;\n  height: 36px;\n  min-width: 64px;\n  padding: 0 8px;\n  border: 0;\n  border-radius: 2px;\n  font-weight: bold;\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", \"sans-serif\";\n  font-size: 14px;\n  letter-spacing: normal;\n  line-height: 36px;\n  text-align: center;\n  text-transform: uppercase;\n  vertical-align: middle;\n  background: none transparent;\n  outline: 0;\n  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n  .sp-cancel::-moz-focus-inner {\n    border: 0; }\n  .sp-cancel:hover {\n    background-color: rgba(153, 153, 153, 0.2); }\n  .sp-cancel:focus:not(:active) {\n    background-color: rgba(0, 0, 0, 0.12); }\n  .sp-cancel:active {\n    background-color: rgba(153, 153, 153, 0.4); }\n  .sp-cancel:hover {\n    text-decoration: none; }\n\n.sp-preview-inner,\n.sp-thumb-inner {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  display: block; }\n\n.sp-clear-display {\n  background: url(\"data:image/gif;base64,R0lGODlhFAAUAPcAAAAAAJmZmZ2dnZ6enqKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq/Hx8fLy8vT09PX19ff39/j4+Pn5+fr6+vv7+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAUABQAAAihAP9FoPCvoMGDBy08+EdhQAIJCCMybCDAAYUEARBAlFiQQoMABQhKUJBxY0SPICEYHBnggEmDKAuoPMjS5cGYMxHW3IiT478JJA8M/CjTZ0GgLRekNGpwAsYABHIypcAgQMsITDtWJYBR6NSqMico9cqR6tKfY7GeBCuVwlipDNmefAtTrkSzB1RaIAoXodsABiZAEFB06gIBWC1mLVgBa0AAOw==\") center no-repeat; }\n\n.sp-palette-disabled .sp-palette-container {\n  display: none; }\n", ""]);

	// exports


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(2)();
	// imports


	// module
	exports.push([module.id, ".header {\n  padding: 60px 0; }\n  .header h1 {\n    font-size: 60px; }\n\n.color-pickers .form-inputs {\n  display: table; }\n  .color-pickers .form-inputs input,\n  .color-pickers .form-inputs .sp-replacer {\n    display: table-cell; }\n  .color-pickers .form-inputs input {\n    border-bottom-right-radius: 0;\n    border-top-right-radius: 0; }\n  .color-pickers .form-inputs .sp-replacer {\n    border-left-width: 0;\n    border-bottom-left-radius: 0;\n    border-top-left-radius: 0; }\n    .color-pickers .form-inputs .sp-replacer.nightmode {\n      background-color: #424242; }\n\n.addons__form,\n.dropbox-container,\n#add-topic,\n#remove-topic {\n  display: none; }\n\n#rotating-header__input option {\n  padding: 10px 0;\n  text-align: center; }\n\niframe {\n  border: 0; }\n\n.affix {\n  top: 0;\n  margin-left: 25%; }\n\n@media (max-width: 768px) {\n  .affix {\n    position: static; } }\n\n.panel-title > a {\n  font-size: 12px; }\n\n.nav-pills .label {\n  float: right;\n  font-size: 12px;\n  margin-left: 2px;\n  padding: .3em .6em; }\n\n.clipboard {\n  position: relative; }\n\n.btn-clipboard {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 5;\n  display: block;\n  padding: 5px 8px;\n  font-size: 12px;\n  color: #767676;\n  cursor: pointer;\n  background-color: #fff;\n  border: 1px solid #e1e1e8;\n  border-radius: 0 4px;\n  -webkit-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  -moz-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n  .btn-clipboard:hover {\n    color: #fff;\n    background-color: #563d7c; }\n\nbody::before {\n  position: fixed;\n  z-index: -1;\n  height: 100%;\n  width: 100%;\n  content: '';\n  -webkit-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  -moz-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n\nbody.droppable::before {\n  position: fixed;\n  z-index: 10;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  border: 2px solid #4285f4;\n  color: #fff;\n  content: 'Drop file(s) to upload';\n  font-size: 36px;\n  font-weight: bold;\n  text-shadow: 0 0 5px rgba(0, 0, 0, 0.4);\n  background-color: rgba(51, 124, 255, 0.5); }\n\n.dropbox-container {\n  width: 100%;\n  margin: 10px 0;\n  padding: 20px;\n  border: 5px dashed #d9edf7;\n  border-radius: 5px;\n  text-align: center; }\n  .dropbox-container:hover {\n    cursor: pointer; }\n  .dropbox-container.disabled {\n    background: repeating-linear-gradient(135deg, lightgray, lightgray 10px, darkgray 10px, darkgray 20px);\n    border: 0; }\n    .dropbox-container.disabled:hover {\n      cursor: not-allowed; }\n\ninput.dropbox {\n  display: none; }\n\n#compile-div {\n  display: inline-block; }\n  #compile-div.disabled {\n    cursor: not-allowed; }\n  #compile-div .btn[disabled] {\n    pointer-events: none; }\n\n.footer {\n  margin-top: 100px;\n  padding: 50px 0; }\n", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Bez 1.0.11
	 * http://github.com/rdallasgray/bez
	 *
	 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
	 *
	 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
	 * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
	 *
	 * Copyright 2016 Robert Dallas Gray. All rights reserved.
	 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
	 */
	(function(factory) {
	  if (true) {
	    factory(__webpack_require__(4));
	  } else if (typeof define === "function" && define.amd) {
	    define(["jquery"], factory);
	  } else {
	    factory(jQuery);
	  }
	}(function($) {
	  $.extend({ bez: function(encodedFuncName, coOrdArray) {
	    if ($.isArray(encodedFuncName)) {
	      coOrdArray = encodedFuncName;
	      encodedFuncName = 'bez_' + coOrdArray.join('_').replace(/\./g, 'p');
	    }
	    if (typeof $.easing[encodedFuncName] !== "function") {
	      var polyBez = function(p1, p2) {
	        var A = [null, null], B = [null, null], C = [null, null],
	            bezCoOrd = function(t, ax) {
	              C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
	              return t * (C[ax] + t * (B[ax] + t * A[ax]));
	            },
	            xDeriv = function(t) {
	              return C[0] + t * (2 * B[0] + 3 * A[0] * t);
	            },
	            xForT = function(t) {
	              var x = t, i = 0, z;
	              while (++i < 14) {
	                z = bezCoOrd(x, 0) - t;
	                if (Math.abs(z) < 1e-3) break;
	                x -= z / xDeriv(x);
	              }
	              return x;
	            };
	        return function(t) {
	          return bezCoOrd(xForT(t), 1);
	        }
	      };
	      $.easing[encodedFuncName] = function(x, t, b, c, d) {
	        return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t/d) + b;
	      }
	    }
	    return encodedFuncName;
	  }});
	}));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(3)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./spectrum.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./spectrum.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(3)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }
/******/ ]);