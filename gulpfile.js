var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    less = require('gulp-less'),
    prefix = require('gulp-autoprefixer'),
    reload = browserSync.reload;

gulp.task('less', function () {
    return gulp.src('app/styles/app.less')
        .pipe(less({ieCompat: false}))
        .pipe(prefix('last 2 versions', 'ie >= 10'))
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app'
        }
    });
});

gulp.task('default', ['less', 'browser-sync'], function () {
    gulp.watch('app/**/*.less', ['less']);
    gulp.watch(['app/**/*.js', 'app/**/*.html'], reload);
});
