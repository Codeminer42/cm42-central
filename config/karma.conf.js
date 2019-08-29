var path = require("path");

var webpackConfig = require("./webpack/test");
var webpackSpecsEntryFile = "../spec/javascripts/index.js";
var jsFiles = "../app/assets/javascripts/**/*.js";
var karmaPreprocessors = {};

karmaPreprocessors[webpackSpecsEntryFile] = ["webpack", "sourcemap"];

webpackConfig.entry = {
  test: path.resolve(__dirname, webpackSpecsEntryFile)
};

webpackConfig.devtool = "inline-source-map";

module.exports = function(config) {
  config.set({
    browsers: ["PhantomJS"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    basePath: ".",
    files: [
      // avoids running tests twice when on watch mode
      {
        pattern: webpackSpecsEntryFile,
        watched: false,
        included: true,
        served: true
      }
    ],
    preprocessors: karmaPreprocessors,
    frameworks: ["jasmine", "sinon"],
    plugins: [
      "karma-webpack",
      "karma-jasmine",
      "karma-sinon",
      "karma-phantomjs-launcher",
      "karma-chrome-launcher",
      "karma-spec-reporter",
      "karma-sourcemap-loader",
      "karma-coverage"
    ],
    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: path.resolve(__dirname, "..", "js_coverage"),
      reporters: [{ type: "html", subdir: "." }, { type: "lcov", subdir: "." }]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    phantomjsLauncher: {
      exitOnResourceError: false
    }
  });
};
