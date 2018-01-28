'use strict'
var _mm 						= require('util/mm.js');
var _address   					= require('service/address-service.js');
var _cities 					= require('util/cities/index.js');
var templateAddressModal 		= require('./address-modal.string');

var addressModal = {
	show : function(option){
		this.option 		= option;
		this.option.data 	= option.data ||{};
		this.$modalWrap 	= $('.modal-wrap');
		this.loadModal();
		this.bindEvent();
	},
	hide : function(){
		this.$modalWrap.empty();
	},
	loadModal : function(){
		var addressModalHtml = _mm.renderHtml(templateAddressModal,{
			isUpdate : this.option.isUpdate,
			data     : this.option.data
		});
		this.$modalWrap.html(addressModalHtml);
		this.loadProvince();
		this.loadCities();
	},
	bindEvent : function(){
		var _this = this;
		this.$modalWrap.find('#receiver-province').change(function(){
			var selectedProvince = $(this).val();
			_this.loadCities(selectedProvince);
		});
		//提交按钮事件绑定
		$(document).on('click','.address-btn',function(){
			var receiverInfo 	= _this.getReceiverInfo(),
			isUpdate 			= _this.option.isUpdate;
			//使用新地址，且验证通过
			if (!isUpdate&&receiverInfo.status) {
				_address.save(receiverInfo.data,function(res){
					_mm.successTips('地址添加成功');
					_this.hide();
					typeof _this.option.onSuccess === 'function'&&
					_this.option.onSuccess(res);
				},function(errMsg){
					_mm.errorTips(errMsg);
				});
			}
			else if(isUpdate&&receiverInfo.status){
				_address.save(receiverInfo.data,function(res){
					_mm.successTips('地址更新成功');
					_this.hide();
					typeof _this.option.onSuccess === 'function'&&
					_this.option.onSuccess(res);
				},function(errMsg){
					_mm.errorTips(errMsg);
				});
			}
			else{
				_mm.errorTips(receiverInfo.errMsg) || "好像哪里不对了";
			}
		});
		//点击container的时候不关闭弹窗
		$modalWrap.find('.modal-container').click(function(e){
			e.stopPropagation;
		})
		//点击叉号或者蒙版区域，关闭弹窗
		$modalWrap.find('.close').click(function(){
			_this.hide();
		})
	},
	// 获取省份信息
	loadProvince : function(){
		_this = this;
		var provinces = _cities.getProvinces() || [];
		this.$modalWrap.find('#receiver-province').html(_this.getSelectedOption(provinces));
		//如果是更新地址，并且有省份信息，要做省份地址的回填
		if(this.option.isUpdate && this.option.data.receiverProvince){
			$('#receiver-province').val(this.option.data.receiverProvince);
			this.loadCities(this.option.data.receiverProvince);
		}
	},
	// 获取城市信息
	loadCities : function(provinceName){
		_this = this;
		var cities = _cities.getCities(provinceName) || [];
		this.$modalWrap.find('#receiver-city').html(_this.getSelectedOption(cities));
		//如果是更新地址，并且有城市信息，要做城市地址的回填
		if(this.option.isUpdate && this.option.data.receiverCity){
			$('#receiver-province').val(this.option.data.receiverCity);
		}
	},
	// 获取选项内容
	getSelectedOption : function(optionArray){
		var html = '<option value="">请选择<option>';
		for(var i = 0 ,length = optionArray.length; i < length;i++){
			html += '<option value=" '+optionArray[i]+' ">'+optionArray[i]+'<option>';
		}
		return html;
	},
	// 获取表单收货人信息，并进行验证
	getReceiverInfo : function(){
		var receiverInfo 	= {},
			result 			= {
			status : false
		};
		    receiverInfo.receiverName 		= $.trim(this.$modalWrap.find('#receiver-name').val());
			receiverInfo.receiverProvince 	= this.$modalWrap.find('#receiver-province').val();
			receiverInfo.receiverCity 		= this.$modalWrap.find('#receiver-name').val();
			receiverInfo.receiverAddress 	= $.trim(this.$modalWrap.find('#receiver-address').val());
			receiverInfo.receiverPhone 		= $.trim(this.$modalWrap.find('#receiver-phone').val());
			receiverInfo.receiverzip 		= $.trim(this.$modalWrap.find('#receiver-zip').val());
		//如果是isUpdate，取出receiver-id
		if(isUpdate){
			receiverInfo.id 	= this.$modalWrap.find('#receiver-id').val();
		}
		//表单验证
		if(!receiverInfo.receiverName){
			result.errMsg = '请输入收件人姓名';
		}
		else if(!receiverInfo.receiverProvince){
			result.errMsg = '请选择省份';
		}
		else if(!receiverInfo.receiverCity){
			result.errMsg = '请选择城市';
		}
		else if(!receiverInfo.receiverAddress){
			result.errMsg = '请填写详细地址';	
		}
		else if(!receiverInfo.receiverPhone){
			result.errMsg = '请填写收件人手机号';
		}
		else{
			result.status 	= true;
			result.data 	= receiverInfo;
		}
		return result;
	}
};

module.exports = addressModal;
