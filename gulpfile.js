const gulp = require("gulp");
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
// const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
// const imagemin = require("gulp-imagemin");
const jshint = require('gulp-jshint');
const uglify = require("gulp-uglify");
const clean = require('gulp-clean');
const cache = require('gulp-cache');
const browserSync = require("browser-sync").create();
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const webp = require('gulp-webp');
const purgecss = require('gulp-purgecss');

const config = {
	build: 'assets',
	dev: 'source',
}

const assets = {
	html: [
		config.dev + ['/**/*.html'],
	],

	css: [
		config.dev + '/scss/**/*.*'
	],
	images: [
		config.dev + '/images/*.{gif,jpg,png,svg,ico,pdf,mp4,mov,wmv,mp3,aac,webm,webp}',
		config.dev + '/images/**/*.{gif,jpg,png,svg,ico,pdf,mp4,mov,wmv,mp3,aac,webm,webp}'
	],
	libs: [
		// 'node_modules/slick-carousel/slick/slick.js',
		// 'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
		// 'node_modules/jquery-match-height/dist/jquery.matchHeight.js',
		// 'node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
		// 'node_modules/webfontloader/webfontloader.js',
		// 'node_modules/selectric/src/jquery.selectric.js',
		// 'node_modules/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
		// 'node_modules/smooth-scrollbar/dist/smooth-scrollbar.js',
		// 'node_modules/smooth-scrollbar/dist/plugins/overscroll.js',
		// 'node_modules/jquery-parallax.js/parallax.js',
		// 'node_modules/rellax/rellax.js',
		// 'node_modules/imagesloaded/imagesloaded.pkgd.js',
		// 'node_modules/jquery-zoom/jquery.zoom.js',
		// 'node_modules/js-cookie/src/js.cookie.js',
		// 'node_modules/perfect-scrollbar/dist/perfect-scrollbar.js',
	],
	customs: [
		config.dev + '/js/**/*.js',
		config.dev + '/js/custom.js',
	],
	font: [
		config.dev + '/fonts/*.*',
	], 
	html: [
		config.dev + '/*.html',
	],
}

function copyHtml() {
	return src(assets.html)
	.pipe(dest(config.build));
  }

function style() {
	return (
		gulp
		.src(assets.css, {read: true, allowEmpty: true})
		// .pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass().on('error', notify.onError()))
		
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 99 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(config.build + '/css'))
		.pipe(postcss([cssnano()]))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(browserSync.reload({
			stream: true
		}))
		// .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.build + '/css'))
	);
}
exports.style = style;

// function purgecss() {
// 	return (
// 		gulp
// 		.src(assets.css, {read: true, allowEmpty: true})
// 		.pipe(purgecss({
//             content: ['src/**/*.html']
//         }))
// 		.pipe(gulp.dest(config.build + '/css'))
// 		.pipe(postcss([cssnano()]))
// 		.pipe(rename({
// 			suffix: ".min"
// 		}))
// 		.pipe(browserSync.reload({
// 			stream: true
// 		}))
// 		.pipe(gulp.dest(config.build + '/css'))
// 	);
// }
// exports.purgecss = purgecss;

function vendors() {
	return (gulp
		.src(' ', {allowEmpty: true})
		.pipe(concat('js/vendors.js'))
		.pipe(cache.clear())
		.pipe(gulp.dest(config.build))
		.pipe(uglify())
		// .pipe(flatten())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(gulp.dest(config.build))
	);
}
exports.vendors = vendors;

function js() {
	return (gulp
		.src(assets.customs, {read: true, allowEmpty: true})
		.pipe(cache.clear())
		// .pipe(jshint())
		.pipe(gulp.dest(config.build + "/js"))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(gulp.dest(config.build + "/js"))
	);
}
exports.js = js;

function imgs() {
	return (
		gulp
		.src(assets.images, {read: true, allowEmpty: true})
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(webp())
		.pipe(gulp.dest(config.build + '/images'))
	);
}
exports.imgs = imgs;

function font() {
	return (
		gulp
		.src(assets.font, {read: true, allowEmpty: true})
		.pipe(cache.clear())
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(gulp.dest(config.build + '/fonts'))
	);
}
exports.font = font;

function html() {
	return (
		gulp
		.src(assets.html, {read: true, allowEmpty: true})
		.pipe(cache.clear())
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(gulp.dest(config.build + '/'))
	);
}
exports.html = html;


function remove() {
	// return (
	// 	del([config.build])
	// );
	return gulp.src(config.build, {read: false})
	.pipe(clean());
}
exports.remove = remove;


function watch() {
	browserSync.init({
		// You can tell browserSync to use this directory and serve it as a mini-server
		server: {
			baseDir: config.build,
		},
		injectChanges: true,
		// If you are already serving your website locally using something like apache
		// You can use the proxy setting to proxy that instead
		// proxy: "yourlocal.dev"
	});
	gulp.watch(assets.css, style);
	gulp.watch(assets.libs, vendors);
	gulp.watch(assets.customs, js);
	gulp.watch(assets.images, imgs);
	gulp.watch(assets.font, font);
	gulp.watch(assets.html, html);
}
exports.watch = watch;

exports.default = gulp.series(gulp.parallel(style, vendors, js, imgs, font, html), watch);