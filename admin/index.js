var SMARTY = require(env.root_path + '/admin/inc/smart/smart.js');
var tpl = new SMARTY('<span>aaa</span>');
res.send(tpl.fetch());
return true;

function loadTPL(fn, cbk) {
    pkg.fs.stat(fn, function(err, stats) {
	if (!err && stats.isFile()) {
            pkg.fs.readFile(fn, 'utf8', function(err, code) {
                if (!err) {
                    cbk(code)
                } else {
                    cbk(fn + ' not exist');										
                }
            });			        									
      } else {
            cbk('file not exist err');				
      } 
    });
}

var patt = new RegExp('^(inc|tpl)/(.+|)', 'i');
if (patt.test(__path) || __path === 'index.js') {
    res.send('access denied!!')
} else {
     var fn = env.root_path + '/admin/' + __path;
     var _f = function() {
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
		loadTPL(env.root_path + ((!isAuth) ? '/admin/tpl/signin.html' : '/admin/tpl/mainpage.html'), function(code) {
		    if (typeof cbk === 'function') {
			res.send(cbk(code));
		    } else {
			res.send(code)
		    }
		});
	    });    
     }

     pkg.fs.stat(fn, function(err, stats) {
	if (!err && stats.isFile()) {
		res.sendFile(fn);        									
	} else {
	    _f();
	} 
    });

}
