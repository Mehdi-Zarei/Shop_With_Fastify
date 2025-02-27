const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  username: "root",
  password: "",
  database: "shop_with_fastify",
  dialect: "mysql",
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅Connect To Database Successfully.");
  } catch (error) {
    await sequelize.close();
    console.error("❌Unable to connect to the database:", error);
  }
})();

(async () => {
  try {
    await sequelize.sync();
    console.log("✅Database synced successfully.");
  } catch (err) {
    console.error("❌Error syncing database:", err);
  }
})();

module.exports = sequelize;
