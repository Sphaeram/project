"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class coupon_collected extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      coupon_collected.belongsTo(models.coupon, { foreignKey: "coupon_id", onDelete: "SET NULL" });
      coupon_collected.belongsTo(models.booking, {
        foreignKey: "booking_id",
        onDelete: "SET NULL",
      });
      coupon_collected.belongsTo(models.user, { foreignKey: "user_id", onDelete: "SET NULL" });
    }
  }
  coupon_collected.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      coupon_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "coupons",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      booking_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "bookings",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      user_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
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
      modelName: "coupon_collected",
    }
  );
  return coupon_collected;
};
