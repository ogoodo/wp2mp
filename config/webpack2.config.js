const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const entryFiles = require('./entry-files.js')
const WebpackMd5Hash = require('webpack-md5-hash')
const cfg = require('../config/env.config.js')
cfg.init('production')
var tmpldir = path.join(__filename, '../static/index.ejs.html')
console.log('tmpldir:', tmpldir)
// const extractCommons = new webpack.optimize.CommonsChunkPlugin({
//   name: 'commons',
//   filename: 'commons.[hash].js'
// })
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('[name].[contenthash].css')

// var entries = entryFiles.getEntry('./src/module/**/*.js') // 获得入口js文件
var entries = entryFiles.getEntry('./src/modules/**/*.js') // 获得入口js文件
console.log('entries:', entries)
const webpackConfig = {

  // 源文件根目录
  // context: path.join(__dirname, '../src'),
  // entry: {
  //   app: ['webpack-hot-middleware/client', './pages/app/app.js'],
  //   admin: './pages/admin/admin.js'
  // },
  entry: entries,
  output: {
    path: cfg.path.OUT_PATH,
    // filename: cfg.server.outputFilename,
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.[chunkhash].js',
    // chunkFilename: cfg.server.outputChunkFilename,
    publicPath: cfg.server.publicPath

    // publicPath: 'http://localhost:8080/dist/',
    // // path: path.join(__dirname, 'dist'),
    // path: path.join(__dirname, 'dist'),
    // filename: '[name].[hash].js'
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
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'standard-loader'
            // enforce: 'pre'
          }
        ]
      },
      {
        test: /\.vue$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        // 抽取css到一个文件, 这个不支持HMR(热更新)
        loader: extractCSS.extract(['css-loader', 'sass-loader'])
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
              limit: 10 * 1000 // 小于 10kB 的的图片转换成 base64
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // extractCommons,
    extractCSS,
    new WebpackMd5Hash(), // 解决每次hash会变的问题
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
    new HtmlWebpackPlugin({
      title: 'test webpack2',
      // favicon:'./build/img/favicon.ico', //favicon路径
      // favicon: path.join(imgPath, 'favicon.ico'), // favicon路径
      inject: true, // 允许插件修改哪些内容，包括head与body
      cache: false, // 如果为 true, 这是默认值 仅仅在文件修改之后才会发布文件
      // template: 'node_modules/html-webpack-template/index.ejs',
      // template: path.join(__filename, '../static/index.ejs.html'),
      template: path.join(cfg.path.EJS_PATH, 'index.ejs.html'),
      filename: path.join(cfg.path.OUT_PATH, 'index.html'),    // 生成的html存放路径，相对于 path
      appMountId: 'id_root',
      // baseHref: envcfg.publicPath, // 'http://example.com/awesome',
      chunks: ['commons', 'app'],
      // 压缩HTML文件 传递 html-minifier 选项给 minify 输出
      minify: {
        // removeComments: true,    // 移除HTML中的注释
        // collapseWhitespace: true    // 删除空白符与换行符
      },
      // devServer: 3001,
      mobile: true,
      // 这里写入浏览器window的变量
      window: {
        envex: {
          apiHost: 'http://myapi.com/api/v1'
        }
      }
    }),
    // 配置信息写在这里面
    new webpack.LoaderOptionsPlugin({
      // debug: !prod,
      // minimize: prod,
      options: {
        // context: urls.project,
        // standard: {
        //   env: {
        //     browser: true,
        //     node: false
        //   },
        //   parser: 'babel-eslint'
        // }
        // eslint: {
        //   formatter: eslintFriendlyFormatter,
        //   // emitWarning: true,
        //   configFile: `${urls.project}/.eslintrc.js`
        // },
        // vue: {
        //   loaders: loaders.css({ sourceMap: true, extract: prod }),
        //   postcss: postcssPlugins
        // },
        // postcss: postcssPlugins
      }
    })
  ]
}

entryFiles.genVendors(webpackConfig.plugins)
entryFiles.genMulPages(webpackConfig.plugins) // 获得入口js文件

module.exports = webpackConfig
