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
      booking.belongsTo(models.user, {
        foreignKey: "user_id",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
      booking.belongsTo(models.coupon, {
        foreignKey: "coupon_id",
        onDelete: "SET NULL",
      });
      booking.belongsTo(models.car, {
        foreignKey: "car_id",
        onDelete: "SET NULL",
      });
      booking.belongsTo(models.package, {
        foreignKey: "package_id",
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
      user_id: {
        type: DataTypes.BIGINT,
      },
      coupon_id: {
        type: DataTypes.BIGINT,
      },
      car_id: {
        type: DataTypes.BIGINT,
      },
      package_id: {
        type: DataTypes.BIGINT,
      },
      pickup_point: {
        type: DataTypes.STRING,
      },
      pickup_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      destination_point: {
        type: DataTypes.STRING,
      },
      destination_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      sub_total: {
        allowNull: false,
        type: DataTypes.DOUBLE,
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
      payment_method: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      payment_status: {
        allowNull: false,
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
      modelName: "booking",
      paranoid: true,
    }
  );
  return booking;
};
