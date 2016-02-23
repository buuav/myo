var port = process.env.PORT || 3000;
var myo = require('myo');
var net = require('net');

Myo.connect('com.ghirlekar.myocontrol');
Myo.on('connected', function() {
    console.log('Connected to Myo armband');
    var myMyo = Myo.myos[0];
    
    //myMyo.zeroOrientation();
    // console.log(myMyo.orientationOffset);  
    myMyo.streamEMG(true);
    net.createServer(function(client) {
        console.log('Client connected');
        client.on('end', function() {
            console.log('Client disconnected');
        });
        client.on('error', console.log);
        
        myMyo.on('emg', function(data, timestamp) {
            client.write(data.join(',').concat('\r\n'));  
        });
    }).listen(port, function() {
        console.log('TCP server listening for incoming connections on PORT: ' + port);
    });
});
