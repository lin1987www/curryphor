const path = require('path');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    // Set the mode configuration option to development to make sure that the bundle is not minified
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    entry: {
        'lib.min': ['react', 'react-dom'],
        'app': ['./src/index.js'],
        'test': ["@babel/polyfill", './test/index.js'],
    },
    output: {
        // filename: 'main.js',
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[name].[chunkhash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: '/' // 用於 express
    },
    plugins: [
        // 將使用到的 css 壓縮成一個 main.css
        /*
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
        */
        // 產生 manifest.json
        new ManifestPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // 避免import順序改變造成 hash 改變
        new webpack.HashedModuleIdsPlugin(),
        /*
        Shimming Globals
        new webpack.ProvidePlugin({
            join: ['lodash','join']
        }),
        */
        // 清除指定資料夾底下的資料
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: true,
            title: 'Hot Module Replacement',
            chunks: ['runtime', 'app'],
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            inject: true,
            title: 'Functional Programing',
            chunks: ['runtime', 'test'],
            filename: 'test.html',
        }),
    ],
    module: {
        rules: [
            /*
            // Granular Shimming
            {
                test: /index\.js/,
                use: ['imports-loader?this=>window']
            },
            */
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, 'src')],
                options: {
                    // Explicitly disable babelrc so we don't catch various config
                    // in much lower dependencies.
                    babelrc: false,
                    presets: [
                        [
                            '@babel/env',
                            {
                                targets: {
                                    browsers: [
                                        'last 3 versions',
                                        'Safari >= 8',
                                        'iOS >= 8',
                                        'ie >= 8'
                                    ]
                                },
                                "debug": true,
                                "useBuiltIns": "entry", // 使用 babel 的 polyfill
                            }
                        ],
                        '@babel/react'
                    ],
                    plugins: [
                        /*
                        'syntax-dynamic-import',
                        'transform-object-rest-spread',
                        */
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-proposal-object-rest-spread",
                        "@babel/plugin-syntax-import-meta",
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-proposal-json-strings",
                        "@babel/plugin-proposal-export-default-from",
                        "@babel/plugin-proposal-export-namespace-from",
                    ],
                }
            },
            {
                test: /test\.js$/,
                use: 'mocha-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    /* MiniCssExtractPlugin.loader, */ 'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            },
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ],
        runtimeChunk: 'single',  // 將runtime 從 Boilerplate  分離
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    // 如果指定名稱 會將 import 的 module 從預設的 vendors~[name] 改名
                    // name: 'vendors',
                    // 如果指定 chunks:'all' 檔案會被分開來
                    // chunks: 'all'
                }
            },
            // chunks: 'all',
        },
    }
};
