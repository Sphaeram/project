"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      booking.hasMany(models.coupon_collected, { foreignKey: "booking_id", onDelete: "SET NULL" });
      booking.belongsTo(models.user, { foreignKey: "user_id", onUpdate: "CASCADE" });
      booking.belongsTo(models.car, {
        foreignKey: "car_id",
        onDelete: "SET NULL",
      });
    }
  }
  booking.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      booking_id: {
        unique: true,
        type: DataTypes.STRING,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          model: "users",
          key: "id",
        },
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
      booking_type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      booking_type_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
      },
      pickup_point: {
        type: DataTypes.STRING,
      },
      drop_point: {
        type: DataTypes.STRING,
      },
      sub_total: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      coupon: {
        type: DataTypes.STRING,
      },
      discount: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.DOUBLE,
      },
      total_price: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      status: {
        allowNull: false,
        defaultValue: "pending approval",
        type: DataTypes.ENUM("pending approval", "confirmed", "on route", "compelete"),
      },
      booking_date: {
        allowNull: false,
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
      modelName: "booking",
      paranoid: true,
    }
  );
  return booking;
};
