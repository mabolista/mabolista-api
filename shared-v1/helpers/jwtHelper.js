const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { jwtDecode } = require('jwt-decode');
const { findUserById } = require('../../modules/user/user.service');
const { findEmployeeById } = require('../../modules/employee/employee.service');

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

const decodeJwt = (authToken) => {
  if (!authToken) return null;

  const token = authToken && authToken.split(' ')[1];
  const decode = jwtDecode(token);

  return decode;
};

module.exports = { generateToken, verifyToken, decodeJwt };
