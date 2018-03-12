/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2017/12/19
 * Time:14:28
 * 此文件用于express后台
 */
const path = require('path');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
module.exports = {
    entry: {
        index: [
            "webpack-hot-middleware/client",
            paths.appIndexJs
        ],
        login: [
            "webpack-hot-middleware/client",
            paths.appLoginJs,
        ]
    },
    devtool: 'cheap-module-src-baseMap',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            filename: 'login.html',
            chunks: ['login']
        }),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, "dll"),
            manifest: require(path.join(__dirname, 'dll', 'base-manifest.json'))
        })
    ],
    output: {
        path: paths.appBuild,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        pathinfo: true,
        publicPath: paths.appPublic
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,

                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                include: paths.appSrc,
            },
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.json$/,
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                ],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },

            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },

            {
                test: /\.(js|jsx)$/,
                include: paths.appSrc,
                exclude: /(node_modules)/,
                loader: require.resolve('babel-loader'),
                options: {
                    // presets: ['env'],
                    cacheDirectory: true,
                },
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                // test: require.resolve("some-module"),
                // use: 'imports-loader?this=>window'
            }
        ],
    }
};