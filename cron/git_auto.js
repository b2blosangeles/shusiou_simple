var exec = require('child_process').exec;
var root_path =  path.join(__dirname, '..');
var site_path =  root_path + '/sites/site';
var cmd = 'cd ' + env.site_path + ' && git pull && cd ' + env.root_path + ' && git pull';
exec(cmd, function(error, stdout, stderr) {});
