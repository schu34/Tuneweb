var gulp = require('gulp');
var server = require('gulp-develop-server');

gulp.task("start", function() {
  server.listen({path: "./lib/server.js"});
  gulp.watch("./lib/*.js", ["restart"]);
});

gulp.task("restart", function() {
  server.restart();
});
