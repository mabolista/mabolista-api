class EmployeeDTORequest {
  constructor(fullname, email, password) {
    this.fullname = fullname;
    this.email = email;
    this.password = password;
  }
}

module.exports = EmployeeDTORequest;
