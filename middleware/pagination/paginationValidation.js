/* eslint-disable consistent-return */
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const AppError = require('../../shared-v1/helpers/AppError');
const { errorCode, errorStatusCode } = require('../../shared-v1/constants');

const maxPageSizeValidation = (req, res, next) => {
  try {
    const { page, pageSize } = req.query;

    if (!page || !pageSize) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        'page and pageSize must be defined on params'
      );
    }

    if (page < 0) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        `page can't be less than 0`
      );
    }

    if (pageSize > 25) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        'Page size cant be greater than 25'
      );
    }

    if (pageSize < 10) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Page size cant be less than 10'
      );
    }

    next();
  } catch (err) {
    console.error(err.stack);

    if (err instanceof AppError) {
      return res
        .status(400)
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

const setPage = (pageSize, page) => {
  return pageSize * page;
};

module.exports = { maxPageSizeValidation, setPage };
