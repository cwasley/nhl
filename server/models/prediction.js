'use strict';
module.exports = (sequelize, DataTypes) => {
  var Prediction = sequelize.define('Prediction', {
    winner_id: {
        type: DataTypes.STRING,
        references: {
            model: 'Teams',
            key: 'id'
        }
    },
    loser_id: {
        type: DataTypes.STRING,
        references: {
            model: 'Teams',
            key: 'id'
        }
    },
    num_games: DataTypes.INTEGER,
    num_goals: DataTypes.INTEGER,
    game_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Games',
            key: 'id'
        }
    },
    bracket_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Brackets',
            key: 'id'
        }
    }
  }, {});
  Prediction.associate = function(models) {
    // associations can be defined here
  };
  return Prediction;
};