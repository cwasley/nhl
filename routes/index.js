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
    brackets = await calculateObtainablePoints(brackets);
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
        order: Sequelize.col('name')
    });
    brackets = await calculateObtainablePoints(brackets);
    res.render('standings', {
        title: 'NHL 2018',
        brackets: brackets,
        standings: true
    });
});

router.get('/payments', async function(req, res, next) {
    var brackets = await models.Bracket.findAll({
       order: Sequelize.col('name')
    });
    res.render('payment', {
        title: 'NHL 2018',
        brackets: brackets,
        standings: false
    });
});

router.post('/update', async function(req, res, next) {
    var change = req.body.change;
    var id = req.body.id;
    var type = req.body.type;
    var value = req.body.value;

    if (value == "") {
        value = null;
    }
    if (change === "paid" && type === "user") {
        var user = await models.Bracket.update({
            paid: value === "true"
        }, {
            where: {
                id: parseInt(id)
            }
        });
    } else if (type === "series") {

        // TODO is this possible to make dynamic?
        if (change === "1") {
            await models.Series.update({
                game1: value
            },
            {
                where: {
                    id: parseInt(id)
            }});
        }
        if (change === "2") {
            await models.Series.update({
                    game2: value
                },
                {
                    where: {
                        id: parseInt(id)
                    }});
        }
        if (change === "3") {
            await models.Series.update({
                    game3: value
                },
                {
                    where: {
                        id: parseInt(id)
                    }});
        }
        if (change === "4") {
            await models.Series.update({
                    game4: value
                },
                {
                    where: {
                        id: parseInt(id)
                    }});
        }
        if (change === "5") {
            await models.Series.update({
                    game5: value
                },
                {
                    where: {
                        id: parseInt(id)
                    }});
        }
        if (change === "6") {
            await models.Series.update({
                    game6: value
                },
                {
                    where: {
                        id: parseInt(id)
                    }});
        }
        if (change === "7") {
            await models.Series.update({
                    game7: value
                },
                {
                    where: {
                        id: parseInt(id)
                    }});
        }
    }
    res.send(true);

});

router.post('/updateSeries', async function(req, res, next) {
    var winner = req.body.winner;
    var num_games = parseInt(req.body.num_games);
    var series_id = parseInt(req.body.series_id);
    var teamKey = req.body.teamKey;
    var toEnable = req.body.toEnable === "true";
    var updating = req.body.updating === "true";
    var currSeries = await models.Series.findAll({
        where: {
            id: series_id
        }
    });
    var round = currSeries[0].dataValues.round;

    // Update series that is either being closed out or reopened
    currSeries[0].winner = updating ? winner : null;
    currSeries[0].num_games = updating ? num_games : null;
    currSeries[0].enabled = !updating;
    await currSeries[0].save();

    // Update next series
    if (updating) {
        currSeries = await models.Series.findAll({
            where: {
                id: currSeries[0].dataValues.next_series_id
            }
        });
        currSeries[0][teamKey] = updating ? winner : null;
        currSeries[0].enabled = toEnable;
        await currSeries[0].save();
    } else {
        while(currSeries[0].dataValues.next_series_id) {
            currSeries = await models.Series.findAll({
                where: {
                    id: currSeries[0].dataValues.next_series_id
                }
            });
            if (currSeries[0].dataValues.team1_id === winner) {
                currSeries[0].team1_id = null;
            } else if (currSeries[0].dataValues.team2_id === winner) {
                currSeries[0].team2_id = null;
            }
            currSeries[0].enabled = false;
            currSeries[0].game1 = null;
            currSeries[0].game2 = null;
            currSeries[0].game3 = null;
            currSeries[0].game4 = null;
            currSeries[0].game5 = null;
            currSeries[0].game6 = null;
            currSeries[0].game7 = null;
            currSeries[0].winner = null;
            currSeries[0].num_games = null;
            currSeries[0].num_goals = null;
            await currSeries[0].save();


        }
    }

    // For resetting a series, we need to go through and reset every game that's been played with that team
    // while(currSeries[0].dataValues.next_series_id && updating === false) {
    //
    // }

    // If we enabled a new series, that means an old one closed out. Let's update the points for each player
    var brackets = await models.Bracket.findAll();
    for (var i = 0; i < brackets.length; i++) {
        var bracket = brackets[i];
        var startingPoints = bracket.dataValues.points;
        var pointDiff = 0;
        var bracketPredictions = await models.Prediction.findAll({
            where: {
                bracket_id: bracket.dataValues.id,
                series_id: series_id
            }
        });
        if (bracketPredictions[0].dataValues.winner_id === winner) {

            // Bracket won! Give points consistent with round #
            switch(round) {
                case 1:
                    pointDiff += 5;
                    break;
                case 2:
                    pointDiff += 7;
                    break;
                case 3:
                    pointDiff += 10;
                    break;
                case 4:
                    pointDiff += 15;
                    break;
            }
            switch(Math.abs(bracketPredictions[0].dataValues.num_games - num_games)) {
                case 0:
                    pointDiff += 3;
                    break;
                case 1:
                    pointDiff += 2;
                    break;
                case 2:
                    pointDiff += 1;
                    break;
                case 3:
                    pointDiff += 0;
                    break;
            }

            await models.Bracket.update({
                    points: updating ? (startingPoints + pointDiff) : (startingPoints - pointDiff)
                },
                {
                    where: {
                        id: bracket.dataValues.id
                    }
                })
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
    var teams = await models.Team.findAll();
    res.render('series', {
        title: 'NHL 2018',
        brackets: brackets,
        series: series,
        teams: teams
    });
});

async function calculateObtainablePoints(bracketArray) {
    var series = await models.Series.findAll();

    // Find each team that lost and add to array; if brackets have predictions that include these teams they will lose the points.
    var loserArray = [];
    for (var i = 0; i < series.length; i++) {
        var seriesInstance = series[i];
        if (seriesInstance.dataValues.winner) {
            if (seriesInstance.dataValues.winner === seriesInstance.dataValues.team1_id) {
                loserArray.push(seriesInstance.dataValues.team2_id);
            } else if (seriesInstance.dataValues.winner === seriesInstance.dataValues.team2_id) {
                loserArray.push(seriesInstance.dataValues.team1_id);
            }
        }
    }

    // Now we can loop through again and for every game that is not already counted, if both teams are not in the loser array they have potential points to win
    for (var i = 0; i < bracketArray.length; i++) {
        var bracket = bracketArray[i];
        var potentialPoints = 0;

        for (var j = 0; j < series.length; j++) {
            var seriesInstance = series[j];
            // We want to skip any series that are already counted in points
            if (seriesInstance.dataValues.winner) {
                continue;
            }

            var bracketPredictions = await models.Prediction.findAll({
                where: {
                    bracket_id: bracket.dataValues.id,
                    series_id: seriesInstance.dataValues.id
                }
            });
            var valid = true;
            for (var k = 0; k < loserArray.length; k++) {
                if (bracketPredictions[0].dataValues.winner_id === loserArray[k]) {
                    valid = false;
                }
            }

            if (valid) {
                switch (seriesInstance.dataValues.round) {
                    case 1:
                        potentialPoints += 8;
                        break;
                    case 2:
                        potentialPoints += 10;
                        break;
                    case 3:
                        potentialPoints += 13;
                        break;
                    case 4:
                        potentialPoints += 18;
                        break;
                }
            }
        }
        bracket.dataValues.potentialPoints = potentialPoints;
    }

    return bracketArray;
}


module.exports = router;
