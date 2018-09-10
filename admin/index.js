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

res.send(config.adminpass);
return true;
/*
function loadTPL(fn, cbk) {
    pkg.fs.exists(fn, function(exists) {
      if (exists) {
            kg.fs.readFile(fn, 'utf8', function(err, code) {
                if (!err) {
                    cbk(code)
                } else {
                    me.send500(err);										
                }
            });			        									
      } else {
            me.send404(fn);					
      } 
    });
}

var patt = new RegExp('^(inc|tpl)/(.+|)', 'i');
if (patt.test(__path)) {
    res.send('access denied!!')
} else {
       if (!req.cookies.session_id) {
            if ((req.body.cmd === 'login') && config.adminpass.indexOf(cryptPwd(req.body.password)) !== -1) {
                res.cookie('session_id',cryptPwd(req.body.password), {maxAge:300000, httpOnly:true });  
                res.redirect('/admin/');
            } else {
                loadTPL(env.root_path + '/admin/tpl/signin.html', function(code) {
                    if (req.body.cmd === 'login') res.send(code.replace(/\{\$err\}/, 'err!!'));
                    else res.send(code.replace(/\{\$err\}/, ''));
                });
            }
       } else {
            res.sendFile(env.root_path + '/admin/tpl/mainpage.html');
       }
}
return true;

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
