let config = {};
try {
	delete require.cache['/var/qalet_config.json'];
	config = require('/var/qalet_config.json');
} catch (err) {}

delete require.cache[env.root_path + '/admin/inc/auth/auth.js'];
var AUTH = require(env.root_path + '/admin/inc/auth/auth.js');
var auth = new AUTH(res, req, env, pkg, config);

auth.check(function(isAuth, cbk) {
	if (!isAuth)  {
		res.send({autherror:'unauthorized access'});
		return true;
	}
	switch (req.body.cmd) {
		case 'getDBModule':
			getDBModule({module:req.body.module, cdb : {}, form:req.body.form});
			break;
		case 'saveDBCFG':
			saveDBCFG(req.body.formData);
			break;			
		case 'getDBConfigs':
			res.send(config.database);
			break;			
		default: 
			res.send(config);
	}	
});  
var SMARTY = require(env.root_path + '/admin/inc/smart/smart.js');
function loadTPL(fn, cbk) {
    pkg.fs.stat(fn, function(err, stats) {
	if (!err && stats.isFile()) {
            pkg.fs.readFile(fn, 'utf8', function(err, code) {
                var tpl = (!err) ? new SMARTY(code) : new SMARTY(fn + ' not exist');
		cbk(tpl)
            });			        									
      } else {
	    var tpl = new SMARTY(fn + ' not exist');
            cbk(tpl)				
      } 
    });
}
function getDBModule(data) {
	if (data.module == 'addDB' && !data.form) {
		data.form = {dbid:'', host:'', user:'', database:'', password:'', error: null};
	}
	loadTPL(env.root_path + '/admin/tpl/dbModule.html', function(tpl) {
	    res.send(tpl.fetch(data));
	});
}
function saveDBCFG(data) {
	var v = validationDBCFG(data);
	if (v === true) {
		saveDBConfig(data.dbid, data, function() {
			res.send(data);
		})
	} else {
		res.send(v);
	}
}
function validationDBCFG(data) {
	if (!data) return {error:'Form Data Error!'};
	if (!data.dbid) return {error:'Missing Config ID'};
	if (!data.host) return {error:'Missing host'};
	if (!data.user) return {error:'Missing user'};
	if (!data.database) return {error:'Missing database'};
	return true;
}
function saveDBConfig(key, data, cbk) {
	config.database = {};
	config.database[key] = data;
	pkg.fs.writeFile('/var/qalet_config.json', JSON.stringify(config), function(err) {
		cbk();
	});
}
