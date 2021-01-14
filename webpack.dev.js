const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleTracker = require('webpack-bundle-tracker');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');


module.exports = merge(common, {

    devtool: 'cheap-module-source-map',

    output: {
        filename: "[name]-[chunkhash].js",
        path: path.resolve(__dirname, './build/dev-dist/'),
        // publicPath: '/asset-path/dev-dist/'
    },


    plugins: [
        // Todo: Update plugin when deprecation is updated
        new BundleTracker({path: __dirname, filename: 'webpack-stats-dev.json'}),

        // delete all files in build dir automatically
        new CleanWebpackPlugin(),

    ],


});
