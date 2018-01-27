
'use strict';
var Hogan = require('hogan.js');
var conf = {
	serverHost : ''
};
var _mm = {
	// 网络请求
	request : function(param){
		var _this = this;
		$.ajax({
			type 	 :  param.method || 'get',
			url  	 :  param.url    || '',
			datatype :  param.type   || 'json',
			data 	 :  param.data   || '',
			success  :  function(res){
				if(0 === res.status){
					typeof param.success ==='function'&& param.success(res.data,res.mag)
				}
				else if (10 === res.status) {
					_this.doLogin();
				}
			},
			error 	 :  function(err) {
				typeof param.error ==='function'&& param.error(err.statusText);
			}
		});
	},
	//获取服务器地址
	getServerUrl 	: function(path){
		return conf.serverHost + path;
	},
	//获取URL参数
	getUrlParam 	: function(name){
		var reg 	 = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		var result   = window.location.search.substr(1).match(reg);
		return result ? decodeURIComponent(result[2]) : null;
	},
	//渲染HTML模板
	renderHtml 		: function(htmlTemplate,data){
		var template = Hogan.compile(htmlTemplate);
		var    result 		 = template.render(data);
		return result;
	},
	//成功提示
	successTips		: function(msg){
		alert(msg ||'操作成功');
	},
	//错误提示
	errorTips		: function(msg){
		alert(msg ||'操作失败');
	},
	//字段验证
	validate		: function(value,type){
		var value = $.trim(value);
		if (type === 'require') {
			return !!value;
			}
		if (type === 'phone')   {
			return /^1\d{10}$/.test(value);
		}
		if (type === 'email')   {
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
		}
	},
	doLogin : function(){
		windows.location.href = './user-login.html?redirect='+encodeURIComponent(windows.location.href);
	},
	goHome  : function(){
        window.location.href = './index.html';
    }
};

module.exports = _mm;
