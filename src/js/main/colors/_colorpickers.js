import { colorList, colors } from './_colorlist.js';

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
export function paletteArrayCreator(newPalette, colorCode) {
  /**
   * create base palette array
   * basePalette = [
   *   ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue',],
   *   ['cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber',],
   *   ['orange', 'deepOrange', 'brown', 'grey', 'blueGrey',],
   * ];
   */
  let basePalette = [];
  let tempArray = [];

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
  basePalette.forEach((element, index, array) => (
    newPalette[index] = array[index].slice()
  ));

  // get HEX codes from nested array elements
  newPalette.forEach((element, index, array) => {
    newPalette[index].forEach((element, i, array) => (
     newPalette[index][i] = colorList[element][colorCode]
   ))
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
export function paletteConstructorArray(keyArray) {

  // palette constructor
  function Palette(key) {
    this.id = `#${key}ColorPicker`;
    this.swatch = colorList[colors[key].color][colors[key].colorCode];
    this.value = key;
    this.colorPalette = colors[key].palette;

    if (key.indexOf('Night') !== -1) {
      this.replacerClassName = 'nightmode';
    } else {
      this.replacerClassName = '';
    }
  }

  let newArray = [];
  keyArray.forEach((element, index, array) => (
    newArray.push(new Palette(array[index]))
  ));
  return newArray;
}

/**
 * construct Palette objects from color[key]'s
 * palettes =  [Palette, Palette, Palette, Palette];
 */
export const palettes = paletteConstructorArray(Object.keys(colors));

// generate color swatches based on palettes
export function createSpectrum(id, swatch, palette = null, replacerClassName, value) {
  $(id).spectrum({
    color: swatch,
    palette,
    replacerClassName,
    theme: 'sp-light',
    showInput: true,
    showInitial: true,
    showPalette: true,
    preferredFormat: 'hex3',
    containerClassName: `${id.slice(1)}Container`,
  });

  // show input text box
  $(id).show();

  $(id).change(() => {
    // set spectrum value equal to input field value
    $(id).spectrum('set', $(id).val());

    // change live preview iframe
    let newColor = $(id).val();
    function hexToRgb(hex) {
      /**
       * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
       */

      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, (m, r, g, b) => {
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
      $('iframe').contents().find('style').append(
        `
        .submit-link .morelink a,
        .submit-text .morelink a,
        .submit-page button[type="submit"],
        #sr-form .save-button button,
        .save-button>button:nth-child(1) {
          background: ${newColor} radial-gradient(circle,rgba(77,208,225,0.3) 15%,transparent 30%) no-repeat 50% 50%/0!important;
        }
        .login-form-side input[type="checkbox"]:checked+label::before,
        .c-checkbox input[type="checkbox"]:checked+label::before,
        .flairtoggle input[type="checkbox"]:checked+label::before,
        .linefield input[type="checkbox"]:checked+label::before,
        .roundfield-content input[type="checkbox"]:checked+label::before {
          border-color: ${newColor}!important;
          background: ${newColor} url('../../../img/sprites/spritesheet.png') -246px -138px;
        }
        .toggleButton.enabled {
          background-color: ${newColor};
        }
        #wikiactions a,
        #moderation_tools a,
        .footer a,
        .bottommenu a {
          background: linear-gradient(to top,${newColor} 50%,transparent 50%);
          background-size: 100% 200%;
          background-repeat: no-repeat;
        }
        `
      );
    } else if (id === '#darkPrimaryColorPicker') {
      $('iframe').contents().find('style').append(
        `
        .submit-link .morelink a:hover, .submit-text .morelink a:hover,
        .submit-page button[type="submit"]:hover, #sr-form .save-button button:hover, .save-button > button:nth-child(1):hover,
        .toggleButton.enabled::before {
          background-color: ${newColor} !important;
        }
        `
      );
    } else if (id === '#lightPrimaryColorPicker') {
      let rVal = hexToRgb(newColor).r;
      let gVal = hexToRgb(newColor).g;
      let bVal = hexToRgb(newColor).b;
      $('iframe').contents().find('style').text(
        $('iframe').contents().find('style').text()
          .replace(/rgba\(77,208,225,0\.3\)/g, `rgba(${rVal},${gVal},${bVal},0.3)`)
      );
    } else if (id === '#accentColorPicker') {
      $('iframe').contents().find('style').append(
        `
        .tabmenu li a:hover::after,
        .tabmenu li #viewImagesButton:hover::after,
        ul.tabmenu.formtab li a:hover::after {
          border-bottom: 2px solid ${newColor};
        }
        .tabmenu li.selected a,
        ul.tabmenu.formtab li.selected a {
          border-bottom-color: ${newColor};
        }
        input[type="text"]:focus,
        input[type="password"]:focus,
        input[type="url"]:focus,
        textarea:focus {
          border-bottom-color: ${newColor} !important;
        }
        #sr-more-link {
          background-color: ${newColor} !important;
        }
        #search:hover::before {
          color: ${newColor};
        }
        #search input[type="text"]:focus {
          border-bottom: 1px solid${newColor};
        }
        label + #moresearchinfo {
          border-color: ${newColor};
        }
        `
      );
    } else if (id === '#darkAccentColorPicker') {
    } else if (id === '#lightAccentColorPicker') {
      let rVal = hexToRgb(newColor).r;
      let gVal = hexToRgb(newColor).g;
      let bVal = hexToRgb(newColor).b;
      $('iframe').contents().find('style').append(
        `
        #header-bottom-left .tabmenu li a,
        #header-bottom-left .tabmenu li #viewImagesButton {
          background: transparent radial-gradient(circle, rgba(${rVal}, ${gVal}, ${bVal}, 0.3) 15%, transparent 30%) no-repeat 50% 50%/0 !important;
        }
        `
      );
    } else if (id === '#linkColorColorPicker') {
      $('iframe').contents().find('style').append(
        `
        body a,
        #siteTable > .thing .title {
          color: ${newColor};
        }
        `
      );
    } else if (id === '#linkColorHoverColorPicker') {
      $('iframe').contents().find('style').append(
        `
        body a:hover,
        #siteTable > .thing .title:hover {
          color: ${newColor};
        }
        `
      );
    } else if (id === '#linkColorActiveColorPicker') {
      $('iframe').contents().find('style').append(
        `
        body a:active,
        #siteTable > .thing .title:active {
          color: ${newColor};
        }
        `
      );
    } else if (id === '#linkColorVisitedColorPicker') {
      $('iframe').contents().find('style').append(
        `
        body a:visited,
        #siteTable > .thing .title:visited {
          color: ${newColor};
        }
        `
      );
    } else if (id === '#linkColorNightColorPicker') {
    } else if (id === '#linkColorHoverNightColorPicker') {
    } else if (id === '#linkColorActiveNightColorPicker') {
    } else if (id === '#linkColorVisitedNightColorPicker') {
    } else if (id === '#upvoteColorPicker') {
      $('iframe').contents().find('style').append(
        `
        .sidecontentbox .gadget .thing span.score.likes,
        #siteTable .score.likes,
        .thing .link .score.likes {
          color: ${newColor};
        }
        .arrow.upmod::before,
        .arrow.upmod:hover::before,
        .arrow.upmod:focus::after,
        .arrow.up:focus::after {
          background-color: ${newColor};
        }
        `
      );
    } else if (id === '#downvoteColorPicker') {
      $('iframe').contents().find('style').append(
        `
        .sidecontentbox .gadget .thing span.score.dislikes,
        #siteTable .score.dislikes,
        .thing .link .score.dislikes,
        .sidecontentbox .gadget .thing span.score.dislikes {
          color: ${newColor};
        }
        .arrow.downmod::before,
        .arrow.downmod:hover::before,
        .arrow.downmod:focus::after,
        .arrow.down:focus::after {
          background-color: ${newColor};
        }
        `
      );
    }

    // after error handling, set variable to final spectrum value
    colors[value] = $(`.${id.slice(1)}Container input`).val();
    console.log(`${value} = ${colors[value]}`);
  });
}

// generate swatches for each palette
palettes.forEach((element, index, array) => (
  createSpectrum(
    array[index].id,
    array[index].swatch,
    array[index].colorPalette,
    array[index].replacerClassName,
    array[index].value
  )
));