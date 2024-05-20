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
      status: {
        allowNull: false,
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
