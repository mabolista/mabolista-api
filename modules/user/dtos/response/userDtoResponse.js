class UserDTOResponse {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.imageUrl = user.imageUrl;
    this.phoneNumber = user.phoneNumber;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}

module.exports = UserDTOResponse;
