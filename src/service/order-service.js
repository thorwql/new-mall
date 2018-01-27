'use strict';

var _mm = require('util/mm.js')
var _order = {
	//获取商品清单
	getProductList : function(productId,resolve,reject){
		_mm.request({
			url 	: _mm.getServerUrl('/cart/get_cart_product_count.do'),
			data    : productId,
			success : resolve,
			error 	: reject
		})
	}
}

module.exports = _order;