var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

gulp.task('server', function() {
	connect.server({
		port: 3000,
		livereload: true,
	});
});

gulp.task('html', function() {
	gulp.src('demo/*.html')
		.pipe(connect.reload());
});

gulp.task('script', function() {
	gulp.src('rainf.js')
		.pipe(uglify())
		.pipe(rename('rainf.min.js'))
		.pipe(gulp.dest('./'))
		.pipe(connect.reload());
});

gulp.task('build', function() {
	gulp.src('rainf.js')
		.pipe(uglify())
		.pipe(rename('rainf.min.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch('demo/rainf.html', ['html']);
	gulp.watch('rainf.js', ['script']);
});

gulp.task('default', ['server', 'watch']);
