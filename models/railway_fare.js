"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class railway_fare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      railway_fare.belongsTo(models.car, { foreignKey: "car_id", onDelete: "SET NULL" });
    }
  }
  railway_fare.init(
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
      pickup_location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      drop_location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      fare: {
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
      modelName: "railway_fare",
      paranoid: true,
    }
  );
  return railway_fare;
};
