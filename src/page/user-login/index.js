'use strict';
require('./index.css');
var _mm 	= require('util/mm.js');
var _user 	= require('service/user-service.js');
//错误提示框
var formError = {
	show : function(errMsg){
		$('.error-item').show().find('.err-msg').text(errMsg);
	},
	hide : function(){
		$('.error-item').hide().find('.err-msg').text('');
	}
};
//页面逻辑
var page = {
	init : function(){
		this.bindEvent();
	},
	bindEvent : function(){
		var _this = this;
		$('#submit').click(function(){
			_this.submit();
		});
		//按下回车也会提交
		$('.user-content').keyup(function(e){
			if(e.keyCode === 13){
				_this.submit();
			}
		});
	},
	submit : function(){
		//表单数据
		var formdata = {
				username 	: $.trim($('#username').val()),
				password 	: $.trim($('#password').val()),
				phone	 	: $.trim($('#phone').val()),
				email 		: $.trim($('#email').val()),
				question 	: $.trim($('#question').val()),
				answer 		: $.trim($('#answer').val())
			 },
		validateResult = this.formValidate(formdata);
		//表单验证成功
		if(validateResult.status){
			_user.register(formdata,function(res){
				window.location.href = _mm.getUrlParam('redirect') || './index.html'
			},function(errMsg){
				formError.show(errMsg)
			});
		}
		//表单验证失败
		else{
			formError.show(validateResult.msg);
		}
	},
	//表单验证逻辑
	formValidate : function(formdata){
		var result = {
			status 	: false,
			msg 	: ''
		};
		if(!_mm.validate(formdata.username,'require')){
			result.msg = '用户名不能为空';
			return result;
		}
		if(!_mm.validate(formdata.password,'require')){
			result.msg = '密码不能为空';
			return result;
		}
			result.status = true;
			result.msg = '验证通过';
			return result;
	}
};
$(document).ready(function(){
	page.init();
});

