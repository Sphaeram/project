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
      booking_id: {
        unique: true,
        type: Sequelize.STRING,
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
      car_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "cars",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      booking_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      booking_type_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      pickup_point: {
        type: Sequelize.STRING,
      },
      drop_point: {
        type: Sequelize.STRING,
      },
      sub_total: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      coupon: {
        type: Sequelize.STRING,
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
      status: {
        allowNull: false,
        defaultValue: "pending approval",
        type: Sequelize.ENUM("pending approval", "confirmed", "on route", "compelete", "cancelled"),
      },
      booking_date: {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bookings");
  },
};
