const Joi = require('joi');
const { responseData } = require('../../helpers/responseDataHelper');

let errorResponse = {};

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

    return next();
  } catch (err) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', err, null));
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
      return res
        .status(400)
        .json(responseData(400, 'Bad User Input', error.details[0], null));
    }

    return next();
  } catch (err) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', err, null));
  }
};

module.exports = { createBenefitValidation, editBenefitValidation };
