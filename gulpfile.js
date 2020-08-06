const gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  del = require("del"),
  autoprefix = require("gulp-autoprefixer");

sass.compiler = require("node-sass");

gulp.task("clean", async function () {
  del.sync("dist");
});

gulp.task("scss", function () {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefix({
        overrideBrowserslist: ["last 5 versions"],
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("css", function () {
  return gulp
    .src([
      "node_modules/normalize.css/normalize.css",
      "node_modules/slick-carousel/slick/slick.css",
      // "node_modules/fullpage.js/dist/fullpage.css",
      "node_modules/animate.css/animate.css",
      "node_modules/wow.js/css/libs/animate.css",
    ])
    .pipe(concat("_libs.scss"))
    .pipe(gulp.dest("app/scss"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", function () {
  return gulp
    .src([
      "node_modules/slick-carousel/slick/slick.js",
      // "node_modules/fullpage.js/dist/fullpage.js",
      "node_modules/wow.js/dist/wow.js",
    ])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("app/js"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("script", function () {
  return gulp.src("app/js/*.js").pipe(browserSync.reload({ stream: true }));
});

gulp.task("html", function () {
  return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
});

gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
});

gulp.task("export", function () {
  let buildHtml = gulp.src("app/**/*.html").pipe(gulp.dest("dist"));

  let buildCss = gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css"));

  let buildJs = gulp.src("app/js/**/*.js").pipe(gulp.dest("dist/js"));

  let buildFonts = gulp.src("app/fonts/**/*.*").pipe(gulp.dest("dist/fonts"));

  let buildImg = gulp.src("app/images/**/*.*").pipe(gulp.dest("dist/images"));
});

gulp.task("build", gulp.series("clean", "export"));

gulp.task("watch", function () {
  gulp.watch("app/scss/**/*.scss", gulp.parallel("scss"));
  gulp.watch("app/*.html", gulp.parallel("html"));
  gulp.watch("app/js/**/*.js", gulp.parallel("script"));
});

gulp.task(
  "default",
  gulp.parallel("css", "scss", "js", "watch", "browser-sync")
);
