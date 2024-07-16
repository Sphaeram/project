"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("coupons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      discount: {
        allowNull: false,
        type: Sequelize.DOUBLE,
      },
      status: {
        allowNull: false,
        defaultValue: "inactive",
        type: Sequelize.ENUM("active", "inactive"),
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
    await queryInterface.dropTable("coupons");
  },
};
