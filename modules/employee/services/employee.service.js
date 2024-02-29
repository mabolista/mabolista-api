const { generateToken } = require('../../../shared-v1/helpers/jwtHelper');
const {
  passwordHashing
} = require('../../../shared-v1/helpers/passwordHelper');
const EmployeeDTOResponse = require('../dtos/reponse/employeeDtoResponse');
const EmployeeDTORequest = require('../dtos/request/employeeDtoRequest');
const EmployeeRepository = require('../repositories/employee.repository');

/* eslint-disable class-methods-use-this */
class EmployeeService {
  async createEmployee(request) {
    const { fullname, email, password } = request.body;
    const hashedPassword = await passwordHashing(password);

    const payload = new EmployeeDTORequest(fullname, email, hashedPassword);

    const employee = await EmployeeRepository.createEmployee(payload);

    const token = generateToken(employee);

    return {
      employee: new EmployeeDTOResponse(employee),
      token
    };
  }

  async loginEmployee(request) {
    const { email } = request.body;

    const employee = await EmployeeRepository.findEmployeeByEmail(email);

    const token = generateToken(employee);

    return {
      employee: new EmployeeDTOResponse(employee),
      token
    };
  }

  async findEmployeeById(request) {
    const { id } = request.params;

    const employee = await EmployeeRepository.findEmployeeById(id);

    return new EmployeeDTOResponse(employee);
  }
}

module.exports = new EmployeeService();
