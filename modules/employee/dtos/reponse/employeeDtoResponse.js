class EmployeeDTOResponse {
  constructor(employee) {
    this.id = employee.id;
    this.fullname = employee.fullname;
    this.email = employee.email;
    this.createdAt = employee.createdAt;
    this.updatedAt = employee.updatedAt;
    this.deletedAt = employee.deletedAt;
  }
}

module.exports = EmployeeDTOResponse;
