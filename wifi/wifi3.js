/* global console */
/* global require */

var tessel = require('tessel');
var http = require('http');

var mainLoop = function() {
  var options = {
    hostname: '52.10.182.239',
    port: 80,
    path:'/',
    //path: '/sensor_readings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  var data = {temperature_f: 100.0};

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function () {
      console.log('Response received.');
    });
    
    res.on('end', function(){
      // after the request is finished, loop again
      setTimeout(mainLoop, 5000);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ', e.message);
    
    // on error loop again
    setTimeout(mainLoop, 5000);
  });


  //req.write(JSON.stringify({secret_token: 'cookie', sensor_reading: data}));
  req.write("XDDDD");
  console.log('Pushed data.');

  req.end();

};

console.log('Tessel started!');
setImmediate(mainLoop);