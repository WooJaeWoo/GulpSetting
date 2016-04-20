"use strict";

const gulp = require('gulp');
// JS
const concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify');
// CSS
const streamqueue = require('streamqueue'),
	concatCss = require('gulp-concat-css'),
	cleanCSS = require('gulp-clean-css'), // same with gulp-minify-css
	autoprefixer = require('gulp-autoprefixer');
// IMG
const imagemin = require('gulp-imagemin');
// Test
const mocha = require('gulp-mocha');
// Watch
const livereload = require('gulp-livereload');

// Paths
const src = "./public/src";
const paths = {
	js: src + "/js/**/*.js",
	css: src + "/css/**/*.css",
    img: src + "/img/**/*",
	dist: "./public/dist",
};

gulp.task("default", function() {
	console.log("[Gulp] read gulpfile.js");
});

gulp.task("js", function() {
	return gulp.src(paths.js)
		.pipe(concat("all.js"))
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist + "/js"))
        .pipe(livereload());
});

gulp.task("css", function() {
	return streamqueue({ objectMode: true },
			gulp.src(src + "/css/reset.css"),
			gulp.src(["!" + src + "/css/reset.css", paths.css])
		)
		.pipe(concatCss("all.css"))
		.pipe(cleanCSS({debug: true}, function(details) {
			console.log(details.name + "(origin): " + details.stats.originalSize + " Kb");
			console.log(details.name + "(min): " + details.stats.minifiedSize + " Kb");
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.dist + "/css"))
        .pipe(livereload());
});

gulp.task("img", function () {
    return gulp.src(paths.img)
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(paths.dist + "/img"))
        .pipe(livereload());
});

/*
gulp.task("test", function () {
    return gulp.src( test js path )
        .pipe(mocha({reporter: 'nyan'}));
});
*/

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(paths.js, ["js"]);
	gulp.watch(paths.css, ["css"]);
    gulp.watch(paths.img, ["img"]);
});

// Uncomment to build img files
gulp.task("build", ["js", "css"/*, "img"*/]);


