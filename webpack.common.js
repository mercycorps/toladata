const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// To find which plugin(s) is causing DeprecationWarning(s)
// process.traceDeprecation = true;

module.exports = {

    entry: {
        base: './js/base.js',
        program_page: './js/pages/program_page/index.js' ,
        tola_management_user: './js/pages/tola_management_pages/user/index.js',
        tola_management_organization: './js/pages/tola_management_pages/organization/index.js',
        tola_management_program: './js/pages/tola_management_pages/program/index.js',
        tola_management_country: './js/pages/tola_management_pages/country/index.js',
        audit_log: './js/pages/tola_management_pages/audit_log/index.js',
        document_list: './js/pages/document_list/index.js' ,
        iptt_quickstart: './js/pages/iptt_quickstart/index.js',
        iptt_report: './js/pages/iptt_report/index.js',
        logframe: './js/pages/logframe/index.js',
        results_framework: './js/pages/results_framework/index.js',
        home_country_map: './js/partials/home_country_map/index.js'
    },

    output: {
        filename: "[name]-[chunkhash].js",
        path: path.resolve(__dirname, './build/dist/'),
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },

            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {url: true, sourceMap: true}},
                    {loader: 'sass-loader', options: {sourceMap: true}}
                ],
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash].[ext]'
                    }
                }]
            }
        ]
    },

    resolve: {
        extensions: ['*', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, "js"),
            'node_modules'
        ],
    },

    plugins: [
        // helps avoid chunkhash changing on bundles w/ no mods
        new webpack.HashedModuleIdsPlugin(),

        // css to their own files
        new MiniCssExtractPlugin({filename: '[name]-[contenthash].css'}),

    ],

    optimization: {
        // split manifest out
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
    },

    externals: {
        jquery: 'jQuery',
    }
};
