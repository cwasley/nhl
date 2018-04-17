'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      next_game_id: {
        type: Sequelize.INTEGER
      },
      team1_id: {
        type: Sequelize.STRING,
        references: {
          model: 'Teams',
          key: 'id'
        }
      },
      team2_id: {
        type: Sequelize.STRING,
          references: {
              model: 'Teams',
              key: 'id'
          }
      },
      winner: {
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
      round: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Games');
  }
};