"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
      },
      coupon_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "coupons",
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
      package_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "packages",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      fare_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "fares",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      fare_type: {
        type: Sequelize.STRING,
      },
      pickup_point: {
        type: Sequelize.STRING,
      },
      destination_point: {
        type: Sequelize.STRING,
      },
      pickup_time: {
        type: Sequelize.TIME,
      },
      pickup_date: {
        type: Sequelize.DATE,
      },
      sub_total: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      discount: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.DOUBLE,
      },
      total_price: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      payment_method: {
        allowNull: false,
        defaultValue: "Cash",
        type: Sequelize.STRING,
      },
      payment_status: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT,
      },
      status: {
        allowNull: false,
        defaultValue: "pending",
        type: Sequelize.ENUM("pending", "confirmed", "cancelled"),
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bookings");
  },
};
