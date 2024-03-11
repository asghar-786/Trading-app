const { investerSignUp } = require("../Repositories/repository");
const { logger } = require("../../logger");

const registerInvester = async (userInfo) => {
  try {

    const data = await investerSignUp(userInfo);

    logger.info('Investor registered successfully', data);
    console.log("SERVER DATA",data)
        return data;

  } catch (error) {
    logger.error('Error registering investor', error);
    throw error;
  }
};

module.exports = { registerInvester };
