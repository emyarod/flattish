var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('app/js/'));
});

gulp.task('clean', function() {
  return del(['app/js']);
});

gulp.task('default', ['clean'], function () {
  gulp.start('scripts');
});