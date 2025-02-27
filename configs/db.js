const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  username: "root",
  password: "",
  database: "shop_with_fastify",
  dialect: "mysql",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Database Successfully.");
  } catch (error) {
    await sequelize.close();
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
