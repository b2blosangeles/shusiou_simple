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
			switch (req.body.authCmd) {
			    case 'login':
				if (config.adminpass.indexOf(md5) !== -1) {
				    res.cookie('session_id',md5, {maxAge:300000, httpOnly:true }); 
				    res.redirect('/admin/');
				} else {
				     loadTPL(env.root_path + '/admin/tpl/signin.html', function(code) {
					res.send(code.replace(/\{\$err\}/ig, 'err!!'));
				    });                        
				}
				break;

			    case 'signout': 
				res.clearCookie('session_id');
				res.redirect('/admin/');
				break;

			    default :
				if ((req.cookies.session_id) && config.adminpass.indexOf(req.cookies.session_id) !== -1) {
				    loadTPL(env.root_path + '/admin/tpl/mainpage.html', function(code) {
					res.send(code);
				    });
				} else {
				    loadTPL(env.root_path + '/admin/tpl/signin.html', function(code) {
					res.send(code.replace(/\{\$err\}/ig, ''));
				    });
				}
			}
		};	
	};
	module.exports = obj;
})();

