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
						cbk({module:'database', data:(config.database) ? config.database : 
						     {host:'', user:'', database:'', password:''}, 
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
		this.saveConfig = function(key, data, cbk) {
			config[key] = data;
			// config.adminpass = [config.adminpass[0]];
			pkg.fs.writeFile('/var/qalet_config.json', JSON.stringify(config), function(err) {
				if (key === 'website') {
					var cmd = 'rm -fr ' + env.site_path + ' && cd ' + env.root_path + 
					    '/sites && git clone ' + data.github + ' site';
					//res.send(cmd);
					pkg.exec(cmd, function(error, stdout, stderr) {
					  cbk();
					});					
				} else {
					cbk();
				}
			});
		}		
		
	};
	module.exports = obj;
})();

