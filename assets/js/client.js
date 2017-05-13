$(document).ready(function() {
    var socket = io.connect('/')
    console.log(socket.id);
    socket.on('OnUserList', function(userList) {
    	console.log("Total connection " + userList.length);
    
    	var line = '';
    	for(var i=0; i<userList.length; i++){
    		var date = new Date(null);
    		date.setSeconds(parseInt(new Date() - new Date(userList[i].loggedInTime))/1000);

    		line += '<tr><td>' + userList[i].username + '</td><td>' + date.toISOString().substr(11,8) + '</tr>'
    	}
    	$("#userList").html(line);
    });

    socket.on('error', function(error) {
    	console.log('error on socket' + error);
    });
});