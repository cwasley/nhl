var express = require('express');
var router = express.Router();

const bracketsController = require('../server/controllers/brackets.js');

var data = {
    0: {
        "city": "Nashville",
        "mascot": "Predators",
        "color": "#FFB81C",
        "pts": 117,
        "row": 47,
        "division": "central",
        "conference": "western",
        "seed": "(1)"
    },
    1 : {
        "city": "Colorado",
        "mascot": "Avalanche",
        "color": "#6F263D",
        "pts": 95,
        "row": 41,
        "division": "central",
        "conference": "western",
        "seed": "(WC2)"
    },
    2 : {
        "city": "Winnipeg",
        "mascot": "Jets",
        "color": "#041E42",
        "pts": 114,
        "row": 48,
        "division": "central",
        "conference": "western",
        "seed": "(2)"
    },
    3 : {
        "city": "Minnesota",
        "mascot": "Wild",
        "color": "#154734",
        "pts": 101,
        "row": 42,
        "division": "central",
        "conference": "western",
        "seed": "(3)"
    },
    4 : {
        "city": "Vegas",
        "mascot": "Golden Knights",
        "color": "#B9975B",
        "pts": 109,
        "row": 47,
        "division": "pacific",
        "conference": "western",
        "seed": "(1)"
    },
    5 : {
        "city": "LA",
        "mascot": "Kings",
        "color": "#000000",
        "pts": 98,
        "row": 43,
        "division": "pacific",
        "conference": "western",
        "seed": "(WC1)"
    },
    6 : {
        "city": "Anaheim",
        "mascot": "Ducks",
        "color": "#FC4C02",
        "pts": 101,
        "row": 40,
        "division": "pacific",
        "conference": "western",
        "seed": "(2)"
    },
    7 : {
        "city": "San Jose",
        "mascot": "Sharks",
        "color": "#006272",
        "pts": 100,
        "row": 40,
        "division": "pacific",
        "conference": "western",
        "seed": "(3)"
    },
    8 : {
        "city": "Tampa Bay",
        "mascot": "Lightning",
        "color": "#00205B",
        "pts": 113,
        "row": 48,
        "division": "atlantic",
        "conference": "eastern",
        "seed": "(1)"
    },
    9 : {
        "city": "New Jersey",
        "mascot": "Devils",
        "color": "#C8102E",
        "pts": 97,
        "row": 39,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(WC1)"
    },
    10 : {
        "city": "Boston",
        "mascot": "Bruins",
        "color": "#000000",
        "pts": 112,
        "row": 47,
        "division": "atlantic",
        "conference": "eastern",
        "seed": "(2)"
    },
    11 : {
        "city": "Toronto",
        "mascot": "Maple Leafs",
        "color": "#00205B",
        "pts": 105,
        "row": 42,
        "division": "atlantic",
        "conference": "eastern",
        "seed": "(3)"
    },
    12 : {
        "city": "Washington",
        "mascot": "Capitals",
        "color": "#C8102E",
        "pts": 105,
        "row": 46,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(1)"
    },
    13 : {
        "city": "Columbus",
        "mascot": "Blue Jackets",
        "color": "#041E42",
        "pts": 97,
        "row": 39,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(3)"
    },
    14 : {
        "city": "Pittsburgh",
        "mascot": "Penguins",
        "color": "#000000",
        "pts": 100,
        "row": 45,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(2)"
    },
    15 : {
        "city": "Philadelphia",
        "mascot": "Flyers",
        "color": "#FA4616",
        "pts": 98,
        "row": 40,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(WC2)"
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'NHL 2018' });
});

router.get('/instructions', function(req, res, next) {
  res.render('instructions', { title: 'NHL 2018' });
});

router.get('/bracket', function(req, res, next) {
  res.render('bracket2', { title: 'NHL 2018' });
});

router.post('/submit', bracketsController.create);

router.get('/data', function(req, res, next) {
    res.json({'data': data});
});

router.get('/confirmation', function(req, res, next) {
    res.render('confirmation', {title: 'NHL 2018' });
});

module.exports = router;
