/* eslint-disable no-useless-escape */
const Joi = require('joi');
const { responseData } = require('../../helpers/responseDataHelper');
const { findBenefitById } = require('../../modules/benefit/benefits.service');

let errorResponse = {};

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
      benefitIds: Joi.array().items(Joi.number()).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    if (!req.file) {
      errorResponse = {
        message: 'Image wajib diisi',
        path: ['image']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', errorResponse, null));
    }

    const checkBenefit = await benefitIds.map(async (benefitId) => {
      const benefit = await findBenefitById(parseInt(benefitId, 10));
      return benefit;
    });

    const checkBenefitResult = await Promise.all(checkBenefit);

    if (checkBenefitResult.includes(null)) {
      errorResponse = {
        message: `Beberapa benefit tidak ditemukan`,
        path: ['benefit']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', errorResponse, null));
    }

    return next();
  } catch (err) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', err, null));
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
      benefitIds: Joi.array().items(Joi.number()).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    const checkBenefit = await benefitIds.map(async (benefitId) => {
      const benefit = await findBenefitById(parseInt(benefitId, 10));
      return benefit;
    });

    const checkBenefitResult = await Promise.all(checkBenefit);

    if (checkBenefitResult.includes(null)) {
      errorResponse = {
        message: `Beberapa benefit tidak ditemukan`,
        path: ['benefit']
      };

      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', errorResponse, null));
    }

    return next();
  } catch (err) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', err, null));
  }
};

module.exports = { createEventValidation, editEventValidation };
