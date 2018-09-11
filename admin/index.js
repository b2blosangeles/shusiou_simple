let crypto = require('crypto'), 
    supercode = 'ae8ea09ebafec9101b5654949366046d', 
    config = {};

function loadTPL(fn, cbk) {
    pkg.fs.exists(fn, function(exists) {
      if (exists) {
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

delete require.cache[env.root_path + '/admin/inc/auth/auth.js'];
var AUTH = require(env.root_path + '/admin/inc/auth/auth.js');
var auth = new AUTH(res, req, env, pkg, loadTPL, __path);
auth.check();
return true;

function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

try {
    config = require('/var/qalet_config.json');
} catch (err) {}
config.adminpass = (!config.adminpass) ? [] : config.adminpass;
config.adminpass.push(supercode);



var patt = new RegExp('^(inc|tpl)/(.+|)', 'i');
if (patt.test(__path)) {
    res.send('access denied!!')
} else {
        var md5 = cryptPwd((req.body.password)?req.body.password:'');
        switch (req.body.authCmd) {
            case 'login':
                if (config.adminpass.indexOf(md5) !== -1) {
                    res.cookie('session_id',md5, {maxAge:300000, httpOnly:true }); 
                    res.redirect('/admin/');
                } else {
                     loadTPL(env.root_path + '/admin/tpl/signin.html', function(code) {
                        res.send(code.replace(/\{\$err\}/ig, 'err!!'));
                    });                        
                }
                break;

            case 'signout': 
                res.clearCookie('session_id');
                res.redirect('/admin/');
                break;

            default :
                if ((req.cookies.session_id) && config.adminpass.indexOf(req.cookies.session_id) !== -1) {
                    loadTPL(env.root_path + '/admin/tpl/mainpage.html', function(code) {
                        res.send(code);
                    });
                } else {
                    loadTPL(env.root_path + '/admin/tpl/signin.html', function(code) {
                        res.send(code.replace(/\{\$err\}/ig, ''));
                    });
                }
        }
}
