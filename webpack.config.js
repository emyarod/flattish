import webpack from 'webpack';
// var del = require('clean-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './src/js/main/app.js',
  output: {
    path: `${__dirname}/app/js`,
    filename: 'bundle.js'
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    // new del(['dist/js']),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
