module.exports = function (config) {
  config.set({
    // Base path that will be used to resolve all patterns (e.g., files, exclude)
    basePath: '',

    // Frameworks to use for testing
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // List of files/patterns to load in the browser
    files: [],

    // List of files/patterns to exclude
    exclude: [],

    // Preprocessors to use
    preprocessors: {},

    // Test results reporter to use
    reporters: ['progress', 'kjhtml'],

    // Web server port
    port: 9876,

    // Enable/disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    logLevel: config.LOG_INFO,

    // Enable/disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers
    browsers: ['Chrome'],

    // Continuous Integration mode
    singleRun: false,

    // Concurrency level (how many browser instances should be started simultaneously)
    concurrency: Infinity,

    // Angular CLI plugin configuration
    client: {
      clearContext: false // Leave Jasmine Spec Runner output visible in browser
    },

    // Coverage reporter configuration
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ecomply-anonymize'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    // Custom launcher for headless Chrome (useful for CI environments)
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },

    // Plugins to load
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ]
  });
};
