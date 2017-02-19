const path = require('path')
const webpack = require('webpack')

const extractCommons = new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'commons.js'
})
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('[name].bundle.css')

const config = {

    // 源文件根目录
    context: path.join(__dirname, '../src'),
    entry: {
        app: ['webpack-hot-middleware/client', './app.js'],
        admin: './admin.js',
    },
    output: {
        publicPath: "http://localhost:8080/dist/",
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                /* Loose mode and No native modules(Tree Shaking) */
                                ['es2015', { modules: false, loose: false }]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                // 抽取css到一个文件, 这个不支持HMR(热更新)
                loader: extractCSS.extract(['css-loader', 'sass-loader']),
                // 打包到<style>标签内, 支持HMR(热更新)
                // use: [
                //     'style-loader', // 输出css到document的<style>元素内
                //     'css-loader', // 解析 css转换成 Javascript 同时解析依赖资源
                //     'sass-loader' // 编译Sass成为css
                // ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10*1000 // 小于 10kB 的的图片转换成 base64
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        extractCommons,
        extractCSS,
        // 加入此插件, 浏览器console里可以看到哪个文件更新了
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(), // 支持hrm
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.DefinePlugin({
        //     "process.env": { NODE_ENV: JSON.stringify("development")},
        //     // __ENV__: JSON.stringify(require("../config/env.config.js").client( "production")),
        //     __DEV__: JSON.stringify( false),
        //     ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
        // }),
    ]
}

module.exports = config
