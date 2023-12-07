const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const { setPage } = require('../../middleware/pagination/paginationValidation');
const {
  uploadImageCloudinary,
  deleteImageCloudinary
} = require('../../shared-v1/utils/cloudinary/uploadImage');
const {
  findAllBenefit,
  createBenefit,
  updateBenefit,
  findBenefitById,
  deleteBenefit
} = require('./benefits.service');
const AppError = require('../../shared-v1/helpers/AppError');
const { errorCode, errorStatusCode } = require('../../shared-v1/constants');

const errorResponse = {
  message: '',
  path: ['']
};

const getAllBenefit = async (req, res) => {
  try {
    const { page } = req.query;
    const { pageSize } = req.query;

    const offset = setPage(pageSize, page);

    const { rows, count } = await findAllBenefit(offset, pageSize);

    const metaData = {
      currentPage: page,
      pageSize,
      total: count.toString(),
      totalPage: Math.ceil(count / pageSize).toString()
    };

    const data = {
      benefits: rows,
      meta: metaData
    };

    return res
      .status(201)
      .json(
        responseData(201, 'Berhasil mendapatkan data list benefit', null, data)
      );
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
};

const addBenefit = async (req, res) => {
  try {
    const { name } = req.body;

    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadImageCloudinary(
        req.file.path,
        'mabol-media-staging/benefit'
      );
    }

    const payload = {
      name,
      imageUrl: imageUrl.secure_url,
      imagePublicId: imageUrl.public_id
    };

    const benefit = await createBenefit(payload);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil membuat benefit baru', null, benefit));
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
};

const editBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    let imageUrl = '';

    const existingBenefit = await findBenefitById(id);

    if (!existingBenefit) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Benefit tidak ditemukan'
      );
    }

    if (!req.file) {
      imageUrl = existingBenefit.imageUrl ? existingBenefit.imageUrl : '';
    } else {
      await deleteImageCloudinary(existingBenefit.imagePublicId);

      imageUrl = await uploadImageCloudinary(
        req.file.path,
        'mabol-media-staging/benefit'
      );
    }

    const requestBody = {
      name,
      imageUrl: imageUrl.secure_url,
      imagePublicId: imageUrl.public_id
    };

    const benefit = await updateBenefit(id, requestBody);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil edit benefit', null, benefit));
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
};

const getBenefitById = async (req, res) => {
  try {
    const { id } = req.params;

    const benefit = await findBenefitById(id);

    if (benefit === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Benefit tidak ditemukan'
      );
    }

    return res
      .status(201)
      .json(
        responseData(201, 'Berhasil mendapatkan data benefit', null, benefit)
      );
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
};

const removeBenefit = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBenefit = await findBenefitById(id);

    if (existingBenefit === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Benefit tidak ditemukan'
      );
    }

    const benefit = await deleteBenefit(id);

    await deleteImageCloudinary(existingBenefit.imagePublicId);

    return res
      .status(201)
      .json(
        responseData(201, 'Berhasil menghapus data benefit', null, benefit)
      );
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
};

module.exports = {
  addBenefit,
  editBenefit,
  getAllBenefit,
  getBenefitById,
  removeBenefit
};
