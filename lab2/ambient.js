var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['A']);
var http = require('http');

var mainLoop = function() {

  ambient.on('ready', function () {
    console.log('Connected to si7020');

    function loop(){

      var data = {"lightLevel": 0, "soundLevel":0};
      var options = {
        hostname: '52.10.182.239',
        port: 80,
        path:'/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

        ambient.getLightLevel( function(err, ldata) {
            if (err) throw err;
            ambient.getSoundLevel( function(err, sdata) {
                if (err) throw err;
                console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
                
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

                data.lightLevel = ldata.toFixed(8);
                data.soundLevel = sdata.toFixed(8);

                console.log('Pushed data.');
                req.write(JSON.stringify(data), function(err){
                    req.end();
                });

            });
        });
    }
    
    setImmediate(loop);

  });
  
    ambient.on('error', function (err) {
        console.log(err)
    });

};

console.log('Tessel started!');
setImmediate(mainLoop);
