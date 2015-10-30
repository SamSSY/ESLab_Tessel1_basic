// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var tessel = require('tessel');
var http = require('http');

var mainLoop = function() {

  var data = {"x": 0, "y": 0, "z": 0};
  
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
   
	// Initialize the accelerometer.
	accel.on('ready', function () {

	  // Stream accelerometer data
		  accel.on('data', function (xyz) {

			  	var req = http.request(options, function(res) {
				    
				    res.setEncoding('utf8');
				    res.on('data', function () {
				      console.log('Response received.');
					});

				    res.on('end', function(){
				      // after the request is finished, loop again
				      mainLoop();
				    });
		  		});

				req.on('error', function(e) {
				    console.log('problem with request: ', e.message);
				    // on error loop again
				    setTimeout(mainLoop, 5000);
				});

			data.x = xyz[0].toFixed(2);
			data.y = xyz[1].toFixed(2);
			data.z = xyz[2].toFixed(2);

		  	console.log('Pushed data.');
		  	req.write(JSON.stringify(data), function(err){
		  		req.end();
		  	});
	  });

	});

	accel.on('error', function(err){
	  console.log('Error:', err);
	});
};

console.log('Tessel started!');
setImmediate(mainLoop);