"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class fixed_price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      fixed_price.belongsTo(models.car, { foreignKey: "car_id", onDelete: "SET NULL" });

      fixed_price.belongsTo(models.airport, {
        foreignKey: "source_id",
        as: "airport_source",
        onDelete: "SET NULL",
      });
      fixed_price.belongsTo(models.railway_station, {
        foreignKey: "source_id",
        as: "railway_station_source",
        onDelete: "SET NULL",
      });
      fixed_price.belongsTo(models.hotel, {
        foreignKey: "source_id",
        as: "hotel_source",
        onDelete: "SET NULL",
      });

      fixed_price.belongsTo(models.airport, {
        foreignKey: "destination_id",
        as: "airport_destination",
        onDelete: "SET NULL",
      });
      fixed_price.belongsTo(models.railway_station, {
        foreignKey: "destination_id",
        as: "railway_station_destination",
        onDelete: "SET NULL",
      });
      fixed_price.belongsTo(models.hotel, {
        foreignKey: "destination_id",
        as: "hotel_destination",
        onDelete: "SET NULL",
      });
    }
  }
  fixed_price.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      source_id: {
        type: DataTypes.BIGINT,
      },
      destination_id: {
        type: DataTypes.BIGINT,
      },
      car_id: {
        type: DataTypes.BIGINT,
      },
      custom_source: {
        type: DataTypes.STRING,
      },
      custom_destination: {
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.DOUBLE,
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
      modelName: "fixed_price",
      paranoid: true,
    }
  );
  return fixed_price;
};
