const fastify = require("fastify");
const dotenv = require("dotenv");
dotenv.config();
const dataSource = require("../infrastructure/psqlconnection");
const { logger } = require("../logger");
const investerRoutes = require("./Routes/investerRoutes");

const startServer = async () => {
  const app = fastify();

  app.get("/", async (req, res) => {
    const result = {
      code: 200,
      status: "OK",
      message: "Fastify server is running ",
    };
    res.send(result);
  });

  app.register(investerRoutes);

  try {
    await app.listen(process.env.PORT || 4000);

    await dataSource.initialize();
    logger.info("Database connection has been established");
    
    logger.info(`Server is listening on ${process.env.PORT || 4000}`);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

module.exports = startServer;
