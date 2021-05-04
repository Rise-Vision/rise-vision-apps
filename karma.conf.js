// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: [
      'mocha',
      'chai',
      'chai-as-promised',
      'sinon-chai',
      '@angular-devkit/build-angular'
    ],
    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('sinon-chai'),
      require('karma-chai-plugins'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './reports/coverage/angular2'),
      reports: ['html', 'lcovonly', 'text', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
