const {
  registerInvester,
  createInvesterAfterVerification,
  loginInvester,
  googleClient,
} = require("../service/service");
const { logger } = require("../../logger");
const { ValidateUser, loginValidation } = require("../schema/investerSchema");
const { redisClient } = require("../../infrastructure/redis");
const { GoogleClient } = require("../authentication/google");

const signup = async (request, reply) => {
  logger.info(["src > controllers > signup > ", request.body]);
  try {
    const { error } = ValidateUser.validate(request.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }
    const InvesterData = await registerInvester(request.body);
    console.log("Invester Data", InvesterData);
    reply.code(201).send({
      message: InvesterData,
    });
  } catch (error) {
    console.log(error);
    logger.error(["Error registering user:", error.message]);
    reply
      .code(500)
      .send({ error: "An error occurred while registering user." });
  }
};

const verifyEmail = async (request, reply) => {
  try {
    const { email, verificationToken } = request.query;
    const storedToken = await redisClient.get(email);
    if (storedToken === verificationToken) {
      await redisClient.del(email);
      let newInvester = await createInvesterAfterVerification(
        verificationToken
      );
      return "Email Verified Successfully";
    } else {
      reply.status(400).send("Link Expire");
    }
  } catch (error) {
    logger.error(["Error verifying email:", error.message]);
    reply.status(500).send(error.message);
  }
};

const login = async (request, reply) => {
  logger.info(["src > controllers > login > ", request.body]);
  try {
    const Login = {
      email: request.body.email,
      password: request.body.password,
    };
    console.log("Login Data", Login);
    const { error } = loginValidation.validate(Login);
    if (error) {
      return reply.code(400).send({ error: error.message });
    }

    const LoginInvester = await loginInvester(Login);
    console.log("Invester Login", LoginInvester);

    reply.code(201).send({
      message: LoginInvester,
    });
  } catch (error) {
    console.log(error);
    logger.error(["Error Login Invester:", error.message]);
    reply.code(500).send({ error: "An error occurred while Login Invester." });
  }
};
const googleLogin = async (request, reply) => {
  const Url = GoogleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  console.log("Url ", Url);
  // Assuming 'reply' object supports redirection
  reply.redirect(Url);
};

const googleLoginCallBack = async (request, reply) => {
  try {
    const code = request.query.code;
    const userInfo = await googleClient(code); // Implement this function
    console.log("User Info In Controller ............", userInfo);
    if (userInfo) {
      reply.send(userInfo);
    }
  } catch (error) {
    reply
      .status(500)
      .send({ error: "An error occurred while fetching user information." });
  }
};
module.exports = {
  signup,
  verifyEmail,
  login,
  googleLogin,
  googleLoginCallBack,
};
