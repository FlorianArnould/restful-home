const gulp = require('gulp');
const sonarqubeScanner = require('sonarqube-scanner');

gulp.task('default', function(callback) {
  sonarqubeScanner({
    serverUrl : "https://sonarcloud.io",
    token : "5c5d03a6c4771dcfd261271a3a1719d566ba2ebc",
    options : {
      "sonar.organization": "florianarnould-github"
    }
  }, callback);
});
