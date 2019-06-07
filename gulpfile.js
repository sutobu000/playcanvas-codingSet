const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cache = require("gulp-cache");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const changed = require("gulp-changed");
const plumber = require("gulp-plumber");

const browserSync = require("browser-sync");
const runSequence = require("run-sequence");

const playcanvas = require("gulp-playcanvas");
const pcOptions = require("./config");


var sassOptions = {
// outputStyle: "compressed",
outputStyle: "expanded",
sourceMap: true,
sourceComments: false
};

var autoprefixerOptions = {
browsers: ["last 2 version", "ie >= 11", "Android >= 4.0"]
};

// キャッシュをクリア
gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

gulp.task("pug", () => {
  return gulp
    .src(["src/pug/**/*.pug", "!src/pug/**/_*.pug"])
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(pug({
      pretty: true,
      locals: {
        playcanvas: false
      }
    }))
    .pipe(changed("dist", {extension: '.html'}))
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.stream())
    // .pipe(pug({
    //   pretty: true,
    //   locals: {
    //     playcanvas: false
    //   }
    // }))
    // .pipe(changed("pc", {extension: '.html'}))
    // .pipe(gulp.dest("pc/"))
    // .pipe(playcanvas(pcOptions));
});
gulp.task("pug2", () => {
  return gulp
    .src(["src/pug/**/*.pug", "!src/pug/**/_*.pug"])
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(pug({
      pretty: true,
      locals: {
        playcanvas: false
      }
    }))
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.stream())
    // .pipe(pug({
    //   pretty: true,
    //   locals: {
    //     playcanvas: false
    //   }
    // }))
    // .pipe(gulp.dest("pc/"))
    // .pipe(playcanvas(pcOptions));
});
gulp.task("pug_pc", () => {
  return gulp
    .src(["src/pug/**/*.pug", "!src/pug/**/_*.pug"])
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(pug({
      pretty: true,
      locals: {
        playcanvas: true
      }
    }))
    .pipe(changed("pc", {extension: '.html'}))
    .pipe(gulp.dest("pc/"))
    .pipe(playcanvas(pcOptions));
});
gulp.task("pug2_pc", () => {
  return gulp
    .src(["src/pug/**/*.pug", "!src/pug/**/_*.pug"])
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(pug({
      pretty: true,
      locals: {
        playcanvas: true
      }
    }))
    .pipe(gulp.dest("pc/"))
    .pipe(playcanvas(pcOptions));
});



gulp.task("js", () => {
  return gulp
    .src(["src/js/*.js", "!src/js/_*.js"])
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(terser())
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream())
    .pipe(gulp.dest("pc/"))
    .pipe(playcanvas(pcOptions));
});

gulp.task("sass", () => {
  return gulp
    .src("src/sass/*.+(scss|sass)")
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(sass(sassOptions))
    .pipe(postcss([autoprefixer({autoprefixerOptions})]))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream())
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(gulp.dest("pc/"))
    .pipe(playcanvas(pcOptions));
});

gulp.task("browser-sync", () => {
  browserSync.init({
    online: true,
    ui: false,
    // proxy: {
    //     target: "http://test.dev",
    // }
        server: {
            baseDir: "./dist",
        },
    port: 9084
  });
});
//監視開始
gulp.task("watch", () => {
  gulp.watch(['src/pug/**/*.pug','!src/pug/**/_*.pug'], gulp.task("pug"));
  gulp.watch(['src/pug/**/_*.pug'], gulp.task("pug2"));
  gulp.watch("src/sass/**/*.+(scss|sass)", gulp.task("sass"));
  gulp.watch(["src/js/*.js","!src/js/*.min.js"],gulp.task("js"));

  gulp.watch(['src/pug/**/*.pug','!src/pug/**/_*.pug'], gulp.task("pug_pc"));
  gulp.watch(['src/pug/**/_*.pug'], gulp.task("pug2_pc"));
});

gulp.task('default', gulp.parallel('clear', 'watch', "browser-sync"));

