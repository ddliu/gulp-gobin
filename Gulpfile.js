var bindata = require('./');
var gulp = require('gulp');

gulp.task('test', function() {
    return gulp.src('tests/**/*.js')
        .pipe(bindata('bindata.go'))
        .pipe(gulp.dest('tests'));
});