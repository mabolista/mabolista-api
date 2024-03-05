/* eslint-disable class-methods-use-this */

const moment = require('moment');
const { errorCode, errorStatusCode } = require('../../../shared-v1/constants');
const {
  EVENT_MEDIA_PATH_FOLDER_DEV,
  EVENT_MEDIA_PATH_FOLDER_PROD
} = require('../../../shared-v1/constants/cloudinaryMedia');
const AppError = require('../../../shared-v1/helpers/AppError');
const {
  uploadImageCloudinary,
  deleteImageCloudinary
} = require('../../../shared-v1/utils/cloudinary/uploadImage');
const EventDTORequest = require('../dtos/request/eventDtoRequest');
const EventDTOResponse = require('../dtos/response/eventDtoResponse');
const EventRepository = require('../repositories/event.repository');
const { sequelize } = require('../../../core/database/models');
const { decodeJwt } = require('../../../shared-v1/helpers/jwtHelper');
const {
  isWithinThreedays
} = require('../../../shared-v1/utils/isWithinThreeDays');

let t;
const env = process.env.NODE_ENV || 'development';
class EventService {
  async findAllEvent(offset, pageSize) {
    const { rows, count } = await EventRepository.findAllEvent(
      offset,
      pageSize
    );

    const events = rows.map((row) => {
      const event = row.toJSON();

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    });

    return {
      events,
      count
    };
  }

  async findEventById(request) {
    const { id } = request.params;
    const event = await EventRepository.findEventById(id);

    if (event === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Event tidak ditemukan'
      );
    }

    const data = new EventDTOResponse(event);
    data.addDataUsers(event.users);

