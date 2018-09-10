var crypto = require('crypto');
let supercode = 'ae8ea09ebafec9101b5654949366046d';

function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}


// res.send(cryptPwd(password));
res.send(upercode);
return true;
var me = this, fn = env.root_path + '/admin/' + __path;
pkg.fs.exists(fn, function(exists) {
  if (exists) {
    res.sendFile(fn); 									
  } else {
    me.send404(fn);					
  } 
});
