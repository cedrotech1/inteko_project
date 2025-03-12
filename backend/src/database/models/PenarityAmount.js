"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PenarityAmounts extends Model {
    static associate(models) {
    
    }
  }

  PenarityAmounts.init(
    {
      amount: DataTypes.INTEGER, // Province name
    },
    {
      sequelize,
      modelName: "PenarityAmounts", // Plural model name
    }
  );
  
  return PenarityAmounts;
};
