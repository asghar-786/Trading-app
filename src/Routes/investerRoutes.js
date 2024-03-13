const {
  signup,
  verifyEmail,
  login,
  googleLogin,
  googleLoginCallBack,
} = require("../Controller/controller");

const investerRoutes = async (fastify, options) => {
  fastify.post("/signup", signup);
  fastify.get("/verify-email", verifyEmail);
  fastify.post("/login", login);

  fastify.get("/auth/google", googleLogin);
  fastify.get("/auth/google/callback", googleLoginCallBack);
};

module.exports = investerRoutes;
