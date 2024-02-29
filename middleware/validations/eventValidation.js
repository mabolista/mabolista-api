/* eslint-disable no-useless-escape */
const Joi = require('joi');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const {
  findBenefitById
} = require('../../modules/benefit/repositories/benefits.repository');
const AppError = require('../../shared-v1/helpers/AppError');
const { errorCode, errorStatusCode } = require('../../shared-v1/constants');

const createEventValidation = async (req, res, next) => {
  try {
    const { benefitIds } = req.body;

    const schema = Joi.object({
      title: Joi.string().trim().min(8).required().messages({
        'string.base': `"Title" should be a text type`,
        'string.empty': `Masukkan judul event`,
        'string.min': `Title setidaknya berisi 8 karakter`,
        'any.required': `Title harus diinput`
      }),
      image: Joi.string().allow('').optional(),
      description: Joi.string().trim().min(8).required().messages({
        'string.base': `"Description" should be a text type`,
        'string.empty': `Masukkan deskripsi event`,
        'string.min': `Deskripsi setidaknya berisi 8 karakter`,
        'any.required': `Deskripsi harus diinput`
      }),
      location: Joi.string().trim().min(3).required().messages({
        'string.base': `"Location" should be a text type`,
        'string.empty': `Masukkan lokasi event`,
        'string.min': `Lokasi setidaknya berisi 3 karakter`,
        'any.required': `Lokasi harus diinput`
      }),
      gmapsUrl: Joi.string().allow(''),
      notes: Joi.string().allow(''),
      playerPrice: Joi.number().min(0).required().messages({
        'number.base': `"Player Price" should be a number type`,
        'number.empty': `Masukkan Harga Pemain`,
        'number.min': `Harga Pemain tidak boleh kurang dari 0`,
        'any.required': `Harga Pemarin harus diinput`
      }),
      keeperPrice: Joi.number().min(0).required().messages({
        'number.base': `"Keeper Price" should be a number type`,
        'number.empty': `Masukkan Harga Kiper`,
        'number.min': `Harga Kiper tidak boleh kurang dari 0`,
        'any.required': `Harga Kiper harus diinput`
      }),
      eventDate: Joi.date().min('now').required().messages({
        'date.base': `"Event Date" should be a date type`,
        'date.empty': `Masukkan tanggal event`,
        'date.min': `Tanggal event harus lebih besar daripada hari ini`,
        'any.required': `Tanggal event harus diinput`
      }),
      startTime: Joi.string()
        .regex(/^([0-9]{2})\:([0-9]{2})$/)
        .min(3)
        .required()
        .messages({
          'string.base': `"Start Time" should be a text type`,
          'string.empty': `Masukkan waktu mulai event`,
          'any.required': `Waktu mulai harus diinput`
        }),
      endTime: Joi.string()
        .regex(/^([0-9]{2})\:([0-9]{2})$/)
        .min(3)
        .required()
        .messages({
          'string.base': `"End Time" should be a text type`,
          'string.empty': `Masukkan waktu selesai event`,
          'string.min': `Waktu selesai setidaknya berisi 3 karakter`,
          'any.required': `Waktu selesai harus diinput`
        }),
      playerQty: Joi.number().min(1).required().messages({
        'number.base': `"Player Quantity" should be a number type`,
        'number.empty': `Masukkan quota pemain`,
        'number.min': `Quota pemain tidak boleh kurang dari 1`,
        'any.required': `Quota pemain harus dimasukkan`
      }),
      keeperQty: Joi.number().min(1).required().messages({
        'number.base': `"Keeper Quantity" should be a number type`,
        'number.empty': `Masukkan quota kiper`,
        'number.min': `Quota kiper tidak boleh kurang dari 1`,
        'any.required': `Quota kiper harus dimasukkan`
      }),
      benefitIds: Joi.array().items(Joi.number()).required()
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

    const checkBenefit = await benefitIds.map(async (benefitId) => {
      const benefit = await findBenefitById(parseInt(benefitId, 10));
      return benefit;
    });

    const checkBenefitResult = await Promise.all(checkBenefit);

    if (checkBenefitResult.includes(null)) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Beberapa benefit tidak ditemukan'
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

const editEventValidation = async (req, res, next) => {
  try {
    const { benefitIds } = req.body;

    const schema = Joi.object({
      title: Joi.string().trim().min(8).required().messages({
        'string.base': `"Title" should be a text type`,
        'string.empty': `Masukkan judul event`,
        'string.min': `Title setidaknya berisi 8 karakter`,
        'any.required': `Title harus diinput`
      }),
      image: Joi.string().allow('').optional(),
      description: Joi.string().trim().min(8).required().messages({
        'string.base': `"Description" should be a text type`,
        'string.empty': `Masukkan deskripsi event`,
        'string.min': `Deskripsi setidaknya berisi 8 karakter`,
        'any.required': `Deskripsi harus diinput`
      }),
      location: Joi.string().trim().min(3).required().messages({
        'string.base': `"Location" should be a text type`,
        'string.empty': `Masukkan lokasi event`,
        'string.min': `Lokasi setidaknya berisi 3 karakter`,
        'any.required': `Lokasi harus diinput`
      }),
      gmapsUrl: Joi.string().allow(''),
      notes: Joi.string().allow(''),
      playerPrice: Joi.number().min(0).required().messages({
        'number.base': `"Player Price" should be a number type`,
        'number.empty': `Masukkan Harga Pemain`,
        'number.min': `Harga Pemain tidak boleh kurang dari 0`,
        'any.required': `Harga Pemarin harus diinput`
      }),
      keeperPrice: Joi.number().min(0).required().messages({
        'number.base': `"Keeper Price" should be a number type`,
        'number.empty': `Masukkan Harga Kiper`,
        'number.min': `Harga Kiper tidak boleh kurang dari 0`,
        'any.required': `Harga Kiper harus diinput`
      }),
      eventDate: Joi.date().min('now').required().messages({
        'date.base': `"Event Date" should be a date type`,
        'date.empty': `Masukkan tanggal event`,
        'date.min': `Tanggal event harus lebih besar daripada hari ini`,
        'any.required': `Tanggal event harus diinput`
      }),
      startTime: Joi.string()
        .regex(/^([0-9]{2})\:([0-9]{2})$/)
        .min(3)
        .required()
        .messages({
          'string.base': `"Start Time" should be a text type`,
          'string.empty': `Masukkan waktu mulai event`,
          'any.required': `Waktu mulai harus diinput`
        }),
      endTime: Joi.string()
        .regex(/^([0-9]{2})\:([0-9]{2})$/)
        .min(3)
        .required()
        .messages({
          'string.base': `"End Time" should be a text type`,
          'string.empty': `Masukkan waktu selesai event`,
          'string.min': `Waktu selesai setidaknya berisi 3 karakter`,
          'any.required': `Waktu selesai harus diinput`
        }),
      playerQty: Joi.number().min(1).required().messages({
        'number.base': `"Player Quantity" should be a number type`,
        'number.empty': `Masukkan quota pemain`,
        'number.min': `Quota pemain tidak boleh kurang dari 1`,
        'any.required': `Quota pemain harus dimasukkan`
      }),
      keeperQty: Joi.number().min(1).required().messages({
        'number.base': `"Keeper Quantity" should be a number type`,
        'number.empty': `Masukkan quota kiper`,
        'number.min': `Quota kiper tidak boleh kurang dari 1`,
        'any.required': `Quota kiper harus dimasukkan`
      }),
      benefitIds: Joi.array().items(Joi.number()).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_USER_INPUT,
        error.details[0].message
      );
    }

    const checkBenefit = await benefitIds.map(async (benefitId) => {
      const benefit = await findBenefitById(parseInt(benefitId, 10));
      return benefit;
    });

    const checkBenefitResult = await Promise.all(checkBenefit);

    if (checkBenefitResult.includes(null)) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Beberapa benefit tidak ditemukan'
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

module.exports = { createEventValidation, editEventValidation };
