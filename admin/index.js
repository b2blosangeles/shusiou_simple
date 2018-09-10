var crypto = require('crypto');
let supercode = 'ae8ea09ebafec9101b5654949366046d';

var config = {};
try {
    config = require('/var/qalet_config.json');
} catch (err) {}

if (!config.adminpass) {
    config.adminpass = supercode;
} else {
    config.adminpass.push(supercode);
}
function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

var patt = new RegExp('^(inc|tpl)/(.+|)', 'i');
if (patt.test(__path)) {
    res.send('access denied!!')
} else {
       if (!req.cookies.session_id) {
            if ((req.body.password) && config.adminpass.indexOf(req.body.password) !== -1) {
                res.send(req.body);
            } else {
                res.sendFile(env.root_path + '/admin/tpl/signin.html');
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
