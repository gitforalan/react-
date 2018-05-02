
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback')
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware')
const bundler = webpack(config);

// 相当于通过本地node服务代理请求到了http://cnodejs.org/api
var proxy = [{
    path: '/api/*',
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true
    //host: 'openapi.dvr163.com'
}];


//启动服务
var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    proxy: proxy,
    stats: {
        colors: true
    },
});



//将其他路由，全部返回index.html
// server.app.get('*', function (req, res) {
//     res.sendFile(__dirname + '/index.html')
// });

//把IP地址改成你自己的，不知道改什么就localhost
server.listen(8888);




