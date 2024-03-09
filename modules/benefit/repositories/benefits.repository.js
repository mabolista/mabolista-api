/* eslint-disable class-methods-use-this */
const { Op } = require('sequelize');
const models = require('../../../core/database/models');

class BenefitRepository {
  async createBenefit({ name, imageUrl, imagePublicId }) {
    const benefit = await models.Benefit.create({
      name,
      imageUrl,
      imagePublicId
    });

    return benefit.toJSON();
  }

  async findBenefitById(id) {
    const benefit = await models.Benefit.findOne({
      where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] }
    });

    if (benefit === null) {
      return null;
    }

    return benefit.toJSON();
  }

  async updateBenefit(id, { name, imageUrl, imagePublicId }) {
    const currentBenefit = await models.Benefit.findByPk(id);

    await currentBenefit.update({
      name,
      imageUrl,
      imagePublicId,
      updatedAt: Date.now()
    });

    const updatedBenefit = await models.Benefit.findByPk(id);

    return updatedBenefit;
  }

  async findAllBenefit(offset, pageSize) {
    const benefits = await models.Benefit.findAndCountAll({
      where: {
        deletedAt: {
          [Op.is]: null
        }
      },
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['imagePublicId'] },
      offset,
      limit: pageSize
    });

    if (benefits === null) {
      return null;
    }

    return benefits;
  }

  async deleteBenefit(id) {
    await models.Benefit.update(
      {
        deletedAt: Date.now()
      },
      { where: { id } }
    );

    const benefit = await models.Benefit.findByPk(id);

    return benefit;
  }
}

module.exports = new BenefitRepository();
