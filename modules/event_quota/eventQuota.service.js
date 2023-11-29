const models = require('../../core/database/models');

const findEventQuotaByEventId = async (eventId) => {
  eventId = parseInt(eventId, 10);

  const data = await models.EventQuota.findOne({
    where: {
      eventId
    }
  });

  return data;
};

const addEventQuota = async (payload, transaction) => {
  const data = await models.EventQuota.create(
    {
      ...payload
    },
    { transaction }
  );

  return data;
};

const updateEventQuota = async (id, payload, transaction) => {
  await models.EventQuota.update(
    { ...payload },
    { where: { id }, transaction }
  );
};

module.exports = {
  findEventQuotaByEventId,
  addEventQuota,
  updateEventQuota
};
