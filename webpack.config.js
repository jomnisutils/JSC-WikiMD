const path = require("path")

module.exports = {
    entry: "./src/main.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devtool: "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "ctr_omnis_wikiMD.bundle.js",
        path: path.resolve(__dirname, "dist"),
        library: "ctr_omnis_wikiMD",
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
}
