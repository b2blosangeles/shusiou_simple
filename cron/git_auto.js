var fs    = require('fs'), path = require('path');
var exec = require('child_process').exec;
var root_path =  path.join(__dirname, '..');
var site_path =  root_path + '/sites/site';
var cmd = 'cd ' + site_path + ' && git pull && cd ' + root_path + ' && git pull';
exec(cmd, function(error, stdout, stderr) {
  console.log(stdout);
});
