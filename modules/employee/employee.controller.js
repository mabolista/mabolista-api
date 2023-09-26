const { generateToken } = require('../../helpers/jwtHelper');
const { passwordHashing } = require('../../helpers/passwordHelper');
const { responseData } = require('../../helpers/responseDataHelper');
const {
  createEmployee,
  findEmployeeById,
  findEmployeeByEmail
} = require('./employee.service');

const userAdminRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const hashedPassword = await passwordHashing(password);

    const payload = {
      fullname,
      email,
      password: hashedPassword
    };

    const newUserAdmin = await createEmployee(payload);

    const token = generateToken(newUserAdmin);

    const data = {
      newUserAdmin,
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

const userAdminLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findEmployeeByEmail(email);

    const token = generateToken(user);

    const data = {
      user,
      token
    };

    return res
      .status(201)
      .json(responseData(201, 'Berhasil login', null, data));
  } catch (error) {
    return res.status(500).json(500, 'Internal Server Error', error, null);
  }
};

const getUserAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findEmployeeById(id);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil mendapatkan data user', null, user));
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

module.exports = {
  userAdminRegister,
  userAdminLogin,
  getUserAdminById
};
