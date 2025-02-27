require("dotenv").config();
const app = require("./app");
const port = process.env.PORT;
const db = require("../configs/db");
const Redis = require("../configs/redis");

const startServer = async () => {
  try {
    app.listen({ port });
    console.log(`🚀 Server is up and running at: http://localhost:${port}`);
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer();
