module.exports = function(io){
    io.sockets.on('connection', function (socket) {
        console.log('a user connected');
        
        socket.on('message1', function () {
            console.log('Event triggered');
        });
    });
};