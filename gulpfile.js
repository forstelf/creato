var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    browserS = require('browser-sync'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    postcss = require('gulp-postcss'),
    del = require('del');

gulp.task('sass', function () {
    return gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('target/css'))
        .pipe(browserS.reload({ stream: true }))
});

gulp.task('autoprefixer', function () {
    return gulp.src('target/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('target/css'));
});

gulp.task('minify-css', function () {
    return gulp.src('target/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('target/css'));
});

gulp.task('sass-auto', gulp.series('sass', 'autoprefixer', 'minify-css'));

gulp.task('clean', function () {
    return del.sync('target')
});

gulp.task('browserS', function () {
    browserS({
        server: {
            baseDir: 'target'
        },
        notify: false
    })
});

gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('target/js'));
});

gulp.task('buildTarget', function () {
    gulp.src('src/images/*')
        .pipe(imagemin({
            optimizationLevel: 2,
            svgoPlugins: [{ removeViewBox: true }]
        }))
        .pipe(gulp.dest('target/images'));

    gulp.src('src/js/*.js')
        .pipe(gulp.dest('target/js'));

    gulp.src('src/html/*.html')
        .pipe(gulp.dest('target'));
});

gulp.task('watch', function () {
    gulp.watch('src/css/*.scss', gulp.series('sass-auto'));
    gulp.watch("src/html/*.html", gulp.series('buildTarget')).on('change', browserS.reload);
    gulp.watch('src/js/*.js', gulp.series('buildTarget')).on('change', browserS.reload);
});

gulp.task('build', gulp.parallel('clean', 'sass-auto', 'buildTarget'));
gulp.task('default', gulp.parallel('build', 'browserS', 'watch'));
