const path              = require('path');
 var webpack            = require('webpack');
 var ExtractTextPlugin  = require('extract-text-webpack-plugin');
 var HtmlWebpackPlugin  = require('html-webpack-plugin');
 // 环境变量配置 dev / online
 var WEBPACK_ENV = process.env.WEBPACK_ENV ||'dev';

//获取html webpack plugin的参数的方法
var getHtmlConfig = function(name,title){
	return {
			template : './src/view/'+name+'.html',
        	filename : 'view/'+name+'.html',
        	hash     : true,
        	title    : title,
        	inject   : true,
        	chunks   : ['common',name]
	};
};
//webpack config
 var config = {
     entry: {
     	'common' 				: ['./src/page/common/index.js' ],
     	'index'  				: ['./src/page/index/index.js'],
     	'list'  				: ['./src/page/list/index.js'],
     	'detail'  				: ['./src/page/detail/index.js'],
     	'cart'  				: ['./src/page/cart/index.js'],
     	'order-confirm'  		: ['./src/page/order-confirm/index.js'],
     	'user-login'  			: ['./src/page/user-login/index.js'],
     	'user-register'  		: ['./src/page/user-register/index.js'],
     	'user-pass-reset'  		: ['./src/page/user-pass-reset/index.js'],
     	'user-center'  			: ['./src/page/user-center/index.js'],
     	'user-center-update'  	: ['./src/page/user-center-update/index.js'],
     	'user-pass-update'  	: ['./src/page/user-pass-update/index.js'],
     	'result' 				: ['./src/page/result/index.js']
     },
     output: {
         path: path.resolve(__dirname, 'dist'),
         filename: 'js/[name].js',
       
     },
     externals: {
     	'jquery':'window.jQuery'
     },
     module: {
        rules:[
        	{
                test:/\.css/,
                use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                use: ["css-loader"]
                })
            },
            {
            	test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
        		loader : 'url-loader',
        		options: {
          			name   : 'resource/[name].[ext]',
        		}
          	},
          	{ test: /\.string$/,
    			use: [ {
      			loader: 'html-loader',
      			options: {
       			minimize: true
      				}
    			}],
            },
        ]
     },
     resolve : {
     	alias : {
     			node_modules    : __dirname + '/node_modules',
     			util			: __dirname + '/src/util',
     			page  			: __dirname + '/src/page',
     			service 		: __dirname + '/src/service',
     			image 			: __dirname + '/src/image',
     		}
     },
     plugins : [
     //独立通用模块到js/base.js
     	new webpack.optimize.CommonsChunkPlugin({
     		name : 'common',
     		filename : 'js/base.js'
     	}),
     	// 把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        //html模板处理
        new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
        new HtmlWebpackPlugin(getHtmlConfig('list','商品列表页')),
        new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情页')),
        new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认页')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
        new HtmlWebpackPlugin(getHtmlConfig('result','操作结果')),
     ]

 };
 if('dev'===WEBPACK_ENV){
 	config.entry.common.push('webpack-dev-server/client?http://localhost:8080/')
 }
 module.exports = config;