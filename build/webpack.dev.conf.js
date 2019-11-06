const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');


const os = require('os');
const portfinder = require('portfinder');
const fs = require('fs');
var ports = fs.readFileSync('./port.json', 'utf8');
ports = JSON.parse(ports);
portfinder.basePort = "8080";
portfinder.getPort(function(err, port) {
    ports.data.port = port;
    ports = JSON.stringify(ports,null,4);
    fs.writeFileSync('./port.json',ports);
});
// console.log(path.resolve(__dirname,'dist/pages','../home.html'))
///////////////////获取本机ip///////////////////////
function getIPAdress(){
    var interfaces = os.networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}
const host = getIPAdress();

const webpackConfigDev = {
	mode: 'development', // 通过 mode 声明开发环境
	output: {
		path: path.resolve(__dirname, '../dist'),
		// 打包多出口文件
		filename: 'js/[name].bundle.js'
	},
	devServer: {
		contentBase: path.join(__dirname, "../src/pages/index"),
        // contentBase:path.resolve(__dirname,'dist/pages'),//最好设置成绝对路径
        // historyApiFallback: true,//true默认打开index.html，false会出现一个目录，一会演示
		publicPath:'/',
		host: host,
		port: ports.data.port,
		overlay: true, // 浏览器页面上显示错误
		open: true, // 开启浏览器
		stats: "errors-only", //stats: "errors-only"表示只打印错误：
		//服务器代理配置项
        proxy: {
            '/testing/*': {
                target: 'https://www.baidu.com',
                secure: true,
                changeOrigin: true
            }
        }
    },
}
module.exports = merge(webpackConfigBase, webpackConfigDev);
