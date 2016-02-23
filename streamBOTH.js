var imuPort = 10000, emgPort = 3000;
var myo = require('myo');
var net = require('net');

Myo.connect('com.ghirlekar.myocontrol');

Myo.on('connected', function() {
    console.log('Connected to Myo armband');
    var myMyo = Myo.myos[0];
//Myo.requestBatteryLevel()
    //myMyo.zeroOrientation();
    // console.log(myMyo.orientationOffset);  
    myMyo.streamEMG(true);
    net.createServer(function(imuStream) {
        console.log('imuStream connected');
        myMyo.zeroOrientation();
        imuStream.on('end', function() {
            console.log('imuStream disconnected');
        });
        imuStream.on('error', console.log);

        net.createServer(function(emgStream) {
            console.log('emgStream connected');
            emgStream.on('end', function() {
                console.log('emgStream disconnected');
            });
            emgStream.on('error', console.log);

            myMyo.on('emg', function(data, timestamp) {
                emgStream.write(data.join(',').concat('\r\n'));
            });

            myMyo.on('imu', function(data, timestamp) {
                // imuStream.write(data.join(',').concat('\r\n'));
                //console.log(data)
                imuStream.write(Math.round(data.accelerometer.x * 1000) / 1000 + ',' + Math.round(data.accelerometer.y * 1000) / 1000 + ',' + Math.round(data.accelerometer.z * 1000) / 1000 + ',' + Math.round(data.gyroscope.x * 1000) / 1000 + ',' + Math.round(data.gyroscope.y * 1000) / 1000 + ',' + Math.round(data.gyroscope.z * 1000) / 1000 + ',' + Math.round(data.orientation.w * 1000) / 1000 + ',' + Math.round(data.orientation.x * 1000) / 1000 + ',' + Math.round(data.orientation.y * 1000) / 1000 + ',' + Math.round(data.orientation.z * 1000) / 1000 + '\r\n');
                //console.log(Math.round(data.accelerometer.x*1000)/1000 + ',' + Math.round(data.accelerometer.y*1000)/1000 + ',' + Math.round(data.accelerometer.z*1000)/1000 + ',' + Math.round(data.gyroscope.x*1000)/1000 + ',' + Math.round(data.gyroscope.y*1000)/1000 + ',' + Math.round(data.gyroscope.z*1000)/1000 + ',' + Math.round(data.orientation.w*1000)/1000 + ',' + Math.round(data.orientation.x*1000)/1000 + ',' + Math.round(data.orientation.y*1000)/1000 + ',' + Math.round(data.orientation.z*1000)/1000);
            });
        }).listen(emgPort, function() {
            console.log('TCP server listening for incoming connections on PORT: ' + emgPort);
        });
    }).listen(imuPort, function() {
        console.log('TCP server listening for incoming connections on PORT: ' + imuPort);
    });
});
