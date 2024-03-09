const express = require('express');
const {
  registerValidation,
  editUserValidation,
  loginValidation,
  currentUserValidation
} = require('../../../middleware/validations/userValidation');
const {
  authenticated,
  userAdminAuthenticated
} = require('../../../middleware/auth/authorization');
const {
  maxPageSizeValidation
} = require('../../../middleware/pagination/paginationValidation');
const { upload } = require('../../../middleware/file/multer');
const UserController = require('../controllers/user.controller');

const router = express.Router();

// Start of User Endpoint of Public API
router.get('/users', maxPageSizeValidation, UserController.getAllUser);
router.get(
  '/users/detail',
  authenticated,
  currentUserValidation,
  UserController.getUserById
);
router.post(
  '/register',
  upload.single('image'),
  registerValidation,
  UserController.register
);
router.post('/login', loginValidation, UserController.login);
router.put(
  '/users/edit',
  authenticated,
  currentUserValidation,
  upload.single('image'),
  editUserValidation,
  UserController.editUser
);
// End of User Endpoint of Public API

// Start of User Endpoint of Internal API
router.get(
  '/admin/users',
  userAdminAuthenticated,
  maxPageSizeValidation,
  UserController.getAllUser
);
router.get(
  '/admin/users/:id',
  userAdminAuthenticated,
  UserController.getMabolismById
);
router.delete(
  '/admin/users/:id',
  userAdminAuthenticated,
  UserController.removeUser
);
// End of User Endpoint of Internal API

module.exports = router;
