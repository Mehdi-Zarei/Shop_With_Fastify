const successResponse = async (reply, statusCode = 200, message, data) => {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  });
};

const errorResponse = async (reply, statusCode = 400, message, data) => {
  return reply.status(statusCode).send({
    success: false,
    error: message,
    data,
  });
};

module.exports = { successResponse, errorResponse };
