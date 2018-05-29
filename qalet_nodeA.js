var 
express = require('./package/express/node_modules/express'),
socket_io = require('./package/socket_io/node_modules/socket.io'),    
bodyParser = require('./package/body-parser/node_modules/body-parser'),
compression = require('./package/compression/node_modules/compression'),
tls = require('tls'),  
app = express(),
app_socket = {};
expireTime	= 604800000,
port 		= 180;

var LOG = require(__dirname + '/package/log/log.js');
var log = new LOG();		
var env = {
	root_path:__dirname,
	config_path:'/var/qalet_config',
	sites_path:__dirname + '/sites',
	site_contents_path : '/var/site_contents'
};
var _dns = {m:{tm:new Date().getTime(), list:[]}, n:{tm:new Date().getTime(), list:[]}};
var pkg = {
	crowdProcess:require('./package/crowdProcess/crowdProcess'),
	request		:require('./package/request/node_modules/request'),
	syntaxError	:require('./package/syntax-error/node_modules/syntax-error'),
	fs		:require('fs'),
	exec		:require('child_process').exec			
};

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(compression({level:9}));

app.all('*', function(req, res, next) {
	console.log('socket in --2--');
	
	
	let _socket_id =  req.query.id;
	console.log(_socket_id);
	setTimeout( function() {
		app_socket.ios.to('VIDEO_112').emit('announcements', { message: 'A new user ' + _socket_id + ' has joined!' });
		console.log('=======================>');
		let clients = app_socket.ios.in('VIDEO_112').clients;
		console.log(Object.keys(clients).length);
		console.log('<=======================');
	}, 1000);
	app_socket.ios.engine.generateId = function(socket_req) {
		return _socket_id;
	};
	
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});

app.use(function(req, res, next){
    res.setTimeout(300000, function(){
		res.writeHead(505, {'Content-Type': 'text/html'});
		var v = {
			url:req.protocol + '://' + req.get('host') + req.originalUrl,
			code: 505,
			reason:'timeout'
		}
		res.write(req.protocol + '://' + req.get('host') + req.originalUrl + ' request was timeout!');
		res.end();			
	});
    next();
});

app.get(/(.+)$/i, function (req, res) {
	delete require.cache[__dirname + '/modules/qaletRouter/qaletRouter.js'];
	var router  = require(__dirname + '/modules/qaletRouter/qaletRouter.js');
	var R = new router(pkg, env, req, res);
	R.load();
});

app.post(/(.+)$/i, function (req, res) {
	delete require.cache[__dirname + '/modules/qaletRouter/qaletRouter.js'];
	var router  = require(__dirname + '/modules/qaletRouter/qaletRouter.js');
	var R = new router(pkg, env, req, res);
	R.load();
});


var server = require('http').createServer(app);
    

server.listen(port, function() {
	log.write("/var/log/shusiou_master_reboot.log", 'shusiou master boot up', 'Started server on port ' + port + '!'); 
	app_socket.io =  socket_io.listen(server);
	app_socket.io.on("connection", (socket) => {});
});

var cert_folder = '/var/cert/sites/';
pkg.fs.exists(cert_folder, function(exists) {
    if (exists) {
	pkg.fs.readdir(cert_folder, function(err, cert_files) {
		var certs = {};
		if (!cert_files.length) return false;
		for (var i = 0; i < cert_files.length; i++) {
			if (pkg.fs.existsSync(cert_folder + cert_files[i] + '/key.pem') &&
			   	pkg.fs.existsSync(cert_folder + cert_files[i] + '/crt.pem')
			   ) {
				certs[cert_files[i]] = {
					key: pkg.fs.readFileSync(cert_folder + cert_files[i] + '/key.pem'),
					cert: pkg.fs.readFileSync(cert_folder + cert_files[i] + '/crt.pem') 			
				};
			}

		}	
		var httpsOptions = {

			SNICallback: function(hostname, cb) {
			  if (certs[hostname]) {
				var ctx = tls.createSecureContext(certs[hostname]);
			  } else {
				var ctx = tls.createSecureContext(certs['_default'])
			  }
			  cb(null, ctx)
			}
		};
		var https_server =  require('https').createServer(httpsOptions, app);

		https_server.listen(1443, function() {
				console.log('Started server on port 1443 at' + new Date() + '');
				app_socket.ios =  socket_io.listen(https_server);

				let sequenceNumberByClient = new Map();		
				 app_socket.ios.on("connection", (socket) => {
					socket.on('createRoom', function(room){
						console.log('socket in-1-' + socket.id + '---' + room);
						socket.join(room);
					});
					console.log('socket in-1-' + socket.id);
					//app_socket.ios.to('ROOM_12398').emit('announcements', { message: 'A new user  has joined!' });
					console.log('socket on connection');
				    console.info(`Client connected [id=${socket.id}]`);
				    // initialize this client's sequence number
				    sequenceNumberByClient.set(socket, 1);

				    // when socket disconnects, remove it from the list:
				    socket.on("disconnect", () => {
					sequenceNumberByClient.delete(socket);
					console.info(`Client gone [id=${socket.id}]`);
				    });

					socket.on('event', function(data) {
						console.log(`the ${socket.id} client sent us this dumb message--->` + data.message + ' socket.id --> ' + socket.id);
					});	


				});				
		});
		
	
		
		
	});
    }
});


