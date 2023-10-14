const { Op } = require('sequelize');
const models = require('../../core/database/models');

const createUser = async ({ name, email, phoneNumber, imageUrl, password }) => {
  const user = await models.User.create({
    name,
    email,
    phoneNumber,
    imageUrl,
    password
  });

  return user.toJSON();
};

const updateUser = async (
  id,
  { name, email, phoneNumber, imageUrl, password }
) => {
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
};

const findAllUser = async (offset, pageSize) => {
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
};

const findUserById = async (id) => {
  const user = await models.User.findOne({
    where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] },
    attributes: { exclude: ['password'] }
  });

  if (user === null) {
    return null;
  }

  return user.toJSON();
};

const findUserByEmail = async (email) => {
  const user = await models.User.findOne({
    where: { email },
    attributes: ['id', 'email']
  });

  if (user === null) {
    return null;
  }

  return user.toJSON();
};

const findUserByEmailGetPassword = async (email) => {
  const user = await models.User.findOne({
    where: { email },
    attributes: ['id', 'email', 'password']
  });

  if (user === null) {
    return null;
  }

  return user.toJSON();
};

const deleteUser = async (id) => {
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
};

module.exports = {
  createUser,
  updateUser,
  findAllUser,
  findUserById,
  findUserByEmail,
  findUserByEmailGetPassword,
  deleteUser
};
