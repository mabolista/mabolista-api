const { Op } = require('sequelize');
const models = require('../../core/database/models');

const findAllEvent = async (offset, pageSize) => {
  const events = await models.Event.findAndCountAll({
    where: {
      deletedAt: {
        [Op.is]: null
      }
    },
    order: [['created_at', 'DESC']],
    offset,
    limit: pageSize,
    include: [
      {
        model: models.Benefit,
        required: false,
        as: 'benefits'
      },
      {
        model: models.EventQuota,
        attributes: {
          exclude: ['id', 'eventId', 'createdAt', 'updatedAt']
        },
        required: false,
        as: 'eventQuota'
      }
    ]
  });

  if (events === null) return null;

  return events;
};

const findEventById = async (id) => {
  const event = await models.Event.findOne({
    where: {
      [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }]
    },
    include: [
      {
        model: models.Benefit,
        required: false,
        as: 'benefits',
        where: {
          deletedAt: null
        },
        through: {
          attributes: []
        }
      },
      {
        model: models.User,
        required: true,
        as: 'users',
        attributes: ['id', 'name']
      },
      {
        model: models.EventQuota,
        attributes: {
          exclude: ['id', 'eventId', 'createdAt', 'updatedAt']
        },
        required: true,
        as: 'eventQuota'
      }
    ]
  });

  if (event === null) return null;

  return event.toJSON();
};

const createEvent = async (
  {
    title,
    imageUrl,
    imagePublicId,
    description,
    location,
    gmapsUrl,
    notes,
    playerPrice,
    keeperPrice,
    eventDate,
    startTime,
    endTime
  },
  transaction
) => {
  const event = await models.Event.create(
    {
      title,
      imageUrl,
      imagePublicId,
      description,
      location,
      gmapsUrl,
      notes,
      playerPrice,
      keeperPrice,
      eventDate,
      startTime,
      endTime
    },
    { transaction }
  );

  return event.toJSON();
};

const updateEvent = async (
  id,
  {
    title,
    imageUrl,
    imagePublicId,
    description,
    location,
    gmapsUrl,
    notes,
    playerPrice,
    keeperPrice,
    eventDate,
    startTime,
    endTime
  },
  existingEvent,
  transaction
) => {
  await models.Event.update(
    {
      title,
      imageUrl,
      imagePublicId,
      description,
      location,
      gmapsUrl,
      notes,
      playerPrice,
      keeperPrice,
      eventDate,
      startTime,
      endTime
    },
    { where: { id }, transaction }
  );
};

const deleteEvent = async (id, transaction) => {
  await models.Event.update(
    {
      deletedAt: Date.now()
    },
    { where: { id }, transaction }
  );

  const event = await models.Event.findOne({
    where: {
      id
    },
    include: [
      {
        model: models.Benefit,
        required: false,
        as: 'benefits'
      }
    ]
  });

  return event;
};

module.exports = {
  findAllEvent,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
