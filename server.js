var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var buzzwords = [{}];
var points = 0;
server.use(express.static('public'));

server.use(bodyParser.urlencoded({extended: true}));

server.get('/', function (req, res) {
  res.status(200).render('index');
});

server.get('/buzzword', function (req, res) {
  res.status(200).json({buzzwords: buzzwords});
});

function createBuzz (req, res) {
  var z;
  if (buzzwords[0].buzzWord === undefined) {
    z = 0;
  } else {
    z = buzzwords.length;
    buzzwords.push({});
  }
  console.log(z, 'and the length is ', buzzwords.length);
  buzzwords[z].buzzWord = req.body.buzzWord;
  buzzwords[z].score = req.body.score;
  buzzwords[z].heard = false;
  return res.status(201).json({success: true});

}

server.post('/buzzword', function (req, res) {
  if(req.body.hasOwnProperty('buzzWord') && req.body.hasOwnProperty('score') && req.body.hasOwnProperty('heard')) {
    if (buzzwords[0].buzzWord !== undefined) {
     for(var i = 0; i < buzzwords.length; i++) {
      if(buzzwords[i].buzzWord === req.body.buzzWord) {
        console.log('Are we heerre?', buzzwords[i].buzzWord, req.body.buzzWord);
        res.status(403).send('buzzWord already exists!');
        return;
      } else {
        return createBuzz(req, res);
      }
     }
    } else {
      return createBuzz(req, res);
    }
  } else {
    return res.status(403).send('Please use proper format to POST');
  }
});

server.put('/buzzword', function (req, res) {
  if(req.body.hasOwnProperty('buzzWord')) {
    if(buzzwords[0].buzzWord !== undefined) {
      for(var y = 0; y < buzzwords.length; y++) {
        if((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === false) && (req.body.heard ===  'true')) {
          buzzwords[y].heard = true;
          points = points + parseInt(buzzwords[y].score);
          return res.status(200).json({buzzWord: req.body.buzzWord, points: points});
        } else if ((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === false) && (req.body.heard === 'false')) {
          res.status(403).json({success: false, reason: 'Your \'heard\' value remained false' });
        } else if ((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === true) && (req.body.heard === 'false')) {
          buzzwords[y].heard = false;
          points = points - parseInt(buzzwords[y].score);
          res.status(200).json({success: false, reason: 'This buzzword\'s heard status has been changed to false and the points have been deducted'});
        } else if ((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === true) && (req.body.heard === 'true')) {
          res.status(403).send('You have already reported hearing this buzzword');
        } else if ((req.body.buzzWord !== buzzwords[y].buzzWord) && (y === buzzwords.length -1)) {
          res.status(404).send('The buzzWord you entered was not found');
        }
      }
    } else {
      return res.status(404).send('No buzzword libraries exist, please Post first');
    }
  } else {
  return res.status(403).send('Please enter a buzzWord and a heard key value pair');
}
});

server.delete('/buzzword', function (req, res) {
  res.status(200).send('You can delete');
});

server.post('/reset', function (req, res) {
  res.status(200).send('You can post the reset');
});

server.listen(3000, function () {
console.log('Server started: http:localhost: 3000'); });