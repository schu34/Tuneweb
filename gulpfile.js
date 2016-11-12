var gulp = require('gulp');
var server = require('gulp-develop-server');

gulp.task("start", function() {
  server.listen({path: "./server.js"});
  gulp.watch("./*.js", ["restart"]);
});

gulp.task("restart", function() {
  server.restart();
});
