var express = require('express');
var app = express();


app.get('/hello.txt', function(req, res){
  res.send('Hello World');
});

app.get('/hello.json', function(req, res){
  res.send({hello: 'world'});
});


var port = process.env.PORT || 80;
app.listen(port, function() {
  console.log("Listening on " + port);
});