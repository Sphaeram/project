"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      car.hasMany(models.booking, { foreignKey: "car_id", onDelete: "SET NULL" });
      car.hasMany(models.airport_fare, { foreignKey: "car_id", onDelete: "SET NULL" });
      car.hasMany(models.railway_fare, { foreignKey: "car_id", onDelete: "SET NULL" });
      car.hasMany(models.category, { foreignKey: "car_id", onDelete: "SET NULL" });

      car.belongsToMany(models.package, {
        through: models.car_package,
        foreignKey: "car_id",
        onDelete: "CASCADE",
      });
    }
  }
  car.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      driver_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      model: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      number_plate: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      seating_capacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      luggage_capacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      booked: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.TINYINT,
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
      modelName: "car",
      paranoid: true,
    }
  );
  return car;
};
