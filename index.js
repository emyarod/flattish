const red = '#f44336';
const pink = '#e91e63';
const purple = '#9c27b0';
const deepPurple = '#673ab7';
const indigo = '#3f51b5';
const blue = '#2196f3';
const lightBlue = '#03a9f4';
const cyan = '#00bcd4';
const teal = '#009688';
const green = '#4caf50';
const lightGreen = '#8bc34a';
const lime = '#cddc39';
const yellow = '#ffeb3b';
const amber = '#ffc107';
const orange = '#ff9800';
const deepOrange = '#ff5722';
const brown = '#795548';
const grey = '#9e9e9e';
const blueGrey = '#607d8b';
const white = '#fff';
const black = '#000';

// colors
var primary = '#00bcd4';
var darkPrimary = '#0097a7';
var lightPrimary = '#4dd0e1';
var accent = '#ffab40';
var darkAccent = '#ff9100';
var lightAccent = '#ffd180';

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

// spectrum color picker
$('#primaryColorPicker').spectrum({
    preferredFormat: 'hex3',
    color: primary,
    showInput: true,
    showInitial: true,
    showPalette: true,
    containerClassName: 'primaryColorPickerContainer',
    replacerClassName: '',
    theme: 'sp-light',
    palette: [
      [red, pink, purple, deepPurple, indigo, blue, lightBlue],
      [cyan, teal, green, lightGreen, lime, yellow, amber],
      [orange, deepOrange, brown, grey, blueGrey, white, black]
    ]
});

$('#primaryColorPicker').show();

$('#primaryColorPicker').on('change', function() {
  // set spectrum value equal to value in input field
  $('#primaryColorPicker').spectrum('set', $('#primaryColorPicker').val());

  // after error handling, set var primary to final spectrum value
  primary = $('.primaryColorPickerContainer input').val();
  console.log('primary color = ' + primary);
});

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

sass.options({ style: Sass.style.expanded }, function(result) {
  console.log('set options');
});

$('#compile').click(function() {
  // get a file's content
  sass.readFile('flattish/utils/_vars.scss', function callback(content) {
    // (string) content is the file's content,
    //   `undefined` when the read failed
    console.log(content);

    // register a file to be available for @import
    sass.writeFile('flattish/utils/_vars.scss', content.replace(/(\$)(primary)(:)( ).*?(;)/, '$primary: ' + primary + ';'), function callback(success) {
      console.log(success);
      // (boolean) success is
      //   `true` when the write was OK,
      //   `false` when it failed

      sass.readFile('flattish/utils/_vars.scss', function callback(content) {
        console.log('final ' + content);
      });

      sass.compileFile('flattish/flattish.scss', function(result) {
        // console.log("compiled", result.text);
        // console.log(result.file);
        // console.log(result.line);
        // console.log(result.message);
        console.log(result);
        $('#target').html(result.text);
      });
    });
  });
});

// download the files immediately
for (var key in Sass.maps) {
  if (Sass.maps.hasOwnProperty(key)) {
    console.log('loading ' + key);
    sass.preloadFiles(Sass.maps[key].base, Sass.maps[key].directory, Sass.maps[key].files, function() {
      console.log('files loaded')
    });
  }
}

// sass.preloadFiles(Sass.maps.bourbon.base, Sass.maps.bourbon.directory, Sass.maps.bourbon.files, function() {
//   console.log('files loaded');
//
//   sass.preloadFiles(Sass.maps.flattish.base, Sass.maps.flattish.directory, Sass.maps.flattish.files, function() {
//     console.log('files loaded');
//
//     // // get a file's content
//     // sass.readFile('flattish/utils/_vars.scss', function callback(content) {
//     //   // (string) content is the file's content,
//     //   //   `undefined` when the read failed
//     //   console.log(content);
//     //
//     //   // register a file to be available for @import
//     //   sass.writeFile('flattish/utils/_vars.scss', content.replace(/(\$)(primary)(:)( ).*?(;)/, '$primary: ' + primary + ';'), function callback(success) {
//     //     console.log(success);
//     //     // (boolean) success is
//     //     //   `true` when the write was OK,
//     //     //   `false` when it failed
//     //
//     //     sass.readFile('flattish/utils/_vars.scss', function callback(content) {
//     //       console.log('final ' + content);
//     //     });
//     //
//     //     sass.compileFile('flattish/flattish.scss', function(result) {
//     //       // console.log("compiled", result.text);
//     //       // console.log(result.file);
//     //       // console.log(result.line);
//     //       // console.log(result.message);
//     //       console.log(result);
//     //       $('#target').html(result.text);
//     //     });
//     //   });
//     // });
//   });
// });