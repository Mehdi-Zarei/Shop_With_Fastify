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

module.exports = fp(function (fastify, options, done) {
  fastify.post("/auth/register", register);
  fastify.post("/auth/login", login);
  fastify.get("/auth/me", getMe);
  fastify.post("/auth/refresh", refreshToken);
  fastify.post("/auth/forget-password", forgetPassword);
  fastify.post("/auth/reset-password/:token", resetPassword);
  fastify.post("/auth/logout", logout);

  done();
});
