var express = require('express');
var Handshaker = require('./lib/handshake');
var HotelAPI = require('./lib/hotel-api');
var HotelRequester = require('./lib/hotel-requester');
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
  var shaker = Handshaker.request({
    latitude: parseFloat(req.param('latitude')),
    longitude: parseFloat(req.param('longitude')),
    minRate: req.param('minRate'),
    maxRate: req.param('maxRate'),
    minStarRating: req.param('minStarRating'),
    maxStarRating: req.param('maxStarRating'),
    maxRadius: req.param('maxRadius'),
    timestamp: new Date(),
    id: id
  });
  
  var interval;
  var tryFrequency = 200;
  var timeout = 10000; // 10 seconds
  interval = setInterval(function() {
    var shakee = Handshaker.doHandshake(id);
    if (shakee) {
      HotelRequester.request(shaker.toJSON(), shakee.toJSON(), function(err, hotels) {
        res.send({
          other: shakee,
          hotel: HotelRequester._hotelFormatter(hotels)
        });
      });
      clearInterval(interval);
    } else {
      timeout -= tryFrequency;
      if (timeout <= 0) {
        clearInterval(interval);
        res.send({error: 'timeout'});
      };
    };
  }, tryFrequency);
});

app.get('/hotel', function(req, res) {
  HotelAPI.request({latitude: 52.373503, longitude: 4.896812, minRate: req.param('minRate'), maxRate: req.param('maxRate'), maxRadius: req.param('maxRadius')}, function(err, hotels) {
    if (err) res.send(err);
    res.send(HotelRequester._hotelFormatter(hotels));
  });
});

app.get('/bookHotel', function(req, res) {
  HotelAPI.bookingRequest({latitude: 52.373503, longitude: 4.896812, minRate: req.param('minRate'), maxRate: req.param('maxRate'), maxRadius: req.param('maxRadius')}, function(err, hotels) {
    if (err) res.send(err);
    res.send(hotels);
  });
});

app.get('/logs', function(req, res) {
  res.send(Handshaker.handshakes.toJSON());
})

var port = process.env.PORT || 80;
app.listen(port, function() {
  console.log("Listening on " + port);
});