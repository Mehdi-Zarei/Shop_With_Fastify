const { redisClient: redis } = require("../configs/redis");

const saveRefreshToken = async (key, value) => {
  return redis.set(
    `refreshToken:${key}`,
    value,
    "EX",
    process.env.REFRESH_TOKEN_EXPIRE_TIME_IN_REDIS
  );
};

const getRefreshToken = async (key) => {
  return redis.get(`refreshToken:${key}`);
};

const removeRefreshToken = async (key) => {
  return redis.del(`refreshToken:${key}`);
};

module.exports = { saveRefreshToken, getRefreshToken, removeRefreshToken };
