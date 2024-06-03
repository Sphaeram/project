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
      railway_station.hasMany(models.fare, {
        as: "railway_pickup",
        foreignKey: "pickup_point",
        onDelete: "SET NULL",
      });
      railway_station.hasMany(models.fare, {
        as: "railway_drop",
        foreignKey: "drop_point",
        onDelete: "SET NULL",
      });

      railway_station.belongsTo(models.car, { foreignKey: "car_id", onDelete: "SET NULL" });
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
