var express = require('express');
var Handshaker = require('./lib/handshake');
var app = express();

var handshakes = [];

app.get('/hello.txt', function(req, res){
  res.send('Hello World');
});

app.get('/hello.json', function(req, res){
  res.send({hello: 'world'});
});

app.get('/handshake', function(req, res) {
  var id = req.param('id');
  Handshaker.request({
    latitude: parseFloat(req.param('latitude')),
    longitude: parseFloat(req.param('longitude')),
    timestamp: new Date(),
    id: id
  });
  
  var interval;
  var tryFrequency = 200;
  var timeout = 10000; // 10 seconds
  interval = setInterval(function() {
    var shake = Handshaker.doHandshake(id);
    if (shake) {
      res.send(shake);
    } else {
      timeout -= tryFrequency;
      if (timeout <= 0) {
        clearInterval(interval);
        res.send({error: 'timeout'});
      };
    };
  }, tryFrequency);
});

var port = process.env.PORT || 80;
app.listen(port, function() {
  console.log("Listening on " + port);
});