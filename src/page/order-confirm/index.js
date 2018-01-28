'use strict'
require('./index.css');
var _mm 					= require('util/mm.js');
var _cart					= require('service/cart-service.js');
var _user					= require('service/user-service.js');
var _order   				= require('service/order-service.js');
var _address   				= require('service/address-service.js');
var addressModal			= require('./address-modal.js')
var templateAddress  		= require('./address-list.string');
var templateProduct 		= require('./product-list.string');


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
	data :{
		selectedAddressId : ''
	},
	init : function(){
		this.bindEvent();
		this.onLoad();
	},
	bindEvent : function(){
		//地址的选择
		var _this = this;
		$(document).on('click','.address-item',function(){
			$(this).addClass('active').sublings('.address-item').removeClass('active');
			_this.data.selectedAddressId = $(this).data('id');
		});
		//订单的提交
		$(document).on('click','.order-submit',function(){
			var shippingId = _this.data.selectedAddressId;
			if(shippingId){
				_order.createOrder({
					shippingId : shippingId
				},function(res){
					window.location.href = './payment.html?orderNumber=' + res.orderNo;
				},function(errMsg){
					_mm.errorTips(errMsg);
				})
			}else{
				_mm.errorTips('请选择地址后再提交');
			}
		});
		//地址的添加
		$(document).on('click','.address-add',function(){
			addressModal.show({
				isUpdate 	: false,
				onSuccess 	: function(){
					_this.loadAddressList();
				}
			});
		});
		//地址的编辑
		$(document).on('click','.address-update',function(e){
			e.stopPropagation();
			var shippingId = $(this).parents('.address-item').data('id');
			_address.getAddress(shippingId,function(res){
				addressModal.show({
				isUpdate 	: true,
				data        : res,
				onSuccess 	: function(){
					_this.loadAddressList();
				}
			});
			},function(errMsg){
				_mm.errorTips(errMsg);
			})
		});
		//地址的删除
		$(document).on('click','.address-delete',function(e){
			e.stopPropagation();
			var id = $(this).parents('.address-item').data('id');
			if(window.confirm('确认删除该地址?')){
			_address.deleteAddress(id,function(res){
				_this.loadAddressList();
			},
			function(errMsg){
				_mm.errorTips(errMsg);
					})
				}
			})
	},
	onLoad : function(){
		this.loadAddressList();
		this.loadProductList();
	},
	//加载地址列表
	loadAddressList : function(){
		_address.getAddressList(function(res){
			_this.addressFilter(res);
			var addressListHtml = '';
			addressListHtml = _mm.renderHtml(templateAddress,res);
			$('.address-con').html(addressListHtml);
		},function(errMsg){
			// $('.address-con').html('<p class="err-tip">地址加载失败，请刷新后再试</p>');
		})
	},
		//处理地址列表中选中状态
	addressFilter : function(data){
		if(this.data.selectedAddressId){
			var selectedAddressFlag = false;
			for(var i = 0,length = data.list.length; i < length ; i++){
				if(data.list[i].id === this.data.selectedAddressId){
					data.list[i].isActive 		= true;
					selectedAddressFlag 		= true;
				}
			};
			//如果以前选中的地址不存在了，将其删除
			if(!this.data.selectedAddressId){
				this.data.selectedAddressId = null;
			}
		}
	},
	//加载商品清单
	loadProductList : function(){
		_order.getProductList(function(res){
			var productListHtml = '';
			productListHtml = _mm.renderHtml(templateProduct,res);
			$('.product-con').html(productListHtml);
		},function(errMsg){
			// $('.product-con').html('<p class="err-tip">商品信息加载失败，请刷新后再试</p>');
		})
	},

}
 $(function(){
 	nav.init();
 	header.init();
 	page.init();
 })