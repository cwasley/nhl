var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');

const bracketsController = require('../server/controllers/brackets.js');
const models = require('../server/models');

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

router.get('/rules', function(req, res, next) {
  res.render('rules', { title: 'NHL 2018' });
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

router.get('/', async function(req, res, next) {
    var brackets = await models.Bracket.findAll({
        order: Sequelize.col('name')
    });
    var teams = await models.Team.findAll();
    var games = await models.Game.findAll({
        order: Sequelize.col('id')
    });
    var bracketPredictions = [];
    for (var i = 0; i < brackets.length; i++) {
        var predictions = await models.Prediction.findAll({
            where: {
                bracket_id: brackets[i].dataValues.id
            },
            order: Sequelize.col('id')
        });
        for (var k = 0; k < predictions.length; k++) {
            var prediction = predictions[k];
            for (var j = 0; j < teams.length; j++) {
                if (prediction.winner_id == teams[j].id) {
                    prediction.dataValues.color = teams[j].color;
                    break;
                }
            }
        }
        bracketPredictions.push(predictions);
    }
    res.render('list', {
        title: 'NHL 2018',
        teams: teams,
        brackets: brackets,
        games: games,
        predictions: bracketPredictions
    });
});

router.get('/standings', async function(req, res, next) {
    var brackets = await models.Bracket.findAll({
        order: Sequelize.col('points')
    });
    brackets = brackets.reverse();
    res.render('standings', {
        title: 'NHL 2018',
        brackets: brackets
    });
})

var abbrev_dict = {};
abbrev_dict['Nashville'] = 'NSH';
abbrev_dict['Colorado'] = 'COL';
abbrev_dict['Philadelphia'] = 'PHI';
abbrev_dict['Pittsburgh'] = 'PIT';
abbrev_dict['Columbus'] = 'CBJ';
abbrev_dict['Washington'] = 'WSH';
abbrev_dict['Toronto'] = 'TOR';
abbrev_dict['Boston'] = 'BOS';
abbrev_dict['New Jersey'] = 'NJD';
abbrev_dict['Tampa Bay'] = 'TBL';
abbrev_dict['San Jose'] = 'SJS';
abbrev_dict['Anaheim'] = 'ANA';
abbrev_dict['LA'] = 'LAK';
abbrev_dict['Vegas'] = 'VGK';
abbrev_dict['Minnesota'] = 'MIN';
abbrev_dict['Winnipeg'] = 'WPG';


// router.get('/getbrackets', async function(req, res, next) {
//     var brackets = await models.Bracket.findAll();
//     for (var i = 0; i < brackets.length; i++) {
//         var id = brackets[i].dataValues.id;
//         var predictions = brackets[i].dataValues.predictions;
//         for (var j = 0; j < 8; j++) {
//             await models.Prediction.create({winner_id: abbrev_dict[predictions.round1[j].winner], loser_id: abbrev_dict[predictions.round1[j].loser], num_games: predictions.round1[j].games, game_id: j+1, bracket_id: id});
//         }
//         for (j = 0; j < 4; j++) {
//             await models.Prediction.create({winner_id: abbrev_dict[predictions.round2[j].winner], loser_id: abbrev_dict[predictions.round2[j].loser], num_games: predictions.round2[j].games, game_id: j+9, bracket_id: id});
//         }
//         for (j = 0; j < 2; j++) {
//             await models.Prediction.create({winner_id: abbrev_dict[predictions.round3[j].winner], loser_id: abbrev_dict[predictions.round3[j].loser], num_games: predictions.round3[j].games, game_id: j+13, bracket_id: id});
//         }
//         await models.Prediction.create({winner_id: abbrev_dict[predictions.finals[0].winner], loser_id: abbrev_dict[predictions.finals[0].loser], num_games: predictions.finals[0].games, num_goals: predictions.finals[0].goals, game_id: 15, bracket_id: id});
//
//     }
// });

module.exports = router;
