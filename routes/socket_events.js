module.exports = function(io){
    io.sockets.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('update_driver_location', function (data) {
            console.log('update_driver_location called from client');
            data = JSON.parse(data);
            console.log("data = ",data);
        });
    });
};