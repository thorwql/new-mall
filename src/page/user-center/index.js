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
		this.loadUserInfo();
	},
	renderNav 	: function(){
		for(var i = 0,iLength = this.option.navList.length;i < iLength; i++){
			if(this.option.name == this.option.navList[i].name){
				this.option.navList[i].isActive = true;
			}
		}
		var navHtml = _mm.renderHtml(templateIndex,{navList : this.option.navList});
		$('.nav-side').html(navHtml);
	},
	loadUserInfo : function(){
		_user.getUserInfo(function(res){
			var html = _mm.renderHtml(templateSecond,res);
			$('panel-body').html(html);
		},function(errMsg){
			_mm.errorTips(errMsg);
		})
	}
};
$(function(){
	header.init();
	nav.init(); 
	navSide.init({
	name : 'user-center'
});

})
