
var express = require("express");
const logger = require('morgan')
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("../config/webpack2.config.js");

process.env.NODE_ENV === 'development'
var app = express()
app.use(logger('dev'))
var compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, {
  // publicPath: "/" // 大部分情况下和 `output.publicPath`相同
    publicPath:  webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: { colors: true },
}))

app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr', // The path which the middleware is serving the event stream on
    heartbeat: 10 * 1000,
    reload: true, // - Set to true to auto-reload the page when webpack gets stuck.
}))

var publicDir = 'public'
// app.use(express.static(publicDir, options.staticOptions))
app.use(express.static('static'))
// app.use('/static', express.static('public'));

app.listen(8080, "127.0.0.1", function() {
	console.log("Starting server on http://localhost:8080");
});
