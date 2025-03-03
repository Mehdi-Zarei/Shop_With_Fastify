const userModel = require("../../../models/User");

const { Op } = require("sequelize");

//* Response Messages
const {
  successResponse,
  errorResponse,
} = require("../../../helpers/responseMessage");

//* Helper Functions
const {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyPassword,
} = require("../../../utils/auth.utils");

const {
  saveRefreshToken,
  removeRefreshToken,
} = require("../../../utils/redis");

exports.register = async (request, reply) => {
  const { name, phone, email, password } = request.body;

  const isUserExist = await userModel.findOne({
    where: {
      [Op.or]: [{ phone: phone }, { email: email }, { isRestrict: true }],
    },
  });

  if (isUserExist) {
    if (isUserExist.phone === phone) {
      return errorResponse(reply, 409, "This Phone Number Already Exist !!");
    }
    if (isUserExist.email === email) {
      return errorResponse(reply, 409, "This Email Address Already Exist !!");
    }
    if (isUserExist.isRestrict) {
      return errorResponse(reply, 409, "This User Is Banned !!");
    }
  }

  const encryptedPassword = await hashPassword(password, 12);

  const isFirstUser = (await userModel.count()) === 0;

  const newUser = await userModel.create({
    name,
    phone,
    email,
    password: encryptedPassword,
    role: isFirstUser ? "ADMIN" : "USER",
    isRestrict: false,
  });

  const accessToken = await generateAccessToken(newUser.id, newUser.role);

  const refreshToken = await generateRefreshToken(newUser.id);

  const encryptedRefreshToken = await hashRefreshToken(refreshToken, 12);

  await saveRefreshToken(newUser.id, encryptedRefreshToken);

  return successResponse(reply, 201, "New User Created Successfully.", {
    accessToken,
    refreshToken,
  });
};

exports.login = async (request, reply) => {
  const { identifier, password } = request.body;

  const isUserExist = await userModel.findOne({
    where: {
      [Op.or]: [{ phone: identifier }, { email: identifier }],
    },
  });

  if (!isUserExist) {
    return errorResponse(reply, 404, "User Not Found With This Information !!");
  }

  if (isUserExist.isRestrict) {
    return errorResponse(reply, 403, "This user already banned !!");
  }

  const comparePassword = await verifyPassword(password, isUserExist.password);

  if (!comparePassword) {
    return errorResponse(reply, 403, "Email/Phone Or Password Not Valid !!");
  }

  const accessToken = await generateAccessToken(
    isUserExist.id,
    isUserExist.role
  );

  const refreshToken = await generateRefreshToken(isUserExist.id);

  const encryptedRefreshToken = await hashRefreshToken(refreshToken, 12);

  await saveRefreshToken(isUserExist.id, encryptedRefreshToken);

  return successResponse(reply, 200, "You are logged successfully.", {
    accessToken,
    refreshToken,
  });
};

exports.getMe = async (request, reply) => {
  const user = request.user;

  return successResponse(reply, 200, "OK", user);
};

exports.refreshToken = async (request, reply) => {
  const user = request.user;

  const accessToken = await generateAccessToken(user.id, user.role);

  return successResponse(reply, 200, "OK", accessToken);
};

exports.forgetPassword = async (request, reply) => {};

exports.resetPassword = async (request, reply) => {};

exports.logout = async (request, reply) => {
  const user = request.user;

  await removeRefreshToken(user.id);

  return successResponse(reply, 200, "User logged out successfully.");
};
