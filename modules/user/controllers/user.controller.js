/* eslint-disable class-methods-use-this */
const {
  responseData
} = require('../../../shared-v1/helpers/responseDataHelper');
const {
  setPage
} = require('../../../middleware/pagination/paginationValidation');

const { errorStatusCode, errorCode } = require('../../../shared-v1/constants');
const AppError = require('../../../shared-v1/helpers/AppError');

const UserService = require('../services/user.service');

class UserController {
  async getAllUser(req, res) {
    try {
      const { page } = req.query;
      const { pageSize } = req.query;

      const offset = setPage(pageSize, page);

      const { rows, count } = await UserService.findAllUser(offset, pageSize);

      const metaData = {
        currentPage: page,
        pageSize,
        total: count.toString(),
        totalPage: Math.ceil(count / pageSize).toString()
      };

      const data = {
        users: rows,
        meta: metaData
      };

      return res
        .status(200)
        .json(
          responseData(200, 'Berhasil mendapatkan data list user', null, data)
        );
    } catch (error) {
      console.error(error.stack);

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

  // TODO: fixing bug on user admin to create new controller handle get user by id from params not from the token
  async getUserById(req, res) {
    try {
      const data = await UserService.findUserById(req);

      return res
        .status(200)
        .json(responseData(200, 'Berhasil mendapatkan data user', null, data));
    } catch (error) {
      console.error(error.stack);

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

  async register(req, res) {
    try {
      const data = await UserService.createUser(req);

      return res
        .status(201)
        .json(responseData(201, 'User berhasil terdaftar', null, data));
    } catch (error) {
      console.error(error.stack);

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

  async login(req, res) {
    try {
      const data = await UserService.findUserByEmail(req);

      return res
        .status(201)
        .json(responseData(201, 'Berhasil login', null, data));
    } catch (error) {
      console.error(error.stack);

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

  async editUser(req, res) {
    try {
      const data = await UserService.editUser(req);

      return res
        .status(201)
        .json(responseData(201, 'User berhasil update', null, data));
    } catch (error) {
      console.error(error.stack);

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

  async removeUser(req, res) {
    try {
      const data = await UserService.deleteUser(req);

      return res
        .status(200)
        .json(responseData(200, 'Berhasil menghapus user', null, data));
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

module.exports = new UserController();
