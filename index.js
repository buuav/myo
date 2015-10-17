var fs = require('fs');
var myo = require('myo');


var file = fs.openSync('data.csv', 'w');
Myo.connect('com.ghirlekar.myocontrol');
Myo.on('connected', function() {
    console.log('Connected to Myo armband');
    var myMyo = Myo.myos[0];
    myMyo.streamEMG(true);
    myMyo.on('emg', function(data, timestamp) {
        fs.write(file, data.join(',').concat('\r\n'));
    });
});
