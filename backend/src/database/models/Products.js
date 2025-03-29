"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Products.init(
    {
      // define attributes here
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      
     
    },
    {
      sequelize,
      modelName: "Products",
    }
  );

  return Products;
};
