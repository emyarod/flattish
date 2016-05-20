'use strict';

import gulp from 'gulp';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import del from 'del';

const paths = {
  src: 'src',
  dest: 'app',
};

// clean out destination folders before rebuilding from source
gulp.task('clean', () => {
  return del([`${paths.dest}/js`]);
});

/**
 * bundle modules and dependencies
 * transpile ES6 to ES2015 via babel
 * mangle and uglify
 * output to destination
 */
gulp.task('webpack', ['clean'], () => {
  return gulp.src(`${paths.src}/js/test.js`)
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest(`${paths.dest}/js/`));
});

// run `webpack` before reloading browsers
gulp.task('js-watch', ['webpack'], browserSync.reload);

// default task
gulp.task('default', ['webpack'], () => {
  // static server
  browserSync.init({
    server: {
      baseDir: './',
    },
    browser: 'chrome',
    port: 8080,
  });

  gulp.watch([
    'index.html',
    `${paths.dest}/css/**/*.css`,
  ], browserSync.reload);

  // run `js-watch` task on file changes
  gulp.watch(`${paths.src}/js/**/*.js`, ['js-watch']);
});