/* eslint-disable consistent-return */
const { verifyToken } = require('../../helpers/jwtHelper');
const { responseData } = require('../../helpers/responseDataHelper');

let errorResponse = {};

const authenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    const token = authToken && authToken.split(' ')[1];

    const tokenVerified = await verifyToken(token);

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

module.exports = { authenticated };
