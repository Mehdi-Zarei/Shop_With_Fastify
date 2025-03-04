const userModel = require("../../../models/User");
const { Op } = require("sequelize");
const uuid = require("uuid").v4;

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
  saveResetPasswordToken,
  getResetPasswordToken,
  removeResetPasswordToken,
} = require("../../../utils/redis");

const { sendVerificationEmail } = require("../../../utils/nodemailer");

const emailMessages = require("../../../utils/emailTemplates");

//* Validator Schema
const {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} = require("./auth.validator");

exports.register = async (request, reply) => {
  const { name, phone, email, password } = request.body;

  const { error } = registerSchema.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    return reply
      .status(400)
      .send({ errors: error.details.map((err) => err.message) });
  }

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

  const { error } = loginSchema.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    return reply
      .status(400)
      .send({ errors: error.details.map((err) => err.message) });
  }

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

exports.forgetPassword = async (request, reply) => {
  const { email } = request.body;

  const { error } = forgetPasswordSchema.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    return reply.status(400).send({ errors: error.message });
  }

  const isUserExist = await userModel.findOne({ where: { email }, raw: true });

  if (!isUserExist) {
    return errorResponse(
      reply,
      404,
      "User Not Found With This Email Address !!"
    );
  }

  if (isUserExist.isRestrict) {
    return errorResponse(reply, 403, "This User Already Banned !!");
  }

  const resetPasswordToken = uuid();

  const emailData = emailMessages.resetPassword(
    isUserExist.name,
    resetPasswordToken
  );

  const sentEmail = await sendVerificationEmail(
    isUserExist,
    emailData.subject,
    emailData.text
  );

  if (sentEmail) {
    await saveResetPasswordToken(resetPasswordToken, email);
    return successResponse(
      reply,
      200,
      "Reset Password Link has been sent successfully."
    );
  } else {
    return errorResponse(
      reply,
      500,
      "Failed to send Reset Password email. Please try again later."
    );
  }
};

exports.resetPassword = async (request, reply) => {
  const { password } = request.body;

  const { token } = request.params;

  const { error } = resetPasswordSchema.validate(
    { password, token },
    {
      abortEarly: false,
    }
  );

  if (error) {
    return reply
      .status(400)
      .send({ errors: error.details.map((err) => err.message) });
  }

  const storedToken = await getResetPasswordToken(token);
  if (!storedToken) {
    return errorResponse(reply, 404, "Invalid or expired reset token.");
  }

  const encryptPassword = await hashPassword(password, 12);

  const updatedUsers = await userModel.update(
    { password: encryptPassword },
    { where: { email: storedToken } }
  );

  if (updatedUsers === 0) {
    return errorResponse(reply, 404, "User Not Found !!");
  }

  await removeResetPasswordToken(token);

  return successResponse(reply, 200, "Your Password Updated Successfully.");
};

exports.logout = async (request, reply) => {
  const user = request.user;

  await removeRefreshToken(user.id);

  return successResponse(reply, 200, "User logged out successfully.");
};
