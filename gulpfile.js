var gulp        = require('gulp');
var path        = require('path');
var less        = require('gulp-less');
var cleanCSS    = require('gulp-clean-css');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var clean       = require('gulp-clean');
var runSequence = require('run-sequence');
var connect     = require('gulp-connect');

var srcs = {
  less: ['./src/css/app.less'],
  js:   ['./bower_components/bootstrap/js/*.js', './bower_components/backbone/backbone.js']
}

var dests = {
  less: './public/css',
  js:   './public/js'
}

gulp.task('clean', function(){
  return gulp.src(['public'], {read:false})
  .pipe(clean());
});

gulp.task('move', function(){
  gulp.src(['./src/img/*', './src/fonts/*', './src/*.html'],  { base: './src' })
  .pipe(gulp.dest('./public'));
});

gulp.task('move:clean', function () {
  runSequence('clean', 'move');
});

gulp.task('less', function () {
  return gulp.src(srcs.less)
  .pipe(sourcemaps.init())
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(dests.less));
});

gulp.task('scripts', function() {  
  return gulp.src(srcs.js)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(dests.js))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dests.js));
});

gulp.task('compile', ['move:clean', 'less', 'scripts']);

gulp.task('webserver', function() {
  connect.server({
    root: "./public"
  });
});

gulp.task('watch', ['compile'], function () {
  gulp.watch('./src/css/*.less', ['less']);
  gulp.watch(['./src/img/*', './src/fonts/*', './src/*.html'],  ['move']);
  runSequence('webserver')
});