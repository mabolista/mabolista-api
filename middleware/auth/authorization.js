/* eslint-disable consistent-return */
const { verifyToken } = require('../../shared-v1/helpers/jwtHelper');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');

let errorResponse = {};

const authenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    const token = authToken && authToken.split(' ')[1];

    const tokenVerified = await verifyToken(token, false);

    if (tokenVerified === null) {
      errorResponse = {
        message: 'Unauthorized access this feature',
        path: ['authorization']
      };
      return res
        .status(401)
        .json(responseData(401, 'Unauthorized', errorResponse, null));
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

const userAdminAuthenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    const token = authToken && authToken.split(' ')[1];

    const tokenVerified = await verifyToken(token, true);

    if (tokenVerified === null) {
      errorResponse = {
        message: 'Unauthorized access this feature',
        path: ['authorization']
      };
      return res
        .status(401)
        .json(responseData(401, 'Unauthorized', errorResponse, null));
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

module.exports = { authenticated, userAdminAuthenticated };
