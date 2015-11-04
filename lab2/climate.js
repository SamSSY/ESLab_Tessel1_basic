var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);
var http = require('http');

var mainLoop = function() {

  climate.on('ready', function () {
    console.log('Connected to si7020');

    function loop(){

      var data = {"degrees": 0, "humidity":0};
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

      
      climate.readTemperature('f', function (err, temp) {
        climate.readHumidity(function (err, humid) {

          console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');

          var req = http.request(options, function(res) {
            
            res.setEncoding('utf8');
            res.on('data', function () {
              console.log('Response received.');
            });

            res.on('end', function(){
              // after the request is finished, loop again
                loop();
            });
          });

          req.on('error', function(e) {
            console.log('problem with request: ', e.message);
            // on error loop again
            setTimeout(mainLoop, 5000);
          });
           
          data.degrees = temp.toFixed(4);
          data.humidity = humid.toFixed(4);

          console.log('Pushed data.');
          req.write(JSON.stringify(data), function(err){
            req.end();
          });

        });
      });
    }
    
    setImmediate(loop);

  });
  
  climate.on('error', function(err) {
    console.log('error connecting module', err);
  });

};

console.log('Tessel started!');
setImmediate(mainLoop);
