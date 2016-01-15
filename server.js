var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var buzzwords = [{}];
var points = 0;
server.use(express.static('public'));

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json({type: 'application/json'}));

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
  buzzwords[z].buzzWord = req.body.buzzWord;
  buzzwords[z].score = req.body.score;
  buzzwords[z].heard = false;
  return res.status(201).json({success: true});
}
function validatePost(req, res, next) {

}

function validate (req, res, next) {
  var keyArry = ['buzzWord', 'score', 'heard'];
  for(var x = 0; x < keyArry.length; x++) {
    console.log('Are we here?');
    if(!req.body.hasOwnProperty(keyArry[x])) {
      return res.status(403).send('Missing ' + keyArry[x] + ' key value pair');
    }

    if(req.body[ keyArry[x] ].length === 0 ) {
      return res.status(403).send('Missing value for key: ' + keyArry[x]);
    }
  }
  next();

}


server.post('/buzzword', validate, function (req, res) {
  if (buzzwords[0].buzzWord !== undefined) {
    for(var i = 0; i < buzzwords.length; i++) {
      if(buzzwords[i].buzzWord === req.body.buzzWord) {
        res.status(403).send('buzzWord already exists!');
        return;
      } else if ((buzzwords[i].buzzWord !== req.body.buzzWord) && (i === buzzwords.length - 1)) {
        return createBuzz(req, res);
      }
    }
  } else {
    return createBuzz(req, res);
  }
});

server.put('/buzzword', validate, function (req, res) {
    if(buzzwords[0].buzzWord !== undefined) {
      for(var y = 0; y < buzzwords.length; y++) {
        if(req.body.buzzWord === buzzwords[y].buzzWord) {
          buzzwords[y].heard = req.body.heard;
          if(buzzwords[y].heard === false) {
            points = points - parseInt(buzzwords[y].score);
            return res.status(200).json({success: false, reason: 'This buzzword\'s heard status has been changed to false and the points have been deducted'});
          } else {
            points = points + parseInt(buzzwords[y].score);
            return res.status(200).json({buzzWord: req.body.buzzWord, points: points});
          }
        }

        // if((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === false) && (req.body.heard ===  'true')) {
        //   buzzwords[y].heard = true;
        //   points = points + parseInt(buzzwords[y].score);
        //   return res.status(200).json({buzzWord: req.body.buzzWord, points: points});
        // } else if ((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === false) && (req.body.heard === 'false')) {
        //   console.log('This put is if heard is false and they report false');
        //   res.status(403).json({success: false, reason: 'Your \'heard\' value remained false' });
        // } else if ((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === true) && (req.body.heard === 'false')) {
        //   buzzwords[y].heard = false;
        //   points = points - parseInt(buzzwords[y].score);
        //   console.log('This is to put and change the value from true back to false and subtract the points');
        //   res.status(200).json({success: false, reason: 'This buzzword\'s heard status has been changed to false and the points have been deducted'});
        // } else if ((req.body.buzzWord === buzzwords[y].buzzWord) &&  (buzzwords[y].heard === true) && (req.body.heard === 'true')) {
        //   console.log('This is if they have set it to true and try to put again with true');
        //   res.status(403).send('You have already reported hearing this buzzword');
        // } else if ((req.body.buzzWord !== buzzwords[y].buzzWord) && (y === buzzwords.length -1)) {
        //   console.log('This is if word not found in array to put');
        //   res.status(404).send('The buzzWord you entered was not found');
        // }
      }
      console.log('This is if word not found in array to put');
      return res.status(404).send('The buzzWord you entered was not found');
    } else {
      return res.status(404).send('No buzzword libraries exist, please Post first');
    }
});

server.delete('/buzzword', validate, function (req, res) {
  if(buzzwords[0].buzzWord !== undefined) {
    for(var i = 0; i < buzzwords.length; i++) {
      if(buzzwords[i].buzzWord === req.body.buzzWord) {
        var removed = buzzwords[i].buzzWord;
        buzzwords.splice(i, 1);
        res.status(200).send('The buzzWord ' + removed + ' has been removed!');
        return;
      } else if ((buzzwords[i].buzzWord !== req.body.buzzWord) && (i === buzzwords.length - 1)) {
        return res.status(404).send('This buzzword does not exist');
      }
    }
  } else {
    return res.status(404).send('No buzzword libraries exist');
  }
});

server.post('/reset', function (req, res) {
  buzzwords = [{}];
  points= 0;
  console.log(points, buzzwords);
  res.status(200).send('All buzzwords have been erased and points set to zero');
});

server.listen(3000, function () {
console.log('Server started: http:localhost: 3000'); });