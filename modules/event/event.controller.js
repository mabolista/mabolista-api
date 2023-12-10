const { setPage } = require('../../middleware/pagination/paginationValidation');
const {
  findAllEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('./event.service');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const { findEventById } = require('./event.service');
const {
  uploadImageCloudinary,
  deleteImageCloudinary
} = require('../../shared-v1/utils/cloudinary/uploadImage');
const { sequelize } = require('../../core/database/models');
const {
  createEventBenefit,
  deleteEventBenefit
} = require('../event_benefit/eventBenefit.service');
const {
  addUserToEvent,
  removeUserOfEvent,
  findEventUserByEventIdAndUserId
} = require('../event_user/eventUser.service');
const {
  addEventQuota,
  findEventQuotaByEventId,
  updateEventQuota
} = require('../event_quota/eventQuota.service');
const { decodeJwt } = require('../../shared-v1/helpers/jwtHelper');
const {
  isWithinThreedays
} = require('../../shared-v1/utils/isWithinThreeDays');
const { errorCode, errorStatusCode } = require('../../shared-v1/constants');
const AppError = require('../../shared-v1/helpers/AppError');
const {
  EVENT_MEDIA_PATH_FOLDER_DEV,
  EVENT_MEDIA_PATH_FOLDER_PROD
} = require('../../shared-v1/constants/cloudinaryMedia');

let t;
const env = process.env.NODE_ENV || 'development';

// Admin Dashboard
const getAllEvent = async (req, res) => {
  try {
    const { page, pageSize } = req.query;

    const offset = setPage(pageSize, page);

    const { rows } = await findAllEvent(offset, pageSize);

    const events = rows.map((row) => {
      return {
        id: row.dataValues.id,
        title: row.dataValues.title,
        imageUrl: row.dataValues.imageUrl,
        description: row.dataValues.description,
        location: row.dataValues.location,
        gmapsUrl: row.dataValues.gmapsUrl,
        notes: row.dataValues.notes,
        playerPrice: row.dataValues.playerPrice,
        keeperPrice: row.dataValues.keeperPrice,
        eventDate: row.dataValues.eventDate,
        startTime: row.dataValues.startTime,
        endTime: row.dataValues.endTime,
        benefits: row.dataValues.benefits,
        playerQty: row.dataValues.eventQuota.playerQty,
        keeperQty: row.dataValues.eventQuota.keeperQty,
        playerAvailableQty: row.dataValues.eventQuota.playerAvailableQty,
        keeperAvailableQty: row.dataValues.eventQuota.keeperAvailableQty,
        createdAt: row.dataValues.createdAt,
        updatedAt: row.dataValues.updatedAt,
        deletedAt: row.dataValues.deletedAt
      };
    });

    const metaData = {
      currentPage: page,
      pageSize,
      total: rows.length.toString(),
      totalPage: Math.ceil(rows.length / pageSize).toString()
    };

    const data = {
      events,
      meta: metaData
    };

    return res
      .status(200)
      .json(
        responseData(200, 'Berhasil mendapatkan data event list', null, data)
      );
  } catch (error) {
    console.error(error.stack);

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    let event = await findEventById(id);

    if (event === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Event tidak ditemukan'
      );
    }

    event = {
      id: event.id,
      title: event.title,
      imageUrl: event.imageUrl,
      description: event.description,
      location: event.location,
      gmapsUrl: event.gmapsUrl,
      notes: event.notes,
      playerPrice: event.playerPrice,
      keeperPrice: event.keeperPrice,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      benefits: event.benefits,
      playerQty: event.eventQuota.playerQty,
      keeperQty: event.eventQuota.keeperQty,
      playerAvailableQty: event.eventQuota.playerAvailableQty,
      keeperAvailableQty: event.eventQuota.keeperAvailableQty,
      createdAt: event.eventQuota.createdAt,
      updatedAt: event.eventQuota.updatedAt,
      deletedAt: event.eventQuota.deletedAt
    };

    return res
      .status(200)
      .json(responseData(200, 'Sucess get event data', null, event));
  } catch (error) {
    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

const addNewEvent = async (req, res) => {
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
    } = req.body;

    let image_url = '';

    if (req.file) {
      image_url = await uploadImageCloudinary(
        req.file.path,
        env === 'development'
          ? EVENT_MEDIA_PATH_FOLDER_DEV
          : EVENT_MEDIA_PATH_FOLDER_PROD
      );
    }

    const payload = {
      title,
      imageUrl: image_url.secure_url,
      imagePublicId: image_url.public_id,
      description,
      location,
      gmapsUrl,
      notes,
      playerPrice,
      keeperPrice,
      eventDate,
      startTime,
      endTime
    };

    const event = await createEvent(payload, t);
    const eventId = event.id;

    const eventBenefitIds = await benefitIds.map((benefitId) => ({
      eventId,
      benefitId: parseInt(benefitId, 10)
    }));

    await createEventBenefit(eventBenefitIds, t);

    const eventQuotaPayload = {
      eventId,
      playerQty,
      keeperQty,
      playerAvailableQty: playerQty,
      keeperAvailableQty: keeperQty
    };

    await addEventQuota(eventQuotaPayload, t);

    await t.commit();

    const result = await findEventById(eventId);

    return res
      .status(201)
      .json(responseData(201, 'Success create new event', null, result));
  } catch (error) {
    await t.rollback();

    console.error(error.stack);

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const editEvent = async (req, res) => {
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
    } = req.body;

    const { id } = req.params;
    let imageUrl = '';

    const existingEvent = await findEventById(id);
    const existingEventQuota = await findEventQuotaByEventId(id);

    if (!existingEvent) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Event not found'
      );
    }

    if (!req.file) {
      imageUrl = existingEvent.imageUrl ? existingEvent.imageUrl : '';
    } else {
      await deleteImageCloudinary(existingEvent.imagePublicId);

      imageUrl = await uploadImageCloudinary(
        req.file.path,
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

    const payload = {
      title,
      imageUrl: imageUrl.secure_url,
      imagePublicId: imageUrl.public_id,
      description,
      location,
      gmapsUrl,
      notes,
      playerPrice,
      keeperPrice,
      eventDate,
      startTime,
      endTime
    };

    t = await sequelize.transaction();

    await updateEventQuota(
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

    await deleteEventBenefit(id, t);
    await updateEvent(id, payload, t);

    const eventBenefitIds = await benefitIds.map((benefitId) => ({
      eventId: parseInt(id, 10),
      benefitId: parseInt(benefitId, 10)
    }));
    await createEventBenefit(eventBenefitIds, t);

    t.commit();

    const event = await findEventById(id);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil mengedit data event', null, event));
  } catch (error) {
    t.rollback();

    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(responseData(500, 'INTERNAL SERVER ERROR', error, null));
  }
};

const removeEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const exsitingEvent = await findEventById(id);

    if (!exsitingEvent) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Event tidak ditemukan'
      );
    }

    t = await sequelize.transaction();

    await deleteEventBenefit(id, t);

    const event = await deleteEvent(id, t);

    await deleteImageCloudinary(exsitingEvent.imagePublicId);

    t.commit();

    return res
      .status(201)
      .json(responseData(201, 'Berhasil menghapus data event', null, event));
  } catch (error) {
    t.rollback();

    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(responseData(500, 'INTERNAL SERVER ERROR', error, null));
  }
};

