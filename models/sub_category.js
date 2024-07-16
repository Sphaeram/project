"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sub_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      sub_category.belongsTo(models.category, { foreignKey: "category_id", onDelete: "SET NULL" });
    }
  }
  sub_category.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      category_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      ziyarat_points: {
        allowNull: false,
        type: DataTypes.TEXT("long"),
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
      modelName: "sub_category",
      paranoid: true,
    }
  );
  return sub_category;
};
