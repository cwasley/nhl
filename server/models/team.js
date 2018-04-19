'use strict';
module.exports = (sequelize, DataTypes) => {
  var Team = sequelize.define('Team', {
    mascot: DataTypes.STRING,
    color: DataTypes.STRING,
    pts: DataTypes.INTEGER,
    row: DataTypes.INTEGER,
    division: DataTypes.STRING,
    conference: DataTypes.STRING,
    seed: DataTypes.STRING,
    original_id: DataTypes.INTEGER
  },{});
  Team.associate = function(models) {
    // associations can be defined here
  };
  return Team;
};