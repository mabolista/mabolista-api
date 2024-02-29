/* eslint-disable class-methods-use-this */
const {
  responseData
} = require('../../../shared-v1/helpers/responseDataHelper');
const {
  setPage
} = require('../../../middleware/pagination/paginationValidation');

const AppError = require('../../../shared-v1/helpers/AppError');
const { errorCode, errorStatusCode } = require('../../../shared-v1/constants');

const BenefitService = require('../services/benefit.service');

class BenefitController {
  async getAllBenefit(req, res) {
    try {
      const { page } = req.query;
      const { pageSize } = req.query;

      const offset = setPage(pageSize, page);

      const { benefits, count } = await BenefitService.findAllBenefits(
        offset,
        pageSize
      );

      const metaData = {
        currentPage: page,
        pageSize,
        total: count.toString(),
        totalPage: Math.ceil(count / pageSize).toString()
      };

      const data = {
        benefits,
        meta: metaData
      };

      return res
        .status(200)
        .json(
          responseData(
            200,
            'Berhasil mendapatkan data list benefit',
            null,
            data
          )
        );
    } catch (error) {
      console.error(error.stack);

      if (error instanceof AppError) {
        return res
          .status(error.code)
          .json(responseData(error.code, error.message, error, null));
      }

      return res
        .status(500)
        .json(
          responseData(
            errorCode.INTENAL_SERVER_ERROR,
            errorStatusCode.INTERNAL_SERVER_ERROR,
            error,
            null
          )
        );
    }
  }

  async getBenefitById(req, res) {
    try {
      const benefit = await BenefitService.findBenefitById(req);

      return res
        .status(200)
        .json(
          responseData(200, 'Berhasil mendapatkan data benefit', null, benefit)
        );
    } catch (error) {
      console.error(error.stack);

      if (error instanceof AppError) {
        return res
          .status(error.code)
          .json(responseData(error.code, error.message, error, null));
      }

      return res
        .status(500)
        .json(
          responseData(
            errorCode.INTENAL_SERVER_ERROR,
            errorStatusCode.INTERNAL_SERVER_ERROR,
            error,
            null
          )
        );
    }
  }

  async addBenefit(req, res) {
    try {
      const benefit = await BenefitService.createBenefit(req);

      return res
        .status(201)
        .json(
          responseData(201, 'Berhasil membuat benefit baru', null, benefit)
        );
    } catch (error) {
      console.error(error.stack);

      if (error instanceof AppError) {
        return res
          .status(error.code)
          .json(responseData(error.code, error.message, error, null));
      }

      return res
        .status(500)
        .json(
          responseData(
            errorCode.INTENAL_SERVER_ERROR,
            errorStatusCode.INTERNAL_SERVER_ERROR,
            error,
            null
          )
        );
    }
  }

  async editBenefit(req, res) {
    try {
      const benefit = await BenefitService.updateBenefit(req);

      return res
        .status(201)
        .json(responseData(201, 'Berhasil edit benefit', null, benefit));
    } catch (error) {
      console.error(error.stack);

      if (error instanceof AppError) {
        return res
          .status(error.code)
          .json(responseData(error.code, error.message, error, null));
      }

      return res
        .status(500)
        .json(
          responseData(
            errorCode.INTENAL_SERVER_ERROR,
            errorStatusCode.INTERNAL_SERVER_ERROR,
            error,
            null
          )
        );
    }
  }

  async removeBenefit(req, res) {
    try {
      const benefit = await BenefitService.deleteBenefit(req);

      return res
        .status(200)
        .json(
          responseData(200, 'Berhasil menghapus data benefit', null, benefit)
        );
    } catch (error) {
      console.error(error.stack);

      if (error instanceof AppError) {
        return res
          .status(error.code)
          .json(responseData(error.code, error.message, error, null));
      }

      return res
        .status(500)
        .json(
          responseData(
            errorCode.INTENAL_SERVER_ERROR,
            errorStatusCode.INTERNAL_SERVER_ERROR,
            error,
            null
          )
        );
    }
  }
}

module.exports = new BenefitController();
