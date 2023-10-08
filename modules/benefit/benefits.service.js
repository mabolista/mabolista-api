const { Op } = require('sequelize');
const models = require('../../core/database/models');
// const { Event, Benefit } = require('../../core/database/models');
// const Event = require('../../core/database/models/Event');

// TODO: deprecated, just test the eager loading
const cobaEventBenefit = async () => {
  const joinEventBenefit = await models.Event.findAll({
    include: [
      {
        model: models.Benefit,
        required: false,
        as: 'benefits'
      }
    ]
  });

  console.log('join event benefit: ', joinEventBenefit);
  return joinEventBenefit;
};

const createBenefit = async ({ name, imageUrl, imagePublicId }) => {
  const benefit = await models.Benefit.create({
    name,
    imageUrl,
    imagePublicId
  });

  return benefit.toJSON();
};

const findBenefitById = async (id) => {
  const benefit = await models.Benefit.findOne({
    where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] }
  });

  if (benefit === null) {
    return null;
  }

  return benefit.toJSON();
};

const updateBenefit = async (id, { name, imageUrl, imagePublicId }) => {
  const currentBenefit = await models.Benefit.findByPk(id);

  await currentBenefit.update({
    name,
    imageUrl,
    imagePublicId,
    updatedAt: Date.now()
  });

  const updatedBenefit = await models.Benefit.findByPk(id);

  return updatedBenefit;
};

const findAllBenefit = async (offset, pageSize) => {
  const benefits = await models.Benefit.findAndCountAll({
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
  await models.Benefit.update(
    {
      deletedAt: Date.now()
    },
    { where: { id } }
  );

  const benefit = await models.Benefit.findByPk(id);

  return benefit;
};

module.exports = {
  createBenefit,
  updateBenefit,
  findAllBenefit,
  findBenefitById,
  deleteBenefit,
  cobaEventBenefit
};
