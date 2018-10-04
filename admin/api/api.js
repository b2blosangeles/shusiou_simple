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
	res.send(req.body);
});  
