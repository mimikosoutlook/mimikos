var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var rem = require('rimraf')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var plumber = require('gulp-plumber')
var browserSync = require('browser-sync')
var buildSemantic = require('./client/semantic/tasks/build')
var watchSemantic = require('./client/semantic/tasks/watch')
var config
try {
  config = require('./config.json')
} catch (e) {
  config = require('./config.example.json')
}

var BROWSER_SYNC_RELOAD_DELAY = 500

gulp.task('post-install', ['build-semantic', 'build'])
gulp.task('build', ['scripts', 'css'])
gulp.task('build-semantic', buildSemantic)
gulp.task('watch-semantic', watchSemantic)

gulp.task('dev', ['build'], function (cb) {
  gulp.watch(['client/js/**/*.js'], ['scripts'])
  gulp.watch(['client/css/**/*.css'], ['css'])
  gulp.watch(['public/js/**/*.js', 'server/views/**/*'], browserSync.reload)
  gulp.start('watch-semantic')
  gulp.start('browsersync')
  cb()
})

gulp.task('scripts', function () {
  rem('public/js/**/*', function () {
    gulp.src(['./client/js/**/*.js'])
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(uglify({mangle: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js'))
  })
})

gulp.task('css', function () {
  rem('public/css/**/*', function () {
    gulp.src(['client/css/**/*.css'])
      .pipe(gulp.dest('public/css'))
      .pipe(browserSync.stream())
  })
})

// browsersync - watches client files and reloads browser
gulp.task('browsersync', ['nodemon'], function () {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({
    proxy: 'http://localhost:' + config.PORT,
    port: 3000,
    notify: false
  })
})

// nodemon - watches server files and restart server on change
gulp.task('nodemon', function (cb) {
  return nodemon({
    script: 'index.js',
    ignore: ['server/views/**/*'],
    // watch core server file(s) that require server restart on change
    watch: ['index.js', 'config.example.json', 'config.json', 'server/**/*']
  })
  .once('start', function onStart () {
    setTimeout(function () {
      cb()
    }, 5000)
  })
  .on('restart', function onRestart () {
    setTimeout(function reload () {
      browserSync.reload({
        stream: false
      })
    }, BROWSER_SYNC_RELOAD_DELAY)
  })
})
