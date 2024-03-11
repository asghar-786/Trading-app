const { logger } = require("../../logger");
const dataSource = require("../../infrastructure/psqlconnection");

const userRepository = dataSource.getRepository("investerSignup");

const investerSignUp = async (userInfo) => {
  try {
    logger.info(['src > repository > userRepository > ', userInfo]);

    const userCreate = userRepository.create(userInfo);
    
    const result = await userRepository.save(userCreate);
    logger.info("User created successfully", result);
    console.log("REPO",result)

    return result;

  } catch (error) {
    logger.error("Error while creating user:", error);
    throw error;
  }
};

module.exports = { investerSignUp };
