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
      ],
      distinct: true
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

    return event.toJSON();
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

    return event;
  }

  async findEventQuotaByEventId(eventId) {
    eventId = parseInt(eventId, 10);

    const data = await models.EventQuota.findOne({
      where: {
        eventId
      }
    });

    return data;
  }

  async addEventQuota(payload, transaction) {
    const data = await models.EventQuota.create(
      {
        ...payload
      },
      { transaction }
    );

    return data;
  }

  async updateEventQuota(id, payload, transaction) {
    await models.EventQuota.update(
      { ...payload },
      { where: { id }, transaction }
    );
  }

  async createEventBenefit(data, transaction) {
    const eventBenefit = await models.EventBenefit.bulkCreate(data, {
      transaction,
      returning: true
    });

    return eventBenefit;
  }

  async deleteEventBenefit(eventId, transaction) {
    eventId = parseInt(eventId, 10);

    await models.EventBenefit.destroy({
      where: { eventId },
      transaction
    });
  }

  async addUserToEvent(eventId, userId, playerPosition, transaction) {
    await models.EventUser.create(
      {
        eventId,
        userId,
        playerPosition
      },
      { transaction }
    );
  }

  async findUserEventByEventIdAndPlayerPosition(eventId, playerPosition) {
    eventId = parseInt(eventId, 10);

    const data = await models.EventUser.findAll({
      where: {
        eventId,
        playerPosition
      }
    });

    return data;
  }

  async findEventUserByEventIdAndUserId(eventId, userId) {
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
  }

  async removeUserOfEvent(eventId, userId, transaction) {
    eventId = parseInt(eventId, 10);
    userId = parseInt(userId, 10);

    await models.EventUser.destroy({
      where: {
        eventId,
        userId
      },
      transaction
    });
  }
}

module.exports = new EventRepository();
