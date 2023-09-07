const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const config = require('./database');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelizeConnection = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  }
);

module.exports = sequelizeConnection;
