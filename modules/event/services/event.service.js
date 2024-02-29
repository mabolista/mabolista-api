/* eslint-disable class-methods-use-this */

const { errorCode, errorStatusCode } = require('../../../shared-v1/constants');
const AppError = require('../../../shared-v1/helpers/AppError');
const EventDTOResponse = require('../dtos/response/eventDtoResponse');
const EventRepository = require('../repositories/event.repository');

class EventService {
  async findAllEvent(offset, pageSize) {
    const { rows } = await EventRepository.findAllEvent(offset, pageSize);

    const events = rows.map((row) => {
      return new EventDTOResponse(row);
    });

    return events;
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

    return new EventDTOResponse(event);
  }
}

module.exports = new EventService();
