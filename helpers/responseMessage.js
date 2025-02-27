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

const handleError = (reply, error, statusCode = 500) => {
  reply.status(statusCode).send({
    success: false,
    message: error.message || "Internal Server Error",
    error: error.message,
  });
  console.log(error);
};

module.exports = { successResponse, errorResponse, handleError };
