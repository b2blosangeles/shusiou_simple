var CronJobManager = require('./crontab_manager.js');
var CrowdProcess = require('../package/crowdProcess/crowdProcess');
var manager = new CronJobManager();
var exec = require('child_process').exec;
var fs    = require('fs'), path = require('path');
var root_path =  path.join(__dirname, '..');
var site_path =  root_path + '/sites/';

var cmd = 'cd ' + env.site_path + ' && git pull && cd ' + env.root_path + ' && git pull';
exec(cmd, function(error, stdout, stderr) {});
