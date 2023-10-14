const express = require('express');
const {
  getAllUser,
  register,
  editUser,
  getUserById,
  login,
  removeUser
} = require('./user.controller');
const {
  registerValidation,
  editUserValidation,
  loginValidation,
  currentUserValidation
} = require('../../middleware/validations/userValidation');
const {
  authenticated,
  userAdminAuthenticated
} = require('../../middleware/auth/authorization');
const {
  maxPageSizeValidation
} = require('../../middleware/pagination/paginationValidation');
const { upload } = require('../../middleware/file/multer');

const router = express.Router();

// Start of User Endpoint of Public API
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
// End of User Endpoint of Public API

// Start of User Endpoint of Internal API
router.get(
  '/admin/users',
  userAdminAuthenticated,
  maxPageSizeValidation,
  getAllUser
);
router.get(
  '/admin/users/:id',
  userAdminAuthenticated,
  currentUserValidation,
  getUserById
);
router.delete('/admin/users/:id', userAdminAuthenticated, removeUser);
// End of User Endpoint of Internal API

module.exports = router;
