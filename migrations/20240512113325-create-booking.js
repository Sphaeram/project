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
        type: Sequelize.BIGINT,
      },
      coupon_id: {
        type: Sequelize.BIGINT,
      },
      car_id: {
        type: Sequelize.BIGINT,
      },
      package_id: {
        type: Sequelize.BIGINT,
      },
      pickup_point: {
        type: Sequelize.STRING,
      },
      pickup_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      destination_point: {
        type: Sequelize.STRING,
      },
      destination_at: {
        allowNull: false,
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
        type: Sequelize.STRING,
      },
      payment_status: {
        allowNull: false,
        type: Sequelize.TINYINT,
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
