const { Op } = require('sequelize');
const User = require('../../core/database/models/UserModel');

const createUser = async ({ name, email, phoneNumber, imageUrl, password }) => {
  const user = await User.create({
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
  const currentUser = await User.findByPk(id);

  await currentUser.update({
    name,
    email,
    phoneNumber,
    imageUrl,
    password
  });

  const updatedUser = await User.findByPk(id, {
    attributes: {
      exclude: ['password']
    }
  });

  return updatedUser;
};

const findAllUser = async (offset, pageSize) => {
  const users = await User.findAndCountAll({
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
  const user = await User.findOne({
    where: { [Op.and]: [{ id }, { deletedAt: { [Op.is]: null } }] },
    attributes: { exclude: ['password'] }
  });

  if (user === null) {
    return null;
  }

  return user.toJSON();
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    attributes: ['id', 'email']
  });

  if (user === null) {
    return null;
  }

  return user.toJSON();
};

const findUserByEmailGetPassword = async (email) => {
  const user = await User.findOne({
    where: { email },
    attributes: ['id', 'email', 'password']
  });

  if (user === null) {
    return null;
  }

  return user.toJSON();
};

module.exports = {
  createUser,
  updateUser,
  findAllUser,
  findUserById,
  findUserByEmail,
  findUserByEmailGetPassword
};
