var glob = require('glob')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
const cfg = require('../config/env.config.js')
cfg.init('production')

/**
 * @param {string} globPath './src/modules/**\*.js'
 * @return {object}
 *    {
 *      'modules/admin2/admin': './src/modules/admin2/admin.js',
 *      'modules/app2/app': './src/modules/app2/app.js'
 *    }
 */
function getEntry (globPath) {
  console.log('Js入口文件:', globPath)
  // var globPath = path.join(globPath2, '**/*.js')
  var entries = {}
  // var basename
  var tmp
  var pathname

  glob.sync(globPath).forEach(function (entry) {
    // basename = path.basename(entry, path.extname(entry))
    // console.log('entry:=> ', entry)
    tmp = entry.split('/').splice(2) // 去掉左边两项
    var filename = tmp[tmp.length - 1]
    filename = filename.substr(0, filename.lastIndexOf('.')) // 去掉扩展名
    tmp[tmp.length - 1] = filename
    pathname = tmp.join('/')
    entries[pathname] = entry
  })
  return entries
}

exports.getEntry = getEntry


// exports.genVendors = function (entry, vendorPrefix, plugins) {
//   function getPrefix (entry) {
//     var entries = {}
//     // var pages = getEntry('./src/modules/**/*.html')
//     var pages = getEntry(entry)
//     for (var pathname in pages) {
//       var pubPrefix = pathname.split('/').splice(0, 2).join('/')
//       entries[pubPrefix] = ''
//     }
//     return entries
//   }
//   console.log('vendors入口:', entry)
//   var pubPrefix = getPrefix(entry)
//   console.log('vendor包前缀: ', pubPrefix)
//   // console.log('pubPrefix:', pubPrefix)
//   // pubPrefix = {modules: ''}
//   for (var pathname in pubPrefix) {
//     const vendorName = pathname + '/vendor'
//     const manifestName = pathname + '/manifest'
//     console.log('vendor生成name: ', vendorName)
//     console.log('vendor生成name: ', manifestName)
//     plugins.push(
//       new webpack.optimize.CommonsChunkPlugin({
//         name: vendorName,
//         filename: '[name].[chunkhash].js',
//         // children: false
//         minChunks: function (module, count) {
//             // any required modules inside node_modules are extracted to vendor
//           return (
//           module.resource &&
//           /\.js$/.test(module.resource) &&
//             module.resource.indexOf(
//                 path.join(__dirname, '../node_modules')
//             ) === 0
//           )
//         }
//       })
//     )
//     plugins.push(
//       new webpack.optimize.CommonsChunkPlugin({
//         name: manifestName,
//         chunks: [vendorName],
//         // chunks: [pathname + '/vendor'],
//         filename: '[name].[hash].js'
//       })
//     )
//   }
// }

/**
 * @param {string} entry 'modules';'modules/ma'
 */
exports.genVendors = function (entry, plugins) {
  let pathname = entry
  const vendorName = pathname + '/vendor'
  const manifestName = pathname + '/manifest'
  console.log('vendor生成name: ', vendorName)
  console.log('vendor生成name: ', manifestName)
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: vendorName,
      filename: '[name].[chunkhash].js',
      // children: false
      minChunks: function (module, count) {
          // any required modules inside node_modules are extracted to vendor
        return (
        module.resource &&
        /\.js$/.test(module.resource) &&
          module.resource.indexOf(
              path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    })
  )
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: manifestName,
      chunks: [vendorName],
      // chunks: [pathname + '/vendor'],
      filename: '[name].[hash].js'
    })
  )
}

exports.genMulPages = function (entry, plugins) {
  console.log('模板入口:', entry)
  // entry = path.join(entry, '**/*.html')
  // console.log('html入口文件')
  // var pages = getEntry(path.join(cfg.path.SRC_PATH, 'modules/**/*.html'))
  // var pages = getEntry('./src/modules/**/*.html')
  var pages = getEntry(entry)
  console.log('pages:', pages)
  for (var pathname in pages) {
    // console.log("template: "+pages[pathname]);
    var filename = path.join(cfg.path.OUT_PATH, pathname + '.html')
    console.log('filename: ', filename)
    // 配置生成的html文件，定义路径等
    // var pubPrefix = pathname.split('/').splice(0, 2).join('/')
    // pubPrefix = 'modules'
    var conf = {
      filename: filename, // 生成的模板名称
      // template: pages[pathname], // 模板路径
      template: path.join(cfg.path.EJS_PATH, 'index.ejs.html'),
      // template: pages[pathname].tmpl, // 模板路径
      minify: {                   //
        removeComments: true,
        collapseWhitespace: false
      },
      inject: true             // js插入位置
      // chunks: [pathname, pubPrefix + '/vendor', pubPrefix + '/manifest']        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    }
    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    plugins.push(new HtmlWebpackPlugin(conf))
  }
}
