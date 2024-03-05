const {
  setPage
} = require('../../../middleware/pagination/paginationValidation');
const {
  responseData
} = require('../../../shared-v1/helpers/responseDataHelper');
const { errorCode, errorStatusCode } = require('../../../shared-v1/constants');
const AppError = require('../../../shared-v1/helpers/AppError');
const EventService = require('../services/event.service');

// Admin Dashboard
const getAllEvent = async (req, res) => {
  try {
    const { page, pageSize } = req.query;

    const offset = setPage(pageSize, page);

    const { events, count } = await EventService.findAllEvent(offset, pageSize);

    const metaData = {
      currentPage: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      total: count,
      totalPage: Math.ceil(count / parseInt(pageSize, 10))
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
    const data = await EventService.findEventById(req);
    return res
      .status(200)
      .json(responseData(200, 'Sucess get event data', null, data));
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
  try {
    const data = await EventService.createEvent(req);

    return res
      .status(201)
      .json(responseData(201, 'Success create new event', null, data));
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

const editEvent = async (req, res) => {
  try {
    const event = await EventService.updateEvent(req);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil mengedit data event', null, event));
  } catch (error) {
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
    const event = await EventService.deleteEvent(req);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil menghapus data event', null, event));
  } catch (error) {
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
    const event = await EventService.joinEventByAdmin(req);

    return res
      .status(200)
      .json(
        responseData(
          200,
          `Berhasil bergabung dengan event ${event.title}`,
          null,
          event
        )
      );
  } catch (error) {
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
    const event = await EventService.leaveEventByAdmin(req);
    return res
      .status(200)
      .json(responseData(200, 'Berhasil keluar dari event', null, event));
  } catch (error) {
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
    const event = await EventService.joinEvent(req);

    return res
      .status(200)
      .json(
        responseData(
          200,
          `Berhasil bergabung dengan event ${event.title}`,
          null,
          event
        )
      );
  } catch (error) {
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
    const event = await EventService.leaveEvent(req);
    return res
      .status(200)
      .json(responseData(200, 'Berhasil keluar dari event', null, event));
  } catch (error) {
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
