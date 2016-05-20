'use strict';

// include gulp and tools used
import gulp from 'gulp';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import del from 'del';

const paths = {
  src: 'src',
  dest: 'app',
};

// clean out destination folders and rebuild from source
gulp.task('clean', () => {
  return del([`${paths.dest}/js`]);
});

/**
 * transpile to ES2015 via babel
 * mangle and uglify
 * output to destination
 */
gulp.task('webpack', ['clean'], () => {
  return gulp.src(`${paths.src}/js/test.js`)
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest(`${paths.dest}/js/`));
});

/**
 * watchers
 *
 * create a task that ensures the `js` task completes before reloading browsers
 */
gulp.task('js-watch', ['webpack'], browserSync.reload);

// default
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

  /**
   * add browserSync.reload to the tasks array to make
   * all browsers reload after tasks are complete
   */
  gulp.watch(`${paths.src}/js/**/*.js`, ['js-watch']);
});