const { redisClient: redis } = require("../configs/redis");

const saveRefreshToken = async (key, value) => {
  return redis.set(
    `refreshToken:${key}`,
    value,
    "EX",
    process.env.REFRESH_TOKEN_EXPIRE_TIME_IN_REDIS
  );
};

module.exports = { saveRefreshToken };
