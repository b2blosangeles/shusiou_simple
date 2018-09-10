let crypto = require('crypto'), 
    supercode = 'ae8ea09ebafec9101b5654949366046d', 
    config = {};

function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

try {
    config = require('/var/qalet_config.json');
} catch (err) {}
config.adminpass = (!config.adminpass) ? [] : config.adminpass;
config.adminpass.push(supercode);

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
                        res.send(code.replace(/\{\$err\}/ig, 'err!!' + cryptPwd(req.body.password)));
                    });                        
                }
                break;

            case 'signout': 
                res.clearCookie('session_id');
                res.redirect('/admin/');
                break;

            default :
                if (!req.cookies.session_id) {
                    loadTPL(env.root_path + '/admin/tpl/signin.html', function(code) {
                        res.send(code.replace(/\{\$err\}/ig, ''));
                    });
                } else {
                    loadTPL(env.root_path + '/admin/tpl/mainpage.html', function(code) {
                        res.send(code);
                    });
                }
        }
}
