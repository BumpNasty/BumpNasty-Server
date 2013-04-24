var express = require('express');
var app = express();


app.get('/hello.txt', function(req, res){
  res.send('Hello World');
});

app.get('/hello.json', function(req, res){
  res.send({hello: 'world'});
});


app.listen(80);
console.log('Listening on port 80');
