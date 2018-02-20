'use strict';
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    inject = require('gulp-inject-string');

//Function for handling errorHandler
var onError = function(err) {
    console.log('An error occured: ', err.message);
    this.emit('end');
};

//for more info: https://www.npmjs.com/package/gulp-sass
gulp.task('scss', function() {
    return gulp.src('./client/src/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('style.scss'))
        .pipe(gulp.dest('./client/build'))
        .pipe(rename({suffix: '.min'}))
        .pipe(scss({outputStyle: 'compressed'})
        .on('error', scss.logError))// with this part ".on('error', sass.logError)" you prevent gulp file break on errors
        .pipe(sourcemaps.write())//Write sourcemaps
        .pipe(gulp.dest('./client/build/'));
});


gulp.task('uglify', function() {
    return gulp.src([ 
        //'./client/src/js/index.js',
        //'./client/src/js/input-validators.js',
        './client/src/app.js'
    ])
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('./client/build/'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./client/build/'));
});

gulp.task('watch', function() {
    gulp.watch('client/src/**/*.scss', ['scss']);
    gulp.watch('client/src/**/*.js', ['uglify']);
});

gulp.task('default', ['uglify', 'scss', 'watch'], function() {
    console.log('Default task is running!');
});
