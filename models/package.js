"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class _package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      _package.hasMany(models.booking, { foreignKey: "package_id", onDelete: "SET NULL" });

      _package.belongsToMany(models.car, {
        through: models.car_package,
        foreignKey: "package_id",
        onDelete: "CASCADE",
      });
    }
  }
  _package.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      details: {
        allowNull: false,
        type: DataTypes.TEXT("long"),
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
      modelName: "package",
      paranoid: true,
    }
  );
  return _package;
};
