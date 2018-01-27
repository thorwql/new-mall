var _cities = {
	cityInfo : {
		'北京' : ['北京'],
		'重庆' : ['重庆'],
		'上海' : ['上海'],
		'天津' : ['天津'],
		'辽宁' : ['沈阳','大连','鞍山','抚顺','本溪','丹东','锦州','营口','阜新','辽阳','盘锦','铁岭','朝阳','葫芦岛']
		'黑龙江' : ['哈尔滨','大庆','齐齐哈尔','双鸭山','绥化','牡丹江','鹤岗','鸡西','伊春','佳木斯','七台河','黑河','大兴安岭','阿城']
	},
	getProvinces : function(){
		var provinces = [];
		for(var item in this.cityInfo){
			provinces.push(item);
		};
		return provinces;
	},
	getCities : function(provinceName){
		return this.cityInfo[provinceName] || [];
	}
}

module.exports = _cities;