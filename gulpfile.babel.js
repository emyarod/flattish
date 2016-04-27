'use strict';

// include gulp and tools used
import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';

const paths = {
  src: 'src',
  dest: 'app',
};

// scripts
gulp.task('scripts', () => {
  return gulp.src(`${paths.src}/js/**/*.js`)
  .pipe(babel())
  .pipe(gulp.dest(`${paths.dest}/js/`));
});

// clean
gulp.task('clean', () => {
  return del([`${paths.dest}/js`]);
});


// default
gulp.task('default', ['clean'], () => {
  gulp.start('scripts');
});

// watch