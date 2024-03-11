const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "investerSignup",
  tableName: "investerSignup",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    profession: {
      type: "varchar",
      nullable: true,
    },
    source: {
      type: "varchar",
    },
  },
});
