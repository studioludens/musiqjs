var browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream');

module.exports = function () {
    return function() {
        return browserify()
            .require('./src/MUSIQ.js')
            .transform('browserify-shim', {
                global: true
            })
            .transform('uglifyify')
            .bundle()
            .pipe(source('musiqjs.min.js'))
            .pipe(gulp.dest('./'));
    };
};