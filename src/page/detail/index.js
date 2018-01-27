'use strict';
require('./index.css');
var _mm 					= require('util/mm.js');
var _product 				= require('service/product-service.js');
var _user 					= require('service/user-service.js');
var _cart   				= require('service/cart-service.js');
var templateIndex   		= require('./index.string');

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
var page = {
	data : {
			productId  :  _mm.getUrlParam('productId') 	|| ''
	},
	init : function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		if(!this.data.productId){
			_mm.goHome();
		}
		this.loadDetail();
	},
	bindEvent 	: 	function(){
		// 查看缩略图
		$(document).on('mouseenter','.p-img',function(){
			var imgUrl = $(this).find('.p-img').attr('src');
			$('.main-img').attr('src',imgUrl);
		});
		// 加减数量
		var count = $('.p-count').val();
		var	maxCount = this.data.detailInfo.stock || 1;
		var minCount = 1;
		$('document').on('click','.p-count-btn',function(){
			if(this.hasClass('plus')){
				if(count < maxCount){
					count++
				}
				else{
					count = maxCount;
				}
			};
			if(this.hasClass('minus')){
				if(count > minCount){
					count--
				}
				else{
					count = minCount;
				}
			}
		});
		// 加入购物车
		$(document).on('click','.cart-add',function(){
			_cart.addToCart({
				productId 	: this.data.productId,
				count		: $('.p-count').val()
			},function(res){
				window.location.href = './result.html?type=cart-add-success';
			},function(errMsg){
				_mm.errorTips(errMsg);
			});
		});
	},
	loadDetail 	: 	function(){
		_product.getProductDetail(this.data.productId,function(res){
			this.filter(res);
			//缓存detailInfo
			this.data.detailInfo = res;
			$('.page-wrap').html(_mm.renderHtml(templateIndex,res));
		},function(errMsg){
			$('.page-wrap').html('<p class="err-tip">此商品太淘气，找不到了</p>');
		})
	},
	filter : function(data){
		data.subImage = data.subImage.split(',');
	}
};


$(function(){
	header.init();
	nav.init(); 
	page.init();
})