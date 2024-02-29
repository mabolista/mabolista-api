/* eslint-disable class-methods-use-this */
const {
  responseData
} = require('../../../shared-v1/helpers/responseDataHelper');
const AppError = require('../../../shared-v1/helpers/AppError');
const { errorCode, errorStatusCode } = require('../../../shared-v1/constants');
const EmployeeService = require('../services/employee.service');

class EmployeeController {
  async userAdminRegister(req, res) {
    try {
      const data = await EmployeeService.createEmployee(req);

      return res
        .status(201)
        .json(responseData(201, 'User berhasil terdaftar', null, data));
    } catch (error) {
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

  async userAdminLogin(req, res) {
    try {
      const data = await EmployeeService.loginEmployee(req);

      return res
        .status(201)
        .json(responseData(201, 'Berhasil login', null, data));
    } catch (error) {
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

  async getUserAdminById(req, res) {
    try {
      const data = await EmployeeService.findEmployeeById(req);

      return res
        .status(200)
        .json(responseData(200, 'Berhasil mendapatkan data user', null, data));
    } catch (error) {
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

module.exports = new EmployeeController();
