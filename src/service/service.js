const { investerSignUp } = require("../Repositories/repository");
const { logger } = require("../../logger");
const { findInvester } = require("../Repositories/repository");
const { redisClient } = require("../../infrastructure/redis");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  passwordVerify,
} = require("../mediators/mediator");
const bcrypt = require("bcrypt");

const registerInvester = async (userInfo) => {
  try {
    const { email, password,name } = userInfo;
    const existingUser = await findInvester({ where: { email } });
    if (existingUser) {
      return "Invester Already Exist With This Email";
    } else {
      const verificationToken = jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      await redisClient.set(email, verificationToken);
      await sendVerificationEmail(email, verificationToken,name);
      if (sendVerificationEmail) {
        return "Verification email sent successfully";
      }
    }
  } catch (error) {
    logger.error("Error registering investor", error);
    throw error;
  }
};

const createInvesterAfterVerification = async (verificationToken) => {
  try {
    const tokenData = jwt.decode(verificationToken, process.env.JWT_SECRET);
    console.log("Token Data....", tokenData);
    const hashPassword = await bcrypt.hash(tokenData?.password, 10);
    console.log("Hash Password", hashPassword);
    const Data = { ...tokenData, password: hashPassword };
    console.log("Data in Service ", Data);
    const registerInvester = await investerSignUp(Data);
    console.log("registerInvester in Service ", registerInvester);
  } catch (error) {
    console.error(error);
  }
};
const loginInvester = async (Login) => {
  try {
    const { email, password } = Login;
    const existingUser = await findInvester({ where: { email } });
    if (!existingUser) {
      return "Invester Does Not Exist";
    } else {
      const VerifyInvesterPassword = await passwordVerify(
        password,
        existingUser
      );
      console.log("Verify Password in Service ", VerifyInvesterPassword);
      if (VerifyInvesterPassword) {
        return "Login Success";
      } else {
        return "Invalid Username and password";
      }
    }
  } catch (error) {}
};

module.exports = {
  registerInvester,
  createInvesterAfterVerification,
  loginInvester,
};
