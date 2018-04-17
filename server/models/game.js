'use strict';
module.exports = (sequelize, DataTypes) => {
  var Game = sequelize.define('Game', {
      next_game_id: {
          type: DataTypes.INTEGER
      },
      team1_id: {
          type: DataTypes.STRING,
          references: {
              model: 'Teams',
              key: 'id'
          }
      },
      team2_id: {
          type: DataTypes.STRING,
          references: {
              model: 'Teams',
              key: 'id'
          }
      },
      winner: {
          type: DataTypes.STRING,
          references: {
              model: 'Teams',
              key: 'id'
          }
      },
      num_games: {
          type: DataTypes.INTEGER
      },
      num_goals: {
          type: DataTypes.INTEGER
      },
      round: {
          type: DataTypes.INTEGER
      }
  }, {});
  Game.associate = function(models) {
  };
  return Game;
};