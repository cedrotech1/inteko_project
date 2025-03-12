"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Penalties extends Model {
    static associate(models) {
      Penalties.belongsTo(models.Users, { foreignKey: "userID", as: "user" });
      Penalties.belongsTo(models.Posts, { foreignKey: "postID", as: "post" });
    }
  }
  Penalties.init(
    {
      userID: { type: DataTypes.INTEGER, allowNull: false },
      postID: { type: DataTypes.INTEGER, allowNull: false },
      penarity: { type: DataTypes.STRING, allowNull: false },
      status:{type: DataTypes.STRING, allowNull: false}
     
    },
    {
      sequelize,
      modelName: "Penalties",
    }
  );
  return Penalties;
};
