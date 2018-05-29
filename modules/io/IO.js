(function () {
	
	var obj =  function (server) {
		let me = this;
		me.io = require('./package/socket_io/node_modules/socket.io').listen(server);
		let sequenceNumberByClient = new Map();		
		me.io.on("connection", (socket) => {
			socket.on('createRoom', function(room){
				console.log('socket in- https')
				console.log('socket in-1-' + socket.id + '---' + room);
				socket.join(room, function() {
					me.io.in('VIDEO_112').clients((err, clients) => {
						console.log('socket in- https')
						console.log(clients);
					});
				});
				me.io.to('VIDEO_112').emit('announcements', { message: 'A new user https ' + socket.id + ' has joined!' });
			});
			sequenceNumberByClient.set(socket, 1);
			socket.on("disconnect", () => {
				sequenceNumberByClient.delete(socket);
				me.io.in('VIDEO_112').clients((err, clients) => {
					console.log('socket in- https')
					console.log(clients);
				});
			});
		});		
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
