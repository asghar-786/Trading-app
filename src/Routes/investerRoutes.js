// investerRoutes.js

const { signup } = require('../Controller/controller');

const investerRoutes = async (fastify, options) => {
    fastify.post("/signup", signup);
};

module.exports = investerRoutes;
