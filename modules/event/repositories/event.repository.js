/* eslint-disable class-methods-use-this */
const { Op } = require('sequelize');
const models = require('../../../core/database/models');

class EventRepository {
  async findAllEvent(offset, pageSize) {
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
          as: 'benefits',
          through: {
            attributes: []
          },
          attributes: { exclude: ['imagePublicId'] },
          where: {
            deletedAt: { [Op.is]: null }
          }
        },
        {
          model: models.User,
          required: false,
          as: 'users',
          attributes: ['id', 'name']
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
  }

  async findEventById(id) {
    const event = await models.Event.findOne({
      where: {
        [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }]
      },
      include: [
        {
          model: models.Benefit,
          required: false,
          as: 'benefits',
          through: {
            attributes: []
          },
          attributes: { exclude: ['imagePublicId'] },
          where: {
            deletedAt: { [Op.is]: null }
          }
        },
        {
          model: models.User,
          required: false,
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

    return event;
  }

  async createEvent(
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
  ) {
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
  }

  async updateEvent(
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
  ) {
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
  }

  async deleteEvent(id, transaction) {
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
  }
}

module.exports = new EventRepository();
