/**
 * Created by morcha on 17-9-22.
 */
var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        base: [path.join(__dirname, "base.js")]
    },
    output: {
        path: path.join(__dirname, "../../","public", "lib"),
        filename: "dll.[name].js",
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname,"[name]-manifest.json"),
            name: "[name]",
            context: path.resolve(__dirname)
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        modules:["../../node_modules"]
    }
};
