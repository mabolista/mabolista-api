const {
  generateToken,
  decodeJwt
} = require('../../shared-v1/helpers/jwtHelper');
const { passwordHashing } = require('../../shared-v1/helpers/passwordHelper');
const { responseData } = require('../../shared-v1/helpers/responseDataHelper');
const { setPage } = require('../../middleware/pagination/paginationValidation');
const {
  uploadImageCloudinary
} = require('../../shared-v1/utils/cloudinary/uploadImage');
const {
  findAllUser,
  createUser,
  updateUser,
  findUserById,
  findUserByEmail,
  deleteUser
} = require('./user.service');
const { errorStatusCode, errorCode } = require('../../shared-v1/constants');
const AppError = require('../../shared-v1/helpers/AppError');
const {
  USER_MEDIA_PATH_FOLDER_DEV,
  USER_MEDIA_PATH_FOLDER_PROD
} = require('../../shared-v1/constants/cloudinaryMedia');

const env = process.env.NODE_ENV || 'development';

const getAllUser = async (req, res) => {
  try {
    const { page } = req.query;
    const { pageSize } = req.query;

    const offset = setPage(pageSize, page);

    const { rows, count } = await findAllUser(offset, pageSize);

    const metaData = {
      currentPage: page,
      pageSize,
      total: count.toString(),
      totalPage: Math.ceil(count / pageSize).toString()
    };

    const data = {
      users: rows,
      meta: metaData
    };

    return res
      .status(201)
      .json(
        responseData(201, 'Berhasil mendapatkan data list user', null, data)
      );
  } catch (error) {
    console.error(error.stack);

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    let imageUrl = '';

    if (!req.file) {
      imageUrl = '';
    } else {
      imageUrl = await uploadImageCloudinary(
        req.file.path,
        env === 'development'
          ? USER_MEDIA_PATH_FOLDER_DEV
          : USER_MEDIA_PATH_FOLDER_PROD
      );
    }

    const hashedPassword = await passwordHashing(password);

    const payload = {
      name,
      email,
      phoneNumber,
      imageUrl: imageUrl.secure_url,
      password: hashedPassword
    };

    const newUser = await createUser(payload);

    const user = await findUserById(newUser.id);

    const token = generateToken(user);

    const data = {
      user,
      token
    };

    return res
      .status(201)
      .json(responseData(201, 'User berhasil terdaftar', null, data));
  } catch (error) {
    console.error(error.stack);

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    const token = generateToken(user);

    const data = {
      user,
      token
    };

    return res
      .status(201)
      .json(responseData(201, 'Berhasil login', null, data));
  } catch (error) {
    console.error(error.stack);

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const editUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    let imageUrl = '';

    if (!req.file) {
      imageUrl = '';
    } else {
      imageUrl = await uploadImageCloudinary(
        req.file.path,
        env === 'development'
          ? USER_MEDIA_PATH_FOLDER_DEV
          : USER_MEDIA_PATH_FOLDER_PROD
      );
    }

    const { id } = decodeJwt(req.headers.authorization);

    const hashedPassword = await passwordHashing(password);

    const requestBody = {
      name,
      email,
      phoneNumber,
      imageUrl: imageUrl.secure_url,
      password: hashedPassword
    };

    const user = await updateUser(id, requestBody);

    return res
      .status(201)
      .json(responseData(201, 'User berhasil update', null, user));
  } catch (error) {
    console.error(error.stack);

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);

    const user = await findUserById(id);

    return res
      .status(201)
      .json(responseData(201, 'Berhasil mendapatkan data user', null, user));
  } catch (error) {
    console.error(error.stack);

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

const removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await deleteUser(id);

    if (!user) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User tidak ditemukan'
      );
    }

    return res
      .status(200)
      .json(responseData(200, 'Berhasil menghapus user', null, user));
  } catch (error) {
    console.error(error.stack);

    if (error instanceof AppError) {
      return res
        .status(error.code)
        .json(responseData(error.code, error.message, error, null));
    }

    return res
      .status(500)
      .json(
        responseData(
          errorCode.INTENAL_SERVER_ERROR,
          errorStatusCode.INTERNAL_SERVER_ERROR,
          error,
          null
        )
      );
  }
};

module.exports = {
  getAllUser,
  register,
  login,
  editUser,
  getUserById,
  removeUser
};