const userJoinToEventByAdmin = async (req, res) => {
  try {
    const { eventId, userId, playerPosition } = req.body;

    const existingEvent = await findEventById(eventId);
    const today = new Date();
    const eventDate = new Date(existingEvent.eventDate);

    if (!existingEvent) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Event tidak ditemukan'
      );
    }

    if (eventDate < today) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Tidak dapat bergabung dengan event ini karena jadwal telah lewat'
      );
    }

    const existingEventUser = await findEventUserByEventIdAndUserId(
      eventId,
      userId
    );

    if (existingEventUser) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User telah bergabung ke event ini'
      );
    }

    const existingEventQuota = await findEventQuotaByEventId(eventId);

    let { playerAvailableQty, keeperAvailableQty } = existingEventQuota;

    if (playerPosition !== 'P' && playerPosition !== 'GK') {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Player position unknown'
      );
    }

    t = await sequelize.transaction();

    if (playerPosition === 'P') {
      if (playerAvailableQty < 1) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Kuantitas player telah habis'
        );
      }

      await addUserToEvent(eventId, userId, playerPosition, t);

      playerAvailableQty -= 1;

      await updateEventQuota(
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

      await addUserToEvent(eventId, userId, playerPosition, t);

      keeperAvailableQty -= 1;

      await updateEventQuota(
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

    const data = await findEventById(eventId);

    return res
      .status(200)
      .json(
        responseData(
          200,
          `Berhasil bergabung dengan event ${data.title}`,
          null,
          data
        )
      );
  } catch (error) {
    t.rollback();

    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const userLeftEventByAdmin = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const existingEvent = await findEventById(eventId);

    if (!existingEvent) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Event tidak ditemukan'
      );
    }

    const existingEventUser = await findEventUserByEventIdAndUserId(
      eventId,
      userId
    );

    if (!existingEventUser) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Kamu belum bergabung dengan event ini'
      );
    }

    const existingEventQuota = await findEventQuotaByEventId(eventId);
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

    t = await sequelize.transaction();

    if (existingEventUser.playerPosition === 'P') {
      await removeUserOfEvent(eventId, userId, t);

      playerAvailableQty += 1;

      await updateEventQuota(
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
      await removeUserOfEvent(eventId, userId, t);

      keeperAvailableQty += 1;

      await updateEventQuota(
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

    const data = await findEventById(eventId);

    return res
      .status(200)
      .json(responseData(200, 'Berhasil keluar dari event', null, data));
  } catch (error) {
    t.rollback();

    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

// User Mabolista Member
const userJoinToEvent = async (req, res) => {
  try {
    const decode = decodeJwt(req.headers.authorization);
    const userId = decode.id;
    const today = new Date();
    const { eventId, playerPosition } = req.body;

    const existingEvent = await findEventById(eventId);

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

    const existingEventUser = await findEventUserByEventIdAndUserId(
      eventId,
      userId
    );

    if (existingEventUser) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User telah bergabung ke event ini'
      );
    }

    const existingEventQuota = await findEventQuotaByEventId(eventId);

    let { playerAvailableQty, keeperAvailableQty } = existingEventQuota;

    if (playerPosition !== 'P' && playerPosition !== 'GK') {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Player position unknown'
      );
    }

    t = await sequelize.transaction();

    if (playerPosition === 'P') {
      if (playerAvailableQty < 1) {
        throw new AppError(
          errorCode.BAD_REQUEST,
          errorStatusCode.BAD_DATA_VALIDATION,
          'Kuantitas player telah habis'
        );
      }

      await addUserToEvent(eventId, userId, playerPosition, t);

      playerAvailableQty -= 1;

      await updateEventQuota(
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

      await addUserToEvent(eventId, userId, playerPosition, t);

      keeperAvailableQty -= 1;

      await updateEventQuota(
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

    const data = await findEventById(eventId);

    return res
      .status(200)
      .json(
        responseData(
          200,
          `Berhasil bergabung dengan event ${data.title}`,
          null,
          data
        )
      );
  } catch (error) {
    t.rollback();

    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const userLeftEvent = async (req, res) => {
  try {
    const today = new Date();
    const decode = decodeJwt(req.headers.authorization);
    const userId = decode.id;

    const { eventId } = req.body;

    const existingEvent = await findEventById(eventId);

    if (!existingEvent) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Event tidak ditemukan'
      );
    }

    const existingEventUser = await findEventUserByEventIdAndUserId(
      eventId,
      userId
    );

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

    if (
      new Date(existingEvent.eventDate).toLocaleDateString() <=
      today.toLocaleString()
    ) {
      throw new AppError(
        errorCode.BAD_REQUEST,
        errorStatusCode.BAD_DATA_VALIDATION,
        'Kamu tidak dapat keluar event karena tanggal event telah lewat atau hari ini'
      );
    }

    const existingEventQuota = await findEventQuotaByEventId(eventId);
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

    t = await sequelize.transaction();

    if (existingEventUser.playerPosition === 'P') {
      await removeUserOfEvent(eventId, userId, t);

      playerAvailableQty += 1;

      await updateEventQuota(
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
      await removeUserOfEvent(eventId, userId, t);

      keeperAvailableQty += 1;

      await updateEventQuota(
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

    const data = await findEventById(eventId);

    return res
      .status(200)
      .json(responseData(200, 'Berhasil keluar dari event', null, data));
  } catch (error) {
    t.rollback();

    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

module.exports = {
  getAllEvent,
  getEventById,
  addNewEvent,
  editEvent,
  removeEvent,
  userJoinToEvent,
  userLeftEvent,
  userJoinToEventByAdmin,
  userLeftEventByAdmin
};
