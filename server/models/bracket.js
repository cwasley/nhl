'use strict';
module.exports = (sequelize, DataTypes) => {
  var Bracket = sequelize.define('Bracket', {
    predictions: DataTypes.JSONB,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    paid: DataTypes.BOOLEAN,
    points: DataTypes.INTEGER
  }, {});
  Bracket.associate = function(models) {
    // associations can be defined here
  };
  return Bracket;
};