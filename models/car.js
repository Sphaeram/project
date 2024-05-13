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
      car.hasMany(models.fixed_price, { foreignKey: "car_id", onDelete: "SET NULL" });
      car.hasMany(models.booking, { foreignKey: "car_id", onDelete: "SET NULL" });

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
        type: Sequelize.BIGINT,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      number_plate: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      seating_capacity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      luggage_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
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
