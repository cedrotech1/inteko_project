"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendances extends Model {
    static associate(models) {
      Attendances.belongsTo(models.Users, { foreignKey: "userID", as: "user" });
      Attendances.belongsTo(models.Posts, { foreignKey: "postID", as: "post" });
    }
  }
  Attendances.init(
    {
      userID: { type: DataTypes.INTEGER, allowNull: false },
      postID: { type: DataTypes.INTEGER, allowNull: false },
      attended: { type: DataTypes.BOOLEAN, defaultValue: false },
      
    },
    {
      sequelize,
      modelName: "Attendances",
    }
  );
  return Attendances;
};
