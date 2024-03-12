const { signup, verifyEmail, login } = require("../Controller/controller");

const investerRoutes = async (fastify, options) => {
  fastify.post("/signup", signup);
  fastify.get("/verify-email", verifyEmail);

  fastify.post("/login", login);
};

module.exports = investerRoutes;
