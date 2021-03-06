(function () { 
	
	var obj =  function (pkg, env, req, res, io) {
		this.envSite = function(env) {
			var me = this;
			let v = JSON.parse(JSON.stringify(env));
			let host = req.headers.host;
			v.site_path = v.sites_path + '/site';
			return v;
		}
		
		this.send404 = function(v) {
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write(v + ' does not exist');
			res.end();		
		}	
		this.send500 = function(err) {
			res.writeHead(500, {'Content-Type': 'text/html'});
			res.write('Error! ' + err.message);
			res.end();			
		}
		this.sendPackage = function(v) {
			var me = this;
			var fn = me.envSite(env).site_path + '/files/package/' + v;
			delete require.cache[__dirname + '/qaletPackage.js'];
			var router  = require(__dirname + '/qaletPackage.js');
			var P = new router(pkg, me.envSite(env), req, res);						
			P.load(fn);								
		};		
		this.sendFile = function(v) {
			var me = this, fn = me.envSite(env).site_path + '/' + v;
			pkg.fs.exists(fn, function(exists) {
				if (exists) {
					res.sendFile(fn); 									
				} else {
					me.send404(v);					
				} 
			});				
		};
		this.sendCMSFile = function(v) {
			var me = this, fn = env.site_contents_path + '/' + v;
			pkg.fs.exists(fn, function(exists) {
				if (exists) {
					res.sendFile(fn); 									
				} else {
					me.send404(v);					
				} 
			});				
		};
		this.runAdmin = function(v) {
			var me = this;
			var patt = new RegExp('api/(.+|).api', 'i');
			if (patt.test(v)) {
				var p = env.root_path + '/admin/' + v.replace(/\.api$/i, '.js');
				pkg.fs.readFile(p, 'utf8', function(err, code) {
					if (!err) {
						try {
							new Function('require', 'pkg', 'env', 'req', 'res', '__path', code)
							(require, pkg, me.envSite(env), req, res, v);
						} catch(err) {
							me.send500(err);
						}
					} else {
						me.send500(err);										
					}
				});
				return true;
			}
			var p = env.root_path + '/admin/index.js';
			
			pkg.fs.readFile(p, 'utf8', function(err, code) {
				if (!err) {
					try {
						new Function('require', 'pkg', 'env', 'req', 'res', '__path', code)
						(require, pkg, me.envSite(env), req, res, v);
					} catch(err) {
						me.send500(err);
					}
				} else {
					me.send500(err);										
				}
			});	
		};	
		
		this.runApi = function(v) {
			var me = this;
			var fn = '/var/qalet_config.json';
		
			pkg.fs.exists(fn, function(exists) {
				if (exists) {
					try {
						delete require.cache[fn];
						env.site_config = require(fn);
					} catch (e) {}
				}
				me.runApiAfterConfig(v);
			});
		};
		
		this.runApiAfterConfig = function(v) {
			var me = this;
			var p = me.envSite(env).site_path + '/api/' + v;
			
			// var patt = new RegExp('.js$', 'i');
			var patt = new RegExp('.api$', 'i');
			if (!patt.test(v)) {
				me.send404(v);
				return true;
			}
			p = p.replace(patt,'.js');
			
			pkg.fs.exists(p, function(exists) {
				if (exists) {
					pkg.fs.stat(p, function(err, stats) {
						 if (stats.isFile()) {
							
							try {
								delete require.cache[p];
								var taskClass = require(p);
								var entity = new taskClass(pkg, me.envSite(env), req, res, io);
								entity.call();
							} catch(err) {
								pkg.fs.readFile(p, 'utf8', function(err, code) {
									if (!err) {
										try {
											new Function('require', 'pkg', 'env', 'req', 'res', 'io', code)
											(require, pkg, me.envSite(env), req, res, io);
										} catch(err) {
											me.send500(err);
										}
									} else {
										me.send500(err);										
									}
								});								
							}		

						 } else {
							me.send404(v);									 
						 }
					});									
				} else {
					me.send404(v);						
				} 
			});	
		};
		
		this.isIp = function(ip) {
		    var arrIp = ip.split(".");
		    if (arrIp.length !== 4) return false;
		    for (let oct of arrIp) {
			if ( isNaN(oct) || Number(oct) < 0 || Number(oct) > 255)
			    return false;
		    }
		    return true;
		};
	
		this.sendWhoami = function() {
			var me = this;
			pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
				if (!err && me.isIp(data)) {
					res.send(data);	
				} else {
					res.send('');	
				}
			});	
		}
		this.snedIndex = function(p) {
			var me = this;
			pkg.fs.exists(me.envSite(env).site_path  + '/index.html', (exists) => {
			    if (exists) {
				    me.sendFile('index.html');
			    } else {
				    pkg.fs.exists(me.envSite(env).site_path  + '/api/index.js', (exists) => {
				    	if (exists) me.runApi('index.api');
					else me.send404('index');
				    });
			    }	    
			});
		};			
		this.load = function() {
			var me = this, p = req.params[0];
			var patt = new RegExp('/(admin|api|checkip|package|cms)/(.+|)', 'i');
			var v = p.match(patt);
			if ((v) && typeof v == 'object') {
				switch (v[1]) {
					case 'api':
						me.runApi(v[2]);
						break;
					case 'admin':
						me.runAdmin(v[2]);
						break;
					case 'checkip':
						me.sendWhoami();
						break;	
					case 'package':
						me.sendPackage(v[2]);
						break;
					case 'cms':
						this.sendCMSFile(v[2]);
						break;					
					default:
						me.send404(p);
				}		
			} else {
				if (p.match(/\/$/i)) {
					me.snedIndex(p)
				} else {
					me.sendFile(p);
				}
			}
		};	
	
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
