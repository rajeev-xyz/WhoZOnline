$(document).ready(function() {
    var socket = io.connect();
    socket.on('stream', function(obj) {
        console.log(obj)
    });

    socket.on('error', function(error) {
        if (error) 
            console.log(error);
    });
}