'use strict';

import gulp from 'gulp';
import del from 'del';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';

const paths = {
  src: 'src',
  dest: 'app',
};

// clean out destination folders before rebuilding from source
gulp.task('clean', () => {
  return del([`${paths.dest}`]);
});

gulp.task('minify', ['clean'], () => {
  return gulp.src(`${paths.src}/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('./'));
});

/**
 * stream webpack config with babel presets and optimizations
 *
 * bundle modules and dependencies
 * transpile ES6 to ES2015 via babel
 * mangle and uglify
 * output to destination
 */
gulp.task('webpack', ['minify'], () => {
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

  // run `js-watch` task on file changes
  gulp.watch([
    `${paths.src}/index.html`,
    `${paths.src}/js/**/*.js`,
    `${paths.src}/css/*.scss`,
    './webpack.config.js',
    './gulpfile.babel.js',
  ], ['js-watch']);
});