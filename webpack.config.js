const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const miniCss = require('mini-css-extract-plugin');

module.exports = {
    // entry: './src/components/form.js',
    entry: path.resolve(__dirname, 'src/components', 'form.js'),
    mode: "development",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                {from: "styles", to: "styles"},
                {from: "static/fonts", to: "static/fonts"},
            ],
        }),
        new miniCss({
            filename: 'style.css',
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },

            {
                test:/\.(s*)css$/,
                use: [
                    miniCss.loader,
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
};