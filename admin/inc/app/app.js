(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(__path, cbk) {
			var me = this;
			switch (__path) {
				case 'website':
					if (me.validation() === null) {
						cbk({module: 'website', data:(config.website) ? config.website : {github:''}, 
						     err : null });
					} else if (me.validation() === true) {
						me.saveConfig(
							'website',
							{github: req.body.github},
							function() {
								cbk({module: 'success', message: 'Success saved website configuration'});
								}
						);
					} else {
						cbk({module: 'website', data:{github: req.body.github}, err : me.validation()});
					}
					break;
				case 'database':
					if (me.validation() === null) {
						cbk({module:'database', data:(config.website) ? config.website : 
						     {host:'', user:'', database:''}, 
						     err : null });
					} else if (me.validation() === true) {
						me.saveConfig(
							'database',
							{host: req.body.host, user: req.body.user, password: req.body.password, database: req.body.database},
							function() {
								cbk({module: 'success', message: 'Success saved database configuration'});
							}
						);
						
					} else {
						cbk({module: 'database', 
						     data:{host: req.body.host, user: req.body.user, password: req.body.password, database: req.body.database}, 
						     err : me.validation()});
					}	
					break;
				case '':
					cbk({module:''});
					break;
				default:
					res.redirect('/admin/');
					break;
			}
		};
		this.validation = function() {
			if (!req.body.appCmd)  return null;

			switch (req.body.appCmd) {
				case 'saveGit':
					var patt = /^(http|https)\:/g;
					if (!patt.test(req.body.github)) {
						return 'Wrong github';
					} 
					return true;
					break;
				case 'savedb':
					if (!req.body.host) return 'missing host !';
					if (!req.body.user) return 'missing user !';
					if (!req.body.database) return 'missing  database!';
					return true;
					break;	
				default: 
					return true;
			}
		};
		this.saveConfig = function(cbk) {
			pkg.ffs.writeFile('/var/qalet_config.json', 'HelloWorld', { 'flag': 'a' }, function(err) {
				cbk();
			}
		}		
		
	};
	module.exports = obj;
})();

