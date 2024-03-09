class EventDTOResponse {
  constructor(event) {
    this.id = event.id;
    this.title = event.title;
    this.imageUrl = event.imageUrl;
    this.description = event.description;
    this.location = event.location;
    this.gmapsUrl = event.gmapsUrl;
    this.notes = event.notes;
    this.playerPrice = event.playerPrice;
    this.keeperPrice = event.keeperPrice;
    this.eventDate = event.eventDate;
    this.startTime = event.startTime;
    this.endTime = event.endTime;
    this.benefits = event.benefits;
    this.users = [];
    this.playerQty = event.eventQuota.playerQty;
    this.keeperQty = event.eventQuota.keeperQty;
    this.playerAvailableQty = event.eventQuota.playerAvailableQty;
    this.keeperAvailableQty = event.eventQuota.keeperAvailableQty;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
    this.deletedAt = event.deletedAt;
  }

  addDataUsers(users) {
    users.map((user) => {
      return this.users.push({
        id: user.id,
        name: user.name,
        playerPosition: user.EventUser.playerPosition
      });
    });
  }
}

module.exports = EventDTOResponse;
