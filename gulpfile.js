

let project_folder = require("path").basename(__dirname);
let src_folder = "#src";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/"
  },
  
  src: {
    html: src_folder+"/*.html",
    css: src_folder + "/scss/style.scss",
    js: src_folder + "/js/script.js",
    img: src_folder + "/img/*.{jpeg,jpg,png,svg, PNG}",
    fonts: src_folder + "/fonts/*.ttf",
  },

  watch: {
    html: src_folder+"/**/*.html",
    css: src_folder + "/scss/**/*.scss",
    js: src_folder + "/js/**/*.js",
    img: src_folder + "/img/*.{jpeg,jpg,png,svg, PNG}",
  },

  clean: "./" + project_folder + "/"
};

let {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require("browser-sync").create();
  del = require("del");
  scss = require("gulp-sass");
  file_include = require("gulp-file-include");
  uglify = require("gulp-uglify-es");
  image_min = require("gulp-imagemin");
  ghPages = require('gulp-gh-pages');



function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
};

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
};

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
};

function js() {
  return src(path.src.js)
    .pipe(file_include())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function img() {
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
};

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream())
};

function clean(params) {
  return del(path.clean);
};

function watchFiles(params) {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.img], img)
};

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

let build = gulp.series(clean, gulp.parallel(js, css, html, img, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
