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
    cbk(fn);
    /*
    pkg.fs.exists(fn, function(exists) {
      if (exists) {
            kg.fs.readFile(fn, 'utf8', function(err, code) {
                if (!err) {
                    cbk(code)
                } else {
                    res.send(fn + ' not exist');										
                }
            });			        									
      } else {
            res.send(err);				
      } 
    });
    */
}

var patt = new RegExp('^(inc|tpl)/(.+|)', 'i');
if (patt.test(__path)) {
    res.send('access denied!!')
} else {
      res.send('AAA')
    /*
       if (!req.cookies.session_id) {
            var md5 = cryptPwd(req.body.password);
            if (req.body.cmd === 'login' && config.adminpass.indexOf(md5) !== -1) {
                res.cookie('session_id',md5, {maxAge:300000, httpOnly:true });  
                res.redirect('/admin/');
            } else {
                loadTPL(env.root_path + '/admin/tpl/signin.html', function(code) {
                    res.send('code');
                    //if (req.body.cmd === 'login') res.send(code.replace(/\{\$err\}/, 'err!!'));
                   // else res.send(code.replace(/\{\$err\}/, ''));
                });
            }
       } else {
            res.sendFile(env.root_path + '/admin/tpl/mainpage.html');
       }
       */
}
return true;
/*
// res.send(cryptPwd(password));
// res.send(supercode);
// maxAge:60000, 
res.cookie('username','cookie的值',{expires: new Date(Date.now() - 900000), httpOnly:true });   //设置cookie  maxAge表示过期时间 单位毫秒
if (!req.cookies.pwd_id) {
    res.sendFile(env.root_path + '/admin/tpl/signin.html');
} else {
    res.sendFile(env.root_path + '/admin/tpl/mainpage.html');
}
// res.send("设置cookie成功");


return true;
var me = this, fn = env.root_path + '/admin/' + __path;
pkg.fs.exists(fn, function(exists) {
  if (exists) {
    res.sendFile(fn); 									
  } else {
    me.send404(fn);					
  } 
});
*/
