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

const saveResetPasswordToken = async (token, email) => {
  await redis
    .multi()
    .hset(`resetPassword:${token}`, "email", email)
    .expire(`resetPassword:${token}`, 3600)
    .exec();
};

const getResetPasswordToken = async (token) => {
  return await redis.hget(`resetPassword:${token}`, "email");
};

const removeResetPasswordToken = async (token) => {
  return await redis.del(`resetPassword:${token}`);
};

module.exports = {
  saveRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  saveResetPasswordToken,
  getResetPasswordToken,
  removeResetPasswordToken,
};
