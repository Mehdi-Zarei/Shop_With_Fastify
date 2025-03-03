const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashPassword = async (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const hashRefreshToken = async (refreshToken, salt) => {
  return bcrypt.hashSync(refreshToken, salt);
};

const compareRefreshToken = async (refreshToken, hashedRefreshToken) => {
  return bcrypt.compareSync(refreshToken, hashedRefreshToken);
};

const generateAccessToken = async (userID, userRole) => {
  return jwt.sign(
    { id: userID, role: userRole },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    }
  );
};

const generateRefreshToken = async (userID) => {
  return jwt.sign({ id: userID }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
  });
};

module.exports = {
  hashPassword,
  verifyPassword,
  hashRefreshToken,
  compareRefreshToken,
  generateAccessToken,
  generateRefreshToken,
};
