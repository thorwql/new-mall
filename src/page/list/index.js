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
		listParam : {
			keyword 		: _mm.getUrlParam('keyword') 	|| '',
			categoryId      : _mm.getUrlParam('categoryId') || '',
            orderBy         : _mm.getUrlParam('orderBy')    || 'default',
            pageNum         : _mm.getUrlParam('pageNum')    || 1,
            pageSize        : _mm.getUrlParam('pageSize')   || 20
		}
	},
	init : function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		this.loadList();
	},
	bindEvent : function(){
		var _this = this;
		_this.data.listParam.pageNum = 1;
		$('.sort-item').click(function(){
			if(this.data['type']==='default'){
				if(this.hasClass('active')){
					return;
				}
				else{
					$(this.addClass('active').next('.sort-item').removeClass('active asc desc'));
					_this.data.listParam.orderBy = 'default';
				}
			}
			else if(this.data['type']==='price'){
				$(this.addClass('active').sublings('.sort-item').removeClass('active asc desc'));
				if(this.hasClass('asc')){
					$(this).removeClass('asc').addClass('desc');
				 	_this.data.listParam.orderBy = 'price_desc';
				}
				else{
					$(this).addClass('asc').removeClass('desc');
				 	_this.data.listParam.orderBy = 'price_asc';
					}
				}
				_this.loadList();
		})
	},
	loadList : function(){
		var _this = this;
		var listParam = this.data.listParam;
		var listHtml  = '';
		listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);
		$('.p-list-con').html('<div class="loading"></div>');
		_product.getProductList(listParam,function(res){
			listHtml = _mm.renderHtml(templateIndex,{
				list  :  res.list});
			$('.p-list-con').html(listHtml);
			_this.loadPagination({
                hasPreviousPage : res.hasPreviousPage,
                prePage         : res.prePage,
                hasNextPage     : res.hasNextPage,
                nextPage        : res.nextPage,
                pageNum         : res.pageNum,
                pages           : res.pages 
            });
		},function(errMsg){
			_mm.errorTips(errMsg);
		})
	},
	loadPagination : function(pageInfo){
		var _this = this;
		this.pagination ? '' : (this.pagination = new Pagination());
		this.pagination.render($.extend({},pageInfo,{
			container		: $('.pagination'),
			onselectPage 	: function(pageNum){
				_this.data.listParam.pageNum = pageNum;
				_this.loadList();
			}
		}));

	}
}


$(function(){
	header.init();
	nav.init(); 
	page.init();
})
