/* eslint-disable consistent-return */
const Joi = require('joi');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const {
  findUserByEmail,
  findUserByEmailGetPassword,
  findUserById
} = require('../../modules/user/user.service');
const { passwordCompare } = require('../../shared-v1/helpers/passwordHelper');
const { errorCode, errorStatusCode } = require('../../shared-v1/constants');
const AppError = require('../../shared-v1/helpers/AppError');

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
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        error.details[0].message
      );
    }

    const userEmail = await findUserByEmail(email);

    if (userEmail) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Email telah terdaftar'
      );
    }

    if (confirmPassword !== password) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        'Confirm password tidak match dengan password'
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
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        error.details[0].message
      );
    }

    const user = await findUserByEmailGetPassword(email);

    if (user === null) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User belum terdaftar'
      );
    }

    const userPassword = await passwordCompare(password, user.password);

    if (userPassword === false) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Password salah'
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
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        error.details[0].message
      );
    }

    const userEmail = await findUserByEmail(email);

    if (!userEmail) {
      return next();
    }

    if (userEmail.id.toString() !== id) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Email telah terdaftar'
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

const currentUserValidation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);

    if (user === null) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User tidak ditemukan'
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

module.exports = {
  registerValidation,
  editUserValidation,
  loginValidation,
  currentUserValidation
};
