const { registerInvester} = require("../service/service");
const { logger } = require("../../logger");
const { ValidateUser, loginValidation } = require("../schema/investerSchema");

const signup = async (request, reply) => {
  logger.info(['src > controllers > signup > ', request.body]);
  try {
    const { error } = ValidateUser.validate(request.body);
    if (error) {
      return reply.code(400).send({ error: error.details[0].message });
    }

    const userData = await registerInvester(request.body);
    logger.info('User registered successfully', userData);
    console.log("USer DATA",userData)

    reply.code(201).send({
      message: 'User registered successfully',
    });


 

  } catch (error) {
    console.log(error);
    logger.error(["Error registering user:", error.message]);
    reply
      .code(500)
      .send({ error: "An error occurred while registering user." });
  }
};



module.exports={signup}