const Joi = require('joi');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const AppError = require('../../shared-v1/helpers/AppError');
const { errorCode, errorStatusCode } = require('../../shared-v1/constants');

const createBenefitValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().trim().min(3).required().messages({
        'string.base': `"Name" should be a text type`,
        'string.empty': `Masukkan nama benefit`,
        'string.min': `Nama setidaknya berisi 3 karakter`,
        'any.required': `Nama harus diinput`
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

    if (!req.file) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        'Image wajib diisi'
      );
    }

    return next();
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

const editBenefitValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().trim().min(3).required().messages({
        'string.base': `"Name" should be a text type`,
        'string.empty': `Masukkan nama benefit`,
        'string.min': `Nama setidaknya berisi 3 karakter`,
        'any.required': `Nama harus diinput`
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

    return next();
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

module.exports = { createBenefitValidation, editBenefitValidation };
