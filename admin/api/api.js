
	    delete require.cache[env.root_path + '/admin/inc/auth/auth.js'];
	    var AUTH = require(env.root_path + '/admin/inc/auth/auth.js');
	    var auth = new AUTH(res, req, env, pkg, config);

	    auth.check(function(isAuth, cbk) {
          if (isAuth) {
            res.send('AAA');
          } else {
            res.send('BBB');
          }
	    });  
