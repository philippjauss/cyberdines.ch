var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();



// concat and minify css files
gulp.task('concatCSS', function () {
    return gulp.src(['src/vendor/bootstrap-dist/css/bootstrap.css', 'src/css/custom.css'])
        .pipe(concat('styles.css'))
        .pipe(cleanCSS({
            debug: true
        }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/css'));
});


// minify html
gulp.task('minifyHTML', function () {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist'));
});


// watcher
gulp.task('watch', ['browser-sync'], function () {
    //gulp.watch('src/**/*', ['minifyHTML','concatCSS','reloadBrowser']);
    gulp.watch('src/*.html', ['minifyHTML','reloadHTML']);
    gulp.watch('src/css/*.css', ['concatCSS','reloadCSS']);
});

gulp.task('reloadHTML', ['minifyHTML'], function(){
    browserSync.reload();
});

gulp.task('reloadCSS', ['concatCSS'], function () {
    browserSync.reload();
});


// Static server
gulp.task('browser-sync', ['minifyHTML', 'concatCSS'], function () {
    browserSync.init({
        server: {
            baseDir: 'dist',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    });
});

gulp.task('default', ['minifyHTML', 'concatCSS', 'browser-sync', 'watch']);