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
	data : {
		username    : '',
        question    : '',
        answer      : '',
        token       : ''
	},
	init : function(){
		this.onload();
		this.bindEvent();
	},
	bindEvent : function(){
		var _this = this;
		//第一步提交逻辑
		$('#submit-username').click(function(){
		var username = $.trim($('#username').val());
		if(username){
			_user.getQuestion(username,function(res){
				_this.data.username = username;
				_this.data.question = res;
				loadStepQuestion();
			},function(errMsg){
				formError.show(errMsg);
			})
		}
		else{
			formError.show('请输入用户名');
		}
		});
		//第二步提交逻辑
		$('#submit-question').click(function(){
		var answer = $.trim($('#answer').val());
		if(answer){
			_user.checkAnswer({
				username : _this.data.username,
				question : _this.data.question,
                answer   : answer
			},function(res){
				_this.data.answer 	= answer;
				_this.data.token 	= res;
				loadStepPassword();
			},function(errMsg){
				formError.show(errMsg);
			})
		}
		else{
			formError.show('请输入密码提示问题答案');
		}
		});
		//第三步提交逻辑
		$('#submit-password').click(function(){
		var password = $.trim($('#password').val());
		if(password&&password.length >= 6){
			_user.resetPassword({
				username 		: 	_this.data.username,
				passwordNew 	: 	password,
				forgetToken		: 	_this.data.token
			},function(res){
				window.location.href = './result.html?type=pass-reset';
			},function(errMsg){
				formError.show('errMsg');
			})
		}
		else{
			formError.show('密码不得少于6位');
		}
		});
	},
	onload : function(){
		this.loadStepUsername();
	},
	loadStepUsername : function(){
		$('.step-username').show();
	},
	loadStepQuestion : function(){
		formError.hide();
		$('.step-username').hide().subling('.step-question').show().find('.question').text('_this.data.res');
	},
	loadStepPassword : function(){
		$formError.hide();
		$('.step-question').hide().subling('.step-password').show();
	},
};
$(document).ready(function(){
	page.init();
});


