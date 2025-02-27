const { sequelize } = require("../configs/db");

const User = require("./User");
const Category = require("./Category");
const SubCategory = require("./SubCategory");
const Product = require("./Product");

Product.belongsToMany(SubCategory, {
  through: "Product_Categories",
  timestamps: false,
  onDelete: "CASCADE",
});

SubCategory.belongsToMany(Product, {
  through: "Product_Categories",
  timestamps: false,
  onDelete: "CASCADE",
});

SubCategory.belongsTo(Category, {
  foreignKey: "categoryID",
  onDelete: "CASCADE",
});

Category.hasMany(SubCategory, {
  foreignKey: "categoryID",
  onDelete: "CASCADE",
});

const syncDB = async () => {
  try {
    await sequelize.sync();
    console.log("✅ Database synced successfully.");
  } catch (err) {
    await sequelize.close();
    console.error("❌ Error syncing database:", err);
  }
};

module.exports = {
  sequelize,
  syncDB,
  User,
  Category,
  SubCategory,
  Product,
};
