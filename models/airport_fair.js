"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class airport_fair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      airport_fair.belongsTo(models.car, { foreignKey: "car_id", onDelete: "SET NULL" });
      airport_fair.belongsTo(models.airport, { foreignKey: "pickup_point", onDelete: "SET NULL" });
      airport_fair.belongsTo(models.airport, { foreignKey: "drop_point", onDelete: "SET NULL" });
    }
  }
  airport_fair.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
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
      fair: {
        type: DataTypes.DOUBLE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "airport_fair",
      paranoid: true,
    }
  );
  return airport_fair;
};
