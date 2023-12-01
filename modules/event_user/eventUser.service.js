const models = require('../../core/database/models');

const addUserToEvent = async (eventId, userId, playerPosition, transaction) => {
  await models.EventUser.create(
    {
      eventId,
      userId,
      playerPosition
    },
    { transaction }
  );
};

const findUserEventByEventIdAndPlayerPosition = async (
  eventId,
  playerPosition
) => {
  eventId = parseInt(eventId, 10);

  const data = await models.EventUser.findAll({
    where: {
      eventId,
      playerPosition
    }
  });

  return data;
};

const findEventUserByEventIdAndUserId = async (eventId, userId) => {
  const data = await models.EventUser.findOne({
    where: {
      eventId,
      userId
    }
  });

  if (!data) {
    return null;
  }

  return data.toJSON();
};

const removeUserOfEvent = async (eventId, userId, transaction) => {
  eventId = parseInt(eventId, 10);
  userId = parseInt(userId, 10);

  await models.EventUser.destroy({
    where: {
      eventId,
      userId
    },
    transaction
  });
};

module.exports = {
  addUserToEvent,
  removeUserOfEvent,
  findUserEventByEventIdAndPlayerPosition,
  findEventUserByEventIdAndUserId
};
