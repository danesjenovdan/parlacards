var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var ejs = require('gulp-ejs');
var gutil = require('gulp-util');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano'); // TODO remove
var cleancss = require('gulp-clean-css');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var deleteLines = require('gulp-delete-lines');
var replace = require('gulp-replace');
var install = require("gulp-install");
var wrap = require('gulp-wrap');

var debug = require('gulp-debug');

var minimist = require('minimist');

var knownOptions = {
    string: 'name',
    default: { path: process.env.NODE_ENV || 'newcard' }
};

var options = minimist(process.argv.slice(2), knownOptions);

// read data.json
var fs = require('fs');
var jsonData = JSON.parse(fs.readFileSync('card/data.json', 'utf-8'));

// generate CSS class name to use for sandboxing
var directoryName = __dirname.replace(/\\/g, '/').split('/').pop()
var className = 'card-' + directoryName

//#################
//## tasks below ##
//#################

// SASS/SCSS compiler
gulp.task('sass', function() {
    return gulp.src('card/scss/style.scss')
        .pipe(wrap('.' + className + '{<%= contents %>}', {}, { parse: false }))
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('temp/css'))
        .pipe(browserSync.reload({
            'stream': true
        }));
});

// minify compiled css
gulp.task('minify:css', function() {
    return gulp.src('temp/css/*.css')
        .pipe(cleancss({
            'compatibility': 'ie8'
        }))
        .pipe(gulp.dest('temp/css'));
});

// js uglifyer
gulp.task('js', function() {
    return gulp.src('card/js/script.js')
        .pipe(uglify())
        .pipe(gulp.dest('temp/js'));
});

// js copier (without uglify, for debug)
gulp.task('js-no-uglify', function() {
    return gulp.src('card/js/script.js')
        .pipe(gulp.dest('temp/js'));
});

// ejs compiler
gulp.task('ejs', function() {
    return gulp.src('card/card.ejs')
        .pipe(ejs({
            'data': jsonData,
            'className' : className
        }, {
            ext: '.html'
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('temp'));
});

// browserSync
gulp.task('browserSync', function() {
    browserSync.init({
        'server': {
            'baseDir': 'temp',
            'index': 'card.html'
        }
    });
});

// useref task to remove script files etc.
gulp.task('useref', function() {
    return gulp.src('card/card.ejs')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify())) //uglify/minify JS files
        // .pipe(gulpif('*.css', cssnano())) //minify CSS files TODO remove
        .pipe(gulp.dest('temp'));
});

// add inline css
gulp.task('inline', function() {
    return gulp.src('temp/card.ejs')
        .pipe(replace(/<link data-inline="true" [^>]*>/, function(s) {
            var style = fs.readFileSync('temp/css/style.css', 'utf8');
            return '<style>' + style + '</style>';
        }))
        .pipe(replace(/<script data-inline="true" [^>]*>/, function(s) {
            var style = fs.readFileSync('temp/js/script.js', 'utf8');
            return '<script>' + style + '</script>';
        }))
        .pipe(rename({
            'suffix': '-inline'
        }))
        .pipe(gulp.dest('temp'));
});

// remove lines task
gulp.task('remove-minify', function() {
    gulp.src('temp/card-inline.ejs')
        .pipe(deleteLines({
            'filters': [
                /<!-- removeme -->/i
            ]
        }))
        .pipe(rename({
            'basename': 'card.min'
        }))
        .pipe(htmlmin({ // piping directly to minifyhtml
            'collapseWhitespace': true,
            'conservativeCollapse': false,
            'removeComments': true
        }))
        .pipe(replace(/<%= *className *%>/, className))
        .pipe(replace(/\n/g, '')) // cleaning up newlines that were left
        .pipe(replace(/\s\s+/g, ' ')) // cleaning up multiple spaces that were left
        .pipe(gulp.dest('dist'));
});

// watch task for serve
gulp.task('watch', function() {
    gulp.watch('card/scss/**/*.scss', ['sass']);
    gulp.watch('card/card.ejs', ['ejs', browserSync.reload]);
    gulp.watch('card/js/**/*.js', ['js-no-uglify', browserSync.reload]);
});

// clean temp folder
gulp.task('clean:temp', function() {
    return del.sync('temp');
})

// clean dist folder
gulp.task('clean:dist', function() {
    return del.sync('dist');
})

// serve
gulp.task('serve', function(callback) {
    runSequence(
        'clean:temp', ['ejs', 'sass', 'js-no-uglify', 'browserSync', 'watch'],
        callback
    );
});

// build
gulp.task('build', function(callback) {
    runSequence(
        ['clean:dist', 'clean:temp'], ['sass', 'js', 'useref'],
        'minify:css',
        'inline',
        'remove-minify',
        callback
    );
});

// copy card
gulp.task('copy:card', function() {
    return gulp.src('card/**/*.*')
        .pipe(gulp.dest(options.path + '/card'))
});
// copy gulpfile and package.json
gulp.task('copy:scaffolding', function() {
    return gulp.src(['gulpfile.js', 'package.json'])
        .pipe(gulp.dest(options.path))
});
// run npm install
gulp.task('install:package.json', function() {
    return gulp.src(options.path + '/package.json')
        .pipe(install());
});

// create
gulp.task('create', function(callback) {
    runSequence(
        'copy:card',
        'copy:scaffolding',
        'install:package.json',
        callback
    );
})