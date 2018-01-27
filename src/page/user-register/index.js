'use strict';
require('./index.css');
var _mm 	= require('util/mm.js');
var _user 	= require('service/user-service.js');
var formError = {
	show : function(errMsg){
		$('.error-item').show().find('.err-msg').text(errMsg);
	},
	hide : function(){
		$('.error-item').hide().find('.err-msg').text('');
	}
};
var page = {
	init : function(){
		this.bindEvent();
	},
	bindEvent : function(){
		//用户名检测
		$('#username').blur(function(){
			var username = $.trim($(this).val());
			if(!username){
                return;
            };
            //异步验证用户名是否存在
			_user.checkUsername(username,function(res){
				formError.hide();
			},function(errMsg){
				formError.show(errMsg);
			});
		});
		var _this = this;
		$('#submit').click(function(){
			_this.submit();
		});
		$('.user-content').keyup(function(e){
			if(e.keyCode === 13){
				_this.submit();
			}
		});
	},
	submit : function(){
		var formdata = {
                username        : $.trim($('#username').val()),
                password        : $.trim($('#password').val()),
                passwordConfirm : $.trim($('#password-confirm').val()),
                phone           : $.trim($('#phone').val()),
                email           : $.trim($('#email').val()),
                question        : $.trim($('#question').val()),
                answer          : $.trim($('#answer').val())
            },
		validateResult = this.formValidate(formdata);
		if(validateResult.status){
			_user.register(formdata,function(res){
				window.location.href = './result.html?type=register';
			},function(errMsg){
				formError.show(errMsg)
			});
		}
		else{
			formError.show(validateResult.msg);
		}
	},
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
		if(formdata.password.length < 6){
			result.msg = '密码长度不能少于6位';
			return result;
		}
		if(formdata.password !== formdata.passwordConfirm){
			result.msg = '两次密码不一致'
			return result;
		}
		if(!_mm.validate(formdata.phone,'phone')){
			result.msg = '手机号码格式不正确';
			return result;
		}
		if(!_mm.validate(formdata.email,'email')){
			result.msg = '邮箱格式不正确';
			return result;
		}
		if(!_mm.validate(formdata.question,'require')){
			result.msg = '密码提示问题不能为空';
			return result;
		}
		if(!_mm.validate(formdata.answer,'require')){
			result.msg = '密码提示问题答案不能为空';
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

