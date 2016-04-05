const app     = require('express')();
const http    = require('http').Server(app);
const io      = require('socket.io')(http);
const express = require('express');
const ipc     = require('ipc-goddess');
const nconf   = require('nconf');
nconf.argv().env();

var config = {
  id: 'channelcheck-goddess'
};

var channelsInput = nconf.get('IN_CHANNELS');
if(channelsInput) {
  config.inputs = {
    'channels': channelsInput
  };
}

ipc.initSocket(config);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));
app.use('/jquery', express.static('bower_components/jquery/dist'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket) {
});

ipc.on('channels', function(data) {
  io.emit('channels',data.data);
});
