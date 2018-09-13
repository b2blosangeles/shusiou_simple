(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(__path, cbk) {
			var me = this;
			switch (__path) {
				case 'website':
					if (me.validation() === null) {
						cbk({module: 'website', data:config.website, err : null });
					} else if (me.validation() === true) {
						res.redirect('/admin/');
					} else {
						cbk({module: 'website', data:config.website, err : 'err'});
					}
					break;
				case 'database':
					if (me.validation() === null) {
						cbk({module:'database', data:config.database, err : null });
					} else if (me.validation() === true) {
						res.redirect('/admin/');
					} else {
						cbk({module: 'website', data:config.website, err : 'err'});
					}	
					break;
				case '':
					cbk({module:null});
					break;
				default:
					res.redirect('/admin/');
					break;
			}
		};
		this.validation = function() {
			if (!req.body.appCmd)  return null;

			switch (req.body.appCmd) {
				case 'website':
					return true;
					break;
				case 'database':
					return true;
					break;	
				default: 
					return true;
			}
		}
	};
	module.exports = obj;
})();

