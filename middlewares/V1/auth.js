const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { errorResponse } = require("../../helpers/responseMessage");
const { getRefreshToken } = require("../../utils/redis");
const { compareRefreshToken } = require("../../utils/auth.utils");

async function authGourd(request, reply) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    reply.send({ error: "Token not provided" });
    return;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    reply.send({ error: "Invalid token format" });
    return;
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

  const user = await User.findOne({
    where: { id: decoded.id },
    attributes: {
      exclude: ["password", "role", "isRestrict"],
    },
  });
  if (!user) {
    reply.status(404).send({ error: "User not found" });
    return;
  }

  request.user = user;
}

async function verifyRefreshToken(request, reply) {
  const getTokenFromCookies = request.cookies.refreshToken;
  if (!getTokenFromCookies) {
    return errorResponse(reply, 403, "Refresh token not provided");
  }

  const decodedToken = jwt.verify(
    getTokenFromCookies,
    process.env.REFRESH_TOKEN_SECRET_KEY
  );

  if (!decodedToken) {
    return errorResponse(reply, 403, "Token Not Valid !!");
  }

  const user = await User.findOne({
    where: { id: decodedToken.id },
  });

  if (!user) {
    return errorResponse(reply, 403, "User not found !!");
  }

  const storedTokenInRedis = await getRefreshToken(user.id);
  if (!storedTokenInRedis) {
    return errorResponse(reply, 403, "Refresh token not found in Redis");
  }

  const isValidToken = await compareRefreshToken(
    getTokenFromCookies,
    storedTokenInRedis
  );
  if (!isValidToken) {
    return errorResponse(reply, 403, "Invalid refresh token");
  }

  request.user = user;
}

module.exports = { authGourd, verifyRefreshToken };
