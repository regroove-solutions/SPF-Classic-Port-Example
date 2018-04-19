'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const cleancss = require('gulp-clean-css');
const clipEmptyFiles = require('gulp-clip-empty-files');
const clone = require('gulp-clone');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const texttojs = require('gulp-texttojs');
const autoprefixer = require("autoprefixer");
const cssModules = require('postcss-modules');
const path = require("path");
const os_1 = require("os");
const dest = require("gulp-dest");
const merge = require('merge2');
const webpack = require("webpack-stream");
const webpackClient = require("webpack");
const _classMaps = {};

const _generateModuleStub = function (cssFileName, json) {
  cssFileName = cssFileName.replace('.css', '.scss.ts');
  _classMaps[cssFileName] = json;
};

const generateScopedName = function (name, fileName) {
  return name + '_' + parseInt(fileName, 36);
};

const postCSSPlugins = [
  autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie >= 10'] }),
  cssModules({
    getJSON: _generateModuleStub.bind(this),
    generateScopedName: generateScopedName.bind(this)
  })
]
const scssTsExtName = '.scss.ts';

const buildClassicTask = build.subTask("build-classic", function (gulp, buildOptions, done) {
  return makeModules(gulp);
});

const makeCss = function (gulp) {
  gulp.src("./src/extensions/classicExample/styles/ClassicExample.module.scss")
    .pipe(sass.sync())
    .pipe(gulp.dest("temp/gulp"))
};

const makeModules = function (gulp) {

  const tasks = [];
  const baseTask = gulp.src("./src/extensions/classicExample/styles/ClassicExample.module.scss")
    .pipe(sass.sync())
    .pipe(postcss(postCSSPlugins))
    .pipe(cleancss({
      advanced: false,
      inline: ["none"]
    }))
    .pipe(clipEmptyFiles());

  tasks.push(baseTask.pipe(clone())
    .pipe(gulp.dest("temp/gulp")));

  tasks.push(baseTask.pipe(clone())
    .pipe(texttojs({
      ext: scssTsExtName,
      isExtensionAppended: false,
      template: function (file) {
        var content = file.contents.toString();
        var classNames = _classMaps[file.path];
        var exportClassNames = '';
        if (classNames) {
          var classNamesLines_1 = [
            'const styles = {'
          ];
          var classKeys_1 = Object.keys(classNames);
          classKeys_1.forEach(function (key, index) {
            var value = classNames[key];
            var line = '';
            if (key.indexOf('-') !== -1) {
              var message = "The local CSS class '" + key + "' is not camelCase and will not be type-safe.";
              line = "  '" + key + "': '" + value + "'";
            }
            else {
              line = "  " + key + ": '" + value + "'";
            }
            if ((index + 1) <= classKeys_1.length) {
              line += ',';
            }
            classNamesLines_1.push(line);
          });
          var exportString = 'export default styles;';
          classNamesLines_1.push('};', '', exportString);
          exportClassNames = classNamesLines_1.join(os_1.EOL);
        }
        var lines = [];
        lines = lines.concat([
          "require('./" + path.basename(file.path, scssTsExtName) + ".css');",
          exportClassNames
        ]);
        return (lines
          .join(os_1.EOL)
          .replace(new RegExp("(" + os_1.EOL + "){3,}", 'g'), "" + os_1.EOL + os_1.EOL)
          .replace(new RegExp("(" + os_1.EOL + ")+$", 'm'), os_1.EOL));
      }
    }))
    .pipe(gulp.dest('temp/gulp')))

  tasks.push(gulp.src("./src/extensions/classicExample/ClassicVersion.ts")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("dist/classic")));
  return merge(tasks);
}


build.task("build-classic", buildClassicTask);

build.initialize(gulp);
