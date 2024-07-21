"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      coupon.hasMany(models.coupon_collected, { foreignKey: "coupon_id", onDelete: "SET NULL" });
    }
  }
  coupon.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      code: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      discount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      valid_from: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      valid_to: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      status: {
        allowNull: false,
        defaultValue: "active",
        type: DataTypes.ENUM("active", "inactive"),
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
      modelName: "coupon",
    }
  );
  return coupon;
};
