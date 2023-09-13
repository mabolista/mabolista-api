/* eslint-disable consistent-return */
const Joi = require('joi');
const { responseData } = require('../../helpers/responseDataHelper');
const {
  findUserByEmail,
  findUserByEmailGetPassword,
  findUserById
} = require('../../modules/user/user.service');
const { passwordCompare } = require('../../helpers/passwordHelper');

let errorResponse = {};

const registerValidation = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const schema = Joi.object({
      name: Joi.string().trim().min(3).required().messages({
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
      phoneNumber: Joi.string().trim().min(10).required().messages({
        'string.base': `"Phonenumber" should be a text type`,
        'string.empty': `Nomor telepon tidak boleh kosong`,
        'string.min': `Nomor telepon setidaknya berisi 10 angka`,
        'any.required': `Nomor telepon harus diinput`
      }),
      password: Joi.string().trim().min(5).required().messages({
        'string.base': `"Password" should be a text type`,
        'string.empty': `Password tidak boleh kosong`,
        'string.min': `Password setidaknya berisi 5 karakter`
      }),
      confirmPassword: Joi.string().trim().min(5).required().messages({
        'string.base': `"Password Confirmation" should be a text type`,
        'string.empty': `Konfirmasi password tidak boleh kosong`,
        'string.min': `Konfirmasi Password setidaknya berisi 5 karakter`
      }),
      image: Joi.string().allow('').optional()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    const userEmail = await findUserByEmail(email);

    if (userEmail) {
      errorResponse = {
        message: 'Email telah terdaftar',
        path: ['email']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad Request', errorResponse, null));
    }

    if (confirmPassword !== password) {
      errorResponse = {
        message: 'Confirm password tidak match dengan password',
        path: ['confirm_password']
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

const loginValidation = async (req, res, next) => {
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

    const user = await findUserByEmailGetPassword(email);

    if (user === null) {
      errorResponse = {
        message: 'User belum terdaftar',
        path: ['email']
      };

      return res
        .status(401)
        .json(responseData(401, 'Unauthorized', errorResponse, null));
    }

    const userPassword = await passwordCompare(password, user.password);

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

const editUserValidation = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { id } = req.params;

    const schema = Joi.object({
      name: Joi.string().trim().min(3).required().messages({
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
      phoneNumber: Joi.string().trim().min(10).required().messages({
        'string.base': `"Phonenumber" should be a text type`,
        'string.empty': `Nomor telepon tidak boleh kosong`,
        'string.min': `Nomor telepon setidaknya berisi 10 angka`,
        'any.required': `Nomor telepon harus diinput`
      }),
      password: Joi.string().trim().min(5).required().messages({
        'string.base': `"Password" should be a text type`,
        'string.empty': `Passsword tidak boleh kosong`,
        'string.min': `Password setidaknya berisi 5 karakter`
      }),
      image: Joi.string().allow('').optional()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    const userEmail = await findUserByEmail(email);

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

const currentUserValidation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);

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
  registerValidation,
  editUserValidation,
  loginValidation,
  currentUserValidation
};
