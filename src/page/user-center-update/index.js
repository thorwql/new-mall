'use strict';
require('./index.css');
var _mm 		= require('util/mm.js');
var _user 		= require('service/user-service.js');
var _cart   = require('service/cart-service.js');
var templateIndex   = require('./index.string');
var templateSecond  = require('./second.string');

//导航
var nav = {
	init : function(){
		this.bindEvent();
		this.loadUserInfo();
		this.loadCartCount();
		return this; 
	},
	//绑定事件
	bindEvent : function(){
		//登录点击事件
		$('.js-login').click(function(){
			_mm.doLogin();
		});
		//注册点击事件
		$('.js-register').click(function() {
			window.location.href = './user-register.html';
		});
		//退出登录点击事件
		$('.js-logout').click(function(){
			window.location.reload();
		},function(errMsg){
			_mm.errorTips(errMsg);
		});
	},
	//加载用户信息
	loadUserInfo 	: function(){
		_user.checkLogin(function(res){
			$('.user.not-Login').hide().sublings('.use.login').show().find('.username').text(res.username);
		},function(errMsg){});
	},
	loadCartCount 	: function(){
		_cart.getCartCount(function(res){
			$('.nav .cart-count').text(res||0)}
			,function(errMsg){
			$('.nav .cart-count').text(0)})
	}

};

//通用头部
var header = {
	init : function(){
		this.bindEvent();
		this.onLoad();
	},
	onLoad : function(){
        var keyword = _mm.getUrlParam('keyword');
        // keyword存在，则回填输入框
        if(keyword){
            $('#search-input').val(keyword);
        };
    },
	bindEvent : function(){
		var _this = this;
		//点击搜索，提交搜索
		$('#search-btn').click(function(){
			_this.searchSubmit();
		});
		//按下回车，提交搜索
		$('#search-input').keyup(function(event){
			if(event.keyCode === 13){
				_this.searchSubmit();
			}
		})

	},
	//搜索提交
	searchSubmit : function(res){
		var keyword = $.trim($('#search-input').val());
		//提交时keyword存在，直接跳转list页
		if(keyword){
			window.location.href = './list.html?keyword=' + keyword;
		}
		//keyword不存在，跳转首页
		else{
			_mm.goHome();
		}
	}
};
//侧边导航
var navSide = {
	option : {
		name : '',
		navList : [
			{name : 'user-center', desc : '个人中心', href: './user-center.html'},
            {name : 'order-list', desc : '我的订单', href: './order-list.html'},
            {name : 'user-pass-update', desc : '修改密码', href: './user-pass-update.html'},
            {name : 'about', desc : '关于MMall', href: './about.html'}
		]
	},
	init 		: function(option){
		$.extend(this.option,option);
		this.renderNav();
	},
	renderNav 	: function(){
		for(var i = 0,iLength = this.option.navList.length;i < iLength; i++){
			if(this.option.name == this.option.navList[i].name){
				this.option.navList[i].isActive = true;
			}
		}
		var navHtml = _mm.renderHtml(templateIndex,{navList : this.option.navList});
		$('.nav-side').html(navHtml);
	}

};
var page = {
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        // 初始化左侧菜单
        navSide.init({
            name: 'user-center'
        });
        // 加载用户信息
        this.loadUserInfo();
    },
    bindEvent : function(){
        var _this = this;
        // 点击提交按钮后的动作
        $(document).on('click', '.btn-submit', function(){
            var userInfo = {
                phone       : $.trim($('#phone').val()),
                email       : $.trim($('#email').val()),
                question    : $.trim($('#question').val()),
                answer      : $.trim($('#answer').val())
            },
            validateResult = _this.validateForm(userInfo);
            if(validateResult.status){
                // 更改用户信息
                _user.updateUserInfo(userInfo, function(res, msg){
                    _mm.successTips(msg);
                    window.location.href = './user-center.html';
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            else{
                _mm.errorTips(validateResult.msg);
            }
        });
    },
    // 加载用户信息
    loadUserInfo : function(){
        var userHtml = '';
        _user.getUserInfo(function(res){
            userHtml = _mm.renderHtml(templateSecond, res);
            $('.panel-body').html(userHtml);
        }, function(errMsg){
            _mm.errorTips(errMsg);
        });
    },
    // 验证字段信息
    validateForm : function(formData){
        var result = {
            status  : false,
            msg     : ''
        };
        // 验证手机号
        if(!_mm.validate(formData.phone, 'phone')){
            result.msg = '手机号格式不正确';
            return result;
        }
        // 验证邮箱格式
        if(!_mm.validate(formData.email, 'email')){
            result.msg = '邮箱格式不正确';
            return result;
        }
        // 验证密码提示问题是否为空
        if(!_mm.validate(formData.question, 'require')){
            result.msg = '密码提示问题不能为空';
            return result;
        }
        // 验证密码提示问题答案是否为空
        if(!_mm.validate(formData.answer, 'require')){
            result.msg = '密码提示问题答案不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status   = true;
        result.msg      = '验证通过';
        return result;
    }
};

$(function(){
	header.init();
	nav.init(); 
	navSide.init({
	name : 'user-pass-update'
});
	page.init();
})
