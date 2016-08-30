


module.exports = function(io){
	io.on('connection', function(socket){
		socket.on('join', function(data){
			console.log('socket requested to join', data.channel)

			if(data.channel){
				socket.join(data.channel)
			}
		});
	})
}