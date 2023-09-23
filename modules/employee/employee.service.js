const { Op } = require('sequelize');
const Employee = require('../../core/database/models/Employee');

const createEmployee = async ({ fullname, email, password }) => {
  const user = await Employee.create({
    fullname,
    email,
    password
  });

  return user.toJSON();
};

const findEmployeeById = async (id) => {
  const userAdmin = await Employee.findOne({
    where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] },
    attributes: { exclude: ['password'] }
  });

  if (userAdmin === null) {
    return null;
  }

  return userAdmin.toJSON();
};

const findEmployeeByEmail = async (email) => {
  const employee = await Employee.findOne({
    where: { email },
    attributes: ['id', 'email']
  });

  if (employee === null) {
    return null;
  }

  return employee.toJSON();
};

const findEmployeeByEmailGetPassword = async (email) => {
  const employee = await Employee.findOne({
    where: { email },
    attributes: ['id', 'email', 'password']
  });

  if (employee === null) {
    return null;
  }

  return employee.toJSON();
};

module.exports = {
  createEmployee,
  findEmployeeById,
  findEmployeeByEmail,
  findEmployeeByEmailGetPassword
};
