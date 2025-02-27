const fastify = require("fastify")();

//* Import Files

const {
  NotFoundErrorHandler,
  GlobalErrorHandler,
} = require("../helpers/ErrorHandlers");

//* Packages

//* Hooks
fastify.addHook("onRoute", (routeOptions) => {
  routeOptions.url = "/api/v1" + routeOptions.url;
});

//* Import Routes
const productRoutes = require("./product/V1/product.routes");

//* Register Routes
fastify.register(productRoutes, { prefix: "/products" });

//* 404  & General Error Handler
fastify.register(NotFoundErrorHandler);
fastify.register(GlobalErrorHandler);

module.exports = fastify;
