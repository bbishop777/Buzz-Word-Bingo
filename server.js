var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var buzzwords = [{}];
var score = null;
server.use(express.static('public'));

server.use(bodyParser.urlencoded({extended: true}));

server.get('/', function (req, res) {
  res.status(200).render('index');
});

server.get('/buzzword', function (req, res) {
  res.status(200).json({buzzwords: buzzwords});
});

server.post('/buzzword', function (req, res) {
  if(req.body.buzzWord && req.body.score && req.body.heard) {
    if (buzzwords.length >= 0){
     for(var i = 0; i < buzzwords.length; i++) {
      if(buzzwords[i].buzzWord === req.body.buzzWord) {
        req.status(403).send('buzzWord already exists!');
        return;
      }
     }
    } else {
      buzzwords[0].buzzWord = req.body.buzzWord;
      buzzwords[0].score = req.body.score;
      buzzwords[0].heard = req.body.heard;
      res.status(201).json({success: true});
    }
  } else {
    req.status(404).send('Please use proper format to POST');
  }

  console.log(buzzwords);
});

// server.put('/buzzword', function (req, res) {
//   for
//   if(req.body.buzzword )
//   res.status(200).send('You can put');
// });

server.delete('/buzzword', function (req, res) {
  res.status(200).send('You can delete');
});

server.post('/reset', function (req, res) {
  res.status(200).send('You can post the reset');
});

server.listen(3000, function () {
console.log('Server started: http:localhost: 3000'); });