var CronJobManager = require('./crontab_manager.js');
var CrowdProcess = require('../package/crowdProcess/crowdProcess');
var manager = new CronJobManager();
var exec = require('child_process').exec;
var fs    = require('fs'), path = require('path');
var root_path =  path.join(__dirname, '..');
var site_path =  root_path + '/sites/';

var LOG = require(root_path + '/package/log/log.js');
var log = new LOG();

let CP = new CrowdProcess(), _f = {};
let cron= [{"id":"_git_auto","schedule":"10 * * * * *", "space":"/cron", "script": "/git_auto.js"}];

_f['site_cron'] = function(cbk) {
	let conf_file = root_path + '/sites/site/cron_service/cron.json';
	fs.exists(conf_file, function(exists){
		let cron_item = [];
		if(exists) {
			try {
				cron_item = require(conf_file);	
			} catch (e) {
				log.write("/var/log/shusiou_cron.log", 'cron', conf_file + ' format error!');
			}
		}
		cbk(cron_item);
	});	
}


CP.serial(
	_f,
	function(data) {
		for (var j = 0; j < CP.data['site_cron'].length; j++ ) {
			let rec = CP.data['site_cron'][j];
			rec.id = 'site_cron_' + rec.id;
			rec.space = '/sites/site/cron_service';
			cron.push(rec);
		}				

		for (var i = 0; i < cron.length; i++) {
			var f = function(v) {
				return function() {
					exec('cd ' + root_path + v.space + ' &&  node ' + v.script, 
					     {maxBuffer: 1024 * 2048},
					     function(error, stdout, stderr) {
						if (error) {
							log.write("/var/log/shusiou_cron.log", 'cron::'+v.script,  JSON.stringify(error));
						} else {
							if (!stderr) {
								log.write("/var/log/shusiou_cron.log", 'cron::'+v.script, JSON.stringify({status:'success', id:v.id, message:log.transformText(stdout)}));
							} else {
								log.write("/var/log/shusiou_cron.log", 'cron::'+v.script, JSON.stringify({status:'error', id:v.id, message:log.transformText(stderr)}));
							}
						}	
					});

				}
			};
			if (manager.exists( cron[i]['id'])) {
				manager.stop( cron[i]['id']);
			}


			if (cron[i].script) {
				if (!manager.exists( cron[i]['id'])) {
					manager.add( cron[i]['id'], cron[i]['schedule'], f(cron[i]), null, false, "America/Los_Angeles");
				} else {
					manager.deleteJob( cron[i]['id']);
				}
				manager.start( cron[i]['id']);
			}	
		}
	},
	6000
);
