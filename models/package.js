"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      package.hasMany(models.booking, { foreignKey: "package_id", onDelete: "SET NULL" });

      package.belongsToMany(models.car, {
        through: models.car_package,
        foreignKey: "package_id",
        onDelete: "CASCADE",
      });
    }
  }
  package.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      details: {
        allowNull: false,
        type: Sequelize.TEXT("long"),
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE,
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
      modelName: "package",
      paranoid: true,
    }
  );
  return package;
};
