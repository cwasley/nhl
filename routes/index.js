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
    var teams = await models.Team.findAll({
        order: Sequelize.col('original_id')
    });
    teams = teams.reverse();
    var series = await models.Series.findAll({
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
        series: series,
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
});

router.get('/payment', async function(req, res, next) {
    var brackets = await models.Bracket.findAll({
       order: Sequelize.col('name')
    });
    res.render('payment', {
        title: 'NHL 2018',
        brackets: brackets
    });
});

router.post('/update', async function(req, res, next) {
    var change = req.body.change;
    var id = req.body.id;
    var type = req.body.type;
    var value = req.body.value;

    if (change === "paid" && type === "user") {
        var user = await models.Bracket.update({
            paid: value === "true"
        }, {
            where: {
                id: parseInt(id)
            }
        });
    } else if (type === "series") {

        var model = await models.Series.findAll({
            where: {
                id: parseInt(id)
            }
        });
        if (change === 1) {
            await model.update({
                game1: value
            });
        }
    }
    res.send(true);

});

router.get('/series', async function(req, res, next) {
    var brackets = await models.Bracket.findAll({
        order: Sequelize.col('name')
    });
    var series = await models.Series.findAll({
        order: Sequelize.col('id')
    });
    res.render('series', {
        title: 'NHL 2018',
        brackets: brackets,
        series: series
    });
});


module.exports = router;
