"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class railway_station extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      railway_station.hasMany(models.fixed_price, {
        foreignKey: "source_id",
        as: "railway_station_source",
        onDelete: "SET NULL",
      });
      railway_station.hasMany(models.fixed_price, {
        foreignKey: "destination_id",
        as: "railway_station_destination",
        onDelete: "SET NULL",
      });
    }
  }
  railway_station.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
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
      deletedAt: {
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "railway_station",
      paranoid: true,
    }
  );
  return railway_station;
};
