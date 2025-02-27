require("dotenv").config();
const fastify = require("./app");
const port = process.env.PORT;
const { connectDB } = require("../configs/db");
const { syncDB } = require("../models/index");
const { connectRedis } = require("../configs/redis");

const startServer = async () => {
  try {
    await connectDB();
    await syncDB();
    await connectRedis();

    fastify.listen({ port });
    console.log(`🚀 Server is up and running at: http://localhost:${port}`);
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer();
