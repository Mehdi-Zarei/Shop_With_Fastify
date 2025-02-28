const fastify = require("fastify")();
fastify.register(require("@fastify/multipart"));

//* Import Files

//* Packages

//* Hooks
fastify.addHook("onRoute", (routeOptions) => {
  routeOptions.url = "/api/v1" + routeOptions.url;
});

//* Import Routes
const authRoutes = require("./auth/V1/auth.routes");

//* Register Routes

fastify.register(authRoutes);

//* 404 Error Handler
fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: "Not Found",
    message: `The requested URL ${request.raw.url} was not found on the server.`,
  });
});

//* General Error Handler
fastify.setErrorHandler((error, request, reply) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    error: error.name,
    message: error || "Internal Server Error",
  });
});

module.exports = fastify;
