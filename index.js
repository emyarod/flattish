var y;

$(document).ready(function() {
  $.ajax({
    // url: 'style/main.scss'
    url: 'style/_utils/_import.scss'
    // url: 'test.scss'
  })
  .done(function(data) {
    y = data;
    $('#target').html(data)
    // console.log(y);

    // var sass = new Sass();
    //
    // sass.writeFile('test.scss', y, function() {
    //   console.log('wrote "test.scss"');
    // });
    // sass.options({ style: Sass.style.expanded }, function(result) {
    //   console.log("set options");
    // });
    // sass.compile('@import "test";', function(result) {
    //   console.log("compiled", result.text);
    // });
  })
});

var sass = new Sass();

// var base = '../';
//
// var directory = '';
// var files = [
//   'test.scss'
// ];

// sass.compile('@import "test";', function(result) {
//   console.log("compiled", result.text);
// });

sass.options({ style: Sass.style.expanded }, function(result) {
  console.log("set options");
});

// download the files immediately
sass.preloadFiles(Sass.maps.bourbon.base, Sass.maps.bourbon.directory, Sass.maps.bourbon.files, function() {
  console.log('files loaded');
  // console.log(Sass.maps.bourbon.files);
  sass.compileFile('bourbon/_bourbon.scss', function(result) {
    console.log("compiled", result.text);
    // console.log("file array", result.files);
  });

  sass.preloadFiles(Sass.maps.flattish.base, Sass.maps.flattish.directory, Sass.maps.flattish.files, function() {
    console.log('files loaded');
    // console.log('flattish ' + Sass.maps.flattish.files);

    sass.listFiles(function callback(list) {
      // console.log('listfiles ' + list);
    });

    sass.compileFile('flattish/test2.scss', function(result) {
      console.log("compiled", result.text);
      console.log(result.file);
      console.log(result.line);
      console.log(result.message);
      // console.log("file array", result.files);
    });
  });
});