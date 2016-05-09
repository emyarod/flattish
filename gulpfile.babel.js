'use strict';

// include gulp and tools used
import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
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
 * transpile from ES2015 via babel
 * uglify
 * output to destination
 */
gulp.task('js', ['clean'], () => {
  return gulp.src(`${paths.src}/js/**/*.js`)
  .pipe(babel())
  // .pipe(uglify())
  .pipe(gulp.dest(`${paths.dest}/js/`));
});

/**
 * watchers
 *
 * create a task that ensures the `js` task completes before reloading browsers
 */
gulp.task('js-watch', ['js'], browserSync.reload);

// default
gulp.task('default', ['js'], () => {
  // static server
  browserSync.init({
    server: {
      baseDir: './',
    },
    browser: 'chrome',
    port: 8080,
  });

  gulp.watch('index.html', browserSync.reload);

  /**
   * add browserSync.reload to the tasks array to make
   * all browsers reload after tasks are complete
   */
  gulp.watch(`${paths.src}/js/**/*.js`, ['js-watch']);
});