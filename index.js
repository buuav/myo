var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 55000;

var myo = require('myo');

app.use(express.static(__dirname + '/client'));

server.listen(port, function() {
    console.log('Server listening at localhost:' + port);
    Myo.connect('com.ghirlekar.myocontrol');
    Myo.on('connected', function() {
        console.log('Connected to Myo armband');
        var myMyo = Myo.myos[0];
        myMyo.streamEMG(true);
        myMyo.on('emg', function(data, timestamp){
        	io.emit('emg', data);
        });
    });
});
