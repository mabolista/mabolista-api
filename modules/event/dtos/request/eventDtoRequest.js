class EventDTORequest {
  constructor(
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
  ) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.imagePublicId = imagePublicId;
    this.description = description;
    this.location = location;
    this.gmapsUrl = gmapsUrl;
    this.notes = notes;
    this.playerPrice = playerPrice;
    this.keeperPrice = keeperPrice;
    this.eventDate = eventDate;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

module.exports = EventDTORequest;
