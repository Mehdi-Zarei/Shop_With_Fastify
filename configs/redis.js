const { default: Redis } = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URI);

redisClient.on("connect", () => {
  console.log("✅ Connect To Redis Successfully.");
});

redisClient.on("error", (error) => {
  console.error("❌ Redis connection error:", error);
  redisClient.quit();
});

module.exports = redisClient;
