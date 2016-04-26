var red500 = '#f44336';
var pink500 = '#e91e63';
var purple500 = '#9c27b0';
var deepPurple500 = '#673ab7';
var indigo500 = '#3f51b5';
var blue500 = '#2196f3';
var lightBlue500 = '#03a9f4';
var cyan500 = '#00bcd4';
var teal500 = '#009688';
var green500 = '#4caf50';
var lightGreen500 = '#8bc34a';
var lime500 = '#cddc39';
var yellow500 = '#ffeb3b';
var amber500 = '#ffc107';
var orange500 = '#ff9800';
var deepOrange500 = '#ff5722';
var brown500 = '#795548';
var grey500 = '#9e9e9e';
var blueGrey500 = '#607d8b';

var red700 = '#d32f2f';
var pink700 = '#c2185b';
var purple700 = '#7b1fa2';
var deepPurple700 = '#512da8';
var indigo700 = '#303f9f';
var blue700 = '#1976d2';
var lightBlue700 = '#0288d1';
var cyan700 = '#0097a7';
var teal700 = '#00796b';
var green700 = '#388e3c';
var lightGreen700 = '#689f38';
var lime700 = '#afb42b';
var yellow700 = '#fbc02d';
var amber700 = '#ffa000';
var orange700 = '#f57c00';
var deepOrange700 = '#e64a19';
var brown700 = '#5d4037';
var grey700 = '#616161';
var blueGrey700 = '#455a64';

var red300 = '#e57373';
var pink300 = '#f06292';
var purple300 = '#ba68c8';
var deepPurple300 = '#9575cd';
var indigo300 = '#7986cb';
var blue300 = '#64b5f6';
var lightBlue300 = '#4fc3f7';
var cyan300 = '#4dd0e1';
var teal300 = '#4db6ac';
var green300 = '#81c784';
var lightGreen300 = '#aed581';
var lime300 = '#dce775';
var yellow300 = '#fff176';
var amber300 = '#ffd54f';
var orange300 = '#ffb74d';
var deepOrange300 = '#ff8a65';
var brown300 = '#a1887f';
var grey300 = '#e0e0e0';
var blueGrey300 = '#90a4ae';

var white = '#fff';
var black = '#000';

// colors
var colors = {
  primary: cyan500,
  darkPrimary: cyan700,
  lightPrimary: cyan300,
  accent: '#ffab40',
  darkAccent: '#ff9100',
  lightAccent: '#ffd180',
}

var basePalette = [
  ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue'],
  ['cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber'],
  ['orange', 'deepOrange', 'brown', 'grey', 'blueGrey'],
];

// generate color palettes
function paletteCreator(newPalette, colorCode) {

  // push the 3 arrays from palette into new array
  basePalette.forEach((element, index, array) => (
    newPalette[index] = array[index].slice()
  ));

  // evaluate each element of nested arrays as variables
  newPalette.forEach((element, index, array) => {
    newPalette[index].forEach((element, i, array) => (
      newPalette[index][i] = eval(element + colorCode)
    ))
  });

  // add white and black vars
  newPalette[newPalette.length - 1].push(white, black);
}

var primaryPalette = [];
var darkPrimaryPalette = [];
var lightPrimaryPalette = [];

var allPalettes = [
  ['primaryPalette', '500'],
  ['darkPrimaryPalette', '700'],
  ['lightPrimaryPalette', '300'],
];

// create palettes
allPalettes.forEach((element, index, array) => (
  paletteCreator(eval(array[index][0]), array[index][1])
));

// spectrum color pickers



// initialize all new palettes from an array
function paletteConstructorArray(yourArrayOfWhatever) {

  // palette constructor
  function Palette(value) {
    this.id = `#${value}ColorPicker`,
    this.swatch = eval(`colors.${value}`),
    this.value = value,
    this.colorPalette = `${value}Palette`
  }

  let newArray = [];
  for (var i = 0; i < yourArrayOfWhatever.length; i++) {
    var newConstructor = new Palette(yourArrayOfWhatever[i]);
    newArray.push(newConstructor);
  }
  return newArray;
}

