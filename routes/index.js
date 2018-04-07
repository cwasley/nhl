var express = require('express');
var router = express.Router();

const bracketsController = require('../server/controllers/brackets.js');

var data = {
    0: {
        "city": "Nashville",
        "mascot": "Predators",
        "color": "#FFB81C",
        "pts": 113,
        "row": 45,
        "division": "central",
        "conference": "western",
        "seed": "(1)"
    },
    1 : {
        "city": "St. Louis",
        "mascot": "Blues",
        "color": "#003087",
        "pts": 93,
        "row": 40,
        "division": "central",
        "conference": "western",
        "seed": "(WC2)"
    },
    2 : {
        "city": "Winnipeg",
        "mascot": "Jets",
        "color": "#041E42",
        "pts": 110,
        "row": 46,
        "division": "central",
        "conference": "western",
        "seed": "(2)"
    },
    3 : {
        "city": "Minnesota",
        "mascot": "Wild",
        "color": "#154734",
        "pts": 98,
        "row": 41,
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
        "pts": 96,
        "row": 42,
        "division": "pacific",
        "conference": "western",
        "seed": "(WC1)"
    },
    6 : {
        "city": "San Jose",
        "mascot": "Sharks",
        "color": "#006272",
        "pts": 98,
        "row": 39,
        "division": "pacific",
        "conference": "western",
        "seed": "(2)"
    },
    7 : {
        "city": "Anaheim",
        "mascot": "Ducks",
        "color": "#FC4C02",
        "pts": 95,
        "row": 37,
        "division": "pacific",
        "conference": "western",
        "seed": "(3)"
    },
    8 : {
        "city": "Tampa Bay",
        "mascot": "Lightning",
        "color": "#00205B",
        "pts": 110,
        "row": 47,
        "division": "atlantic",
        "conference": "eastern",
        "seed": "(1)"
    },
    9 : {
        "city": "Philadelphia",
        "mascot": "Flyers",
        "color": "#FA4616",
        "pts": 94,
        "row": 38,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(WC2)"
    },
    10 : {
        "city": "Boston",
        "mascot": "Bruins",
        "color": "#000000",
        "pts": 110,
        "row": 46,
        "division": "atlantic",
        "conference": "eastern",
        "seed": "(2)"
    },
    11 : {
        "city": "Toronto",
        "mascot": "Maple Leafs",
        "color": "#00205B",
        "pts": 103,
        "row": 41,
        "division": "atlantic",
        "conference": "eastern",
        "seed": "(3)"
    },
    12 : {
        "city": "Washington",
        "mascot": "Capitals",
        "color": "#041E42",
        "pts": 103,
        "row": 45,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(1)"
    },
    13 : {
        "city": "New Jersey",
        "mascot": "Devils",
        "color": "#C8102E",
        "pts": 95,
        "row": 38,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(WC1)"
    },
    14 : {
        "city": "Pittsburgh",
        "mascot": "Penguins",
        "color": "#000000",
        "pts": 96,
        "row": 43,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(2)"
    },
    15 : {
        "city": "Columbus",
        "mascot": "Blue Jackets",
        "color": "#041E42",
        "pts": 96,
        "row": 39,
        "division": "metropolitan",
        "conference": "eastern",
        "seed": "(3)"
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
