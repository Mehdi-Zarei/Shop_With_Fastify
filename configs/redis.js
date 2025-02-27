const { default: Redis } = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URI);

const connectRedis = async () => {
  try {
    await redisClient.ping();
    console.log("✅ Connected to Redis Successfully.");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
    redisClient.quit();
    process.exit(1);
  }
};

redisClient.on("error", (error) => {
  console.error("❌ Redis error:", error);
  redisClient.quit();
});

module.exports = { redisClient, connectRedis };
