const gulp = require('gulp');
const sonarqubeScanner = require('sonarqube-scanner');

gulp.task('default', function(callback) {
  sonarqubeScanner({
    serverUrl : "https://sonarcloud.io",
    token : "2d5c58bab38596a7bcbac3575929a2d9861ae654",
    options : {
      "sonar.organization": "florianarnould-github"
    }
  }, callback);
});
