(function (req, res) { 
	var obj =  function () {
		this.check = function() {
			res.send('AAA_' + __path);
			// var fs = require('fs');
		};	
	};
	module.exports = obj;
})(req, res);

