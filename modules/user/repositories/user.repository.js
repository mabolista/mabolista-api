/* eslint-disable class-methods-use-this */
const { Op } = require('sequelize');
const models = require('../../../core/database/models');

class UserRepository {
  async createUser({ name, email, phoneNumber, imageUrl, password }) {
    const user = await models.User.create({
      name,
      email,
      phoneNumber,
      imageUrl,
      password
    });

    return user.toJSON();
  }

  async updateUser(id, { name, email, phoneNumber, imageUrl, password }) {
    const currentUser = await models.User.findByPk(id);

    await currentUser.update({
      name,
      email,
      phoneNumber,
      imageUrl,
      password
    });

    const updatedUser = await models.User.findByPk(id, {
      attributes: {
        exclude: ['password']
      }
    });

    return updatedUser;
  }

  async findAllUser(offset, pageSize) {
    const users = await models.User.findAndCountAll({
      where: {
        deletedAt: {
          [Op.is]: null
        }
      },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      offset,
      limit: pageSize
    });

    if (users === null) {
      return null;
    }

    return users;
  }

  async findUserById(id) {
    const user = await models.User.findOne({
      where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] },
      attributes: { exclude: ['password'] }
    });

    if (user === null) {
      return null;
    }

    return user.toJSON();
  }

  async findUserByEmail(email) {
    const user = await models.User.findOne({
      where: { email },
      attributes: ['id', 'email']
    });

    if (user === null) {
      return null;
    }

    return user.toJSON();
  }

  async findUserByEmailGetPassword(email) {
    const user = await models.User.findOne({
      where: { email },
      attributes: ['id', 'email', 'password']
    });

    if (user === null) {
      return null;
    }

    return user.toJSON();
  }

  async deleteUser(id) {
    const existingUser = await models.User.findOne({
      where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] },
      attributes: { exclude: ['password'] }
    });

    if (existingUser === null) {
      return null;
    }

    await models.User.update(
      {
        deletedAt: Date.now()
      },
      { where: { id } }
    );

    return models.User.findOne({
      where: { id },
      attributes: { exclude: ['password'] }
    });
  }
}

module.exports = new UserRepository();
