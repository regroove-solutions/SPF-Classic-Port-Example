const path = require('path');
const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const lastDirName = path.basename(__dirname);
const dropPath = path.join(__dirname, 'temp', 'stats');

var babelOptions = {
  "presets": [
    "react",
    ["babel-preset-env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7", "ie 10"]
      }
    }]
  ]
};

module.exports = {
  entry: [
    "./src/extensions/classicExample/ClassicVersion.ts"
  ],
  module: {
    rules: [
      {
        test: /(\.tsx$|\.ts)/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: "[local]"
              }
            }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "home": __dirname
    }
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /styles\/ClassicExample\.module/,
      __dirname + "/temp/gulp/ClassicExample.module.scss"
    ),
    new ExtractTextPlugin({ filename: 'styles.css', allChunks: true }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  output: {
    filename: 'classic-example.js',
    path: path.resolve(__dirname, 'dist/classic'),
    libraryExport: "default"
  }
};