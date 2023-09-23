const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { findUserById } = require('../modules/user/user.service');
const { findEmployeeById } = require('../modules/employee/employee.service');

dotenv.config();

const generateToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRES_IN
  });

  return token;
};

const verifyToken = (token, isUserAdmin) => {
  if (!token) return null;

  const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (isUserAdmin) {
    const user = findEmployeeById(id);
    return user;
  }

  const user = findUserById(id);

  return user;
};

module.exports = { generateToken, verifyToken };
