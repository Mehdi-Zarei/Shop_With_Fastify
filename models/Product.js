const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

const product = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subCategory: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    filterValues: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { freezeTableName: true }
);

module.exports = product;
