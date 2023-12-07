/* eslint-disable consistent-return */
const { verifyToken } = require('../../shared-v1/helpers/jwtHelper');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const AppError = require('../../shared-v1/helpers/AppError');
const { errorCode, errorStatusCode } = require('../../shared-v1/constants');

const authenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    const token = authToken && authToken.split(' ')[1];

    const tokenVerified = await verifyToken(token, false);

    if (tokenVerified === null) {
      throw new AppError(
        errorCode.UNAUTHORIZED,
        errorStatusCode.UNAUTHENTICATED,
        'Unauthorized access this service'
      );
    }

    next();
  } catch (err) {
    console.error(err.stack);

    if (err instanceof AppError) {
      return res
        .status(401)
        .json(responseData(err.code, err.message, err, null));
    }

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          err,
          null
        )
      );
  }
};

const userAdminAuthenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    const token = authToken && authToken.split(' ')[1];

    const tokenVerified = await verifyToken(token, true);

    if (tokenVerified === null) {
      throw new AppError(
        errorCode.UNAUTHORIZED,
        errorStatusCode.UNAUTHENTICATED,
        'Unauthorized access this service'
      );
    }

    next();
  } catch (err) {
    console.error(err.stack);

    if (err instanceof AppError) {
      return res
        .status(401)
        .json(responseData(err.code, err.message, err, null));
    }

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          err,
          null
        )
      );
  }
};

module.exports = { authenticated, userAdminAuthenticated };
