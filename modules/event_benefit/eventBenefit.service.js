const models = require('../../core/database/models');

const createEventBenefit = async (data, transaction) => {
  const eventBenefit = await models.EventBenefit.bulkCreate(data, {
    transaction,
    returning: true
  });

  return eventBenefit;
};

const deleteEventBenefit = async (eventId, transaction) => {
  eventId = parseInt(eventId, 10);

  await models.EventBenefit.destroy({
    where: { eventId },
    transaction
  });
};

module.exports = {
  createEventBenefit,
  deleteEventBenefit
};
