'use strict';
require('./index.css');
var _mm = require('util/mm.js');
//显示对应元素
$(document).ready(function() {
	var type = _mm.getUrlParam('type')||'default' ;
	var element = '.' + type + '-success';
	$(element).show();
});


























