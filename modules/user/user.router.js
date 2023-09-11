const express = require('express');
const {
  getAllUser,
  register,
  editUser,
  getUserById,
  login,
  uploadUserImage
} = require('./user.controller');
const {
  registerValidation,
  editUserValidation,
  loginValidation
} = require('../../middleware/validations/userValidation');
const { authenticated } = require('../../middleware/auth/authorization');
const {
  maxPageSizeValidation
} = require('../../middleware/pagination/paginationValidation');
const { upload } = require('../../middleware/file/multer');

const router = express.Router();

router.get('/users', maxPageSizeValidation, getAllUser);
router.get('/users/:id', getUserById);
router.post('/register', upload.single('image'), registerValidation, register);
router.post('/login', loginValidation, login);
router.put(
  '/users/:id',
  authenticated,
  upload.single('image'),
  editUserValidation,
  editUser
);

module.exports = router;
