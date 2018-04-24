'use strict';
module.exports = (sequelize, DataTypes) => {
  var Series = sequelize.define('Series', {
      next_series_id: {
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
      },
      game1: {
          type: DataTypes.STRING
      },
      game2: {
          type: DataTypes.STRING
      },
      game3: {
          type: DataTypes.STRING
      },
      game4: {
          type: DataTypes.STRING
      },
      game5: {
          type: DataTypes.STRING
      },
      game6: {
          type: DataTypes.STRING
      },
      game7: {
          type: DataTypes.STRING
      },
      enabled: {
          type: DataTypes.BOOLEAN
      },
      name: {
          type: DataTypes.STRING
      }
  }, {});
  Series.associate = function(models) {
  };
  return Series;
};