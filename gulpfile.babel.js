'use strict';

// include gulp and tools used
import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';

const paths = {
  src: 'src',
  dest: 'app',
};

gulp.task('scripts', () => {
  return gulp.src(`${paths.src}/js/**/*.js`)
  .pipe(babel())
  .pipe(gulp.dest(`${paths.dest}/js/'`));
});

gulp.task('clean', () => {
  return del([`${paths.dest}/js'`]);
});

gulp.task('default', ['clean'], () => {
  gulp.start('scripts');
});