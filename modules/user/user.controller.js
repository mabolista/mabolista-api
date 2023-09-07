/* eslint-disable consistent-return */
const { generateToken } = require('../../helpers/jwtHelper');
const { passwordHashing } = require('../../helpers/passwordHelper');
const { responseData } = require('../../helpers/responseDataHelper');
const { setPage } = require('../../middleware/pagination/paginationValidation');
const {
  findAllUser,
  createUser,
  updateUser,
  findUserById,
  findUserByEmail
} = require('./user.service');

const getAllUser = async (req, res) => {
  try {
    const { page } = req.query;
    const { pageSize } = req.query;

    const offset = setPage(pageSize, page);

    const { rows, count } = await findAllUser(offset, pageSize);

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
      .status(201)
      .json(
        responseData(201, 'Berhasil mendapatkan data list user', null, data)
      );
  } catch (error) {
    res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const hashedPassword = await passwordHashing(password);

    const payload = {
      name,
      email,
      phoneNumber,
      password: hashedPassword
    };

    const newUser = await createUser(payload);

    const user = await findUserById(newUser.id);

    const token = generateToken(user);

    const data = {
      user,
      token
    };

    return res
      .status(201)
      .json(responseData(201, 'User berhasil terdaftar', null, data));
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    const token = generateToken(user);

    const data = {
      user,
      token
    };

    return res
      .status(201)
      .json(responseData(201, 'Berhasil login', null, data));
  } catch (error) {
    res.status(500).json(500, 'Internal Server Error', error, null);
  }
};

const editUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const { id } = req.params;

    const requestBody = {
      name,
      email,
      phoneNumber,
      password
    };

    const currentUser = await findUserById(id);

    if (!currentUser) {
      return res
        .status(404)
        .json(responseData(404, 'Not Found', 'User tidak ditemukan', null));
    }

    const user = await updateUser(id, requestBody);

    return res
      .status(201)
      .json(responseData(201, 'User berhasil update', null, user));
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil mendapatkan data user', null, user));
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

module.exports = { getAllUser, register, login, editUser, getUserById };
