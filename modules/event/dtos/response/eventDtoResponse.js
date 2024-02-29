class EventDTOResponse {
  constructor(event) {
    this.id = event.dataValues.id;
    this.title = event.dataValues.title;
    this.imageUrl = event.dataValues.imageUrl;
    this.description = event.dataValues.description;
    this.location = event.dataValues.location;
    this.gmapsUrl = event.dataValues.gmapsUrl;
    this.notes = event.dataValues.notes;
    this.playerPrice = event.dataValues.playerPrice;
    this.keeperPrice = event.dataValues.keeperPrice;
    this.eventDate = event.dataValues.eventDate;
    this.startTime = event.dataValues.startTime;
    this.endTime = event.dataValues.endTime;
    this.benefits = event.dataValues.benefits;
    this.users = event.dataValues.users.map((item) => {
      return {
        id: item.id,
        name: item.name,
        playerPosition: item.EventUser.playerPosition
      };
    });
    this.playerQty = event.dataValues.eventQuota.playerQty;
    this.keeperQty = event.dataValues.eventQuota.keeperQty;
    this.playerAvailableQty = event.dataValues.eventQuota.playerAvailableQty;
    this.keeperAvailableQty = event.dataValues.eventQuota.keeperAvailableQty;
    this.createdAt = event.dataValues.createdAt;
    this.updatedAt = event.dataValues.updatedAt;
    this.deletedAt = event.dataValues.deletedAt;
  }
}

module.exports = EventDTOResponse;
