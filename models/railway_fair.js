"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class railway_fair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      railway_fair.belongsTo(models.car, { foreignKey: "car_id", onDelete: "SET NULL" });
      railway_fair.belongsTo(models.railway_station, {
        foreignKey: "pickup_point",
        onDelete: "SET NULL",
      });
      railway_fair.belongsTo(models.railway_station, {
        foreignKey: "drop_point",
        onDelete: "SET NULL",
      });
    }
  }
  railway_fair.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      pickup_point: {
        type: Sequelize.BIGINT,
        references: {
          model: "railway_stations",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      drop_point: {
        type: Sequelize.BIGINT,
        references: {
          model: "railway_stations",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      car_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "cars",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      fair: {
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
      modelName: "railway_fair",
      paranoid: true,
    }
  );
  return railway_fair;
};
