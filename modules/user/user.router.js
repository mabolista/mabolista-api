const express = require('express');
const {
  getAllUser,
  register,
  editUser,
  getUserById,
  login
} = require('./user.controller');
const {
  registerValidation,
  editUserValidation,
  loginValidation,
  currentUserValidation
} = require('../../middleware/validations/userValidation');
const { authenticated } = require('../../middleware/auth/authorization');
const {
  maxPageSizeValidation
} = require('../../middleware/pagination/paginationValidation');
const { upload } = require('../../middleware/file/multer');

const router = express.Router();

router.get('/users', maxPageSizeValidation, getAllUser);
router.get('/users/:id', currentUserValidation, getUserById);
router.post('/register', upload.single('image'), registerValidation, register);
router.post('/login', loginValidation, login);
router.put(
  '/users/:id',
  authenticated,
  currentUserValidation,
  upload.single('image'),
  editUserValidation,
  editUser
);

module.exports = router;
