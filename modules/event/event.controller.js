const { setPage } = require('../../middleware/pagination/paginationValidation');
const {
  findAllEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('./event.service');
const { responseData } = require('../../helpers/responseDataHelper');
const { findEventById } = require('./event.service');
const {
  uploadImageCloudinary,
  deleteImageCloudinary
} = require('../../utils/cloudinary/uploadImage');
const { sequelize } = require('../../core/database/models');
const {
  createEventBenefit,
  deleteEventBenefit
} = require('../event_benefit/eventBenefit.service');

let errorResponse = {
  message: '',
  path: ['']
};
let t;

const getAllEvent = async (req, res) => {
  try {
    const { page, pageSize } = req.query;

    const offset = setPage(pageSize, page);

    const { rows } = await findAllEvent(offset, pageSize);

    const metaData = {
      currentPage: page,
      pageSize,
      total: rows.length.toString(),
      totalPage: Math.ceil(rows.length / pageSize).toString()
    };

    const data = {
      events: rows,
      meta: metaData
    };

    return res
      .status(200)
      .json(
        responseData(200, 'Berhasil mendapatkan data event list', null, data)
      );
  } catch (error) {
    return res
      .status(500)
      .json(responseData(500, 'Internal Server Error', error, null));
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await findEventById(id);

    if (event === null) {
      errorResponse = {
        message: 'Event tidak ditemukan',
        path: ['event']
      };

      return res
        .status(404)
        .json(responseData(404, 'Event not found', errorResponse, null));
    }

    return res
      .status(200)
      .json(responseData(200, 'Sucess get event data', null, event));
  } catch (error) {
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
      benefitIds
    } = req.body;

    let image_url = '';

    if (req.file) {
      image_url = await uploadImageCloudinary(
        req.file.path,
        'mabol-media-staging/event'
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

    await t.commit();

    const result = await findEventById(eventId);

    return res
      .status(201)
      .json(responseData(201, 'Success create new event', null, result));
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json(responseData(500, 'INTERNAL SERVER ERROR', error, null));
  }
};

const editEvent = async (req, res) => {
  try {
    t = await sequelize.transaction();

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
      benefitIds
    } = req.body;

    const { id } = req.params;
    let imageUrl = '';

    const existingEvent = await findEventById(id);

    if (!existingEvent) {
      errorResponse = {
        message: 'Event not found',
        path: ['event']
      };

      return res
        .status(404)
        .json(responseData(404, 'Event tidak ditemukan', errorResponse, null));
    }

    if (!req.file) {
      imageUrl = existingEvent.imageUrl ? existingEvent.imageUrl : '';
    } else {
      await deleteImageCloudinary(existingEvent.imagePublicId);

      imageUrl = await uploadImageCloudinary(
        req.file.path,
        'mabol-media-staging/event'
      );
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

    await deleteEventBenefit(id, t);

    await updateEvent(id, payload, t);

    const eventBenefitIds = await benefitIds.map((benefitId) => ({
      eventId: parseInt(id, 10),
      benefitId: parseInt(benefitId, 10)
    }));
    await createEventBenefit(eventBenefitIds, t);

    const event = await findEventById(id);

    t.commit();

    return res
      .status(201)
      .json(responseData(201, 'Berhasil mengedit data event', null, event));
  } catch (error) {
    t.rollback();
    return res
      .status(500)
      .json(responseData(500, 'INTERNAL SERVER ERROR', error, null));
  }
};

const removeEvent = async (req, res) => {
  try {
    t = await sequelize.transaction();

    const { id } = req.params;
    const exsitingEvent = await findEventById(id);

    if (!exsitingEvent) {
      errorResponse = {
        message: 'Event not found',
        path: ['event']
      };

      return res
        .status(404)
        .json(responseData(404, 'Event tidak ditemukan', errorResponse, null));
    }

    await deleteEventBenefit(id, t);

    const event = await deleteEvent(id, t);

    await deleteImageCloudinary(exsitingEvent.imagePublicId);

    t.commit();

    return res
      .status(201)
      .json(responseData(201, 'Berhasil menghapus data event', null, event));
  } catch (error) {
    t.rollback();
    return res
      .status(500)
      .json(responseData(500, 'INTERNAL SERVER ERROR', error, null));
  }
};

module.exports = {
  getAllEvent,
  getEventById,
  addNewEvent,
  editEvent,
  removeEvent
};
