const fp = require("fastify-plugin");

//* Controller
const {
  register,
  login,
  getMe,
  refreshToken,
  forgetPassword,
  resetPassword,
  logout,
} = require("./auth.controller");

//* Middlewares
const {
  authGourd,
  verifyRefreshToken,
} = require("../../../middlewares/V1/auth");

module.exports = fp(async function (fastify, options) {
  fastify.post("/auth/register", register);

  fastify.post("/auth/login", login);

  fastify.get("/auth/me", { preHandler: authGourd }, getMe);

  fastify.get(
    "/auth/refresh",
    { preHandler: verifyRefreshToken },
    refreshToken
  );

  fastify.post("/auth/forget-password", forgetPassword);

  fastify.post("/auth/reset-password/:token", resetPassword);

  fastify.post("/auth/logout", { preHandler: authGourd }, logout);
});
