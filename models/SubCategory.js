const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");
const Category = require("./Category");

const SubCategory = sequelize.define(
  "subCategory",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    categoryID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  { freezeTableName: true }
);

module.exports = SubCategory;
