const path = require('path')

let init = {
  path: {},
  client: {},
  server: {}
}
let haveCalledInit = false

init.init = function (envName) {
  if (haveCalledInit) {
    console.log('evn.config.js已经有初始化')
    return
  }
  haveCalledInit = true
  if (!checkEvn(envName)) {
    envName = 'error-development'
  }
  initPath(envName)
  initClient(envName)
  initServer(envName)
}

function formatName (envName) {
  envName = envName ? envName.trim() : 'development'
  envName = envName === 'dev' ? 'dev_' : envName
  envName = envName === 'development' ? 'dev_' : envName
  envName = envName === 'stg' ? 'dev_' : envName
  envName = envName === 'production' ? 'prod' : envName
  return envName
}

function checkEvn (nodeEnv) {
  if (['development', 'production', 'stg'].indexOf(nodeEnv) < 0) {
    console.error('请输入正确的环境(如:development,production,stg): 错误环境:', nodeEnv)
    return false
  }
  return true
}

/**
 * @param {string} nodeEvn development:开发版; production:生产版; stg:测试版(生产版不压缩)
 */
function initPath (nodeEnv) {
  let obj = {}
  // 运行 npm run cmd的目录
  obj.ROOT_PATH = path.join(__dirname, '..')
  obj.SRC_PATH = path.join(obj.ROOT_PATH, 'src')
  obj.EJS_PATH = path.join(obj.ROOT_PATH, 'static')
  // 项目所有输出文件都在这个BUILD目录里面, 包括临时文件
  obj.BUILD_PATH = path.join(obj.ROOT_PATH, '__build')
  obj.OUT_PATH = path.join(obj.BUILD_PATH, nodeEnv)
  obj.DLL_PATH = path.join(obj.OUT_PATH, 'dist/dll')
  console.log('项目的根目录: ==========================={{')
  console.log(`     ROOT_PATH: ${obj.ROOT_PATH}`)
  console.log(`      EJS_PATH: ${obj.EJS_PATH}`)
  console.log(`      SRC_PATH: ${obj.SRC_PATH}`)
  console.log(`    BUILD_PATH: ${obj.BUILD_PATH}`)
  console.log(`      OUT_PATH: ${obj.OUT_PATH}`)
  console.log(`      DLL_PATH: ${obj.DLL_PATH}`)
  console.log('项目的根目录: ===========================}}')
  console.log('')
  init.path = obj
}


// 浏览器使用的配置项
function initClient (nodeEnv) {
  const cfg = {}
  cfg.dev_ = {}
  cfg.prod = {}
  cfg.test = {}

  cfg.dev_.baseUrl = 'http://dev.api.xx.com'
  cfg.prod.baseUrl = 'http://api.xx.com'
  cfg.test.baseUrl = 'http://test.api.xx.com'

  const envName = formatName(nodeEnv)
  // console.log('===================000000000000000000000:', envName, ':',cfg[envName]);
  init.client = cfg[envName]
}

// nodejs使用的配置项
function initServer (nodeEnv) {
  const envName = formatName(nodeEnv)
  const cfg = {}
  cfg.dev_ = {}
  cfg.prod = {}

  cfg.dev_.publicPath = '/'
  cfg.prod.publicPath = 'http://127.0.0.1:3001/'
  // cfg.prod.publicPath = 'http://www.ogoodo.com:3001/'

  // cfg.dev_.vendorsFilename = 'dist/js/[id].vendors.js'
  // cfg.prod.vendorsFilename = 'dist/js/[id].vendors.[hash:8].js'
  cfg.dev_.vendorsFilename = 'dist/js/[id].[name].js'
  cfg.prod.vendorsFilename = 'dist/js/[id].[name].[hash:8].js'

  cfg.dev_.cssFilename = 'dist/css/[id].[name].css'
  cfg.prod.cssFilename = 'dist/css/[id].[name].[hash:8].css'

  cfg.dev_.outputFilename = 'dist/js/[id].[name].js'
  cfg.prod.outputFilename = 'dist/js/[id].[name].[chunkhash:8].js'

  cfg.dev_.outputChunkFilename = 'dist/js/[id].chunk.js'
  cfg.prod.outputChunkFilename = 'dist/js/[id].[chunkhash:8].chunk.js'

  // console.log('===================000000000000000000000:', envName, ':',cfg[envName]);
  init.server = cfg[envName]
}
module.exports = init
