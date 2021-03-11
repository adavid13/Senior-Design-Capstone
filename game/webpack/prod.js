const webpack = require('webpack');
const { mergeWithCustomize, unique } = require("webpack-merge");
const CopyPlugin = require('copy-webpack-plugin');
const base = require('./base');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = mergeWithCustomize({
  customizeArray: unique("plugins", ["DefinePlugin"], (plugin) => plugin.constructor && plugin.constructor.name)
})(base, {
  mode: 'production',
  output: {
    filename: 'bundle.min.js',
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify('https://chexy.tk')
    }),
    new CopyPlugin({
      patterns: [
        { from: './assets', to: 'assets' },
        { from: './index.css', to: 'index.css' },
        { from: './rules.html', to: 'rules.html' }
      ],
    }),
  ],
});
