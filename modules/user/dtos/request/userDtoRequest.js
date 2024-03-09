class UserDTORequest {
  constructor(name, email, phoneNumber, imageUrl, password) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.imageUrl = imageUrl;
    this.password = password;
  }
}

module.exports = UserDTORequest;
