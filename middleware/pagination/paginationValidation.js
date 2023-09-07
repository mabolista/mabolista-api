/* eslint-disable consistent-return */
const { responseData } = require('../../helpers/responseDataHelper');

let errorResponse = {};
const maxPageSizeValidation = (req, res, next) => {
  try {
    const { pageSize } = req.query;

    if (pageSize > 25) {
      errorResponse = {
        message: 'Page size cant be greater than 25',
        path: ['pagination']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', errorResponse, null));
    }

    if (pageSize < 10) {
      errorResponse = {
        message: 'Page size cant be less than 10',
        path: ['pagination']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', errorResponse, null));
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

const setPage = (pageSize, page) => {
  return pageSize * page;
};

module.exports = { maxPageSizeValidation, setPage };
