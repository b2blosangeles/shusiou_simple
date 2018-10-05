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
		res.send({error:'unauthorized access'});
		return true;
	}
	switch (req.body.cmd) {
		case 'getDBModule':
			getDBModule({module:req.body.module, cdb : {} });
			break;
		default: 
			res.send('');
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
	req.send(data);
	return true;
	if (data.module == 'addDB' && !data.form) {
		data.form = {dbid:'', host:'', user:'', database:'', password:'', err: null};
	}
	loadTPL(env.root_path + '/admin/tpl/dbModule.html', function(tpl) {
	    res.send(tpl.fetch(data));
	});
}
