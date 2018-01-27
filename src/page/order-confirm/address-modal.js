'use strict'
var _mm 						= require('util/mm.js');
var _address   					= require('service/address-service.js');
var _cities 					= require('util/cities/index.js');
var templateAddressModal 		= require('./address-modal.string');

var addressModal = {
	show : function(option){
		this.option = option;
		this.$modalWrap = $('.modal-wrap');
		this.loadModal();
		this.bindEvent();
	},
	hide : function(){

	},
	loadModal : function(){
		var addressModalHtml = _mm.renderHtml(templateAddressModal,this.option.data);
		this.$modalWrap.html(addressModalHtml);
		this.loadProvince();
		this.loadCities();
	},
	bindEvent : function(){
		_this = this;
		this.$modalWrap.find('#receiver-province').change(function(){
			var selectedProvince = $(this).val();
			_this.loadCities(selectedProvince);
		})
	},
	loadProvince : function(){
		_this = this;
		var provinces = _cities.getProvinces() || [];
		this.$modalWrap.find('#receiver-province').html(_this.getSelectedOption(provinces));
	},
	loadCities : function(provinceName){
		_this = this;
		var cities = _cities.getCities(provinceName) || [];
		this.$modalWrap.find('#receiver-city').html(_this.getSelectedOption(cities));
	},
	getSelectedOption : function(optionArray){
		var html = '<option value="">请选择<option>';
		for(var i = 0 ,length = optionArray.length; i < length;i++){
			html += '<option value=" '+optionArray[i]+' ">'+optionArray[i]+'<option>';
		}
		return html;
	}
};

module.exports = addressModal;
