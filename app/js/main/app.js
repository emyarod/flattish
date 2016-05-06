'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var colorList = {
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
var colors = {
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
  for (var i = 0; i < Object.keys(colorList).length; i++) {

    // push every 7 values or until array ends
    if (i % 7 === 6 || i === Object.keys(colorList).length - 1) {
      tempArray.push(Object.keys(colorList)[i]);
      basePalette.push(tempArray);
      tempArray = [];
    } else {
      tempArray.push(Object.keys(colorList)[i]);
    }
  }

  // push the 3 arrays that form a palette into new array
  basePalette.forEach(function (element, index, array) {
    return newPalette[index] = array[index].slice();
  });

  // get HEX codes from nested array elements
  newPalette.forEach(function (element, index, array) {
    newPalette[index].forEach(function (element, i, array) {
      return newPalette[index][i] = colorList[element][colorCode];
    });
  });

  // add white and black HEX codes
  newPalette[newPalette.length - 1].push('#fff', '#000');
}

for (var key in colors) {
  if (colors.hasOwnProperty(key)) {
    // initialize object property
    colors[key].palette = [];

    // create HEX code arrays
    paletteArrayCreator(colors[key].palette, colors[key].colorCode);
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
    this.swatch = colorList[colors[key].color][colors[key].colorCode];
    this.value = key;
    this.colorPalette = colors[key].palette;

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
var palettes = paletteConstructorArray(Object.keys(colors));
console.log(palettes);

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
      $('iframe').contents().find('style').append('\n        .submit-link .morelink a,\n        .submit-text .morelink a,\n        .submit-page button[type="submit"],\n        #sr-form .save-button button,\n        .save-button>button:nth-child(1) {\n          background: ' + newColor + ' radial-gradient(circle,rgba(77,208,225,0.3) 15%,transparent 30%) no-repeat 50% 50%/0!important;\n        }\n        .login-form-side input[type="checkbox"]:checked+label::before,\n        .c-checkbox input[type="checkbox"]:checked+label::before,\n        .flairtoggle input[type="checkbox"]:checked+label::before,\n        .linefield input[type="checkbox"]:checked+label::before,\n        .roundfield-content input[type="checkbox"]:checked+label::before {\n          border-color: ' + newColor + '!important;\n          background: ' + newColor + ' url("//b.thumbs.redditmedia.com/WwVfPsjJK8fP59rNqswJrUJTWvS9kCK83eSjybERWMw.png") -246px -138px;\n        }\n        .toggleButton.enabled {\n          background-color: ' + newColor + ';\n        }\n        #wikiactions a,\n        #moderation_tools a,\n        .footer a,\n        .bottommenu a {\n          background: linear-gradient(to top,' + newColor + ' 50%,transparent 50%);\n          background-size: 100% 200%;\n          background-repeat: no-repeat;\n        }\n        ');
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
    colors[value] = $('.' + id.slice(1) + 'Container input').val();
    console.log(value + ' = ' + colors[value]);
  });
}

// generate swatches for each palette
palettes.forEach(function (element, index, array) {
  return createSpectrum(array[index].id, array[index].swatch, array[index].colorPalette, array[index].replacerClassName, array[index].value);
});

// addons

// pinned topics
var pinnedTopics;
var numStickiedLinks; // number of stickied links
var numStickiedMenus; // number of stickied menus

// desired image backgrounds for stickies
var stickyLinkImages;
var stickyMenuImages;

$(document).ready(function () {
  $.ajax({
    url: 'style/flattish.scss'
    // url: 'style/utils/_vars.scss'
    // url: 'test.scss'
  }).done(function (data) {
    $('#target').html(data);
  });
});

var sass = new Sass();

