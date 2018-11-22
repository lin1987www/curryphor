const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(common, {
    // mode: 'production',
    // Avoid inline-*** and eval-*** use in production as they can increase bundle size and reduce the overall performance.
    devtool: 'cheap-module-source-map',
    plugins: common.plugins.concat([

    ]),
});
