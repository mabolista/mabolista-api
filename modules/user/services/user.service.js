const { errorCode, errorStatusCode } = require('../../../shared-v1/constants');
const {
  USER_MEDIA_PATH_FOLDER_DEV,
  USER_MEDIA_PATH_FOLDER_PROD
} = require('../../../shared-v1/constants/cloudinaryMedia');
const AppError = require('../../../shared-v1/helpers/AppError');
const {
  decodeJwt,
  generateToken
} = require('../../../shared-v1/helpers/jwtHelper');
const {
  passwordHashing
} = require('../../../shared-v1/helpers/passwordHelper');
const {
  uploadImageCloudinary
} = require('../../../shared-v1/utils/cloudinary/uploadImage');
const UserDTORequest = require('../dtos/request/userDtoRequest');
const UserDTOResponse = require('../dtos/response/userDtoResponse');
const UserRepository = require('../repositories/user.repository');

/* eslint-disable class-methods-use-this */

const env = process.env.NODE_ENV || 'development';

class UserService {
  async findAllUser(offset, pageSize) {
    const users = await UserRepository.findAllUser(offset, pageSize);

    return users;
  }

  async findMabolismById(request) {
    const { id } = request.params;

    const user = await UserRepository.findUserById(id);

    if (user === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User tidak ditemukan'
      );
    }

    return new UserDTOResponse(user);
  }

  async findUserById(request) {
    const { id } = decodeJwt(request.headers.authorization);

    const user = await UserRepository.findUserById(id);

    if (user === null) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User tidak ditemukan'
      );
    }

    return new UserDTOResponse(user);
  }

  async createUser(request) {
    const { name, email, phoneNumber, password } = request.body;

    let imageUrl = '';

    if (!request.file) {
      imageUrl = '';
    } else {
      imageUrl = await uploadImageCloudinary(
        request.file.path,
        env === 'development'
          ? USER_MEDIA_PATH_FOLDER_DEV
          : USER_MEDIA_PATH_FOLDER_PROD
      );
    }

    const hashedPassword = await passwordHashing(password);

    const payload = new UserDTORequest(
      name,
      email,
      phoneNumber,
      imageUrl.secure_url,
      hashedPassword
    );

    const user = await UserRepository.createUser(payload);
    delete user.password;

    const token = generateToken(user);

    return {
      user: new UserDTOResponse(user),
      token
    };
  }

  async findUserByEmail(request) {
    const { email } = request.body;

    const user = await UserRepository.findUserByEmail(email);

    const token = generateToken(user);

    return {
      user: new UserDTOResponse(user),
      token
    };
  }

  async editUser(request) {
    const { name, email, phoneNumber, password } = request.body;

    let imageUrl = '';

    if (!request.file) {
      imageUrl = '';
    } else {
      imageUrl = await uploadImageCloudinary(
        request.file.path,
        env === 'development'
          ? USER_MEDIA_PATH_FOLDER_DEV
          : USER_MEDIA_PATH_FOLDER_PROD
      );
    }

    const { id } = decodeJwt(request.headers.authorization);

    const hashedPassword = await passwordHashing(password);

    const payload = new UserDTORequest(
      name,
      email,
      phoneNumber,
      imageUrl.secure_url,
      hashedPassword
    );

    const user = await UserRepository.updateUser(id, payload);

    return new UserDTOResponse(user);
  }

  async deleteUser(request) {
    const { id } = request.params;

    const user = await UserRepository.deleteUser(id);

    if (!user) {
      throw new AppError(
        errorCode.NOT_FOUND,
        errorStatusCode.BAD_DATA_VALIDATION,
        'User tidak ditemukan'
      );
    }

    return new UserDTOResponse(user);
  }
}
module.exports = new UserService();
