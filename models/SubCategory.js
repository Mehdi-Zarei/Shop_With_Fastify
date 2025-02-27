const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

const category = sequelize.define(
  "category",
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
    parent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = category;
