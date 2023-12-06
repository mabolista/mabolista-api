/* eslint-disable consistent-return */
const Joi = require('joi');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const { passwordCompare } = require('../../shared-v1/helpers/passwordHelper');
const {
  findEmployeeByEmail,
  findEmployeeByEmailGetPassword,
  findEmployeeById
} = require('../../modules/employee/employee.service');

let errorResponse = {};

const userAdminRegisterValidation = async (req, res, next) => {
  try {
    const { email } = req.body;

    const schema = Joi.object({
      fullname: Joi.string().trim().min(3).required().messages({
        'string.base': `"Fullname" should be a text type`,
        'string.empty': `Masukkan nama lengkap`,
        'string.min': `Nama setidaknya berisi 3 karakter`,
        'any.required': `Nama harus diinput`
      }),
      email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
        .required()
        .messages({
          'string.base': `"Email" should be a text type`,
          'string.email': `Email format should be ".com" or ".net"`,
          'string.empty': `Email tidak boleh kosong`,
          'any.required': `Email harus diinput`
        }),
      password: Joi.string().trim().min(5).required().messages({
        'string.base': `"Password" should be a text type`,
        'string.empty': `Password tidak boleh kosong`,
        'string.min': `Password setidaknya berisi 5 karakter`
      })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    const userAdminEmail = await findEmployeeByEmail(email);

    if (userAdminEmail) {
      errorResponse = {
        message: 'Email telah terdaftar',
        path: ['email']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad Request', errorResponse, null));
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', err, null));
  }
};

const userAdminLoginValidation = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
        .required()
        .messages({
          'string.base': `"Email" should be a text type`,
          'string.email': `Email format should be ".com" or ".net"`,
          'string.empty': `Email tidak boleh kosong`,
          'any.required': `Email harus diinput`
        }),
      password: Joi.string().trim().min(5).required().messages({
        'string.base': `"Password" should be a text type`,
        'string.empty': `Password tidak boleh kosong`,
        'string.min': `Password setidaknya berisi 5 karakter`
      })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    const employee = await findEmployeeByEmailGetPassword(email);

    if (employee === null) {
      errorResponse = {
        message: 'User belum terdaftar',
        path: ['email']
      };

      return res
        .status(401)
        .json(responseData(401, 'Unauthorized', errorResponse, null));
    }

    const userPassword = await passwordCompare(password, employee.password);

    if (userPassword === false) {
      errorResponse = {
        message: 'Password salah',
        path: ['password']
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

const editUserAdminValidation = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { id } = req.params;

    const schema = Joi.object({
      fullname: Joi.string().trim().min(3).required().messages({
        'string.base': `"Fullname" should be a text type`,
        'string.empty': `Masukkan nama lengkap`,
        'string.min': `Nama setidaknya berisi 3 karakter`,
        'any.required': `Nama harus diinput`
      }),
      email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
        .required()
        .messages({
          'string.base': `"Email" should be a text type`,
          'string.email': `Email format should be ".com" or ".net"`,
          'string.empty': `Email tidak boleh kosong`,
          'any.required': `Email harus diinput`
        }),
      password: Joi.string().trim().min(5).required().messages({
        'string.base': `"Password" should be a text type`,
        'string.empty': `Passsword tidak boleh kosong`,
        'string.min': `Password setidaknya berisi 5 karakter`
      })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    const userEmail = await findEmployeeByEmail(email);

    if (!userEmail) {
      return next();
    }

    if (userEmail.id.toString() !== id) {
      errorResponse = {
        message: 'Email telah terdaftar',
        path: ['email']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad Request', errorResponse, null));
    }

    next();
  } catch (err) {
    return res.json(responseData(500, 'Internal Server Error', err, null));
  }
};

const currentUserAdminValidation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await findEmployeeById(id);

    if (user === null) {
      errorResponse = {
        message: 'User tidak ditemukan',
        path: ['user']
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

module.exports = {
  userAdminRegisterValidation,
  editUserAdminValidation,
  userAdminLoginValidation,
  currentUserAdminValidation
};
