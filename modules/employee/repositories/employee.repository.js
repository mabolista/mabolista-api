/* eslint-disable class-methods-use-this */
const { Op } = require('sequelize');
const models = require('../../../core/database/models');

class EmployeeRepository {
  async createEmployee({ fullname, email, password }) {
    let user = await models.Employee.create({
      fullname,
      email,
      password
    });

    user = user.toJSON();

    delete user.password;

    return user;
  }

  async findEmployeeById(id) {
    const userAdmin = await models.Employee.findOne({
      where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] },
      attributes: { exclude: ['password'] }
    });

    if (userAdmin === null) {
      return null;
    }

    return userAdmin.toJSON();
  }

  async findEmployeeByEmail(email) {
    const employee = await models.Employee.findOne({
      where: { email },
      attributes: ['id', 'email']
    });

    if (employee === null) {
      return null;
    }

    return employee.toJSON();
  }

  async findEmployeeByEmailGetPassword(email) {
    const employee = await models.Employee.findOne({
      where: { email },
      attributes: ['id', 'email', 'password']
    });

    if (employee === null) {
      return null;
    }

    return employee.toJSON();
  }
}

module.exports = new EmployeeRepository();
