const { sequelize } = require("../configs/db");

const userModel = require("./User");
const categoryModel = require("./Category");
const productModel = require("./Product");
const subCategoryModel = require("./SubCategory");

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully.");
  } catch (err) {
    await sequelize.close();
    console.error("❌ Error syncing database:", err);
  }
};

module.exports = {
  sequelize,
  syncDB,
  userModel,
  categoryModel,
  productModel,
  subCategoryModel,
};
