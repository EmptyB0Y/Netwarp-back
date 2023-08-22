require('dotenv').config();

module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./sqlite-dev.db"
  },
  test: {
    dialect: "sqlite",
    storage: "./sqlite-test.db"
  },
  production: {
    dialect: "sqlite",
    storage: "./sqlite-dev.db"
  },
};
