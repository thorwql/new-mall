'use strict';
require('./index.css');
var _mm 					= require('util/mm.js');
var templatePagination   	= require('./index.string');

var Pagination = function(){
	var _this = this;
	this.defaultOption = {
		container       : null,
        pageNum         : 1,
        pageRange       : 3,
        onSelectPage    : null
	};
	//渲染分页的组件
	Pagination.prototype.render = function(userOption){
		this.option = $.extend({},defaultOption,userOption);
		if(!(this.option.container instanceof jquery)){
			return;
		};
		if(this.option.pageNum < = 1){
			return;
		};
		this.option.container.html(this.getPaginationHtml());
	};
	//获取组件的HTML
	Pagination.prototype.getPaginationHtml = function(){
		// 上一页 2 3 4 5 6 7 8 下一页  5/8
		pageArray 	= [];
		html : '';
		start 		= (this.option.pageNum-this.option.range) > 0 ?
		(this.option.pageNum-this.option.range) : 1;
		end 		= (this.option.pageNum+this.option.range) < this.option.pages ?
		(this.option.pageNum+this.option.range) : this.option.pages;
		//获取‘上一页’
		pageArray.push({
			name 		: '上一页',
			value 		: this.option.prePage,
			disabled 	: !(this.option.hasPreviousPage)
		});
		//获取‘数字’
		for(var i=start ; i < end ; i++){
			pageArray.push({
			name : i,
			value : i,
			active : (i = this.option.pageNum)
			})
		};
		//获取‘下一页’
		pageArray.push({
			name 		: '下一页',
			value 		: this.option.nextPage,
			disabled 	: !(this.option.hasnextPage)
		});
		html = _mm.renderHtml(templatePagination,{
			pageArray 	: pageArray,
			pageNum 	: this.option.pageNum,
			pages 		: this.option.pages
		});
		return html;
		
	}
};
module.exports = Pagination;