    return data;
  }

  async createEvent(request) {
    t = await sequelize.transaction();

    try {
      const {
        title,
        description,
        location,
        gmapsUrl,
        notes,
        playerPrice,
        keeperPrice,
        eventDate,
        startTime,
        endTime,
        playerQty,
        keeperQty,
        benefitIds
      } = request.body;

      let imageUrl = '';

      if (request.file) {
        imageUrl = await uploadImageCloudinary(
          request.file.path,
          env === 'development'
            ? EVENT_MEDIA_PATH_FOLDER_DEV
            : EVENT_MEDIA_PATH_FOLDER_PROD
        );
      }

      const payload = new EventDTORequest(
        title,
        imageUrl.secure_url,
        imageUrl.public_id,
        description,
        location,
        gmapsUrl,
        notes,
        playerPrice,
        keeperPrice,
        eventDate,
        startTime,
        endTime
      );

      const newEvent = await EventRepository.createEvent(payload, t);

      const eventId = newEvent.id;

      const eventBenefitIds = await benefitIds.map((benefitId) => ({
        eventId,
        benefitId: parseInt(benefitId, 10)
      }));

      await EventRepository.createEventBenefit(eventBenefitIds, t);

      const eventQuotaPayload = {
        eventId,
        playerQty,
        keeperQty,
        playerAvailableQty: playerQty,
        keeperAvailableQty: keeperQty
      };

      await EventRepository.addEventQuota(eventQuotaPayload, t);

      await t.commit();

      const event = await EventRepository.findEventById(eventId);

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    } catch (error) {
      t.rollback();

      throw error;
    }
  }

  async updateEvent(request) {
    t = await sequelize.transaction();

    try {
      const {
        title,
        description,
        location,
        gmapsUrl,
        notes,
        playerPrice,
        keeperPrice,
        eventDate,
        startTime,
        endTime,
        playerQty,
        keeperQty,
        benefitIds
      } = request.body;

      const { id } = request.params;
      let imageUrl = '';

      const existingEvent = await EventRepository.findEventById(id);
      const existingEventQuota =
        await EventRepository.findEventQuotaByEventId(id);

      if (!existingEvent) {
        throw new AppError(
          errorCode.NOT_FOUND,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Event not found'
        );
      }

      if (!request.file) {
        imageUrl = existingEvent.imageUrl ? existingEvent.imageUrl : '';
      } else {
        await deleteImageCloudinary(existingEvent.imagePublicId);

        imageUrl = await uploadImageCloudinary(
          request.file.path,
          env === 'development'
            ? EVENT_MEDIA_PATH_FOLDER_DEV
            : EVENT_MEDIA_PATH_FOLDER_PROD
        );
      }

      let { playerAvailableQty, keeperAvailableQty } = existingEventQuota;
      const existingPlayerQty = existingEventQuota.playerQty;
      const existingKeeperQty = existingEventQuota.keeperQty;

      if (playerQty > existingPlayerQty) {
        const qtyGap = playerQty - existingPlayerQty;

        playerAvailableQty += qtyGap;
      }

      if (playerQty < existingPlayerQty) {
        const usageQty = existingPlayerQty - playerAvailableQty;

        if (playerQty < usageQty) {
          throw new AppError(
            errorCode.BAD_REQUEST,
            errorStatusCode.BAD_DATA_VALIDATION,
            'Quantity player tidak bisa kurang dari quantity player yang sudah digunakan'
          );
        }

        playerAvailableQty = playerQty - usageQty;
      }

      if (keeperQty > existingKeeperQty) {
        const qtyGap = keeperQty - existingKeeperQty;

        keeperAvailableQty += qtyGap;
      }

      if (keeperQty < existingKeeperQty) {
        const usageQty = existingKeeperQty - keeperAvailableQty;

        if (keeperQty < usageQty) {
          throw new AppError(
            errorCode.BAD_REQUEST,
            errorStatusCode.BAD_DATA_VALIDATION,
            'Quantity keeper tidak bisa kurang dari quantity keeper yang sudah digunakan'
          );
        }

        keeperAvailableQty = keeperQty - usageQty;
      }

      const payload = new EventDTORequest(
        title,
        imageUrl.secure_url,
        imageUrl.public_id,
        description,
        location,
        gmapsUrl,
        notes,
        playerPrice,
        keeperPrice,
        eventDate,
        startTime,
        endTime
      );

      await EventRepository.updateEventQuota(
        existingEventQuota.id,
        {
          eventId: id,
          playerQty,
          keeperQty,
          playerAvailableQty,
          keeperAvailableQty
        },
        t
      );

      await EventRepository.deleteEventBenefit(id, t);
      await EventRepository.updateEvent(id, payload, t);

      const eventBenefitIds = await benefitIds.map((benefitId) => ({
        eventId: parseInt(id, 10),
        benefitId: parseInt(benefitId, 10)
      }));
      await EventRepository.createEventBenefit(eventBenefitIds, t);

      t.commit();

      const event = await EventRepository.findEventById(id);

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    } catch (error) {
      t.rollback();

      throw error;
    }
  }

  async deleteEvent(request) {
    t = await sequelize.transaction();
    try {
      const { id } = request.params;
      const exsitingEvent = await EventRepository.findEventById(id);

      if (!exsitingEvent) {
        throw new AppError(
          errorCode.NOT_FOUND,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Event tidak ditemukan'
        );
      }

      await EventRepository.deleteEventBenefit(id, t);

      const event = await EventRepository.deleteEvent(id, t);

      await deleteImageCloudinary(exsitingEvent.imagePublicId);

      t.commit();

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    } catch (error) {
      t.rollback();

      throw error;
    }
  }

  async joinEventByAdmin(request) {
    t = await sequelize.transaction();
    try {
      const { eventId, userId, playerPosition } = request.body;

      const existingEvent = await EventRepository.findEventById(eventId);

      const today = new Date();

      if (!existingEvent) {
        throw new AppError(
          errorCode.NOT_FOUND,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Event tidak ditemukan'
        );
      }

      const eventDate = new Date(existingEvent.eventDate);

      if (eventDate < today) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Tidak dapat bergabung dengan event ini karena jadwal telah lewat'
        );
      }

      const existingEventUser =
        await EventRepository.findEventUserByEventIdAndUserId(eventId, userId);

      if (existingEventUser) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'User telah bergabung ke event ini'
        );
      }

      const existingEventQuota =
        await EventRepository.findEventQuotaByEventId(eventId);

      let { playerAvailableQty, keeperAvailableQty } = existingEventQuota;

      if (playerPosition !== 'P' && playerPosition !== 'GK') {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Player position unknown'
        );
      }

      if (playerPosition === 'P') {
        if (playerAvailableQty < 1) {
          throw new AppError(
            errorCode.BAD_REQUEST,
            errorStatusCode.BAD_DATA_VALIDATION,
            'Kuantitas player telah habis'
          );
        }

        await EventRepository.addUserToEvent(
          eventId,
          userId,
          playerPosition,
          t
        );

        playerAvailableQty -= 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      if (playerPosition === 'GK') {
        if (keeperAvailableQty < 1) {
          throw new AppError(
            errorCode.BAD_REQUEST,
            errorStatusCode.BAD_DATA_VALIDATION,
            'Kuantitas keeper telah habis'
          );
        }

        await EventRepository.addUserToEvent(
          eventId,
          userId,
          playerPosition,
          t
        );

        keeperAvailableQty -= 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      t.commit();

      const event = await EventRepository.findEventById(eventId);

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    } catch (error) {
      t.rollback();

      throw error;
    }
  }

  async leaveEventByAdmin(request) {
    t = await sequelize.transaction();

    try {
      const { eventId, userId } = request.body;

      const existingEvent = await EventRepository.findEventById(eventId);

      if (!existingEvent) {
        throw new AppError(
          errorCode.NOT_FOUND,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Event tidak ditemukan'
        );
      }

      const existingEventUser =
        await EventRepository.findEventUserByEventIdAndUserId(eventId, userId);

      if (!existingEventUser) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'User belum bergabung dengan event ini'
        );
      }

      const existingEventQuota =
        await EventRepository.findEventQuotaByEventId(eventId);
      let { playerAvailableQty, keeperAvailableQty } = existingEventQuota;

      if (
        existingEventUser.playerPosition !== 'P' &&
        existingEventUser.playerPosition !== 'GK'
      ) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Player position unknown'
        );
      }

      if (existingEventUser.playerPosition === 'P') {
        await EventRepository.removeUserOfEvent(eventId, userId, t);

        playerAvailableQty += 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      if (existingEventUser.playerPosition === 'GK') {
        await EventRepository.removeUserOfEvent(eventId, userId, t);

        keeperAvailableQty += 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      t.commit();

      const event = await EventRepository.findEventById(eventId);

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    } catch (error) {
      t.rollback();

      throw error;
    }
  }

  async joinEvent(request) {
    t = await sequelize.transaction();

    try {
      const decode = decodeJwt(request.headers.authorization);
      const userId = decode.id;
      const today = new Date();
      const { eventId, playerPosition } = request.body;

      const existingEvent = await EventRepository.findEventById(eventId);

      if (!existingEvent) {
        throw new AppError(
          errorCode.NOT_FOUND,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Event tidak ditemukan'
        );
      }

      const eventDate = new Date(existingEvent.eventDate);

      if (eventDate < today) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Tidak dapat bergabung dengan event ini karena jadwal telah lewat'
        );
      }

      const existingEventUser =
        await EventRepository.findEventUserByEventIdAndUserId(eventId, userId);

      if (existingEventUser) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'User telah bergabung ke event ini'
        );
      }

      const existingEventQuota =
        await EventRepository.findEventQuotaByEventId(eventId);

      let { playerAvailableQty, keeperAvailableQty } = existingEventQuota;

      if (playerPosition !== 'P' && playerPosition !== 'GK') {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Player position unknown'
        );
      }

      if (playerPosition === 'P') {
        if (playerAvailableQty < 1) {
          throw new AppError(
            errorCode.BAD_REQUEST,
            errorStatusCode.BAD_DATA_VALIDATION,
            'Kuantitas player telah habis'
          );
        }

        await EventRepository.addUserToEvent(
          eventId,
          userId,
          playerPosition,
          t
        );

        playerAvailableQty -= 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      if (playerPosition === 'GK') {
        if (keeperAvailableQty < 1) {
          throw new AppError(
            errorCode.BAD_REQUEST,
            errorStatusCode.BAD_DATA_VALIDATION,
            'Kuantitas keeper telah habis'
          );
        }

        await EventRepository.addUserToEvent(
          eventId,
          userId,
          playerPosition,
          t
        );

        keeperAvailableQty -= 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      t.commit();

      const event = await EventRepository.findEventById(eventId);

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    } catch (error) {
      t.rollback();

      throw error;
    }
  }

  async leaveEvent(request) {
    t = await sequelize.transaction();

    try {
      const today = moment(new Date());
      const decode = decodeJwt(request.headers.authorization);
      const userId = decode.id;

      const { eventId } = request.body;

      const existingEvent = await EventRepository.findEventById(eventId);

      const eventDate = moment(existingEvent.eventDate);

      if (!existingEvent) {
        throw new AppError(
          errorCode.NOT_FOUND,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Event tidak ditemukan'
        );
      }

      const existingEventUser =
        await EventRepository.findEventUserByEventIdAndUserId(eventId, userId);

      if (!existingEventUser) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Kamu belum bergabung dengan event ini'
        );
      }

      if (isWithinThreedays(new Date(existingEvent.eventDate))) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Kamu tidak dapat keluar event dalam H-3 dari tanggal event'
        );
      }

      const existingEventQuota =
        await EventRepository.findEventQuotaByEventId(eventId);
      let { playerAvailableQty, keeperAvailableQty } = existingEventQuota;

      if (
        existingEventUser.playerPosition !== 'P' &&
        existingEventUser.playerPosition !== 'GK'
      ) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Player position unknown'
        );
      }

      if (existingEventUser.playerPosition === 'P') {
        await EventRepository.removeUserOfEvent(eventId, userId, t);

        playerAvailableQty += 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      if (existingEventUser.playerPosition === 'GK') {
        await EventRepository.removeUserOfEvent(eventId, userId, t);

        keeperAvailableQty += 1;

        await EventRepository.updateEventQuota(
          existingEventQuota.id,
          {
            eventId,
            playerQty: existingEventQuota.playerQty,
            keeperQty: existingEventQuota.keeperQty,
            playerAvailableQty,
            keeperAvailableQty
          },
          t
        );
      }

      t.commit();

      const event = await EventRepository.findEventById(eventId);

      const data = new EventDTOResponse(event);
      data.addDataUsers(event.users);

      return data;
    } catch (error) {
      t.rollback();

      throw error;
    }
  }
}

module.exports = new EventService();
