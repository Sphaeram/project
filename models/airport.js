"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      airport.hasMany(models.airport_fair, { foreignKey: "pickup_point", onDelete: "SET NULL" });
      airport.hasMany(models.airport_fair, { foreignKey: "drop_point", onDelete: "SET NULL" });

      airport.belongsTo(models.car, { foreignKey: "car_id", onDelete: "SET NULL" });
    }
  }
  airport.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      car_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "cars",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT("long"),
      },
      location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "airport",
      paranoid: true,
    }
  );
  return airport;
};
