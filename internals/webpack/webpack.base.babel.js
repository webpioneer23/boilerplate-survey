/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
/**
 * Required to read .env for a local development
 */
const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const env = dotenv.config().parsed;

module.exports = (options) => ({
    mode: options.mode,
    entry: options.entry,
    output: Object.assign(
        {
            // Compile into js/build.js
            path: path.resolve(process.cwd(), 'build'),
            publicPath: '/',
        },
        options.output,
    ), // Merge with env dependent settings
    optimization: options.optimization,
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: options.babelQuery,
                },
            },
            {
                test: /\.ts(x?)$/, // Transform typescript files with ts-loader
                exclude: /node_modules/,
                use: options.tsLoaders,
            },
            {
                // Preprocess our own .css files
                // This is the place to add your own loaders (e.g. sass/less etc.)
                // for a list of loaders, see https://webpack.js.org/loaders/#styling
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: ['./app/style/sass/_variables.scss', './app/style/sass/_mixins.scss'],
                        },
                    },
                ],
            },
            {
                // Preprocess 3rd party .css files located in node_modules
                test: /\.css$/,
                include: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/,
                use: 'file-loader',
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            // Inline files smaller than 10 kB
                            limit: 10 * 1024,
                            noquotes: true,
                        },
                    },
                ],
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // Inline files smaller than 10 kB
                            limit: 10 * 1024,
                            esModule: false,
                        },
                    },
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         mozjpeg: {
                    //             enabled: false,
                    //             // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                    //             // Try enabling it in your environment by switching the config to:
                    //             // enabled: true,
                    //             // progressive: true,
                    //         },
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //         optipng: {
                    //             optimizationLevel: 7,
                    //         },
                    //         pngquant: {
                    //             quality: [0.65, 0.9],
                    //             speed: 4,
                    //         },
                    //     },
                    // },
                ],
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.(mp4|webm)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                    },
                },
            },
        ],
    },
    plugins: options.plugins.concat([
        // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
        // inside your code for any environment checks; Terser will automatically
        // drop any unreachable code.
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),
        new webpack.DefinePlugin(
            Object.keys(process.env).reduce((prev, next) => {
                // eslint-disable-next-line no-param-reassign
                prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
                return prev;
            }, {}),
        ),
    ]),
    resolve: {
        modules: ['node_modules', 'app'],
        extensions: ['.js', '.jsx', '.react.js', '.ts', '.tsx'],
        mainFields: ['browser', 'jsnext:main', 'main'],
        alias: {
            app: path.resolve('./app/containers/App'),
            utils: path.resolve('./app/utils'),
            components: path.resolve('./app/components'),
            containers: path.resolve('./app/containers'),
        },
    },
    devtool: options.devtool,
    target: 'web', // Make web variables accessible to webpack, e.g. window
    performance: options.performance || {},
});
