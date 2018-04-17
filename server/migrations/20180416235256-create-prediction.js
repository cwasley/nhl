'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Predictions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      winner_id: {
        type: Sequelize.STRING,
          references: {
              model: 'Teams',
              key: 'id'
          }
      },
      loser_id: {
          type: Sequelize.STRING,
          references: {
              model: 'Teams',
              key: 'id'
          }
      },
      num_games: {
        type: Sequelize.INTEGER
      },
      num_goals: {
        type: Sequelize.INTEGER
      },
      game_id: {
        type: Sequelize.INTEGER,
          references: {
              model: 'Games',
              key: 'id'
          }
      },
      bracket_id: {
        type: Sequelize.INTEGER,
          references: {
              model: 'Brackets',
              key: 'id'
          }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Predictions');
  }
};