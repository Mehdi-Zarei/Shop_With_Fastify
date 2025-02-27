async function NotFoundErrorHandler(fastify) {
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: "Not Found",
      message: `The requested URL ${request.raw.url} was not found on the server.`,
    });
  });
}

async function GlobalErrorHandler(fastify) {
  fastify.setErrorHandler((error, request, reply) => {
    console.error(error);
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      error: error.name,
      message: error.message || "Internal Server Error",
    });
  });
}

module.exports = { NotFoundErrorHandler, GlobalErrorHandler };
