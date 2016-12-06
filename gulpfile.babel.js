'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import del from 'del';

// clean out destination folders
gulp.task('clean', ['minify', 'sass'], () => del(['./dist']));

// compile to css
gulp.task('sass', () => {
  gulp.src('./style/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(gulp.dest(f => f.base));
});

// generate minified css
gulp.task('minify', () => {
  gulp.src('./style/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(rename((path) => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(f => f.base));
});

// pipe css to `dist`
gulp.task('css', ['clean'], () => (
  gulp.src('./style/flattish.min.css')
    .pipe(gulp.dest('./dist/'))
));

// pipe images to `dist`
gulp.task('images', ['clean'], () => {
  const images = {
    'header': 'headers/header.png',
    'sprites': 'sprites/*.png',
    'sidebar': 'sidebar.png',
  };

  let arr = Object.keys(images);
  arr.forEach((element, index, array) => (
    gulp.src(`./img/${images[element]}`)
      .pipe(gulp.dest('./dist/img'))
  ));
});

// pipe README to `dist`
gulp.task('readme', ['clean'], () => (
  gulp.src('./README.md')
    .pipe(gulp.dest('./dist/'))
));

// run `create-dist` on stylesheet or readme change
gulp.task('default', ['css', 'images', 'readme'], () => {
  gulp.watch('./**/*.scss', ['css', 'images', 'readme']);
  gulp.watch(['./style/flattish.min.css', './README.md'], ['css', 'images', 'readme']);
});