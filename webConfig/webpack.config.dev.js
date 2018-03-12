'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);
module.exports = {
    devtool: 'cheap-module-eval-src-map',
    entry: {
        index: [
            require.resolve('react-dev-utils/webpackHotDevClient'),
            require.resolve('./polyfills'),
            require.resolve('react-error-overlay'),
            paths.appIndexJs
        ],
        login: [
            require.resolve('react-dev-utils/webpackHotDevClient'),
            require.resolve('./polyfills'),
            require.resolve('react-error-overlay'),
            paths.appLoginJs,
        ],
        test: [
            require.resolve('react-dev-utils/webpackHotDevClient'),
            require.resolve('./polyfills'),
            require.resolve('react-error-overlay'),
            paths.appTestJs,
        ]
    },
    plugins: [
        new InterpolateHtmlPlugin(env.raw),
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
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            filename: 'test.html',
            chunks: ['test']
        }),
        // new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedModulesPlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common'
        // }),

        new webpack.DefinePlugin(env.stringified),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, "dll"),
            manifest: require(path.join(__dirname, 'dll', 'base-manifest.json'))
        })
    ],
    output: {
        path: paths.appBuild,
        pathinfo: true,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        publicPath: publicPath,
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath),
    },
    resolve: {

        modules: ['node_modules', paths.appNodeModules].concat(
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
        alias: {
            'react-native': 'react-native-web',
        },
        plugins: [
            new ModuleScopePlugin(paths.appSrc),
            // new webpack.ProvidePlugin({
            //     $: 'jquery',
            //     jQuery: 'jquery'
            // })
        ],
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
                exclude: /(node_ odules)/,
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
    },
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    performance: {
        hints: false,
    },
    amd: {}
};