sass.options({ style: Sass.style.expanded }, function (result) {
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
        /**
         * Array destructuring
         *
         * [capitalLetters] = input.match(/[A-Z]/g);
         *
         * instead of
         *
         * capitalLetters = input.match(/[A-Z]/g)[0];
         */


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
      for (var key in colors) {
        if (colors.hasOwnProperty(key)) {
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
          if (_typeof(colors[replacementValue[i]]) === 'object') {
            var color = colors[replacementValue[i]];
            return '$' + varNames[i] + ': ' + colorList[color.color][color.colorCode] + ';';
          } else if (typeof colors[replacementValue[i]] === 'string') {
            return '$' + varNames[i] + ': ' + colors[replacementValue[i]] + ';';
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

// sidebar image validation
function sidebarImgHeight(state) {
  /**
   * enable/disable
   *
   * remove/add warning from form group
   * enable/disable compile button
   * remove/add tooltip from compile button
   * destroy/create input group popover
   */
  if (state === 'enable') {
    $('#sidebar-image__div .form-group').removeClass('has-error');
    $('#compile').removeClass('disabled').prop('disabled', false);
    $('#compile-div').removeClass('disabled').tooltip('destroy');
    $('.input-group-addon').popover('destroy');
  } else if (state === 'disable') {
    $('#sidebar-image__div .form-group').addClass('has-error');
    $('#compile').addClass('disabled').prop('disabled', true);
    $('#compile-div').addClass('disabled').tooltip();
    $('.input-group-addon').popover('show');
  }
}

// checkbox events
$('#sidebar-image-checkbox:checkbox').change(function () {
  var bezierEasing = [0.4, 0, 0.2, 1];
  if ($('#sidebar-image-checkbox:checkbox').prop('checked')) {
    // show div
    $('#sidebar-image__div').show(200, $.bez(bezierEasing)).fadeIn(200, $.bez(bezierEasing)).slideDown(200, $.bez(bezierEasing));

    // enable input field
    $('#sidebar-image__input').prop({
      disabled: false,
      required: true
    });

    // validate input form
    if ($('#sidebar-image__input').is(':invalid')) {
      // reset value of image height input
      $('#sidebar-image__input').val('224');
    } else {
      sidebarImgHeight('enable');
    }
  } else {
    // hide div
    $('#sidebar-image__div').hide(200, $.bez(bezierEasing)).fadeOut(200, $.bez(bezierEasing)).slideUp(200, $.bez(bezierEasing));

    // disable input field
    $('#sidebar-image__input').prop({
      disabled: true,
      required: false
    });

    sidebarImgHeight('enable');
  }
});

// sidebar image height form validation
$('#sidebar-image__input').change(function () {
  if ($('#sidebar-image__input').is(':invalid')) {
    sidebarImgHeight('disable');
  } else {
    sidebarImgHeight('enable');
  }
});

$('iframe').load(function () {
  // $('iframe').contents().find('body').css('background-color', 'purple');
  // $('iframe').contents().find('style').append('body { background-color: purple; }');
});

// affix iframe after scroll below header
$('#iframe-container').affix({
  offset: {
    top: $('.header').outerHeight(true),
    bottom: function bottom() {
      return $('#results').outerHeight(true) + 150;
    }
  }
});

// compile
$('#compile').click(function () {
  // disable inputs while compiling
  $('input').addClass('disabled').prop('disabled', true);

  // get file content
  sass.readFile('flattish/utils/_vars.scss', function (content) {
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
      if ($('#sidebar-image-checkbox:checkbox').prop('checked')) {
        console.log('checked');
        content = replacer(content, 'bool', true, 'sidebarImg');
        content = replacer(content, 'bool', $('#sidebar-image__input').val(), 'sidebarImgHeight');
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

          console.log('compiled');
          console.log(result);
          $('#target').html(result.text);

          var finalPreview = result.text;

          finalPreview = finalPreview.replace(/%%dropdown%%/g, '"//b.thumbs.redditmedia.com/n8Tjs0Bql4bCTP1yXHT6uyQ2FiNxqvyiqX0dmgEvGtU.png"').replace(/%%dropdown-night%%/g, '"//a.thumbs.redditmedia.com/2OhDOWNjWv07gPH_SInBCkIGV-Vvh79bOivLCefF-Y0.png"').replace(/%%header%%/g, '"//b.thumbs.redditmedia.com/fRsvIUIv8r1kjAnVvvPnYkxDLjzLMaNx3qDq8lVW-_c.png"').replace(/%%spritesheet%%/g, '"//b.thumbs.redditmedia.com/WwVfPsjJK8fP59rNqswJrUJTWvS9kCK83eSjybERWMw.png"').replace(/%%save%%/g, '"//b.thumbs.redditmedia.com/BSYuVoMV0MOiH4OA6vtW8VqLePOAqwnC69QrPmjRHgk.png"').replace(/%%hide%%/g, '"//b.thumbs.redditmedia.com/KIFC2QeI3sY7e9pL4_MqCgo5n9x5QwVmgcovfNm8RJc.png"');
          $('iframe').contents().find('style').text('html,body{overflow:hidden;}' + finalPreview);
        });
      });
    } else {
      console.log('readFile failed');
    }
  });
});