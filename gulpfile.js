const gulp = require('gulp');
const sonarqubeScanner = require('sonarqube-scanner');

gulp.task('default', function(callback) {
  sonarqubeScanner({
    serverUrl : "https://sonarcloud.io",
    token : "kM3O3WSBSodpfYoZOS9rBWdVHOm0RNyOhsCWzx3k7wE3hJlbGWL42DkndAcWZir5pGxEFDdyeNFcoqULdzMownX8gfN83XG8rDAuSA6XDrFBnLUOFYFm8uIrTRL6Hn3BEaglelXgUisDDgjcg/UrtV5gzB/XloDFhbGgSDxYo4yhwD9a1DLd2hlmC+fgsNXfDd8NzoP/lyAMJRc5YmkRnbGZzdpb42NfIAtnV+lj88FCnxmShATSFYN6ovb+zVj/JYfbCxufAaZDik/2zb8q5B3o/BM6RoYWQX8ssdsM/JU5d5bYgWLyzAizs2p/mGVGlaI56lTx/zySnK/I8f/MKWEbUlVxEAQJl48rHakpEDCBfmGHnKj7PX2TNX0d5SGJiIO75mJsyrsKCic4WvCNiml9oRXKY2hz+Zverb3xffYpbczomp5+Mf0jWvNlHvxD+howNakVvYgIjBAl918nLC3zzK1rAqN4z2GL2epx2+Szw+9ylaKLW1dxWt9jQW5dbaXSXYpIMZKuIBMAg1feSk883pTBEEun52sd7dEMJOTigb8coSPcC2fswxL9sUI4eVKVUhc4VjDw6nQzjQBh6+ILmYbIUYd1Ndl7ySAEC29UAKbZW0L7sRspXF7O7aqHCPv7d91MS7KMZWOyOxS+7OiXFe/3uBPZW51RaMIshHE=",
    options : {
      "sonar.organization": "florianarnould-github"
    }
  }, callback);
});
