var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Bracket = mongoose.model('Bracket', {
    result2_0: String,
    result2_1: String,
    result2_2: String,
    result2_3: String,
    result2_4: String,
    result2_5: String,
    result2_6: String,
    result2_7: String,
    result2_8: String,
    result2_9: String,
    result2_10: String,
    result2_11: String,
    result2_12: String,
    result2_13: String,
    result2_14: String,
    result2_15: String,
    result3_0: String,
    result3_1: String,
    result3_2: String,
    result3_3: String,
    result3_4: String,
    result3_5: String,
    result3_6: String,
    result3_7: String,
    result4_0: String,
    result4_1: String,
    result4_2: String,
    result4_3: String,
    result5_0: String,
    result5_1: String
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'NHL 2018' });
});

router.get('/instructions', function(req, res, next) {
  res.render('instructions', { title: 'NHL 2018' });
});

router.get('/bracket', function(req, res, next) {
  res.render('bracket2');
});

// TODO refactor this into an object that you can just pass into the model as 'payload' or something, not all these fields
router.post('/submit', function(req, res, next) {
    console.log('test');
  var newBracket = new Bracket({
      result2_0: req.body['2-0'],
      result2_1: req.body['2-1'],
      result2_2: req.body['2-2'],
      result2_3: req.body['2-3'],
      result2_4: req.body['2-4'],
      result2_5: req.body['2-5'],
      result2_6: req.body['2-6'],
      result2_7: req.body['2-7'],
      result2_8: req.body['2-8'],
      result2_9: req.body['2-9'],
      result2_10: req.body['2-10'],
      result2_11: req.body['2-11'],
      result2_12: req.body['2-12'],
      result2_13: req.body['2-13'],
      result2_14: req.body['2-14'],
      result2_15: req.body['2-15'],
      result3_0: req.body['3-0'],
      result3_1: req.body['3-1'],
      result3_2: req.body['3-2'],
      result3_3: req.body['3-3'],
      result3_4: req.body['3-4'],
      result3_5: req.body['3-5'],
      result3_6: req.body['3-6'],
      result3_7: req.body['3-7'],
      result4_0: req.body['4-0'],
      result4_1: req.body['4-1'],
      result4_2: req.body['4-2'],
      result4_3: req.body['4-3'],
      result5_0: req.body['5-0'],
      result5_1: req.body['5-1']
  });
  newBracket.save().then(function() {
    res.redirect('/');
  });

});

module.exports = router;
