import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import ejs from 'gulp-ejs';
import gutil from 'gulp-util';
import useref from 'gulp-useref';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import cleancss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import del from 'del';
import runSequence from 'run-sequence';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import deleteLines from 'gulp-delete-lines';
import replace from 'gulp-replace';
import wrap from 'gulp-wrap';
import request from 'request';
import minimist from 'minimist';
import babel from 'gulp-babel';
import fs from 'fs';

browserSync.create();

const defaultPath = 'p/besedni-zaklad';
const knownOptions = {
  string: 'name',
  default: { path: process.env.NODE_ENV || defaultPath },
};

const options = minimist(process.argv.slice(2), knownOptions);

function getFileContents(filePath, defaultValue = false) {
  const fullPath = `${options.path}/${filePath}`;

  if (fs.existsSync(fullPath)) {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  }
  return defaultValue;
}

// read card.json
const cardData = getFileContents('card.json');

// generate CSS class with card name from path param to use for sandboxing
const className = `card-${options.path.split('/')[1]}`;

// generate random id
const randomId = (() => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array(5).fill(0).map(() => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
})();

// #################
// ## tasks below ##
// #################

// SASS/SCSS compiler
gulp.task('sass', () =>
  gulp.src(`${options.path}/scss/style.scss`)
      .pipe(wrap(`.${className}{<%= contents %>}`, {}, { parse: false }))
      .pipe(sass({ includePaths: 'node_modules' })) // Converts Sass to CSS with gulp-sass
      .pipe(autoprefixer())
      .pipe(gulp.dest('temp/css'))
      .pipe(browserSync.reload({ stream: true })),
);

// minify compiled css
gulp.task('minify:css', () =>
  gulp.src('temp/css/*.css')
      .pipe(cleancss({
        compatibility: 'ie8',
      }))
      .pipe(gulp.dest('temp/css')),
);

// js uglifyer
gulp.task('js', () =>
  gulp.src(`${options.path}/js/script.js`)
      .pipe(replace('/* SCRIPT_PARAMS */', `"${randomId}", "${className}", "${cardData}"`))
      .pipe(babel({
        presets: ['es2015'],
      }))
      .pipe(uglify())
      .pipe(gulp.dest('temp/js')),
);

// js copier (without uglify, for debug)
gulp.task('js-no-uglify', () =>
  gulp.src(`${options.path}/js/script.js`)
      .pipe(replace('/* SCRIPT_PARAMS */', `"${randomId}", "${className}", "${cardData}"`))
      .pipe(babel({
        presets: ['es2015'],
      }))
      .pipe(gulp.dest('temp/js')),
);

// ejs compiler
gulp.task('ejs', () =>
  gulp.src(`${options.path}/card.ejs`)
      .pipe(ejs({
        data: getFileContents('data.json'),
        className,
        vocab: getFileContents('../../vocab.json'),
        cardData,
        state: getFileContents('state.json'),
        urlsData: getFileContents('../../urls.json'),
        customUrl: getFileContents('customUrl.json'),
        randomId,
      }, {}, {
        ext: '.html',
      }))
      .on('error', gutil.log)
      .pipe(gulp.dest('temp')),
);

// browserSync
gulp.task('browserSync', () =>
  browserSync.init({
    server: {
      baseDir: 'temp',
      index: 'card.html',
    },
  }),
);

// useref task to remove script files etc.
gulp.task('useref', () =>
  gulp.src(`${options.path}/card.ejs`)
      .pipe(useref())
      .pipe(gulpif('*.js', uglify())) // uglify/minify JS files
      .pipe(gulp.dest('temp')),
);

// add inline css
gulp.task('inline', () =>
  gulp.src('temp/card.ejs')
      .pipe(replace(/<link data-inline="true" [^>]*>/, () => {
        const style = fs.readFileSync('temp/css/style.css', 'utf8');
        return `<style>${style}</style>`;
      }))
      .pipe(replace(/<script data-inline="true" [^>]*>/, () => {
        const style = fs.readFileSync('temp/js/script.js', 'utf8');
        return `<script>${style}</script>`;
      }))
      .pipe(rename({
        suffix: '-inline',
      }))
      .pipe(gulp.dest('temp')),
);

// remove lines task
gulp.task('remove-minify', () =>
  gulp.src('temp/card-inline.ejs')
      .pipe(deleteLines({
        filters: [/<!-- removeme -->/i],
      }))
      .pipe(rename({
        basename: 'card.min',
      }))
      .pipe(htmlmin({ // piping directly to minifyhtml
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
      }))
      .pipe(replace(/<%= *className *%>/g, className))
      .pipe(replace(/<%= *randomId *%>/g, randomId))
      .pipe(replace(/\n/g, '')) // cleaning up newlines that were left
      .pipe(replace(/\s\s+/g, ' ')) // cleaning up multiple spaces that were left
      .pipe(gulp.dest('dist')),
);

// watch task for serve
gulp.task('watch', () => {
  gulp.watch(`${options.path}/scss/**/*.scss`, ['sass']);
  gulp.watch(`${options.path}/card.ejs`, ['ejs', browserSync.reload]);
  gulp.watch(`${options.path}/js/**/*.js`, ['js-no-uglify', browserSync.reload]);
});

// clean temp folder
gulp.task('clean:temp', () => del.sync('temp'));

// clean dist folder
gulp.task('clean:dist', () => del.sync('dist'));

// serve
gulp.task('serve', callback =>
  runSequence(
    'clean:temp', ['ejs', 'sass', 'js-no-uglify', 'browserSync', 'watch'],
    callback,
  ),
);

// build
gulp.task('build', callback =>
  runSequence(
    ['clean:dist', 'clean:temp'], ['sass', 'js', 'useref'],
    'minify:css',
    'inline',
    'remove-minify',
    callback,
  ),
);

// push file contents to server
gulp.task('push', () =>
  fs.readFile('dist/card.min.ejs', 'utf8', (err, data) => {
    request.post({
      /* eslint no-underscore-dangle: "off" */
      // url: `https://glej.parlameter.si/api/card/${cardData._id}/updateEjs`,
      url: `http://localhost:3000/api/card/${cardData._id}/updateEjs`,
      json: { ejs: data },
    }, (err2, response) =>
      fs.writeFile(`${options.path}/card.json`, JSON.stringify(response.body), 'utf-8'),
    );
  }),
);

// build and push
gulp.task('push-build', callback =>
  runSequence(
    'build',
    'push',
    callback,
  ),
);
