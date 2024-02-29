class BenefitDTOResponse {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.imageUrl = data.imageUrl;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}

module.exports = BenefitDTOResponse;
