/* eslint-disable class-methods-use-this */
const { errorCode, errorStatusCode } = require('../../../shared-v1/constants');
const {
  BENEFIT_MEDIA_PATH_FOLDER_DEV,
  BENEFIT_MEDIA_PATH_FOLDER_PROD
} = require('../../../shared-v1/constants/cloudinaryMedia');
const AppError = require('../../../shared-v1/helpers/AppError');
const {
  uploadImageCloudinary,
  deleteImageCloudinary
} = require('../../../shared-v1/utils/cloudinary/uploadImage');
const BenefitDTORequest = require('../dtos/request/benefitDtoRequest');
const BenefitDTOResponse = require('../dtos/response/benefitDtoResponse');
const BenefitRepository = require('../repositories/benefits.repository');

const env = process.env.NODE_ENV || 'development';

class BenefitService {
  async findAllBenefits(offset, pageSize) {
    const { rows, count } = await BenefitRepository.findAllBenefit(
      offset,
      pageSize
    );

    const benefits = rows.map((row) => {
      return new BenefitDTOResponse(row);
    });

    return { benefits, count };
  }

  async findBenefitById(request) {
    const { id } = request.params;

    const benefit = await BenefitRepository.findBenefitById(id);

    if (benefit === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Benefit tidak ditemukan'
      );
    }

    return new BenefitDTOResponse(benefit);
  }

  async createBenefit(request) {
    const { name } = request.body;

    let imageUrl = '';

    if (request.file) {
      imageUrl = await uploadImageCloudinary(
        request.file.path,
        env === 'development'
          ? BENEFIT_MEDIA_PATH_FOLDER_DEV
          : BENEFIT_MEDIA_PATH_FOLDER_PROD
      );
    }

    const payload = new BenefitDTORequest(
      name,
      imageUrl.secure_url,
      imageUrl.public_id
    );
    const benefit = await BenefitRepository.createBenefit(payload);

    return new BenefitDTOResponse(benefit);
  }

  async updateBenefit(request) {
    const { id } = request.params;
    const { name } = request.body;

    let imageUrl = '';

    const existingBenefit = await BenefitRepository.findBenefitById(id);

    if (!existingBenefit) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Benefit tidak ditemukan'
      );
    }

    if (!request.file) {
      imageUrl = existingBenefit.imageUrl ? existingBenefit.imageUrl : '';
    } else {
      if (existingBenefit.imagePublicId) {
        await deleteImageCloudinary(existingBenefit.imagePublicId);
      }

      imageUrl = await uploadImageCloudinary(
        request.file.path,
        env === 'development'
          ? BENEFIT_MEDIA_PATH_FOLDER_DEV
          : BENEFIT_MEDIA_PATH_FOLDER_PROD
      );
    }

    const payload = new BenefitDTORequest(
      name,
      imageUrl.secure_url,
      imageUrl.public_id
    );

    const benefit = await BenefitRepository.updateBenefit(id, payload);

    return new BenefitDTOResponse(benefit);
  }

  async deleteBenefit(request) {
    const { id } = request.params;

    const existingBenefit = await BenefitRepository.findBenefitById(id);

    if (existingBenefit === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Benefit tidak ditemukan'
      );
    }

    if (existingBenefit.imagePublicId) {
      await deleteImageCloudinary(existingBenefit.imagePublicId);
    }

    const benefit = await BenefitRepository.deleteBenefit(id);

    return new BenefitDTOResponse(benefit);
  }
}

module.exports = new BenefitService();