// var palettes = paletteConstructorArray(['primary', 'darkPrimary', 'lightPrimary']);

var palettes = [];

allPalettes.forEach((element, index, array) => (
  palettes.push(array[index][0].slice(0, -7))
));

palettes = paletteConstructorArray(palettes);

console.log(palettes);

function createSpectrum(id, swatch, colorPalette = null, value) {
  $(id).spectrum({
    color: swatch,
    palette: eval(colorPalette),
    theme: 'sp-light',
    showInput: true,
    showInitial: true,
    showPalette: true,
    preferredFormat: 'hex3',
    containerClassName: `${id.slice(1)}Container`,
    replacerClassName: '',
  });

  $(id).show();

  $(id).on('change', () => {

    // set spectrum value equal to input field value
    $(id).spectrum('set', $(id).val());

    // after error handling, set variable to final spectrum value
    colors[value] = $(`.${id.slice(1)}Container input`).val();
    console.log(`${value} = ${colors[value]}`);
  });
}

palettes.forEach((element, index, array) => (
  createSpectrum(array[index].id, array[index].swatch, array[index].colorPalette, array[index].value)
));

// createSpectrum(palettes[0].id, palettes[0].swatch, palettes[0].colorPalette, palettes[0].value);
// createSpectrum(palettes[1].id, palettes[1].swatch, palettes[1].colorPalette, palettes[1].value);
// createSpectrum(palettes[2].id, palettes[2].swatch, palettes[2].colorPalette, palettes[2].value);

// createSpectrum('#primaryColorPicker', colors.primary, 'primary', primaryPalette);
// createSpectrum('#darkPrimaryColorPicker', colors.darkPrimary, 'darkPrimary', darkPrimaryPalette);
// createSpectrum('#lightPrimaryColorPicker', colors.lightPrimary, lightPrimaryPalette, 'lightPrimary');

// addons
// large header
var largeHeader;

// random header
var randomHeader;

// sidebar image
var sidebarImage;
var sidebarImageHeight;

// pinned topics
var pinnedTopics;
var numStickiedLinks; // number of stickied links
var numStickiedMenus; // number of stickied menus

// desired image backgrounds for stickies
var stickyLinkImages;
var stickyMenuImages;

$(document).ready(function() {
  $.ajax({
    url: 'style/flattish.scss'
    // url: 'style/utils/_vars.scss'
    // url: 'test.scss'
  })
  .done(function(data) {
    $('#target').html(data);
  })
});

var sass = new Sass();

sass.options({ style: Sass.style.expanded }, result => (
  console.log('set options')
));

// download the files immediately
for (var key in Sass.maps) {
  if (Sass.maps.hasOwnProperty(key)) {
    console.log(`loading ${key}`);
    sass.preloadFiles(Sass.maps[key].base, Sass.maps[key].directory, Sass.maps[key].files, function() {
      console.log('files loaded');
    });
  }
}

$('#compile').click(function() {

  // get a file's content
  sass.readFile('flattish/utils/_vars.scss', function callback(content) {
    if (content !== undefined) {
      console.log('reading _vars.scss');

      content = content.replace(/(\$primary: .*?;)|(\$dark-primary: .*?;)|(\$light-primary: .*?;)/g, function(str, p1, p2, p3) {
        if(p1) return `$primary: ${colors.primary};`;
        if(p2) return `$dark-primary: ${colors.darkPrimary};`;
        if(p3) return `$light-primary: ${colors.lightPrimary};`;
      })

      // register a file to be available for @import
      sass.writeFile('flattish/utils/_vars.scss', content, function callback(success) {
        if (success) {
          console.log('_vars.scss successfully written');
        } else {
          console.log('writeFile failed');
        }

        // compile main Sass file
        sass.compileFile('flattish/flattish.scss', function(result) {
          console.log('compiled');
          console.log(result);
          $('#target').html(result.text);
        });
      });
    } else {
      console.log('readFile failed');
    }
  });
});