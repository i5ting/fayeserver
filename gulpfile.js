var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


gulp.task('default', function() {
	gulp.src('./client/iChatClient.js')
		.pipe(uglify())
		.pipe(rename(function (path) {
			path.extname = ".min.js"
		}))
		.pipe(gulp.dest('client/dist'))
});
