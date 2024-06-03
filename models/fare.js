"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class fare extends Model {
    static associate(models) {
      fare.belongsTo(models.airport, {
        as: "airport_pickup",
        foreignKey: "pickup_point",
        constraints: false,
      });
      fare.belongsTo(models.hotel, {
        as: "hotel_pickup",
        foreignKey: "pickup_point",
        constraints: false,
      });
      fare.belongsTo(models.railway_station, {
        as: "railway_pickup",
        foreignKey: "pickup_point",
        constraints: false,
      });

      fare.belongsTo(models.airport, {
        as: "airport_drop",
        foreignKey: "drop_point",
        constraints: false,
      });
      fare.belongsTo(models.railway_station, {
        as: "railway_drop",
        foreignKey: "drop_point",
        constraints: false,
      });
      fare.belongsTo(models.hotel, {
        as: "hotel_drop",
        foreignKey: "drop_point",
        constraints: false,
      });

      fare.belongsTo(models.car, { foreignKey: "car_id", onDelete: "SET NULL" });
    }
  }
  fare.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      location_type: {
        allowNull: false,
        type: DataTypes.ENUM("airport", "railway", "hotel"),
      },
      pickup_point: {
        type: DataTypes.BIGINT,
        references: {
          model: "airports",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      drop_point: {
        type: DataTypes.BIGINT,
        references: {
          model: "airports",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
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
      fare: {
        type: DataTypes.DOUBLE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "fare",
      paranoid: true,
    }
  );
  return fare;
};
