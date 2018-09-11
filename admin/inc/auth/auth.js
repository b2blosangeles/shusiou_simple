(function () { 
	var obj =  function (res, req, __path) {
		this.check = function() {
			res.send('AAA_' + __path);
			// var fs = require('fs');
		};	
	};
	module.exports = obj;
})();

