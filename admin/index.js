var crypto = require('crypto');
function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

var password = '123456';
res.send(cryptPwd(password));
retur true;
var me = this, fn = env.root_path + '/admin/' + __path;
pkg.fs.exists(fn, function(exists) {
  if (exists) {
    res.sendFile(fn); 									
  } else {
    me.send404(fn);					
  } 
});
