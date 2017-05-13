/*
    Author: Rajeev Jayaswal
    Server side script
*/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var winston = require('winston');
var bodyParser = require('body-parser');

var userList = [];
var connectionsList = [];

//logging each request just like that
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'who-online.log' })
    ]
  });

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({
    extended: true
}));

//Express ejs setup
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.io = io;

app.get('/', function(req, res){
  res.render('login');
});


app.post('/login', function(req, res){
    var newUser = {
                  username: req.body.username,
                  loggedInTime: new Date()
                };

    userList.push(newUser);
    logger.info(newUser.username);
    req.app.io.emit('OnUserList', userList);
    
    res.render('main');

});

io.on('connection', function(socket){
  console.log('Connecting user ' + socket.id);

  connectionsList.push(socket.id);
  if (connectionsList.length > 0) {
        setInterval(function(){ 
                io.sockets.emit('OnUserList', userList);
            },1000);
  }
  
  socket.on('disconnect', function() {
        
        for(var i = 0; i < connectionsList.length; i++) {
            if(connectionsList[i] == socket.id) {
                connectionsList.splice(i, 1);
                userList.splice(i,1);
                break;
            }
        }
        io.sockets.emit('OnUserList', userList);
        console.log('user disconnected with' + socket.id);
    });

});


http.listen(8080, function(){
  console.log('listening on:8080');
});