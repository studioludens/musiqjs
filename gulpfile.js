var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    debug = require('gulp-debug'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    //return version + '.' + name + '.' + 'min';
    return name + '.' + 'min';
};


// define tasks here
gulp.task('default', function(){
    // run tasks here
    // set up watch handlers here
    console.log('running task default!');
});

gulp.task('docs', function(){
    gulp.src('docs')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('build', function(){

    var bundler = browserify({
        entries: ['./src/musiq.js'],
        debug: true
    });

    var bundle = function() {
        return bundler
            .bundle()
            .pipe(source(getBundleName() + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            // Add transformation tasks to the pipeline here.
            //.pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/'));
    };

    return bundle();
});

gulp.task('minify', function(){
    gulp.src('src/**/*.js')
        .pipe(uglify())
        .pipe(concat('musiqjs.min.js'))
        .pipe(gulp.dest('build'));
});