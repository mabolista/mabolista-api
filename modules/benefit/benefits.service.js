const { Op } = require('sequelize');
const Benefit = require('../../core/database/models/Benefit');

const createBenefit = async ({ name, imageUrl, imagePublicId }) => {
  const benefit = await Benefit.create({
    name,
    imageUrl,
    imagePublicId
  });

  return benefit.toJSON();
};

const findBenefitById = async (id) => {
  const benefit = await Benefit.findOne({
    where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] }
  });

  if (benefit === null) {
    return null;
  }

  return benefit.toJSON();
};

const updateBenefit = async (id, { name, imageUrl, imagePublicId }) => {
  const currentBenefit = await Benefit.findByPk(id);

  await currentBenefit.update({
    name,
    imageUrl,
    imagePublicId,
    updatedAt: Date.now()
  });

  const updatedBenefit = await Benefit.findByPk(id);

  return updatedBenefit;
};

const findAllBenefit = async (offset, pageSize) => {
  const benefits = await Benefit.findAndCountAll({
    where: {
      deletedAt: {
        [Op.is]: null
      }
    },
    order: [['created_at', 'DESC']],
    offset,
    limit: pageSize
  });

  if (benefits === null) {
    return null;
  }

  return benefits;
};

const deleteBenefit = async (id) => {
  await Benefit.update(
    {
      deletedAt: Date.now()
    },
    { where: { id } }
  );

  const benefit = await Benefit.findByPk(id);

  return benefit;
};

module.exports = {
  createBenefit,
  updateBenefit,
  findAllBenefit,
  findBenefitById,
  deleteBenefit
};
