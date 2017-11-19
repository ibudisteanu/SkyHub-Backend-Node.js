const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/bin/www.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'webpack.bundle.js'
    },
    resolve:{
        alias:{
            'application': path.resolve( __dirname + '/application'),
            'modules': path.resolve( __dirname + '/application/modules'),
            'DB': path.resolve( __dirname , 'application/modules/DB'),
            'REST': path.resolve( __dirname + '/application/modules/REST'),
            'utils': path.resolve( __dirname + '/application/modules/utils'),
        },
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    module: {
        loaders: [
            {
                test: /\.(ts|js|jsx)$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2017']
                },
                include: [
                    path.resolve(__dirname, "application"),
                    path.resolve(__dirname, "bin")
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ]
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};