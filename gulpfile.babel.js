import path from 'path';
import gulp from 'gulp';
import babel from 'gulp-babel';
import newer from 'gulp-newer';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import nodemon from 'gulp-nodemon';

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!populate.js', '!frontend/**', '!webpack.config.js'],
  nonJs: ['./package.json', './.gitignore', './.babelrc'],
  tests: './dyc-survey/**/tests/*.js',
};

gulp.task('clean', () =>
  del(['./dist/**', '!./dist'])
);

gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(newer('dist'))
    .pipe(gulp.dest('dist'))
);

gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(newer('dist'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      },
    }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('nodemon', gulp.series(
  'copy',
  'babel',
  () => nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel'],
  }))
);

gulp.task('serve', gulp.series('clean', 'nodemon'));

gulp.task('default', gulp.series('clean', 'copy', 'babel'));

