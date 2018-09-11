(function () { 
	var obj =  function (res, req, pkg, __path) {
		let crypto = require('crypto'),
		    supercode = 'ae8ea09ebafec9101b5654949366046d';
		
		this.cryptPwd = function(password) {
		    var md5 = crypto.createHash('md5');
		    return md5.update(password).digest('hex');
		}
		this.check = function() {
			res.send('AAA_' + __path);
			// var fs = require('fs');
		};	
	};
	module.exports = obj;
})();

