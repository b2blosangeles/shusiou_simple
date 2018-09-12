(function () { 
	var obj =  function (res, req, env, pkg, config) {
		let crypto = require('crypto');
		
		this.cryptPwd = function(password) {
		    var md5 = crypto.createHash('md5');
		    return md5.update(password).digest('hex');
		}
		this.check = function(cbk) {
			var me = this;
			var md5 = me.cryptPwd((req.body.password)?req.body.password:'');
			switch (req.body.authCmd) {
			    case 'login':
				if (config.adminpass.indexOf(md5) !== -1) {
				    res.cookie('session_id',md5, {maxAge:600000, httpOnly:true }); 
				    res.redirect('/admin/');
				} else {
				     cbk(false, function(tpl) {
					return tpl.fetch({err: 'err!!'});
				    });                        
				}
				break;

			    case 'signout': 
				res.clearCookie('session_id');
				res.redirect('/admin/');
				break;

			    default :
				if ((req.cookies.session_id) && config.adminpass.indexOf(req.cookies.session_id) !== -1) {
					cbk(true)
				} else {
					cbk(false,  function(tpl) {
						return tpl.fetch({err:''});
				    	});
				}
			}
		};	
	};
	module.exports = obj;
})();

