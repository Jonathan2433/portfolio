'use strict'; // oblige à déclarer les variables ou constantes (let, var, const)

var gulp  			= require('gulp'),
	sass 			= require('gulp-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	sourcemaps 		= require('gulp-sourcemaps'),
	cleancss 		= require('gulp-clean-css'),
	rename 			= require('gulp-rename'),
	notify 			= require('gulp-notify'),
	gcmq 			= require('gulp-group-css-media-queries'),
	browsersync 	= require('browser-sync'),
	concat 			= require('gulp-concat'),
	uglify 			= require('gulp-uglify'),
	babel 			= require('gulp-babel'),
	imagemin 		= require('gulp-imagemin'),
	gifsicle 		= require('gifsicle'),
    mozjpeg 		= require('mozjpeg'),
    optipng 		= require('optipng'),
    svgo 			= require('svgo');

sass.compiler 		= require('node-sass');

gulp.task('browser-sync', function() {
	browsersync.init({
		server: {
			baseDir: "./" // à utiliser en cas de site statique (html)
		}
		// proxy: "localhost/file_name/", au cas où vous êtes sur un serveur local type wamp, mamp ou xamp
	})
})
gulp.task('style', function () {
  return gulp.src('./assets/css/src/**/*.scss') //  on lui indique où sont les fichiers scss
  	.pipe(sourcemaps.init()) // va indexer tous les fichiers css
    
    .pipe(sass({outputStyle: 'compressed'}).on('error', notify.onError())) // on l'envoie au préprocesseur sass de façon compressé
    .pipe(gcmq())
    .pipe(rename({suffix: '.min', prefix: ''})) // ajoute un suffixe au fichier css pour devenir style.min.css
    .pipe(autoprefixer(['last 15 versions'])) // autoprefixer automatiquement les propriétés css
    .pipe(cleancss({level: {1: {specialComments: 0}}})) // permet de nettoyer le fichier css des commentaires
    
    .pipe(sourcemaps.write()) // ecrit le sourcemaps dans le fichier css compilé
    .pipe(gulp.dest('./assets/css/dist')) // on lui indique où il envoie le fichier compilé css
    .pipe(notify({message: 'Super, le CSS est bien compilé !!!', onLast: true})) // afficher message succes si tout va bien
    .pipe(browsersync.stream()); // rafraichi le navigateur avec les modifs
});

gulp.task('scripts', function() {
	return gulp.src([
		// './assets/libs/jquery/jquery-3.5.1.min.js',
		'./assets/js/src/*.js'
	])
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./assets/js/dist'))
	.pipe(notify({message: 'Super, le JS est bien compilé !!!', onLast: true})) // afficher message succes si tout va bien
    .pipe(browsersync.reload({stream: true})); // rafraichi le navigateur avec les modifs
});

gulp.task('image', function() {  // concatenation et optimisation des images 
	return gulp.src('/assets/img/src/**/*') // jpeg, jpg, png, svg
	.pipe(imagemin([
	    imagemin.gifsicle({interlaced: true}),
	    imagemin.mozjpeg({quality: 75, progressive: true}),
	    imagemin.optipng({optimizatiotnLevel: 5}),
	    imagemin.svgo({
	        plugins: [
	            {removeViewBox: true},
	            {cleanupIDs: false}
	        ]
	    })
	]))
	.pipe(gulp.dest('./assets/img/dist/'))
});

gulp.task('watch', function() {
	gulp.watch('./assets/css/src/**/*.scss', gulp.parallel('style'))
	gulp.watch('./assets/js/src/**/*.js', gulp.parallel('scripts'))
	gulp.watch('./assets/img/src/**/*', gulp.parallel('image'))
});

gulp.task('default', gulp.parallel('style', 'scripts', 'image', 'watch', 'browser-sync'));
