(function () { 
	var obj =  function (res, req, pkg, __path) {
		let crypto = require('crypto'),
		    supercode = 'ae8ea09ebafec9101b5654949366046d';
		
		this.cryptPwd = function(password) {
		    var md5 = crypto.createHash('md5');
		    return md5.update(password).digest('hex');
		}
		this.check = function() {
			var me = this;
			var md5 = me.cryptPwd((req.body.password)?req.body.password:'');
			res.send('AAA_' + md5);
			// var fs = require('fs');
		};	
	};
	module.exports = obj;
})();

